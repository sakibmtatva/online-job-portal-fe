import { Loader2 } from "lucide-react";
import { LoadingSpinnerProps } from "../../utility/interface/IEmployerProfile";

export const LoadingSpinner = ({
  message = "Loading applied jobs",
}: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center py-8 gap-2">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    <p className="text-gray-500">{message}</p>
  </div>
);

export const getJobTypeLabel = (jobType: string) => {
  switch (jobType) {
    case "full-time":
      return "Full-time";
    case "part-time":
      return "Part-time";
    case "contract":
      return "Contract";
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    default:
      return "Unknown";
  }
};

export const getEducation = (education: string) => {
  switch (education) {
    case "high_school":
      return "High School";
    case "bachelors_degree":
      return "Bachelor's Degree";
    case "masters_degree":
      return "Master's Degree";
    case "phd":
      return "Ph.D.";
    case "other":
      return "Other";
    default:
      return "Unknown";
  }
};
