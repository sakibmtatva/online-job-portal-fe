export const FORM_LABELS = {
  POSITION: "Designation",
  PREVIOUS_EXPERIENCE: "Previous Experience",
  TOTAL_EXPERIENCE: "Total Experience (Years)",
  CURRENT_SALARY: "Current Salary",
  EXPECTED_SALARY: "Expected Salary",
  LOCATION: "Location",
  EDUCATION: "Education",
  NATIONALITY: "Nationality",
  BIO: "Bio",
  HEADLINE: "Headline",
  RESUMEURL: "Resume URL",
  PHONE_NUMBER: "Phone number",
  RESUME: "Resume",
  PROFILE_PIC: "Profile Pic",
} as const;

// Placeholders
export const PLACEHOLDERS = {
  POSITION: "Enter your position",
  PREVIOUS_EXPERIENCE: "Enter previous experience details",
  TOTAL_EXPERIENCE: "Enter total experience",
  CURRENT_SALARY: "Enter your current salary",
  EXPECTED_SALARY: "Enter your expected salary",
  LOCATION: "Enter your location",
  EDUCATION: "Select your education",
  NATIONALITY: "Enter your nationality",
  HEADLINE: "Enter your headline",
  BIO: "Enter your bio",
  RESUMEURL: "Enter your Resume URL",
  PHONE_NUMBER: "Enter phone number (e.g. +1234567890)",
} as const;

// Options
export const experienceOptions: string[] = [
  "Less than 1 year",
  "1-2 years",
  "2-5 years",
  "5-10 years",
  "More than 10 years",
];

export const educationOptions: { label: string; value: string }[] = [
  { label: "High School", value: "high_school" },
  { label: "Bachelor's Degree", value: "bachelors_degree" },
  { label: "Master's Degree", value: "masters_degree" },
  { label: "Ph.D.", value: "phd" },
  { label: "Other", value: "other" },
];

export const jobTypeOptions: { label: string; value: string }[] = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

export const experienceLevelOptions: { label: string; value: string }[] = [
  { label: "Fresher", value: "fresher" },
  { label: "Mid-level", value: "mid-level" },
  { label: "Senior-level", value: "senior-level" },
];

export const skillsOptions: { label: string; value: string }[] = [
  { label: "JavaScript", value: "javascript" },
  { label: "React", value: "react" },
  { label: "Node.js", value: "nodejs" },
  { label: "TypeScript", value: "typescript" },
  { label: "MongoDB", value: "mongodb" },
  { label: "Express.js", value: "expressjs" },
  { label: "Python", value: "python" },
  { label: "Django", value: "django" },
  { label: "AWS", value: "aws" },
  { label: "Docker", value: "docker" },
];

// Validation Messages
export const VALIDATION_MESSAGES = {
  FULL_NAME_REQUIRED: "Full name is required",
  FULL_NAME_MIN: "Name must be at least 2 characters",
  TITLE_REQUIRED: "Title/headline is required",
  TITLE_MIN: "Title must be at least 2 characters",
  EXPERIENCE_REQUIRED: "Experience is required",
  EDUCATION_REQUIRED: "Education is required",
  WEBSITE_URL: "Must be a valid URL",
} as const;

// Photo Upload Constants
export const PHOTO_UPLOAD = {
  MAX_SIZE_MB: 1,
  MAX_SIZE_ERROR: "File size must be less than 1MB",
  LABEL_TEXT: "Click to upload your Profile pic",
  HELP_TEXT: "A photo larger than 400 pixels work best. Max photo size 1 MB.",
  DELETE_BUTTON_LABEL: "Delete image",
  PREVIEW_ALT: "Profile preview",
} as const;

// Add these to your existing FORM_LABELS
export const EMPLOYER_FORM_LABELS = {
  COMPANY_NAME: "Company name",
  ABOUT_US: "About us",
  LOGO: "Upload Logo",
  BANNER: "Banner Image",
  PHONE_NUMBER: "Phone number",
  LOCATION: "Location",
  OPEN_POSITIONS: "Open positions",
  WEBSITE: "Company website",
  ESTABLISHED_YEAR: "Established year",
  INDUSTRY_TYPE: "Industry type",
  TOTAL_EMPLOYEES: "Total working employees",
  VISION: "Company vision",
} as const;

// Add these to your existing PLACEHOLDERS
export const EMPLOYER_PLACEHOLDERS = {
  COMPANY_NAME: "Enter your company name",
  ABOUT_US:
    "Write down about your company here. Let the candidate know who we are...",
  LOGO: "Upload your company logo",
  BANNER: "Upload banner image",
  PHONE_NUMBER: "Enter phone number (e.g. +1234567890)",
  LOCATION: "Enter company location",
  OPEN_POSITIONS: "Number of open positions",
  WEBSITE: "Enter company website URL (e.g. https://example.com)",
  ESTABLISHED_YEAR: "Enter year of establishment (e.g. 2000)",
  INDUSTRY_TYPE: "Enter industry type (e.g. IT, Finance)",
  TOTAL_EMPLOYEES: "Enter total number of working employees",
  VISION: "Enter your company's vision",
} as const;

