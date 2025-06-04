import Header from "../components/custom/Header";
import {
  HeroImg,
  JobIcon,
  CompanyIcon,
  CandidateIcon,
  userPlaceholder,
  circleWavy,
  magnifyingGlass,
  uploadResume,
  upwordDash,
  downwordDash,
} from "../assets/assets";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  MapPin,
  Search,
} from "lucide-react";
import { Input } from "../components/ui/input";
import Footer from "../components/custom/Footer";
import bookmarkService from "../services/bookmark-service";
import jobService from "../services/job-service";
import { Job } from "../utility/interface/IJobResponse";
import { UI_TEXT } from "../config/config";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ApplyJobDialog from "../components/custom/ApplyJobModal";
import { Filter } from "./FindJobs/FindJobListing";
import { useNavigate } from "react-router-dom";
import { getJobTypeLabel } from "../components/Common";
import { LocationRS } from "../utility/interface/ILocationResponse";
import locationService from "../services/location-service";
type LiveDataType = {
  title: string;
  icon: string;
  count: string | number;
};

interface Option {
  label: string;
  value: string;
}

const LandingPage = () => {
  const [filter, setFilter] = useState<Filter>({
    jobTitle: "",
    location: "",
    category: "",
    experienceLevel: "",
    jobType: "",
    salaryRange: "",
  });
  const [liveData, setLiveData] = useState<LiveDataType[]>([]);
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [jobListData, setJobListData] = useState<Job[]>([]);
  const [totalData, setTotalData] = useState<{
    totalJobs: string | number;
    totalEmployers: string | number;
    totalCandidates: string | number;
  }>({
    totalJobs: 0,
    totalEmployers: 0,
    totalCandidates: 0,
  });
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type || "Candidate"
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (open: boolean) => {
    setIsOpen(open);
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
    } catch (e) {
      console.error(e);
    }
  };

  const getAllJobsData = async () => {
    try {
      const response = await jobService.getAllJobsData(1, Number(6), filter);
      setJobListData(response?.data?.data);
      setTotalData({
        totalJobs: response?.data?.pagination.totalJobs || 0,
        totalEmployers: response?.data?.pagination?.totalEmployers || 0,
        totalCandidates: response?.data?.pagination?.totalCandidates || 0,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const bookmarkAJob = async (jobId: string) => {
    try {
      await bookmarkService.bookmarkAJob({ jobId });
      getAllJobsData();
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromBookmark = async (bookmarkId: string) => {
    try {
      await bookmarkService.removeFromBookmark(bookmarkId);
      getAllJobsData();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getLocationData();
    getAllJobsData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLiveData([
      {
        title: "Live Job",
        icon: JobIcon,
        count: totalData?.totalJobs || "0",
      },
      {
        title: "Companies",
        icon: CompanyIcon,
        count: totalData?.totalEmployers || "0",
      },
      {
        title: "Candidates",
        icon: CandidateIcon,
        count: totalData?.totalCandidates || "0",
      },
    ]);
  }, [totalData]);

  const handleFindJobClick = () => {
    const queryParams = new URLSearchParams(
      Object.entries(filter).reduce((acc, [key, value]) => {
        if (value) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    navigate(`/jobs?${queryParams}`);
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find a job that suits your interest & skills.
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-10">
                Discover your perfect career match. Find a job that aligns with
                your passion and expertise. Your ideal opportunity awaits.
              </p>

              <div className="bg-white border border-blue-300 rounded-lg flex flex-col md:flex-row items-stretch md:items-center w-full shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 flex-1">
                  <Search className="text-blue-500 w-5 h-5" />
                  <Input
                    type="text"
                    name="jobTitle"
                    value={filter.jobTitle}
                    onChange={handleChange}
                    placeholder="Job title, Keyword..."
                    className="border-0 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 placeholder:text-gray-500 w-full py-2 mr-[24px] text-gray-700 text-sm rounded-md"
                  />
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-300" />

                <div className="flex items-center gap-2 px-4 py-3 flex-1">
                  <MapPin className="text-blue-500 w-5 h-5" />
                  <select
                    name="location"
                    value={filter.location}
                    onChange={handleChange}
                    className="border-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 placeholder:text-gray-500 w-full py-2 mr-[24px] text-gray-700 text-sm rounded-md"
                  >
                    <option value="">{UI_TEXT.selectLocationTitle}</option>
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="px-4 py-3 md:py-0">
                  <Button
                    onClick={handleFindJobClick}
                    className="bg-blue-600 text-white font-medium hover:bg-blue-700 px-6 w-full md:w-auto h-12"
                  >
                    Find Job
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <img
                src={HeroImg}
                alt="hero img"
                className="w-full max-w-sm md:max-w-md lg:max-w-lg"
              />
            </div>
          </div>

          <div className="w-full mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveData.map((item: LiveDataType) => (
              <div
                key={item.title}
                className="bg-white p-6 flex items-center gap-5 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={item.icon}
                  alt={`${item.title} Icon`}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold">{item.count}</h2>
                  <p className="text-base text-gray-600">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl md:text-3xl font-semibold mb-6">
            How jobpilot works
          </h3>
          <p className="text-base md:text-lg text-gray-600 mb-10">
            Our platform streamlines your job search with a simple, effective
            process to connect you with the right opportunities.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-12 relative">
            <div className="text-center max-w-[200px] z-10">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <img
                  src={userPlaceholder}
                  alt="user placeholder"
                  className="w-10 h-10"
                />
              </div>
              <h4 className="font-bold text-lg mb-2">Create account</h4>
              <p className="text-sm text-gray-500">
                Set up your profile in minutes to unlock access to thousands of
                career opportunities.
              </p>
            </div>

            <div className="hidden md:block absolute left-[11%] right-[67%] top-[-10px] z-11">
              <img
                src={upwordDash}
                alt="upward dashed arrow"
                className="w-full h-[70px] object-contain"
              />
            </div>

            <div className="text-center max-w-[250px] rounded-lg z-10 bg-gray-100 py-4 px-10">
              <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center ml-10 mr-9 mb-4">
                <img
                  src={uploadResume}
                  alt="upload resume"
                  className="w-10 h-10"
                />
              </div>
              <h4 className="font-bold text-lg mb-2">Upload CV/Resume</h4>
              <p className="text-sm text-gray-500">
                Share your professional background effortlessly so employers can
                find you.
              </p>
            </div>

            <div className="hidden md:block absolute left-[37%] z-11 right-[35%] top-14">
              <img
                src={downwordDash}
                alt="downward dashed arrow"
                className="w-full h-[63px] object-contain"
              />
            </div>

            <div className="text-center max-w-[200px] z-10">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <img
                  src={magnifyingGlass}
                  alt="magnifying glass"
                  className="w-10 h-10"
                />
              </div>
              <h4 className="font-bold text-lg mb-2">Find suitable job</h4>
              <p className="text-sm text-gray-500">
                Browse curated listings that match your skills and preferences.
              </p>
            </div>

            <div className="hidden md:block absolute left-[65%] right-[10%] top-[-10px]">
              <img
                src={upwordDash}
                alt="upward dashed arrow"
                className="w-full h-[65px] object-contain"
              />
            </div>

            <div className="text-center max-w-[200px] z-10">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <img src={circleWavy} alt="circle wavy" className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-lg mb-2">Apply job</h4>
              <p className="text-sm text-gray-500">
                Submit applications with just one click and track your progress.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-semibold">Featured jobs</h3>
            <a
              href="/jobs"
              className="text-blue-600 font-medium flex items-center"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          <div className="space-y-4">
            {" "}
            {jobListData.length === 0 ? (
              <div className="border border-blue-500 rounded-lg p-6 flex justify-center items-center gap-4">
                No data available
              </div>
            ) : (
              jobListData.map((item: Job) => (
                <div key={item._id} className="mb-4">
                  <div className="border border-blue-500 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">
                            {item.job_title}
                          </h4>
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {getJobTypeLabel(item.jobType)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-5 h-5" />
                            {item.location}
                          </div>

                          <div className="flex items-center gap-1">
                            <BriefcaseBusiness className="w-5 h-5" />
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
                            className="bg-yellow-50 text-yellow-600 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-yellow-100"
                          >
                            {UI_TEXT.alreadyAppliedTitle}
                          </Button>
                        ) : (
                          <ApplyJobDialog
                            jobData={item}
                            isOpen={isOpen}
                            onStateChange={handleStateChange}
                            callParentFunction={() => getAllJobsData()}
                          >
                            <Button className="w-full sm:w-auto md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                              {UI_TEXT.applyNowTitle}
                              <ArrowRight className="w-5 h-5" />
                            </Button>
                          </ApplyJobDialog>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="px-4 py-16">
        <div className="flex flex-wrap justify-center items-center gap-4 px-4 sm:px-8 md:px-16 lg:px-40">
          <div className="bg-gray-200 px-6 py-6 w-full sm:w-[320px] md:w-[350px] lg:w-[400px] h-auto rounded-md">
            <h3 className="text-[21px] font-semibold">Become a Candidate</h3>
            <p className="text-sm text-gray-500 my-4">
              Start your career journey with us. Create your profile, showcase
              your skills, and discover job opportunities that match your
              aspirations.
            </p>
            <a
              href="/register"
              className="bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-sm w-[155px] flex items-center hover:bg-blue-100 transition-colors"
            >
              Register Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          <div className="bg-blue-800 px-6 py-6 w-full sm:w-[320px] md:w-[350px] lg:w-[400px] h-auto rounded-md">
            <h3 className="text-xl text-white font-semibold">
              Become an Employer
            </h3>
            <p className="text-sm text-white my-4">
              Find the perfect talent for your team. Post jobs, review
              applications, and connect with qualified candidates effortlessly.
            </p>
            <button
              // href="/register"
              onClick={() => navigate("/register?type=Employer")}
              className="bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-sm w-[155px] flex items-center hover:bg-blue-100 transition-colors"
            >
              Register Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
