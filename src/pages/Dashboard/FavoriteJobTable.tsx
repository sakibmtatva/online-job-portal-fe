import React from "react";
import {
  ArrowRight,
  BookmarkCheck,
  BriefcaseBusiness,
  CheckCircle,
  MapPin,
  XCircle,
} from "lucide-react";
import { FavoriteJobApplication } from "../../utility/interface/IFavoriteJobResponse";
import ApplyJobDialog from "../../components/custom/ApplyJobModal";
import { Button } from "../../components/ui/button";
import { UI_TEXT } from "../../config/config";
import { getJobTypeLabel, LoadingSpinner } from "../../components/Common";

interface FavoriteJobTableProps {
  loadingF: boolean;
  favoriteJobData: FavoriteJobApplication[];
  removeFromBookmark: (bookmarkId: string) => void;
  getCandidateBookmarkedJobs: (isBookmarked: boolean) => void;
  getCandidateAppliedJobs?: () => void;
  isOpen: boolean;
  handleStateChange: (state: boolean) => void;
}

const FavoriteJobTable: React.FC<FavoriteJobTableProps> = ({
  loadingF,
  favoriteJobData,
  removeFromBookmark,
  getCandidateBookmarkedJobs,
  getCandidateAppliedJobs,
  isOpen,
  handleStateChange,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden bg-white shadow-lg">
      <thead className="bg-[#F1F2F4] text-[#474C54]">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider sm:px-6">
            Job
          </th>
          <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider sm:px-6">
            Status
          </th>
          <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider sm:px-6">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loadingF ? (
          <tr>
            <td colSpan={3} className="text-center">
              <LoadingSpinner message="Loading favorite jobs" />
            </td>
          </tr>
        ) : favoriteJobData.length === 0 ? (
          <tr>
            <td
              colSpan={3}
              className="px-6 py-4 text-center text-sm text-gray-500"
            >
              No data available
            </td>
          </tr>
        ) : (
          favoriteJobData.map((job) => (
            <tr key={job._id}>
              <td className="px-4 py-4 text-sm text-[#5E6670] text-left sm:px-6">
                <div className="flex flex-row items-center gap-4 w-auto">
                  {job.profile_url && job.profile_url !== "" ? (
                    <img
                      src={job.profile_url}
                      className="w-14 h-14 object-cover border p-1 rounded-lg"
                      alt={`${job.jobDetails.job_title} profile`}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-gray-500 text-xl">
                        {job.jobDetails.job_title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="mr-8">
                    <div className="flex items-center gap-2 mb-2 whitespace-nowrap">
                      <h4 className="font-semibold text-lg text-gray-900 whitespace-nowrap">
                        {job.jobDetails.job_title}
                      </h4>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {getJobTypeLabel(job.jobDetails.jobType)}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500 mt-1 whitespace-nowrap">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {job.jobDetails.location}
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <BriefcaseBusiness className="w-4 h-4 text-gray-400" />
                        {`${job.jobDetails.salary_min} - ${job.jobDetails.salary_max}`}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-[#5E6670] whitespace-nowrap text-center sm:px-6">
                {job.jobDetails.status === "Active" ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                    <XCircle className="w-4 h-4" /> Expired
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-center whitespace-nowrap sm:px-6">
                <div className="flex gap-3 w-full justify-center sm:w-auto items-center">
                  <button
                    className="text-gray-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromBookmark(job.bookmarkId);
                    }}
                  >
                    <BookmarkCheck className="w-5 h-5" />
                  </button>

                  {job.jobDetails.status === "Active" ? (
                    <>
                      {" "}
                      {job.hasApplied ? (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="bg-yellow-50 text-yellow-600 font-medium py-2 px-4 rounded-lg flex items-center hover:bg-yellow-100 transition-colors"
                        >
                          {UI_TEXT.alreadyAppliedTitle}
                        </Button>
                      ) : (
                        <ApplyJobDialog
                          jobData={job.jobDetails}
                          isOpen={isOpen}
                          onStateChange={handleStateChange}
                          callParentFunction={() => {
                            getCandidateBookmarkedJobs(false);
                            getCandidateAppliedJobs?.();
                          }}
                        >
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                            {UI_TEXT.applyNowTitle}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </ApplyJobDialog>
                      )}
                    </>
                  ) : (
                    <Button className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center hover:bg-red-700 transition-colors">
                      {UI_TEXT.jobExpired}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default FavoriteJobTable;
