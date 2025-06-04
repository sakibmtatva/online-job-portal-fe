import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../../components/custom/Header";
import Footer from "../../components/custom/Footer";
import { UI_TEXT } from "../../config/config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  Globe,
  Bookmark,
  ArrowRight,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  MapPin,
  BookmarkCheck,
  Type,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import moment from "moment";
import jobService from "../../services/job-service";
import { SingleJob } from "../../utility/interface/IJobResponse";
import bookmarkService from "../../services/bookmark-service";
import ApplyJobDialog from "../../components/custom/ApplyJobModal";
import { getJobTypeLabel, LoadingSpinner } from "../../components/Common";

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [jobData, setJobData] = useState<SingleJob>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type || "Candidate"
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (open: boolean) => {
    setIsOpen(open);
  };

  const getSingleJobData = async (jobId: string, loading: boolean) => {
    try {
      setLoading(loading);
      const response = await jobService.getSingleJobData(jobId);
      setJobData(response?.data?.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const bookmarkAJob = async () => {
    try {
      if (jobId) {
        await bookmarkService.bookmarkAJob({ jobId });
        getSingleJobData(jobId, false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromBookmark = async (bookmarkId: string) => {
    try {
      if (jobId) {
        await bookmarkService.removeFromBookmark(bookmarkId);
        getSingleJobData(jobId, false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCallFunction = () => {
    if (jobId) {
      getSingleJobData(jobId, false);
    }
  };

  useEffect(() => {
    if (jobId) {
      getSingleJobData(jobId, true);
    }
  }, []);

  return (
    <>
      <Header />
      <div>
        <div className="bg-gray-100">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {UI_TEXT.jobDetailsTitle}
              </h2>
              <div className="text-sm text-gray-500">
                <span>{UI_TEXT.homeTitle}</span> /{" "}
                <button
                  className="text-gray-800 font-semibold cursor-pointer bg-transparent border-none p-0"
                  onClick={() => navigate(`/jobs`)}
                >
                  {UI_TEXT.findJobsTitle}
                </button>
                / {""}
                <span className="text-gray-800 font-semibold">
                  {UI_TEXT.jobDetailsTitle}
                </span>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner message="Loading job details" />
        ) : (
          <>
            <div className="bg-white max-w-7xl mx-auto">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white gap-4 p-4 md:p-0 border-[#E7F0FA] rounded-lg border-2 md:border-none">
                  <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
                    <div className="w-full md:w-auto flex justify-between items-center">
                      <div className="w-16 h-16 flex-shrink-0 ">
                        {jobData?.employerDetails?.profile_url &&
                        jobData.employerDetails.profile_url !== "" ? (
                          <img
                            src={jobData?.employerDetails?.profile_url}
                            className="w-14 h-14 rounded-lg border object-cover p-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-gray-500 text-xl">
                              {jobData?.job_title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      {role === "Candidate" && token && (
                        <button className="h-[40px] w-[40px] rounded-md bg-[#E7F0FA] items-center justify-center flex md:hidden">
                          {jobData?.isBookmarked ? (
                            <BookmarkCheck
                              className="h-5 w-5 text-blue-500"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromBookmark(jobData?.bookmarkId);
                              }}
                            />
                          ) : (
                            <Bookmark
                              className="h-5 w-5 text-blue-500"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                bookmarkAJob();
                              }}
                            />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {jobData?.job_title}
                        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                          {jobData?.jobType &&
                            getJobTypeLabel(jobData?.jobType)}
                        </span>
                      </h2>

                      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mt-2">
                        {jobData?.employerDetails?.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <a
                              href={jobData?.employerDetails?.website}
                              className="hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {jobData?.employerDetails?.website}
                            </a>
                          </div>
                        )}
                        {jobData?.employerDetails?.phone_number && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {jobData?.employerDetails?.phone_number}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {jobData?.employerDetails?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  {role === "Candidate" && token && (
                    <div className="flex flex-col justify-center w-full md:w-auto items-center md:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button className="h-[40px] w-[40px] rounded-md bg-[#E7F0FA] items-center justify-center hidden md:flex">
                          {jobData?.isBookmarked ? (
                            <BookmarkCheck
                              className="h-5 w-5 text-blue-500"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromBookmark(jobData?.bookmarkId);
                              }}
                            />
                          ) : (
                            <Bookmark
                              className="h-5 w-5 text-blue-500"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                bookmarkAJob();
                              }}
                            />
                          )}
                        </button>
                        {jobData?.hasApplied ? (
                          <Button className="bg-yellow-50 text-yellow-600 font-medium py-2 px-4 rounded-lg flex items-center hover:bg-yellow-100 transition-colors">
                            {UI_TEXT.alreadyAppliedTitle}
                          </Button>
                        ) : (
                          <>
                            {jobData && (
                              <ApplyJobDialog
                                jobData={jobData}
                                isOpen={isOpen}
                                onStateChange={handleStateChange}
                                callParentFunction={() => handleCallFunction()}
                              >
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                                  {UI_TEXT.applyNowTitle}
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </ApplyJobDialog>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white max-w-7xl mx-auto">
              <div className="px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-white p-4 md:p-0 border-[#E7F0FA] rounded-lg border-2 md:border-none">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {UI_TEXT.jobDescriptionTitle}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 break-words">
                      {jobData?.job_description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="bg-white p-4 rounded-lg border-2 border-[#E7F0FA]">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {UI_TEXT.jobOverviewTitle}
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-gray-600">
                        <div className="flex flex-col items-start gap-1">
                          <Calendar className="text-blue-500 w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            {UI_TEXT.jobPostedTitle}
                          </span>
                          <span className="font-medium text-gray-800 text-sm">
                            {moment(jobData?.createdAt).format("D MMMM, YYYY")}
                          </span>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                          <GraduationCap className="text-blue-500 w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            {UI_TEXT.educationDetailsTitle}
                          </span>
                          <span className="font-medium text-gray-800 text-sm">
                            {jobData?.education}
                          </span>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                          <DollarSign className="text-blue-500 w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            {UI_TEXT.salaryTitle}:
                          </span>
                          <span className="font-medium text-gray-800 text-sm">
                            {`${jobData?.salary_min} - ${jobData?.salary_max}`}
                            /month
                          </span>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                          <MapPin className="text-blue-500 w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            {UI_TEXT.locationTitle}:
                          </span>
                          <span className="font-medium text-gray-800 text-sm">
                            {jobData?.location}
                          </span>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                          <Type className="text-blue-500 w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            {UI_TEXT.jobTypeTitle}:
                          </span>
                          <span className="font-medium text-gray-800 text-sm">
                            {jobData?.jobType &&
                              getJobTypeLabel(jobData?.jobType)}
                          </span>
                        </div>

                        <div className="flex flex-col items-start gap-1">
                          <Briefcase className="text-blue-500 w-5 h-5" />
                          <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            {UI_TEXT.jobCategoryTitle}:
                          </span>
                          <span className="font-medium text-gray-800 text-sm">
                            {jobData?.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-[#E7F0FA] mb-4">
                      <div className="flex items-center gap-4 mb-4">
                        {jobData?.employerDetails?.profile_url &&
                        jobData.employerDetails.profile_url !== "" ? (
                          <img
                            src={jobData?.employerDetails?.profile_url}
                            className="w-14 h-14 rounded-lg border object-cover p-1"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-gray-500 text-xl">
                              {jobData?.job_title.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {jobData?.employerDetails?.full_name}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-3 text-gray-600 text-sm">
                        {jobData?.employerDetails?.est_year && (
                          <div className="flex justify-between">
                            <span>{UI_TEXT.foundedInTitle}:</span>
                            <span className="font-medium text-gray-800">
                              {jobData?.employerDetails?.est_year}
                            </span>
                          </div>
                        )}
                        {jobData?.employerDetails?.industry_type && (
                          <div className="flex justify-between">
                            <span>{UI_TEXT.organizationTypeTitle}:</span>
                            <span className="font-medium text-gray-800">
                              {jobData?.employerDetails?.industry_type}
                            </span>
                          </div>
                        )}
                        {jobData?.employerDetails?.total_working_employees && (
                          <div className="flex justify-between">
                            <span>{UI_TEXT.companySizeTitle}:</span>
                            <span className="font-medium text-gray-800">
                              {
                                jobData?.employerDetails
                                  ?.total_working_employees
                              }{" "}
                              Employers
                            </span>
                          </div>
                        )}
                        {jobData?.employerDetails?.phone_number && (
                          <div className="flex justify-between">
                            <span>{UI_TEXT.phoneTitle}:</span>
                            <span className="font-medium text-gray-800">
                              {jobData?.employerDetails?.phone_number}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>{UI_TEXT.emailTitle}:</span>
                          <span className="font-medium text-gray-800">
                            {jobData?.employerDetails?.email}
                          </span>
                        </div>
                        {jobData?.employerDetails?.website && (
                          <div className="flex justify-between">
                            <span>{UI_TEXT.websiteTitle}:</span>
                            <a
                              href={jobData?.employerDetails?.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {jobData?.employerDetails?.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JobDetails;
