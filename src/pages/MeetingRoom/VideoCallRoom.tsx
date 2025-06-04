import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize,
  Minimize,
  Share2,
  ScreenShareOff,
  X,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Input } from "../../components/ui/input";
import { logo } from "../../assets/assets";
import { Meeting } from "../../services/schedulemeeting-service";

let socket: Socket;

interface VideoCallRooomProps {
  meetingId: string;
  meetingData: Meeting;
}

const VideoCallRoom = ({ meetingData, meetingId }: VideoCallRooomProps) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const remoteUserId = useRef<string | null>(null);
  const [roomId] = useState(meetingId);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteVideoOff, setRemoteVideoOff] = useState(false);
  const [remoteUserInfo, setRemoteUserInfo] = useState<{
    name: string;
    profileUrl: string;
  } | null>(null);
  const [messages, setMessages] = useState<
    { from: string; text: string; time: string }[]
  >([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      socket.emit("send-message", {
        to: remoteUserId.current,
        from: currentUser?.user_name || "You",
        text: newMessage.trim(),
        time: timestamp,
      });
      setMessages((prev) => [
        ...prev,
        { from: "You", text: newMessage.trim(), time: timestamp },
      ]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);

      // Emit video toggle event to remote user
      if (remoteUserId.current) {
        socket.emit("video-toggled", {
          to: remoteUserId.current,
          isVideoOff: !isVideoOff,
          userInfo: {
            name: currentUser?.user_name || "User",
            profileUrl: currentUser?.profile_url || "",
          },
        });
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !isMuted;
        });

        localStream.current?.getTracks().forEach((track) => track.stop());
        localStream.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          const sender = peerConnection.current
            ?.getSenders()
            .find((s) => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          }
        });
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioStream.getAudioTracks().forEach((track) => {
          track.enabled = !isMuted;
        });

        const combinedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);

        localStream.current?.getTracks().forEach((track) => track.stop());
        localStream.current = combinedStream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combinedStream;
        }

        combinedStream.getTracks().forEach((track) => {
          const sender = peerConnection.current
            ?.getSenders()
            .find((s) => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          }
          if (sender) {
            sender.replaceTrack(track);
          } else if (peerConnection.current) {
            peerConnection.current.addTrack(track, screenStream);
          }
        });

        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      }

      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error("Screen sharing failed:", err);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const endCall = () => {
    // Notify the other user that we're leaving
    if (remoteUserId.current) {
      socket.emit("user-leaving", { to: remoteUserId.current });
    }

    socket.disconnect();

    if (peerConnection.current) {
      peerConnection.current.onicecandidate = null;
      peerConnection.current.ontrack = null;
      peerConnection.current.onconnectionstatechange = null;
      peerConnection.current.onsignalingstatechange = null;
      peerConnection.current.oniceconnectionstatechange = null;
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((track) => track.stop());
      remoteStream.current = null;
    }

    remoteUserId.current = null;
    setRemoteUserInfo(null);
    setRemoteVideoOff(false);

    window.location.href = "/dashboard";
  };

  useEffect(() => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("user-joined", async (id: string) => {
      console.log("User joined:", id);
      remoteUserId.current = id;
      // Send your user info to the remote user
      socket.emit("user-info", {
        to: id,
        userInfo: {
          name: currentUser?.user_name || "User",
          profileUrl: currentUser?.profile_url || "",
        },
      });
      await createOffer(id);
    });

    socket.on("video-toggled", ({ isVideoOff, userInfo }) => {
      setRemoteVideoOff(isVideoOff);
      if (isVideoOff) {
        setRemoteUserInfo(userInfo);
      }
    });

    socket.on("receive-message", ({ from, text, time }) => {
      setMessages((prev) => [...prev, { from, text, time }]);

      if (!isChatOpen && from !== "You") {
        setHasUnreadMessages(true);
      }
    });

    socket.on("user-info", (info) => {
      setRemoteUserInfo(info);
    });

    socket.on("offer", async ({ offer, from }) => {
      console.log("Received offer from", from);
      remoteUserId.current = from;
      await createAnswer(offer, from);
    });

    socket.on("answer", ({ answer }) => {
      console.log("Received answer");
      peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", ({ candidate }) => {
      console.log("Received ICE candidate");
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("user-disconnected", (id: string) => {
      console.log("User disconnected:", id);
      handleRemoteDisconnection();
    });

    socket.on("user-leaving", () => {
      console.log("Remote user is leaving");
      handleRemoteDisconnection();
    });

    const startStream = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current && localStream.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        // Only emit join-room after local stream is ready
        socket.emit("join-room", roomId);
      } catch (err) {
        console.error("Failed to get local media:", err);
      }
    };

    startStream();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      socket.disconnect();
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId]);

  const handleRemoteDisconnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((track) => track.stop());
      remoteStream.current = null;
    }
    remoteUserId.current = null;
    setRemoteUserInfo(null);
    setRemoteVideoOff(false);
  };

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        {
          urls: "turn:freestun.net:3478",
          username: "free",
          credential: "free",
        },
      ],
    });

    // Setup remote stream
    remoteStream.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream.current;
    }

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && remoteUserId.current) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: remoteUserId.current,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (!remoteStream.current) {
        remoteStream.current = new MediaStream();
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
        }
      }
      remoteStream.current.addTrack(event.track);
    };

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.current?.connectionState);
      if (
        peerConnection.current?.connectionState === "disconnected" ||
        peerConnection.current?.connectionState === "failed"
      ) {
        handleRemoteDisconnection();
      }
    };

    peerConnection.current.onsignalingstatechange = () => {
      console.log("Signaling state:", peerConnection.current?.signalingState);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log(
        "ICE connection state:",
        peerConnection.current?.iceConnectionState
      );
      if (
        peerConnection.current?.iceConnectionState === "disconnected" ||
        peerConnection.current?.iceConnectionState === "failed"
      ) {
        handleRemoteDisconnection();
      }
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(
          track,
          localStream.current as MediaStream
        );
      });
    } else {
      console.warn("Local stream not available when creating peer connection.");
    }
  };

  const createOffer = async (targetId: string) => {
    try {
      createPeerConnection();
      const offer = await peerConnection.current?.createOffer();
      if (offer) {
        await peerConnection.current?.setLocalDescription(offer);
        socket.emit("offer", { offer, to: targetId });
      }
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const createAnswer = async (
    offer: RTCSessionDescriptionInit,
    from: string
  ) => {
    try {
      createPeerConnection();
      await peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current?.createAnswer();
      if (answer) {
        await peerConnection.current?.setLocalDescription(answer);
        socket.emit("answer", { answer, to: from });
      }
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  };

  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isChatOpen, messages]);

  useEffect(() => {
    if (isChatOpen) {
      setHasUnreadMessages(false);
    }
  }, [isChatOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="bg-gray-800 text-white px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 shadow-md animate-fade-in">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            width={40}
            height={40}
            className="w-auto h-auto"
          />
          <h2 className="text-2xl font-bold text-white">Career Connect</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-700 px-3 py-1 rounded text-sm animate-pulse text-white">
            {formatDuration(callDuration)}
          </span>
          <span className="text-md text-gray-300">
            {meetingData?.job?.job_title}
          </span>
        </div>
      </div>
      <main
        className={`flex-1 p-4 grid gap-4 transition-all duration-300 ease-in-out overflow-hidden ${
          isChatOpen
            ? "grid-cols-1 lg:grid-cols-[1fr_1fr_0.5fr]"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onStalled={() => {
              if (remoteVideoRef.current?.srcObject) {
                remoteVideoRef.current.srcObject = null;
                if (remoteStream.current) {
                  remoteVideoRef.current.srcObject = remoteStream.current;
                }
              }
            }}
          />

          {(!remoteVideoRef.current?.srcObject || remoteVideoOff) &&
            remoteUserInfo && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-90 text-gray-100 space-y-2 animate-fade-in">
                {remoteUserInfo.profileUrl ? (
                  <img
                    src={remoteUserInfo.profileUrl}
                    alt="User Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-lg font-semibold">
                    {remoteUserInfo.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-lg font-semibold">
                  {remoteUserInfo.name}
                </span>
              </div>
            )}
          {!remoteUserId.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-300 text-center animate-fade-in">
              <div>
                <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2" />
                <p>Waiting for participant to join...</p>
              </div>
            </div>
          )}
        </div>
        <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {isVideoOff && currentUser && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-90 text-gray-100 space-y-2 animate-fade-in">
              {currentUser.profile_url ? (
                <img
                  src={currentUser.profile_url}
                  alt="User Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-lg font-semibold">
                  {currentUser.user_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-lg font-semibold">
                {currentUser.user_name}
              </span>
            </div>
          )}
          <div className="absolute bottom-3 inset-x-0 flex justify-center animate-fade-in">
            <div className="bg-gray-700 bg-opacity-80 text-gray-100 px-3 py-1 rounded text-sm">
              You
            </div>
          </div>
        </div>
        {isChatOpen && (
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 flex flex-col max-h-[80vh] md:h-full animate-slide-left w-full">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 rounded-t-xl bg-gray-700">
              <h2 className="text-lg font-semibold text-white select-none">
                In-call messages
              </h2>
              <button
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
                className="text-gray-400 hover:text-white transition"
              >
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto chat-scrollbar p-5 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex item-center w-full ${
                    msg.from === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg break-words ${
                      msg.from === "You"
                        ? "bg-blue-700 text-white self-end rounded-br-none"
                        : "bg-gray-600 text-gray-100 self-start rounded-bl-none"
                    } shadow-sm`}
                  >
                    <span className="text-sm whitespace-pre-wrap">
                      {msg.text}
                    </span>
                    <span className="text-xs text-gray-400 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-700 p-4 flex items-center bg-gray-700 rounded-b-xl">
              <div className="relative w-full">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Send a message..."
                  className="w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-full p-5 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                  onClick={sendMessage}
                  className="absolute inset-y-0 right-2 flex items-center justify-center text-blue-400 hover:text-blue-600"
                  aria-label="Send message"
                >
                  <SendHorizonal className="w-5 h-5 text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <div className="bg-gray-800 px-4 sm:px-6 py-4 text-gray-200 animate-fade-in-up w-full border-t border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-sm">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-4 justify-center md:justify-start">
            <span>
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="hidden md:inline-block w-px h-4 bg-gray-500" />
            <span>{roomId}</span>
          </div>
          <div className="flex justify-center flex-wrap gap-3 sm:gap-4">
            {[
              {
                onClick: toggleMute,
                active: isMuted,
                icon: isMuted ? <MicOff size={24} /> : <Mic size={24} />,
                activeClass: "bg-red-500",
                tooltip: isMuted ? "Unmute" : "Mute",
              },
              {
                onClick: toggleVideo,
                active: isVideoOff,
                icon: isVideoOff ? <VideoOff size={24} /> : <Video size={24} />,
                activeClass: "bg-red-500",
                tooltip: isVideoOff ? "Turn on video" : "Turn off video",
              },
              {
                onClick: toggleScreenShare,
                active: isScreenSharing,
                icon: isScreenSharing ? (
                  <ScreenShareOff size={24} />
                ) : (
                  <Share2 size={24} />
                ),
                activeClass: "bg-blue-500",
                tooltip: isScreenSharing ? "Stop sharing" : "Share screen",
              },
              {
                onClick: toggleFullScreen,
                icon: isFullScreen ? (
                  <Minimize size={24} />
                ) : (
                  <Maximize size={24} />
                ),
                tooltip: isFullScreen ? "Exit fullscreen" : "Enter fullscreen",
              },
              {
                onClick: endCall,
                icon: <PhoneOff size={24} />,
                buttonClass: "bg-red-600 hover:bg-red-700",
                tooltip: "End call",
              },
            ].map((btn, index) => (
              <button
                key={index}
                onClick={btn.onClick}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 text-white ${
                  btn.active
                    ? btn.activeClass
                    : btn.buttonClass || "bg-gray-600"
                }`}
                title={btn.tooltip}
              >
                {btn.icon}
              </button>
            ))}
          </div>
          <div className="flex justify-center md:justify-end gap-4">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 text-white ${
                isChatOpen ? "bg-blue-500" : "bg-gray-600"
              }`}
              title={isChatOpen ? "Close chat" : "Open chat"}
            >
              <div className="relative">
                <MessageSquareText size={24} />
                {!isChatOpen && hasUnreadMessages && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallRoom;
