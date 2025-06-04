import { employers } from "./assets/assets";

export type FeaturedJobDataType = {
  title: string;
  icon: string;
  count: string;
  location: string;
  salary: string;
  days: string;
  jobType: string;
};

export const featuredJobs: FeaturedJobDataType[] = [
  {
    title: "Senior UX Designer",
    icon: employers,
    count: "5,324",
    location: "New York, NY",
    salary: "$100,000 - $120,000",
    days: "3 days ago",
    jobType: "Contract Base",
  },
  {
    title: "Software Engineer",
    icon: employers,
    count: "5,324",
    location: "New York, NY",
    salary: "$100,000 - $120,000",
    days: "3 days ago",
    jobType: "Full Time",
  },
  {
    title: "Junior Graphic Designer",
    icon: employers,
    count: "5,324",
    location: "New York, NY",
    salary: "$100,000 - $120,000",
    days: "3 days ago",
    jobType: "Full Time",
  },
  {
    title: "Product Designer",
    icon: employers,
    count: "5,324",
    location: "New York, NY",
    salary: "$100,000 - $120,000",
    days: "3 days ago",
    jobType: "Full Time",
  },
  {
    title: "Marketing Officer",
    icon: employers,
    count: "5,324",
    location: "New York, NY",
    salary: "$100,000 - $120,000",
    days: "3 days ago",
    jobType: "Internship",
  },
  {
    title: "Interaction Designer",
    icon: employers,
    count: "5,324",
    location: "New York, NY",
    salary: "$100,000 - $120,000",
    days: "3 days ago",
    jobType: "Full Time",
  },
];

export const experienceOptions = [
  { label: "Freshers", value: "Freshers" },
  { label: "1-2 years", value: "1-2 years" },
  { label: "2-4 years", value: "2-4 years" },
  { label: "4-6 years", value: "4-6 years" },
  { label: "6-8 years", value: "6-8 years" },
  { label: "8-10 years", value: "8-10 years" },
  { label: "10-15 years", value: "10-15 years" },
  { label: "15+ years", value: "15+ years" },
];

export const salaryOptions = [
  { label: "₹0 - ₹20,000", value: "0-20000" },
  { label: "₹20,000 - ₹40,000", value: "20000-40000" },
  { label: "₹40,000 - ₹60,000", value: "40000-60000" },
  { label: "₹60,000 - ₹80,000", value: "60000-80000" },
  { label: "₹80,000 - ₹1,00,000", value: "80000-100000" },
  { label: "₹1,00,000 - ₹1,50,000", value: "100000-150000" },
  { label: "₹1,50,000 - ₹2,00,000", value: "150000-200000" },
  { label: "₹2,00,000 - ₹2,50,000", value: "200000-250000" },
];

export const jobTypesOptions = [
  { label: "All", value: "All" },
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Internship", value: "Internship" },
  { label: "Remote", value: "Remote" },
  { label: "Temporary", value: "Temporary" },
  { label: "Contract Base", value: "Contract Base" },
];

export const educationOptions = [
  { label: "All", value: "All" },
  { label: "High School", value: "High School" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Graduation", value: "Graduation" },
  { label: "Master Degree", value: "Master Degree" },
  { label: "Bachelor Degree", value: "Bachelor Degree" },
];

export const jobLevelsOptions = [
  { label: "Entry level", value: "Entry level" },
  { label: "Mid level", value: "Mid level" },
  { label: "Expert level", value: "Expert level" },
];

export const CATEGORY_OPTIONS: { label: string; value: string }[] = [
  { value: "it", label: "IT" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
];

export const SORT_OPTIONS: { label: string; value: string }[] = [
  { value: "asc", label: "Latest" },
  { value: "desc", label: "Oldest" },
];

export const PER_PAGE_OPTIONS: { label: string; value: string }[] = [
  { value: "12", label: "12 per page" },
  { value: "24", label: "24 per page" },
  { value: "36", label: "36 per page" },
];
