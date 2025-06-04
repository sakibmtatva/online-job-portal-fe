import { useEffect, useState } from "react";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import Pagination from "../../components/custom/Pagination";
import bookmarkService, { UserProfile } from "../../services/bookmark-service";
import { LoadingSpinner } from "../../components/Common";
import { BookmarkCheck } from "lucide-react";
import { Card } from "../../components/ui/card";

const BookmarkedCandidates = () => {
  const [count, setCount] = useState<number>(0);
  const [savedCandidateData, setSavedCandidateData] = useState<UserProfile[]>(
    []
  );
  const [limit] = useState<string>("10");
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(count / Number(limit));
  const [loadingF, setLoadingF] = useState<boolean>(false);

  const getBookmarkedCandidates = async (loading: boolean) => {
    try {
      setLoadingF(loading);
      const response = await bookmarkService.getBookmarkedCandidateData(
        page,
        Number(limit)
      );
      setSavedCandidateData(response?.data?.data);
      setCount(response?.data?.pagination?.total);
    } catch (e) {
    } finally {
      setLoadingF(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const removeFromBookmark = async (bookmarkId: string) => {
    try {
      await bookmarkService.removeCandidateFromBookmark(bookmarkId);
      getBookmarkedCandidates(false);
    } catch (e) {}
  };

  useEffect(() => {
    getBookmarkedCandidates(true);
  }, [page, limit]);
  return (
    <Layout>
      <div className="sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-black font-bold text-2xl">Saved Candidates</h2>
        </div>
        <div className="overflow-x-auto w-full mt-4">
          {loadingF ? (
            <LoadingSpinner message="Loading bookmarked candidates..." />
          ) : savedCandidateData.length === 0 ? (
            <div className="p-4 border rounded-md flex justify-center items-center">
              No data available
            </div>
          ) : (
            <>
              {savedCandidateData.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white w-full mb-4"
                >
                  <div className="flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {candidate?.profile_url &&
                      candidate.profile_url !== "" ? (
                        <img
                          src={candidate.profile_url}
                          className="w-14 h-14 object-cover border p-1 rounded-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-gray-500 text-xl">
                            {candidate?.full_name?.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidate?.full_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {candidate?.position !== ""
                            ? candidate.position
                            : "Position not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <button className="text-gray-500 hover:text-blue-600">
                        <BookmarkCheck
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromBookmark(candidate.bookmarkId);
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
          {savedCandidateData.length > 0 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookmarkedCandidates;