export const COMPANY_UPLOAD = {
  ...PHOTO_UPLOAD,
  LOGO_HELP_TEXT: "Company logo should be square and at least 400x400 pixels",
  BANNER_HELP_TEXT: "Banner image should be at least 1200x400 pixels",
} as const;

export const Job_Form_Labels = {
  JOB_TITLE: "Job Title",
  LOCATION: "Location",
  MINIMUM_SALARY: "Minimum Salary",
  MAXIMUM_SALARY: "Maximum Salary",
  JOB_TYPE: "Job Type",
  EXPERIENCE_LEVEL: "Experience Level",
  EDUCATION: "Education",
  SKILLS: "Skills Required",
  CATEGORY: "Job Category",
} as const;

export const Job_Form_Placeholder = {
  JOB_TITLE_PLACEHOLDER: "Enter job title",
  LOCATION: "Enter location",
  CATEGORY: "Enter Job Category",
  MINIMUM_SALARY_PLACEHOLDER: "Enter minimum salary",
  MAXIMUM_SALARY_PLACEHOLDER: "Enter maximum salary",
  JOB_TYPE_PLACEHOLDER: "Select job type",
  EXPERIENCE_LEVEL_PLACEHOLDER: "Select experience level",
  EDUCATION_PLACEHOLDER: "Enter education requirement",
  SKILLS_PLACEHOLDER: "Select skills",
  JOB_DESCRIPTION_PLACEHOLDER: "Enter detailed job description",
} as const;

export const CANDIDATE_FILTERS = {
  CANDIDATE_LEVELS: ["Entry Level", "Mid Level", "Expert Level"],
  EXPERIENCES: [
    "Freshers",
    "1 - 2 Years",
    "2 - 4 Years",
    "4 - 6 Years",
    "6 - 8 Years",
    "8 - 10 Years",
    "10 - 15 Years",
    "15+ Years",
  ],
  EDUCATION: [
    "All",
    "High School",
    "Intermediate",
    "Graduation",
    "Master Degree",
    "Bachelor Degree",
  ],
  GENDER: ["Male", "Female", "Others"],
};

export const EMPLOYER_FILTERS = {
  ORGANIZATION_TYPES: [
    "Government",
    "Semi-Government",
    "NGO",
    "Private Company",
    "International Agencies",
    "Others",
  ],
} as const;

export const UI_MESSAGES = {
  LOADING: "Loading...",
  LOADING_EMPLOYERS: "Loading employers...",
  ERROR_LOAD_EMPLOYERS: "Failed to load employers. Please try again later.",
  NO_EMPLOYERS_FOUND: "No employers found matching your criteria.",
  UNKNOWN_LOCATION: "Unknown",
} as const;

export const BUTTON_LABELS = {
  VIEW_PROFILE: "View Profile",
  OPEN_POSITION: "Open Position",
  TRY_AGAIN: "Try again",
} as const;

export const PAGE_TITLES = {
  FIND_CANDIDATES: "Find Candidates",
  FIND_EMPLOYERS: "Find Companies",
  FIND_JOBS_BY_EMPLOYER: "Find Jobs By Companies",
  FILTERS: "Filters",
} as const;

export const CANDIDATE_FILTER_LABELS = {
  LEVEL_TITLE: "Candidate Level",
  EXPERIENCE_TITLE: "Experience",
  EDUCATION_TITLE: "Education",
  GENDER_TITLE: "Gender",
  LOCATION_RADIUS: "Location Radius",
} as const;

export const EMPLOYER_UI = {
  LOADING_MESSAGE: "Loading companies...",
  ERROR_MESSAGE: "Failed to load companies. Please try again later.",
  NO_RESULTS_MESSAGE: "No companies found matching your criteria.",
  ORGANIZATION_TYPE_TITLE: "Organization Type",
  OPEN_POSITION_BUTTON: "Open Position",
} as const;

export const EMPLOYER_ORGANIZATION_TYPES = [
  "Government",
  "Semi-Government",
  "NGO",
  "Private Company",
  "International Agencies",
  "Others",
] as const;

export const Contact_content = {
  navLinks: [
    "Home",
    "Find Job",
    "Employers",
    "Candidates",
    "Pricing Plans",
    "Customer Supports",
  ],
  phoneNumber: "+1-202-555-0178",
  language: "English",
  logoText: "Career Connect",
  country: "India",
  searchPlaceholder: "Job title, keyword, company",
  signIn: "Sign In",
  postJob: "Post A Jobs",
  breadcrumbTitle: "Contact",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Contact",
  sectionTitle: "Who we are",
  sectionHeading: "We care about customer services",
  sectionDescription:
    "Want to chat? We’d love to hear from you! Get in touch with our Customer Success Team to inquire about speaking events, advertising rates, or just say hello.",
  emailSupportButton: "Email Support",
  formTitle: "Get in Touch",
  inputName: "Name",
  inputEmail: "Email",
  inputSubject: "Subjects",
  inputMessage: "Message",
  sendMessage: "Send Message",
};
