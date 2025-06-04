import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  return (
    <>
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center transition-all duration-200 group disabled:opacity-50 bg-transparent hover:bg-transparent"
      >
        <ArrowLeft
          size={20}
          className={`${
            currentPage === 1
              ? "text-gray-300"
              : "text-gray-500 group-hover:text-blue-600"
          } transition-colors`}
        />
      </Button>
      {[...Array(totalPages)].map((_, i) => (
        <Button
          key={i}
          onClick={() => handlePageChange(i + 1)}
          className={`w-8 h-8 text-sm rounded-full flex items-center justify-center bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-200 ${
            currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-600"
          }`}
        >
          {i + 1 < 10 ? `0${i + 1}` : i + 1}
        </Button>
      ))}
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center transition-all duration-200 group disabled:opacity-50 bg-transparent hover:bg-transparent"
      >
        <ArrowRight
          size={20}
          className={`${
            currentPage === totalPages
              ? "text-gray-300"
              : "text-gray-500 group-hover:text-blue-600"
          } transition-colors`}
        />
      </Button>
    </>
  );
};

export default Pagination;
