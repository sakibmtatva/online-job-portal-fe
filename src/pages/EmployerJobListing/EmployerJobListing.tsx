import { useEffect, useRef, useState } from "react";
import { UI_TEXT } from "../../config/config";
import {
  CheckCircle,
  Edit,
  MoreVertical,
  Trash,
  Users,
  XCircle,
} from "lucide-react";
import jobService from "../../services/job-service";
import { Job } from "../../utility/interface/IJobResponse";
import Pagination from "../../components/custom/Pagination";
import PostJobForm from "../PostJob/PostJobForm";
import { JobFormValues } from "../../schemas/profile.schema";
import { Button } from "../../components/ui/button";
import DeleteDialog from "../../components/custom/DeleteModal";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner, getJobTypeLabel } from "../../components/Common";

const EmployerJobListing = () => {
  const navigate = useNavigate();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [dropdownDirection, setDropdownDirection] = useState<string>("");
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [jobListData, setJobListData] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobFormValues | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isEditButtonClicked, setIsEditButtonClicked] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [count, setTotalCount] = useState<number>(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const totalPages = Math.ceil(count / Number(limit));

  const handleMenuClick = (index: number, job: Job) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null);
      setSelectedJob(null);
      setDropdownPosition({ top: 0, left: 0 });
      setSelectedJobId("");
      return;
    }

    const button = buttonRefs.current[index];
    if (button) {
      const rect = button.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const spaceAbove = rect.top;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceRight = windowWidth - rect.right;
      let top = rect.bottom + 8;
      let direction = "down";

      if (spaceAbove > spaceBelow) {
        direction = "up";
        top = rect.top - 8 - 40;
      }

      let left = rect.left;
      if (spaceRight < 200) {
        left = Math.max(0, rect.left - (200 - spaceRight));
      }
      setDropdownDirection(direction);
      setDropdownPosition({ top, left });
    }

    // Set the current job and open the menu
    setOpenMenuIndex(index);
    const min_salary = job.salary_min;
    const max_salary = job.salary_max;

    const jobData: JobFormValues = {
      ...job,
      min_salary,
      max_salary,
    };
    setSelectedJob(jobData);
    setSelectedJobId(job._id);
  };

  const getEmployerJobsData = async () => {
    try {
      setLoading(true);
      const response = await jobService.getEmployerJobsData(page, limit);
      setJobListData(response?.data?.data);
      setTotalCount(response?.data?.pagination?.total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployerJobsData();
  }, [page]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const handleClickBackButton = () => {
    setIsEditButtonClicked(false);
    setOpenMenuIndex(null);
    setSelectedJob(null);
    setDropdownPosition({ top: 0, left: 0 });
    setSelectedJobId("");
  };

  const handleSuccessEdit = () => {
    handleClickBackButton();
    getEmployerJobsData();
  };

  const onSuccessDelete = () => {
    handleClickBackButton();
    getEmployerJobsData();
  };

  return (
    <div>
      {!isEditButtonClicked && (
        <div className="sm:p-6">
          <div className="text-black font-bold text-2xl">
            {UI_TEXT.myJobs}
            <span className="text-gray-400 font-medium ml-2">({count})</span>
          </div>
          <div className="overflow-x-auto w-full mt-4">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden bg-white shadow-lg">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <LoadingSpinner message="Loading job details" />
                    </td>
                  </tr>
                ) : (
                  <>
                    {jobListData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      jobListData.map((job, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 transition-colors duration-300"
                        >
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <div className="font-medium">{job.job_title}</div>
                            <div className="text-xs text-gray-500">
                              {getJobTypeLabel(job.jobType)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
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
                          <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.applicants.length} Applications
                            </span>
                          </td>
                          <td className="px-6 py-4 relative whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button
                                // onClick={() => {
                                //   navigate(`/viewapplications/${job._id}`);
                                // }}
                                onClick={() => {
                                  navigate(`/jobApplication/${job._id}`);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                              >
                                View Applications
                              </Button>
                              {job.status !== "Expired" && (
                                <button
                                  ref={(el) => {
                                    buttonRefs.current[index] = el;
                                  }}
                                  onClick={() => handleMenuClick(index, job)}
                                  className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200 transform hover:scale-105"
                                >
                                  <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </>
                )}
              </tbody>
            </table>

            {openMenuIndex !== null && (
              <div
                className="fixed w-40 bg-white border border-gray-200 rounded-md shadow-md z-50"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  transform:
                    dropdownDirection === "up"
                      ? "translateY(-100%)"
                      : "translateY(0)",
                }}
              >
                <button
                  onClick={() => setIsEditButtonClicked(true)}
                  className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit Job
                </button>
                <DeleteDialog
                  jobId={selectedJobId}
                  onSuccessDelete={() => onSuccessDelete()}
                >
                  <button className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2">
                    <Trash className="w-4 h-4 text-red-500" /> Delete Job
                  </button>
                </DeleteDialog>
              </div>
            )}
          </div>
          {jobListData.length > 0 && (
            <div className="flex items-center justify-center mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
      {isEditButtonClicked && (
        <PostJobForm
          jobData={selectedJob}
          jobId={selectedJobId}
          onClickBack={() => handleClickBackButton()}
          onSuccess={() => handleSuccessEdit()}
        />
      )}
    </div>
  );
};

export default EmployerJobListing;
