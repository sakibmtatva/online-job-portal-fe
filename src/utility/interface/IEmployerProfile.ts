import { IPagination } from "./IResponse";

export interface IEmployerProfileRequest {
  phone_number: string;
  location: string;
  open_positions: number;
  website: string;
  about_us: string;
  est_year: number;
  industry_type: string;
  total_working_employees: number;
  vision: string;
}

export interface IEmployerProfileDataResponse {
  _id: string;
  user: string;
  open_positions: number;
  createdAt: string;
  updatedAt: string;
  about_us: string;
  est_year: number;
  industry_type: string;
  location: string;
  phone_number: string;
  total_working_employees: number;
  vision: string;
  website: string;
  profile_url: string;
}

export interface IEmployerListResponse {
  data: IEmployerData[];
  pagination: IPagination;
}

export interface IEmployerData {
  _id: string;
  user: string;
  open_positions: number;
  createdAt: string;
  updatedAt: string;
  location: string;
  website: string;
  full_name: string;
  user_name: string;
  email: string;
  user_type: string;
  profile_url: string;
}

export interface Employer {
  id: string;
  name: string;
  location: string;
  jobs: number;
  username: string;
}

export interface EmployerCardProps {
  employer: Employer;
}

export interface FilterSidebarProps {
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}

export interface LoadingSpinnerProps {
  message?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export interface EmployerListContentProps {
  loading: boolean;
  error: string | null;
  employers: Employer[];
  pagination: IPagination | null;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}
