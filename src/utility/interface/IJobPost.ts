export interface IJobPostRequest {
  job_title: string;
  job_description: string;
  location: string;
  salary_min: string | number;
  salary_max: string | number;
  jobType: string;
  skills_required: string[];
  experience_level: string;
  education: string;
  category: string;
  closing_date: Date | string | null;
  is_featured?: boolean;
}
