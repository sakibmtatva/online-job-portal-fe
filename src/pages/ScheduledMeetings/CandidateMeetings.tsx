import { useEffect, useState } from "react";
import schedulemeetingService, {
  Meeting,
} from "../../services/schedulemeeting-service";
import { UI_TEXT } from "../../config/config";
import Pagination from "../../components/custom/Pagination";
import { LoadingSpinner } from "../../components/Common";
import moment from "moment";
import EditMeetingForm from "./EditScheduleMeeting";
import { dismissMeeting } from "../../features/meeting/meetingSlice";
import { useDispatch } from "react-redux";
import { Clock } from "lucide-react";

const CandidateMeetings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [count, setTotalCount] = useState<number>(0);
  const totalPages = Math.ceil(count / Number(limit));
  const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);
  const [selectedMeetingsData, setSelectedMeetingsData] =
    useState<Meeting | null>(null);

  const getScheduleMeetingsList = async (loading: boolean) => {
    try {
      setLoading(loading);
      const response = await schedulemeetingService.getScheduleMeetingsList(
        page,
        limit
      );
      setMeetingsData(response?.data?.data || []);
      setTotalCount(response?.data?.pagination?.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const handleClickBackButton = () => {
    setSelectedMeetingsData(null);
  };

  const handleSuccessEdit = () => {
    handleClickBackButton();
    getScheduleMeetingsList(true);
  };

  useEffect(() => {
    getScheduleMeetingsList(true);
  }, [page]);

  const joinMeeting = (meeting: Meeting) => {
    dispatch(dismissMeeting(meeting._id));
    window.location.href = `/meeting/${meeting._id}`;
  };

  return (
    <>
      {selectedMeetingsData ? (
        <EditMeetingForm
          meetingData={selectedMeetingsData}
          onClickBack={handleClickBackButton}
          onSuccess={handleSuccessEdit}
        />
      ) : (
        <div className="sm:p-6">
          <div className="text-black font-bold text-2xl mb-6">
            {UI_TEXT.scheduledMeetings}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-separate border-spacing-0">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  {[
                    "Employer Name",
                    "Email",
                    "Job Title",
                    "Date",
                    "Time",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-3 border-b font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6">
                      <LoadingSpinner message="Loading scheduled meetings..." />
                    </td>
                  </tr>
                ) : meetingsData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No scheduled meetings available.
                    </td>
                  </tr>
                ) : (
                  meetingsData.map((meeting) => (
                    <tr
                      key={meeting._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-3 border-b whitespace-nowrap">
                        {meeting.scheduled_by.full_name}
                      </td>
                      <td className="p-3 border-b whitespace-nowrap">
                        {meeting.scheduled_by.email}
                      </td>
                      <td className="p-3 border-b whitespace-nowrap">
                        {meeting.job.job_title}
                      </td>
                      <td className="p-3 border-b whitespace-nowrap">
                        {moment(meeting.date).format("DD/MM/YYYY")}
                      </td>
                      <td className="p-3 border-b whitespace-nowrap">
                        {meeting.start_time} - {meeting.end_time}
                      </td>
                      <td className="p-3 border-b whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                            meeting.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : meeting.status === "Completed"
                              ? "bg-blue-100 text-blue-700"
                              : meeting.status === "Expired"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </td>

                      <td className="p-3 border-b whitespace-nowrap">
                        {meeting.status === "Scheduled" ? (
                          <div className="flex flex-col space-y-2">
                            {moment(meeting.date).isSame(moment(), "day") &&
                            moment(meeting.start_time, "HH:mm").isSameOrBefore(
                              moment()
                            ) &&
                            moment(meeting.end_time, "HH:mm").isAfter(
                              moment()
                            ) ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => joinMeeting(meeting)}
                                  className="text-green-600 hover:underline font-medium cursor-pointer"
                                >
                                  Join Meeting
                                </button>
                              </div>
                            ) : (
                              <Clock
                                className="text-gray-400 ml-6"
                                height="20px"
                                width="20px"
                              />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300 ml-6">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {meetingsData.length > 0 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CandidateMeetings;
