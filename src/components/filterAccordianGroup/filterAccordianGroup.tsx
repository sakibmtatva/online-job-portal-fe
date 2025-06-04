import { useState } from "react";
import { salaryOptions } from "../../data";
import { ChevronDown, ChevronUp } from "lucide-react";
import { UI_TEXT } from "../../config/config";
import { experienceLevelOptions, jobTypeOptions } from "../../utility/constant";
import { Filter } from "../../pages/FindJobs/FindJobListing";

interface FilterAccordianProps {
  filter: Filter;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function FilterAccordionGroup({
  filter,
  handleChange,
}: FilterAccordianProps) {
  const [openSections, setOpenSections] = useState({
    experience: false,
    salary: false,
    jobType: false,
    education: false,
    jobLevel: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getChevronIcon = (isOpen: boolean) => {
    return isOpen ? (
      <ChevronUp className="w-4 h-4 transform transition-transform duration-300" />
    ) : (
      <ChevronDown className="w-4 h-4 transform transition-transform duration-300" />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("experience")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {UI_TEXT.experienceTitle}
          </h3>
          {getChevronIcon(openSections.experience)}
        </div>
        {openSections.experience && (
          <div className="mt-4 space-y-3">
            {experienceLevelOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={option.value}
                  checked={filter.experienceLevel === option.value}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#EDEFF5]" />

      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("salary")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {UI_TEXT.salaryTitle}
          </h3>
          {getChevronIcon(openSections.salary)}
        </div>
        {openSections.salary && (
          <div className="mt-4 space-y-3">
            {salaryOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="radio"
                  name="salaryRange"
                  value={option.value}
                  checked={filter.salaryRange === option.value}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#EDEFF5]" />

      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("jobType")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {UI_TEXT.jobTypeTitle}
          </h3>
          {getChevronIcon(openSections.jobType)}
        </div>
        {openSections.jobType && (
          <div className="mt-4 space-y-3">
            {jobTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="radio"
                  name="jobType"
                  value={option.value}
                  checked={filter.jobType === option.value}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
