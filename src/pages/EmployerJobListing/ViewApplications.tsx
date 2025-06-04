import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import { useEffect, useState } from "react";
import viewapplicationService from "../../services/viewapplication-service";
import { Application } from "../../utility/interface/IApplicationResponse";
import { ArrowLeft } from "lucide-react";
import Pagination from "../../components/custom/Pagination";
import { Button } from "../../components/ui/button";
import { getEducation, LoadingSpinner } from "../../components/Common";
import CandidateOverviewModal from "../../components/custom/CandidateOverviewModal";

const ViewApplications: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [application, setApplication] = useState<Application | null>(null);
  const [count, setCount] = useState<number>(0);
  const totalPages = Math.ceil(count / 10);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const getAllApplicationsByJobId = async (jobId: string) => {
    try {
      setLoading(true);
      const response = await viewapplicationService.getAllApplicationsByJobID(
        jobId,
        page,
        10
      );
      setApplications(response?.data?.data || []);
      setCount(response?.data?.pagination?.total);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  useEffect(() => {
    if (jobId) {
      getAllApplicationsByJobId(jobId);
    }
  }, [page]);
  return (
    <Layout>
      <div className="sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Applications</h2>
          <Button
            onClick={() => navigate("/myjobs")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
        </div>
        <div className="grid gap-6">
          {loading ? (
            <LoadingSpinner message="Loading Applications" />
          ) : (
            <>
              {applications.length === 0 ? (
                <div className="flex justify-center items-center border rounded-md p-4 mt-4 text-gray-500">
                  No applications found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-6">
                  {applications.map((app) => {
                    const profile = app.candidate["candidate-profile-info"];
                    return (
                      <div
                        key={app._id}
                        onClick={() => {
                          setShowProfile(true);
                          setApplication(app);
                        }}
                        className="bg-white shadow-lg rounded-lg p-6 flex flex-col cursor-pointer md:flex-row items-start md:items-center gap-6 hover:shadow-2xl transition-shadow duration-300"
                      >
                        {profile.profile_url && profile.profile_url !== "" ? (
                          <img
                            src={profile.profile_url}
                            alt={app.candidate.full_name}
                            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow-md"
                          />
                        ) : (
                          <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-gray-500 text-xl">
                              {app.candidate.full_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-gray-800">
                            {app.candidate.full_name}
                          </h3>
                          <div className="mt-2">
                            <p
                              className={`text-sm ${
                                profile.education
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }`}
                            >
                              {profile.education
                                ? `Education: ${getEducation(
                                    profile.education
                                  )}`
                                : "Education: Not Updated"}
                            </p>
                            <p
                              className={`text-sm ${
                                profile.total_experience
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }`}
                            >
                              {profile.total_experience
                                ? `Experience: ${profile.total_experience} years`
                                : "Experience: Not Updated"}
                            </p>
                            <p
                              className={`text-sm ${
                                profile.phone_number
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }`}
                            >
                              {profile.phone_number
                                ? `Phone: ${profile.phone_number}`
                                : "Phone: Not Updated"}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mt-3">
                            Applied At:{" "}
                            {new Date(app.applied_at).toLocaleString()}
                          </p>
                        </div>
                        <a
                          href={app.resume_url}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-6 rounded-md transition duration-300 transform hover:scale-105"
                        >
                          View Resume
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
              {applications.length > 0 && (
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
      {application && (
        <CandidateOverviewModal
          application={application}
          visible={showProfile}
          onClose={() => {
            setShowProfile(false);
            setApplication(null);
          }}
        />
      )}
    </Layout>
  );
};

export default ViewApplications;
