import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
// Update the imports to include Loader2
import { MapPin, Bookmark, BookmarkCheck } from "lucide-react";
import CandidateFilter from "../../components/filterAccordianGroup/CandidateFilter";
import { PER_PAGE_OPTIONS, SORT_OPTIONS } from "../../data";
import profileService from "../../services/profile-service";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import { ICandidateProfileDataResponse } from "../../utility/interface/ICandidateProfile";
import Pagination from "../../components/custom/Pagination";
import { IPagination } from "../../utility/interface/IResponse";
import bookmarkService from "../../services/bookmark-service";
import { LoadingSpinner } from "../../components/Common";

interface CandidateCardProps {
  candidate: ICandidateProfileDataResponse;
}

const CandidateListing = () => {
  const [sortOption, setSortOption] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState("12");
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState<ICandidateProfileDataResponse[]>(
    []
  );
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async (loading: boolean) => {
    try {
      setLoading(loading);
      const response = await profileService.getCandidateProfileListData(
        currentPage,
        Number(itemsPerPage),
        sortOption
      );
      setCandidates(response?.data?.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const bookmarkACandidate = async (candidateId: string) => {
    try {
      await bookmarkService.bookmarkACandidate({ candidateId });
      fetchCandidates(false);
    } catch (e) {}
  };

  const removeFromBookmark = async (bookmarkId: string) => {
    try {
      await bookmarkService.removeCandidateFromBookmark(bookmarkId);
      fetchCandidates(false);
    } catch (e) {}
  };

  const CandidateCard = ({ candidate }: CandidateCardProps) => (
    <Card className="p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white w-full">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {candidate?.profile_url && candidate.profile_url !== "" ? (
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

          <div className="space-y-1 w-full sm:w-auto">
            <h3 className="text-lg font-semibold text-gray-900">
              {candidate?.full_name}
            </h3>
            <p className="text-sm text-gray-600">
              {candidate?.position !== ""
                ? candidate.position
                : "Position not specified"}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
              {candidate?.location ? (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{candidate.location}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Location not specified</p>
              )}
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center w-auto">
          <button className="text-gray-500 hover:text-blue-600">
            {candidate.isBookmarked ? (
              <BookmarkCheck
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromBookmark(candidate.bookmarkId);
                }}
              />
            ) : (
              <Bookmark
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  bookmarkACandidate(candidate.user);
                }}
              />
            )}
          </button>
        </div>
      </div>
    </Card>
  );

  useEffect(() => {
    fetchCandidates(true);
  }, [currentPage, itemsPerPage, sortOption]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (
    filterType: string,
    value: string | number | string[]
  ) => {
    console.log(filterType, value);
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <main className="sm:p-6 bg-white flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-lg font-semibold mb-2 md:mb-0 text-gray-800">
              Find Candidates
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
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
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
          <div className="mt-4">
            <div className="grid grid-cols-12 gap-4 items-start">
              <div
                className="col-span-12 md:col-span-4 bg-white p-6 rounded border hidden"
                style={{ borderColor: "#EDEFF5" }}
              >
                <CandidateFilter onFilterChange={handleFilterChange} />
              </div>

              <div className="col-span-12 md:col-span-12 bg-white">
                {loading ? (
                  <LoadingSpinner message="Loading candidates..." />
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {candidates.map((candidate) => (
                        <CandidateCard
                          key={candidate._id}
                          candidate={candidate}
                        />
                      ))}
                    </div>

                    {pagination && (
                      <div className="mt-6 flex justify-center items-center">
                        <Pagination
                          currentPage={pagination.page}
                          totalPages={pagination.totalPages}
                          handlePageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default CandidateListing;
