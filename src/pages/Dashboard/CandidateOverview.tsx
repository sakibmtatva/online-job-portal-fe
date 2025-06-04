import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ArrowRight, Bookmark, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";
import candidateappliedjobService from "../../services/candidateappliedjob-service";
import { Job } from "../../utility/interface/IJobResponse";
import { useNavigate } from "react-router-dom";
import { FavoriteJobApplication } from "../../utility/interface/IFavoriteJobResponse";
import bookmarkService from "../../services/bookmark-service";
import JobTable from "./AppliedJobTable";
import FavoriteJobTable from "./FavoriteJobTable";

const CandidateOverview = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(0);
  const [bookmarkedCount, setBookmarkedCount] = useState<number>(0);
  const [jobData, setJobData] = useState<Job[]>([]);
  const [favoriteJobData, setFavoriteJobData] = useState<
    FavoriteJobApplication[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingF, setLoadingF] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleStateChange = (open: boolean) => {
    setIsOpen(open);
  };

  const getCandidateAppliedJobs = async () => {
    try {
      setLoading(true);
      const response =
        await candidateappliedjobService.getCandidateAppliedJobsData(1, 5);
      setCount(response?.data?.pagination?.total);
      setJobData(response?.data?.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const getCandidateBookmarkedJobs = async (loading: boolean) => {
    try {
      setLoadingF(loading);
      const response =
        await candidateappliedjobService.getCandidateBookmarkedJobsData(1, 5);
      setBookmarkedCount(response?.data?.pagination?.total);
      setFavoriteJobData(response?.data?.data);
    } catch (e) {
    } finally {
      setLoadingF(false);
    }
  };

  const removeFromBookmark = async (bookmarkId: string) => {
    try {
      await bookmarkService.removeFromBookmark(bookmarkId);
      getCandidateBookmarkedJobs(false);
    } catch (e) {}
  };

  useEffect(() => {
    getCandidateAppliedJobs();
    getCandidateBookmarkedJobs(true);
  }, []);
  return (
    <div className="sm:px-4 sm:py-2">
      <div className="flex flex-col">
        <span className="text-black text-2xl">
          Hello, {currentUser?.full_name}
        </span>
        <span className="text-gray-500">Here is your daily activities</span>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-6 p-6 rounded-md bg-[#E7F0FA]">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-black text-3xl font-semibold">{count}</span>
              <span className="text-black font-normal">Applied jobs</span>
            </div>
            <div className="flex justify-center items-center bg-white rounded-md h-[64px] w-[64px]">
              <BriefcaseBusiness className="h-[32px] w-[32px] text-blue-500" />
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 p-6 rounded-md bg-[#E7F6EA]">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-black text-3xl font-semibold">
                {bookmarkedCount}
              </span>
              <span className="text-black font-normal">Favorite jobs</span>
            </div>
            <div className="flex justify-center items-center bg-white rounded-md h-[64px] w-[64px]">
              <Bookmark className="h-[32px] w-[32px] text-green-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border rounded-md mt-4">
        <div className="flex justify-between items-center p-1">
          <span className="text-black text-sm sm:text-md md:text-lg">
            Recently Applied
          </span>
          <div
            onClick={() => {
              navigate("/appliedjobs");
            }}
            className="flex justify-center items-center text-gray-500 gap-1 cursor-pointer text-sm sm:text-base"
          >
            <span>View All</span>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
        <div className="overflow-x-auto w-full mt-4">
          <JobTable loading={loading} jobData={jobData} />
        </div>
      </div>
      <div className="p-4 border mt-4 rounded-md">
        <div className="flex justify-between items-center p-1">
          <span className="text-black text-sm sm:text-md md:text-lg">
            Favorite Jobs
          </span>
          <div
            onClick={() => {
              navigate("/bookmarkedjobs");
            }}
            className="flex justify-center items-center text-gray-500 gap-1 cursor-pointer text-sm sm:text-base"
          >
            <span>View All</span>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
        <div className="overflow-x-auto w-full mt-4">
          <FavoriteJobTable
            loadingF={loadingF}
            favoriteJobData={favoriteJobData}
            removeFromBookmark={removeFromBookmark}
            getCandidateBookmarkedJobs={getCandidateBookmarkedJobs}
            getCandidateAppliedJobs={getCandidateAppliedJobs}
            isOpen={isOpen}
            handleStateChange={handleStateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateOverview;
