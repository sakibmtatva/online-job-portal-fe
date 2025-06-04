import React from "react";
import { useNavigate } from "react-router-dom";
import { Job } from "../../utility/interface/IJobResponse";
import { BriefcaseBusiness, CheckCircle, MapPin, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { getJobTypeLabel, LoadingSpinner } from "../../components/Common";
import moment from "moment";

interface JobTableProps {
  loading: boolean;
  jobData: Job[];
}

const JobTable: React.FC<JobTableProps> = ({ loading, jobData }) => {
  const navigate = useNavigate();

  return (
    <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden bg-white shadow-lg">
      <thead className="bg-[#F1F2F4] text-[#474C54]">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider sm:px-6">
            Job
          </th>
          <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider sm:px-6">
            Date Applied
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
        {loading ? (
          <tr>
            <td colSpan={4} className="text-center">
              <LoadingSpinner />
            </td>
          </tr>
        ) : jobData.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="px-6 py-4 text-center text-sm text-gray-500"
            >
              No data available
            </td>
          </tr>
        ) : (
          jobData.map((job) => (
            <tr key={job._id}>
              <td className="px-4 py-4 text-sm text-[#5E6670] text-left sm:px-6">
                <div className="flex flex-row items-center gap-4 w-auto">
                  {job.profile_url && job.profile_url !== "" ? (
                    <img
                      src={job.profile_url}
                      className="w-14 h-14 object-cover border p-1 rounded-lg"
                      alt={`${job.job_title} profile`}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-gray-500 text-xl">
                        {job.job_title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="mr-8">
                    <div className="flex items-center gap-2 mb-2 whitespace-nowrap">
                      <h4 className="font-semibold text-lg text-gray-900 whitespace-nowrap">
                        {job.job_title}
                      </h4>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {getJobTypeLabel(job.jobType)}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500 mt-1 whitespace-nowrap">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <BriefcaseBusiness className="w-4 h-4 text-gray-400" />
                        {`${job.salary_min} - ${job.salary_max}`}
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-[#5E6670] text-center sm:px-6 whitespace-nowrap">
                {moment(job.appliedAt).format("MM/DD/YYYY")}
              </td>

              <td className="px-4 py-4 text-sm text-[#5E6670] text-center sm:px-6 whitespace-nowrap">
                {job.status === "Active" ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                    <XCircle className="w-4 h-4" /> Expired
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-center sm:px-6 whitespace-nowrap">
                <Button
                  onClick={() => navigate(`/jobdetails/${job._id}`)}
                  className="bg-[#F1F2F4] rounded-sm text-[#0A65CC] hover:bg-[#0A65CC] hover:text-[#FFFFFF] cursor-pointer"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default JobTable;
