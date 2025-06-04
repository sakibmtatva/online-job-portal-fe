import { useEffect, useState } from "react";
import moment from "moment";
import schedulemeetingService, {
  Meeting,
  ScheduledBy,
} from "../../services/schedulemeeting-service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  clearExpiredDismissedCandidateMeetings,
  dismissCandidateMeeting,
} from "../../features/meeting/meetingSlice";
import { Clock, Video, X } from "lucide-react";

const CandidateMeetingPopup = () => {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(moment());
  const [upcomingMeeting, setUpcomingMeeting] = useState<Meeting | null>(null);
  const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);
  const dismissedCandidateMeetingIds = useSelector(
    (state: RootState) => state.meeting.dismissedCandidateMeetingIds
  );

  const getCandidateScheduleMeetingsList = async () => {
    try {
      const response =
        await schedulemeetingService.getCandidateScheduleMeetingsList();
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
    getCandidateScheduleMeetingsList();
  }, []);

  useEffect(() => {
    const liveMeeting = meetingsData.find((meeting) => {
      const isToday = moment(meeting.date).isSame(currentTime, "day");
      const hasStarted = moment(meeting.start_time, "HH:mm").isSameOrBefore(
        currentTime
      );
      const notEnded = moment(meeting.end_time, "HH:mm").isAfter(currentTime);
      const isDismissed = dismissedCandidateMeetingIds.includes(meeting._id);
      return isToday && hasStarted && notEnded && !isDismissed;
    });

    if (liveMeeting) {
      setUpcomingMeeting(liveMeeting);
    } else {
      setUpcomingMeeting(null);
    }
  }, [currentTime, meetingsData, dismissedCandidateMeetingIds]);

  useEffect(() => {
    if (!meetingsData.length) return;
    const validDismissed = dismissedCandidateMeetingIds.filter((id) => {
      const meeting = meetingsData.find((m) => m._id === id);
      if (!meeting) return false;
      const isToday = moment(meeting.date).isSame(currentTime, "day");
      const end = moment(meeting.end_time, "HH:mm");
      return isToday && end.isAfter(currentTime);
    });

    dispatch(clearExpiredDismissedCandidateMeetings(validDismissed));
  }, [meetingsData, currentTime]);

  const handleCancel = () => {
    if (upcomingMeeting?._id) {
      dispatch(dismissCandidateMeeting(upcomingMeeting._id));
      setUpcomingMeeting(null);
    }
  };

  const handleJoin = () => {
    if (upcomingMeeting?._id) {
      dispatch(dismissCandidateMeeting(upcomingMeeting._id));
      setUpcomingMeeting(null);
      window.location.href = `/meeting/${upcomingMeeting._id}`;
    }
  };

  if (!upcomingMeeting) return null;

  const scheduledBy = upcomingMeeting.scheduled_by as ScheduledBy;
  const profileUrl = scheduledBy["employer-profile-info"]?.profile_url;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-pop-in transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Interview Invitation
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
            {profileUrl ? (
              <div className="h-12 w-12 rounded-full flex items-center justify-center">
                <img
                  src={profileUrl}
                  alt={scheduledBy.full_name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {scheduledBy.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {scheduledBy.full_name}
            </h3>
            <p className="text-sm text-gray-500">
              {upcomingMeeting.job?.job_title}
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
            Decline
          </button>
          <button
            onClick={handleJoin}
            className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Video className="h-5 w-5 mr-2" />
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateMeetingPopup;
