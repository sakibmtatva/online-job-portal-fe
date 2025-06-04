interface SortPerPageProps {
  sortValue: string;
  perPageValue: string | number;
  sortOptions: { value: string; label: string }[];
  perPageOptions: { value: string; label: string }[];
  handleSortChange: (sortOption: string) => void;
  handlePerPageChange: (perPage: string | number) => void;
}

const selectStyles = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666666' d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "16px",
};

const SortPerPage = ({
  sortOptions,
  sortValue,
  perPageValue,
  perPageOptions,
  handlePerPageChange,
  handleSortChange,
}: SortPerPageProps) => {
  return (
    <div className="max-w-7xl mb-4 mx-auto flex flex-wrap items-center justify-between gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full ml-auto md:w-auto">
        <select
          value={sortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full pl-3 pr-10 sm:w-40 border border-gray-300 h-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none relative"
          style={selectStyles}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={perPageValue}
          onChange={(e) => handlePerPageChange(e.target.value)}
          className="w-full pl-3 pr-10 sm:w-40 border border-gray-300 h-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none relative"
          style={selectStyles}
        >
          {perPageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortPerPage;
