import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/custom/Header";
import Footer from "../../components/custom/Footer";
import { useEffect, useState } from "react";
import { PER_PAGE_OPTIONS, SORT_OPTIONS } from "../../data";
import Pagination from "../../components/custom/Pagination";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  MapPin,
} from "lucide-react";
import { Job } from "../../utility/interface/IJobResponse";
import ApplyJobDialog from "../../components/custom/ApplyJobModal";
import { Button } from "../../components/ui/button";
import { UI_TEXT } from "../../config/config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import bookmarkService from "../../services/bookmark-service";
import jobService from "../../services/job-service";
import FindJobHeader from "../Listing/FindJobHeader";
import { PAGE_TITLES } from "../../utility/constant";
import { LoadingSpinner, getJobTypeLabel } from "../../components/Common";

const EmployerJobs: React.FC = () => {
  const navigate = useNavigate();
  const { employerId } = useParams<{ employerId: string }>();
  const [sortOption, setSortOption] = useState("asc");
  const [limit, setLimit] = useState<string>("12");
  const [loading, setLoading] = useState<boolean>(false);
  const [jobListData, setJobListData] = useState<Job[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(count / Number(limit));

  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type || "Candidate"
  );
  const token = useSelector((state: RootState) => state.auth.token);

  const handleStateChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const getAllJobsData = async (employerId: string, loading: boolean) => {
    try {
      setLoading(loading);
      const response = await jobService.getAllEmployerJobsData(
        employerId,
        page,
        Number(limit),
        sortOption
      );
      setJobListData(response?.data?.data);
      setCount(response?.data?.pagination?.total);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const bookmarkAJob = async (jobId: string) => {
    try {
      if (employerId) {
        await bookmarkService.bookmarkAJob({ jobId });
        getAllJobsData(employerId, false);
      }
    } catch (e) {}
  };

  const removeFromBookmark = async (bookmarkId: string) => {
    try {
      if (employerId) {
        await bookmarkService.removeFromBookmark(bookmarkId);
        getAllJobsData(employerId, false);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (employerId) {
      getAllJobsData(employerId, true);
    }
  }, [page, limit, sortOption]);

  const handleCallFunction = () => {
    if (employerId) {
      getAllJobsData(employerId, false);
    }
  };

  return (
    <>
      <Header />
      <FindJobHeader title={PAGE_TITLES.FIND_JOBS_BY_EMPLOYER} />
      <div className="bg-white-100 p-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto ml-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-3 sm:w-40 border border-gray-300 h-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full p-3 sm:w-40 border border-gray-300 h-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {PER_PAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4">
          <div className="col-span-12 md:col-span-8 bg-white">
            {loading ? (
              <LoadingSpinner message="Loading jobs" />
            ) : (
              <>
                {jobListData.length === 0 ? (
                  <div className="mb-4 cursor-pointer transition-all duration-200 hover:shadow-md rounded-xl">
                    <div
                      className="border rounded-xl p-6 flex flex-col sm:flex-row justify-center items-center sm:items-center gap-4 bg-white"
                      style={{ borderColor: "#EDEFF5" }}
                    >
                      No data available
                    </div>
                  </div>
                ) : (
                  jobListData.map((item: Job) => (
                    <div
                      key={item._id}
                      className="mb-4 cursor-pointer transition-all duration-200 hover:shadow-md rounded-xl"
                      onClick={() => {
                        if (!isOpen) {
                          navigate(`/jobdetails/${item._id}`);
                        }
                      }}
                    >
                      <div
                        className="border rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white"
                        style={{ borderColor: "#EDEFF5" }}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                          {item.profile_url && item.profile_url !== "" ? (
                            <img
                              src={item.profile_url}
                              className="w-14 h-14 object-cover border p-1 rounded-lg"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-gray-500 text-xl">
                                {item.job_title.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg text-gray-900">
                                {item.job_title}
                              </h4>
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                {getJobTypeLabel(item.jobType)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {item.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <BriefcaseBusiness className="w-4 h-4 text-gray-400" />
                                {`${item.salary_min} - ${item.salary_max}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {role === "Candidate" && token && (
                          <div className="flex gap-3 sm:mt-0 mt-4 w-full sm:w-auto justify-end items-center">
                            <button className="text-gray-500 hover:text-blue-600">
                              {item.isBookmarked ? (
                                <BookmarkCheck
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFromBookmark(item.bookmarkId);
                                  }}
                                />
                              ) : (
                                <Bookmark
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    bookmarkAJob(item._id);
                                  }}
                                />
                              )}
                            </button>

                            {item.hasApplied ? (
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
                                jobData={item}
                                isOpen={isOpen}
                                onStateChange={handleStateChange}
                                callParentFunction={() => handleCallFunction()}
                              >
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                                  {UI_TEXT.applyNowTitle}
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </ApplyJobDialog>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {jobListData.length > 0 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmployerJobs;
