export interface Job {
  _id: string;
  job_title: string;
  job_description: string;
  user: string;
  location: string;
  salary_min: number;
  salary_max: number;
  jobType: string;
  skills_required: string[];
  experience_level: string;
  status: string;
  education: string;
  applicants: any[];
  is_remote: boolean;
  is_active: boolean;
  posted_date: string;
  createdAt: string;
  updatedAt: string;
  closing_date: Date | string | null;
  profile_url: string;
  isBookmarked: boolean;
  bookmarkId: string;
  hasApplied: boolean;
  appliedAt: string;
  category: string;
  __v: number;
}

export interface SingleJob {
  _id: string;
  job_title: string;
  job_description: string;
  user: string;
  location: string;
  salary_min: number;
  salary_max: number;
  jobType: string;
  skills_required: string[];
  experience_level: string;
  status: string;
  education: string;
  applicants: any[];
  is_remote: boolean;
  is_active: boolean;
  posted_date: string;
  profile_url: string;
  createdAt: string;
  updatedAt: string;
  isBookmarked: boolean;
  closing_date: Date | string | null;
  bookmarkId: string;
  category: string;
  __v: number;
  employerDetails: EmployerDetails;
  hasApplied: boolean;
}

interface EmployerDetails {
  _id: string;
  full_name: string;
  user_name: string;
  email: string;
  open_positions: number;
  est_year: number;
  industry_type: string;
  location: string;
  phone_number: string;
  total_working_employees: number;
  website: string;
  profile_url: string;
}
