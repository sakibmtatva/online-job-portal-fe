import { useEffect, useState } from "react";
import candidateappliedjobService from "../../services/candidateappliedjob-service";
import { FavoriteJobApplication } from "../../utility/interface/IFavoriteJobResponse";
import bookmarkService from "../../services/bookmark-service";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import Pagination from "../../components/custom/Pagination";
import FavoriteJobTable from "../Dashboard/FavoriteJobTable";

const CandidateBookmarkedJobs = () => {
  const [bookmarkedCount, setBookmarkedCount] = useState<number>(0);
  const [favoriteJobData, setFavoriteJobData] = useState<
    FavoriteJobApplication[]
  >([]);
  const [loadingF, setLoadingF] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<string>("10");
  const [isOpen, setIsOpen] = useState(false);
  const totalPages = Math.ceil(bookmarkedCount / Number(limit));

  const handleStateChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const getCandidateBookmarkedJobs = async (loading: boolean) => {
    try {
      setLoadingF(loading);
      const response =
        await candidateappliedjobService.getCandidateBookmarkedJobsData(
          page,
          Number(limit)
        );
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
    getCandidateBookmarkedJobs(true);
  }, [page, limit]);
  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mt-4">
          <span className="text-black text-2xl">Favorite Jobs</span>
        </div>
        <div className="overflow-x-auto w-full mt-4">
          <FavoriteJobTable
            loadingF={loadingF}
            getCandidateBookmarkedJobs={getCandidateBookmarkedJobs}
            removeFromBookmark={removeFromBookmark}
            isOpen={isOpen}
            handleStateChange={handleStateChange}
            favoriteJobData={favoriteJobData}
          />
        </div>
        {favoriteJobData.length > 0 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CandidateBookmarkedJobs;
