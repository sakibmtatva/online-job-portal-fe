import React, { useEffect } from "react";
import { useState } from "react";
import { Card } from "../../components/ui/card";
import schedulemeetingService, {
  Meeting,
} from "../../services/schedulemeeting-service";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import VideoCallRoom from "./VideoCallRoom";
import { XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";

const VideoCall = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [meetingData, setMeetingData] = useState<Meeting | null>(null);
  const { meetingId } = useParams<{ meetingId: string }>();
  const [loading, setLoading] = useState<boolean>(true);

  const getMeetingData = async (meetingId: string) => {
    try {
      const response = await schedulemeetingService.getMeeting(meetingId);
      setMeetingData(response?.data?.data);
      const scheduledBy = response?.data?.data?.scheduled_by;
      const candidateId = response?.data?.data?.candidate?.id;

      if (currentUser?.user_type === "Employer") {
        setIsAuthorized(currentUser?._id === scheduledBy);
      } else if (currentUser?.user_type === "Candidate") {
        setIsAuthorized(currentUser?._id === candidateId);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meetingId) {
      getMeetingData(meetingId);
    }
  }, [meetingId]);

  return (
    <React.Fragment>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-lg text-blue-700">Loading meeting...</p>
          </div>
        </div>
      ) : (
        <React.Fragment>
          {!isAuthorized ? (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <Card className="w-full max-w-2xl p-12 shadow-xl border-t-4 border-red-700">
                <div className="text-center">
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-blue-600 mb-3">
                      Job Portal
                    </h2>
                    <h3 className="text-2xl font-semibold text-gray-700">
                      Video Call Room
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                    <div className="bg-red-50 p-6 rounded-lg">
                      <p className="text-red-700 text-lg">
                        You are not authorized to perform this action
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate("/dashboard")}
                      variant="outline"
                      className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 text-lg py-6"
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <React.Fragment>
              {meetingData && meetingId && (
                <VideoCallRoom
                  meetingData={meetingData}
                  meetingId={meetingId}
                />
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default VideoCall;
