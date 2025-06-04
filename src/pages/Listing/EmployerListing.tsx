import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import Header from "../../components/custom/Header";
import { ArrowRight } from "lucide-react";
import Pagination from "../../components/custom/Pagination";
import FindJobHeader from "./FindJobHeader";
import profileService from "../../services/profile-service";
import { IEmployerData } from "../../utility/interface/IEmployerProfile";
import { PER_PAGE_OPTIONS, SORT_OPTIONS } from "../../data";

interface Employer {
  id: string;
  name: string;
  location: string;
  jobs: number;
  username: string;
  profile_url: string;
}

import {
  EMPLOYER_UI,
  EMPLOYER_ORGANIZATION_TYPES,
  PAGE_TITLES,
} from "../../utility/constant";
import { IPagination } from "../../utility/interface/IResponse";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../../components/Common";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="text-center py-8">
    <p className="text-red-500 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-blue-500 hover:text-blue-600 underline"
      >
        Try again
      </button>
    )}
  </div>
);
interface EmployerCardProps {
  employer: Employer;
}

const EmployerCard = ({ employer }: EmployerCardProps) => (
  <Card className="p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
    <div className="flex items-center gap-4">
      {employer?.profile_url && employer.profile_url !== "" ? (
        <img
          src={employer.profile_url}
          className="w-14 h-14 object-cover border p-1 rounded-lg"
        />
      ) : (
        <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-gray-500 text-xl">
            {employer?.name?.charAt(0)}
          </span>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{employer.name}</h3>
        <p className="text-sm text-gray-500">{employer.location}</p>
      </div>
    </div>

    <div className="sm:ml-auto flex justify-center sm:justify-end">
      <Link to={`/employers/${employer.id}/jobs`}>
        <div className="flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer">
          {EMPLOYER_UI.OPEN_POSITION_BUTTON}
          <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </div>
      </Link>
    </div>
  </Card>
);

interface FilterSidebarProps {
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}

const FilterSidebar = ({ selectedTypes, onTypeChange }: FilterSidebarProps) => (
  <div
    className="col-span-12 md:col-span-4 bg-white p-6 rounded border"
    style={{ borderColor: "#EDEFF5" }}
  >
    <div>
      <h3 className="text-sm font-medium mb-2">
        {EMPLOYER_UI.ORGANIZATION_TYPE_TITLE}
      </h3>
      <div className="space-y-2">
        {EMPLOYER_ORGANIZATION_TYPES.map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              className="form-checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => onTypeChange(type)}
              aria-label={`Filter by ${type}`}
              id={`org-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
            />
            <span className="text-sm">{type}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const EmployerListing = () => {
  const [sortOption, setSortOption] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState("12");
  const [currentPage, setCurrentPage] = useState(1);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getEmployerProfileListData(
        currentPage,
        Number(itemsPerPage),
        sortOption
      );

      const mappedEmployers: Employer[] = response.data.data.map(
        (emp: IEmployerData) => ({
          id: emp._id,
          name: emp.full_name,
          location: emp.location || "Unknown",
          jobs: emp.open_positions,
          username: emp.user_name,
          profile_url: emp.profile_url || "",
        })
      );

      setEmployers(mappedEmployers);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(EMPLOYER_UI.ERROR_MESSAGE);
      console.error("Failed to fetch employers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, [currentPage, itemsPerPage, sortOption]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    fetchEmployers();
  };

  const filteredEmployers = selectedTypes.length
    ? employers.filter((employer) => selectedTypes.includes(employer.name))
    : employers;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full bg-white">
        <Header />
      </div>
      <FindJobHeader title={PAGE_TITLES.FIND_EMPLOYERS} />
      <main className="p-6 bg-white flex-grow">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Available Companies: {pagination?.total}
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
        <div className="max-w-7xl mx-auto mt-4">
          <div className="grid grid-cols-12 gap-4 items-start">
            <FilterSidebar
              selectedTypes={selectedTypes}
              onTypeChange={handleTypeChange}
            />

            <div className="col-span-12 md:col-span-8 bg-white">
              {loading ? (
                <LoadingSpinner message={EMPLOYER_UI.LOADING_MESSAGE} />
              ) : error ? (
                <ErrorMessage message={error} onRetry={fetchEmployers} />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredEmployers.length === 0 ? (
                      <div className="flex items-center justify-center">
                        <p className="text-center py-8 text-gray-500">
                          {EMPLOYER_UI.NO_RESULTS_MESSAGE}
                        </p>
                      </div>
                    ) : (
                      filteredEmployers.map((employer) => (
                        <EmployerCard
                          key={employer.id}
                          employer={employer}
                          data-testid={`employer-card-${employer.id}`}
                        />
                      ))
                    )}
                  </div>

                  {pagination && filteredEmployers.length > 0 && (
                    <div className="mt-6 flex justify-center items-center">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={Math.ceil(
                          pagination.total / pagination.limit
                        )}
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
  );
};

export default EmployerListing;
