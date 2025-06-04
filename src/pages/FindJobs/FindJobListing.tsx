import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Layers3,
  MapPin,
  Search,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/custom/Pagination";
import FilterAccordionGroup from "../../components/filterAccordianGroup/filterAccordianGroup";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { UI_TEXT } from "../../config/config";
import { SORT_OPTIONS, PER_PAGE_OPTIONS } from "../../data";
import jobService from "../../services/job-service";
import { Job } from "../../utility/interface/IJobResponse";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import bookmarkService from "../../services/bookmark-service";
import ApplyJobDialog from "../../components/custom/ApplyJobModal";
import locationService from "../../services/location-service";
import { JobCategory } from "../../utility/interface/IJobCategories";
import { LocationRS } from "../../utility/interface/ILocationResponse";
import { getJobTypeLabel, LoadingSpinner } from "../../components/Common";
import { useLocation } from "react-router-dom";

export interface Filter {
  jobTitle: string;
  location: string;
  category: string;
  experienceLevel: string;
  jobType: string;
  salaryRange: string;
}

interface Option {
  label: string;
  value: string;
}

const FindJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [filter, setFilter] = useState<Filter>({
    jobTitle: queryParams.get("jobTitle") || "",
    location: queryParams.get("location") || "",
    category: "",
    experienceLevel: "",
    jobType: "",
    salaryRange: "",
  });
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [jobCategoryOptions, setJobCategoryOptions] = useState<Option[]>([]);
  const filterClearedRef = useRef(false);
  const [sortOption, setSortOption] = useState("asc");
  const [jobListData, setJobListData] = useState<Job[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<string>("12");
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const totalPages = Math.ceil(count / Number(limit));
  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (open: boolean) => {
    setIsOpen(open);
  };
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type || "Candidate"
  );
  const token = useSelector((state: RootState) => state.auth.token);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
      getAllJobsData(page, true);
    }
  };

  const getLocationData = async () => {
    try {
      const response = await locationService.getLocationData();
      const data: LocationRS[] = response.data?.data;

      const formattedLocations = data.map((location) => ({
        label: location.name,
        value: location.name,
      }));
      setLocationOptions(formattedLocations);
    } catch (e) {}
  };

  const getJobCategoryData = async () => {
    try {
      const response = await jobService.getJobCategoryData();
      const data: JobCategory[] = response.data?.data;

      const formattedJobCategories = data.map((category) => ({
        label: category.name,
        value: category.name,
      }));
      setJobCategoryOptions(formattedJobCategories);
    } catch (e) {}
  };

  const getAllJobsData = async (page: number, loading: boolean) => {
    try {
      setLoading(loading);
      const response = await jobService.getAllJobsData(
        page,
        Number(limit),
        filter,
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
      await bookmarkService.bookmarkAJob({ jobId });
      getAllJobsData(page, false);
    } catch (e) {}
  };

  const removeFromBookmark = async (bookmarkId: string) => {
    try {
      await bookmarkService.removeFromBookmark(bookmarkId);
      getAllJobsData(page, false);
    } catch (e) {}
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClearAllFilter = () => {
    setFilter({
      jobTitle: "",
      location: "",
      category: "",
      experienceLevel: "",
      jobType: "",
      salaryRange: "",
    });
    setPage(1);
    setLimit("12");
    navigate("/jobs", { replace: true });
    filterClearedRef.current = true;
  };

  useEffect(() => {
    getLocationData();
    getJobCategoryData();
  }, []);

  useEffect(() => {
    if (filterClearedRef.current) {
      filterClearedRef.current = false;
      getAllJobsData(1, true);
    }
  }, [filter]);

  useEffect(() => {
    setPage(1);
    getAllJobsData(1, true);
  }, [
    limit,
    filter.experienceLevel,
    filter.jobType,
    filter.salaryRange,
    sortOption,
  ]);

  return (
    <div>
      <div className="bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {UI_TEXT.findJobsTitle}
            </h2>
            <div className="text-sm text-gray-500">
              <span>{UI_TEXT.homeTitle}</span> /{" "}
              <span className="text-gray-800 font-semibold">
                {UI_TEXT.findJobsTitle}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl flex flex-col md:flex-row items-center px-6 py-6 space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex items-center w-full md:w-1/3 border-gray-200 mb-4 md:mb-0 md:border-r">
              <Search className="text-blue-500 w-5 h-5 mr-3" />
              <Input
                type="text"
                name="jobTitle"
                value={filter.jobTitle}
                onChange={handleChange}
                placeholder="Job title, Keyword..."
                className="border-0 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 placeholder:text-gray-500 w-full px-0 py-2 md:mr-[24px] text-gray-700 text-sm rounded-md"
              />
            </div>
            <div className="flex items-center w-full md:w-1/3 border-gray-200 mb-4 md:mb-0 md:border-r">
              <MapPin className="text-blue-500 w-5 h-5 mr-3" />
              <select
                name="location"
                value={filter.location}
                onChange={handleChange}
                className="border-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 placeholder:text-gray-500 w-full py-2 md:mr-[24px] text-gray-700 text-sm rounded-md"
              >
                <option value="">{UI_TEXT.selectLocationTitle}</option>
                {locationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center w-full md:w-1/3 mb-4 md:mb-0">
              <Layers3 className="text-blue-500 w-5 h-5 mr-3" />
              <select
                name="category"
                value={filter.category}
                onChange={handleChange}
                className="border-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 placeholder:text-gray-500 w-full py-2 text-gray-700 text-sm rounded-md"
              >
                <option value="">{UI_TEXT.selectCategoryTitle}</option>
                {jobCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto flex justify-center">
              <Button
                onClick={() => {
                  setPage(1);
                  getAllJobsData(1, true);
                }}
                className="w-full sm:w-auto md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {UI_TEXT.findJobsTitle}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white-100 p-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Available Jobs: {count}
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto ml-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-3 md:w-40 border border-gray-300 h-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
              className="w-full p-3 md:w-40 border border-gray-300 h-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 md:col-span-4 bg-white">
              <div
                className="p-6 rounded border"
                style={{ borderColor: "#EDEFF5" }}
              >
                <FilterAccordionGroup
                  filter={filter}
                  handleChange={handleChange}
                />
              </div>
              <div className="w-full sm:w-auto flex justify-center mt-4">
                {Object.values(filter).some((value) => value !== "") && (
                  <Button
                    onClick={handleClearAllFilter}
                    className="w-full sm:w-auto md:w-auto bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {UI_TEXT.clearAllFilter}
                  </Button>
                )}
              </div>
            </div>
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
                        className="mb-4 cursor-pointer transition-all duration-200 hover:shadow-lg rounded-xl"
                        onClick={() => {
                          if (!isOpen) {
                            navigate(`/jobdetails/${item._id}`);
                          }
                        }}
                      >
                        <div
                          className="border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white"
                          style={{ borderColor: "#EDEFF5" }}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            <div className="w-full sm:w-auto flex justify-between items-center">
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
                              {role === "Candidate" && token && (
                                <button className="text-gray-500 hover:text-blue-600 block sm:hidden">
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
                              )}
                            </div>
                            <div className="w-full sm:w-auto">
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
                            <div className="flex gap-3 sm:mt-0 mt-4 w-full sm:w-auto justify-center md:justify-end items-center">
                              <button className="text-gray-500 hover:text-blue-600 hidden sm:block">
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
                                  callParentFunction={() =>
                                    getAllJobsData(page, false)
                                  }
                                >
                                  <Button className="w-full sm:w-auto md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
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
      </div>
    </div>
  );
};

export default FindJobs;
