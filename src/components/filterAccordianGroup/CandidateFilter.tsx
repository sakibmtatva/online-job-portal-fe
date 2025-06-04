import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  CANDIDATE_FILTERS,
  CANDIDATE_FILTER_LABELS,
} from "../../utility/constant";
import { Slider } from "../ui/slider";

interface CandidateFilterProps {
  onFilterChange: (
    filterType: string,
    value: string | number | string[]
  ) => void;
}

export default function CandidateFilter({
  onFilterChange,
}: CandidateFilterProps) {
  const [openSections, setOpenSections] = useState({
    radius: false,
    level: false,
    experience: false,
    education: false,
    gender: false,
  });

  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [selectedEducations, setSelectedEducations] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [radiusValue, setRadiusValue] = useState<number>(32);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEducationChange = (value: string) => {
    const newValues = selectedEducations.includes(value)
      ? selectedEducations.filter((edu) => edu !== value)
      : [...selectedEducations, value];
    setSelectedEducations(newValues);
    onFilterChange("education", newValues);
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
          onClick={() => toggleSection("radius")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {CANDIDATE_FILTER_LABELS.LOCATION_RADIUS}
          </h3>
          {getChevronIcon(openSections.radius)}
        </div>
        {openSections.radius && (
          <div className="mt-4 px-1">
            <Slider
              value={[radiusValue]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setRadiusValue(value[0]);
                onFilterChange("radius", value[0]);
              }}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-2">{radiusValue} miles</p>
          </div>
        )}
      </div>

      <div className="border-t border-[#EDEFF5]" />

      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("level")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {CANDIDATE_FILTER_LABELS.LEVEL_TITLE}
          </h3>
          {getChevronIcon(openSections.level)}
        </div>
        {openSections.level && (
          <div className="mt-4 space-y-3">
            {CANDIDATE_FILTERS.CANDIDATE_LEVELS.map((level) => (
              <label
                key={level}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={selectedLevel === level}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    onFilterChange("level", e.target.value);
                  }}
                  className="accent-blue-600"
                />
                {level}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#EDEFF5]" />

      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("experience")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {CANDIDATE_FILTER_LABELS.EXPERIENCE_TITLE}
          </h3>
          {getChevronIcon(openSections.experience)}
        </div>
        {openSections.experience && (
          <div className="mt-4 space-y-3">
            {CANDIDATE_FILTERS.EXPERIENCES.map((exp) => (
              <label
                key={exp}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="radio"
                  name="experience"
                  value={exp}
                  checked={selectedExperience === exp}
                  onChange={(e) => {
                    setSelectedExperience(e.target.value);
                    onFilterChange("experience", e.target.value);
                  }}
                  className="accent-blue-600"
                />
                {exp}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#EDEFF5]" />

      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("education")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {CANDIDATE_FILTER_LABELS.EDUCATION_TITLE}
          </h3>
          {getChevronIcon(openSections.education)}
        </div>
        {openSections.education && (
          <div className="mt-4 space-y-3">
            {CANDIDATE_FILTERS.EDUCATION.map((edu) => (
              <label
                key={edu}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="checkbox"
                  name="education"
                  value={edu}
                  checked={selectedEducations.includes(edu)}
                  onChange={() => handleEducationChange(edu)}
                  className="accent-blue-600"
                />
                {edu}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#EDEFF5]" />

      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("gender")}
        >
          <h3 className="font-semibold text-gray-800 text-base">
            {CANDIDATE_FILTER_LABELS.GENDER_TITLE}
          </h3>
          {getChevronIcon(openSections.gender)}
        </div>
        {openSections.gender && (
          <div className="mt-4 space-y-3">
            {CANDIDATE_FILTERS.GENDER.map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={selectedGender === gender}
                  onChange={(e) => {
                    setSelectedGender(e.target.value);
                    onFilterChange("gender", e.target.value);
                  }}
                  className="accent-blue-600"
                />
                {gender}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
