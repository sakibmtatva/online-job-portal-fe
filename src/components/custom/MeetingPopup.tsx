import { useEffect, useState } from "react";
import schedulemeetingService, {
  Meeting,
} from "../../services/schedulemeeting-service";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  clearExpiredDismissedMeetings,
  dismissMeeting,
} from "../../features/meeting/meetingSlice";
import { Clock, UsersRound, Video, X } from "lucide-react";

const MeetingPopup = () => {
  const dispatch = useDispatch();
  const [upcomingMeeting, setUpcomingMeeting] = useState<Meeting | null>(null);
  const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);
  const [currentTime, setCurrentTime] = useState(moment());
  const dismissedMeetingIds = useSelector(
    (state: RootState) => state.meeting.dismissedMeetingIds
  );

  const getScheduleMeetingsList = async () => {
    try {
      const response = await schedulemeetingService.getScheduleMeetingsList();
      setMeetingsData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getScheduleMeetingsList();
  }, []);

  useEffect(() => {
    if (!meetingsData.length) return;

    const validDismissed = dismissedMeetingIds.filter((id) => {
      const meeting = meetingsData.find((m) => m._id === id);
      if (!meeting) return false;

      const isToday = moment(meeting.date).isSame(currentTime, "day");
      const end = moment(meeting.end_time, "HH:mm");

      return isToday && end.isAfter(currentTime);
    });

    dispatch(clearExpiredDismissedMeetings(validDismissed));
  }, [meetingsData, currentTime]);

  useEffect(() => {
    const liveMeeting = meetingsData.find((meeting) => {
      const isToday = moment(meeting.date).isSame(currentTime, "day");
      const hasStarted = moment(meeting.start_time, "HH:mm").isSameOrBefore(
        currentTime
      );
      const notEnded = moment(meeting.end_time, "HH:mm").isAfter(currentTime);
      const isDismissed = dismissedMeetingIds.includes(meeting._id);

      return (
        isToday &&
        hasStarted &&
        notEnded &&
        meeting.status === "Scheduled" &&
        !isDismissed
      );
    });

    if (liveMeeting) {
      setUpcomingMeeting(liveMeeting);
    } else {
      setUpcomingMeeting(null);
    }
  }, [currentTime, meetingsData, dismissedMeetingIds]);

  const handleCancel = () => {
    if (upcomingMeeting?._id) {
      dispatch(dismissMeeting(upcomingMeeting._id));
      setUpcomingMeeting(null);
    }
  };

  const handleJoin = () => {
    if (upcomingMeeting?._id) {
      dispatch(dismissMeeting(upcomingMeeting._id));
      setUpcomingMeeting(null);
      window.location.href = `/meeting/${upcomingMeeting._id}`;
    }
  };

  if (!upcomingMeeting) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-pop-in transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <UsersRound className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Candidate Interview
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {upcomingMeeting.candidate?.full_name?.charAt(0) || "C"}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {upcomingMeeting.candidate?.full_name || "Candidate"}
            </h3>
            <p className="text-sm text-gray-500">
              Applying for {upcomingMeeting.job?.job_title}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-gray-700">
              {upcomingMeeting.start_time} - {upcomingMeeting.end_time}
            </span>
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Video className="h-5 w-5 mr-2" />
            Start Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingPopup;
