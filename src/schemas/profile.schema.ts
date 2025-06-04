import * as Yup from "yup";

export interface CandidateProfileFormValues {
  phone_number: string;
  profile_pic: File | string | null;
  resume: File | string | null;
  position: string;
  previous_experience: string;
  total_experience: string;
  current_sal: string;
  expected_sal: string;
  location: string;
  education: string;
  nationality: string;
  bio: string;
  headline: string;
}

export interface EmployerProfileFormValues {
  profile_pic: File | string | null;
  phone_number: string;
  location: string;
  website: string;
  about_us: string;
  est_year: string;
  industry_type: string;
  total_working_employees: string;
  vision: string;
}

export interface JobFormValues {
  job_title: string;
  job_description: string;
  location: string;
  min_salary: number | string;
  max_salary: number | string;
  jobType: string;
  skills_required: string[];
  experience_level: string;
  education: string;
  category: string;
  closing_date: Date | string | null;
  is_featured?: boolean;
}

export const candidateProfileSchema = Yup.object({
  phone_number: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, "Invalid phone number format")
    .required("Phone number is required"),
  profile_pic: Yup.mixed()
    .required("Profile pic is required")
    .test("isValidImage", "The provided URL is not a valid image.", (value) => {
      if (typeof value === "string") {
        return /\.(jpg|jpeg|png)$/i.test(value);
      }
      const file = value as File;
      return file
        ? ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
        : true;
    })
    .test("fileSize", "File size should not exceed 1 MB", (value) => {
      if (typeof value === "string") {
        return true;
      }

      const file = value as File;
      return file ? file.size <= 1 * 1024 * 1024 : true;
    }),
  resume: Yup.mixed()
    .required("Resume is required")
    .test("isValidFile", "Only PDF files are allowed", (value) => {
      if (typeof value === "string") {
        return value.endsWith(".pdf");
      }
      const file = value as File;
      return file ? file.type === "application/pdf" : true;
    })
    .test("fileSize", "File size should not exceed 1 MB", (value) => {
      if (typeof value === "string") {
        return true;
      }
      const file = value as File;
      return file ? file.size <= 1 * 1024 * 1024 : true;
    }),

  position: Yup.string().trim().required("Designation is required"),
  previous_experience: Yup.string()
    .trim()
    .required("Previous experience is required"),
  total_experience: Yup.string()
    .trim()
    .required("Total experience is required")
    .matches(/^\d+$/, "Total experience must be a valid number"),
  current_sal: Yup.string()
    .trim()
    .required("Current salary is required")
    .matches(/^\d+$/, "Current salary must be a valid number"),
  expected_sal: Yup.string()
    .trim()
    .required("Expected salary is required")
    .matches(/^\d+$/, "Expected salary must be a valid number"),
  location: Yup.string().trim().required("Location is required"),
  education: Yup.string().trim().required("Education is required"),
  nationality: Yup.string().trim().required("Nationality is required"),
  bio: Yup.string()
    .trim()
    .max(1000, "Bio cannot exceed 1000 characters")
    .required("Bio is required"),
  headline: Yup.string()
    .trim()
    .max(100, "Headline cannot exceed 100 characters")
    .required("Headline is required"),
});

export const employerProfileSchema = Yup.object({
  phone_number: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, "Invalid phone number format")
    .required("Phone number is required"),
  profile_pic: Yup.mixed()
    .required("Profile pic is required")
    .test("isValidImage", "The provided URL is not a valid image.", (value) => {
      if (typeof value === "string") {
        return /\.(jpg|jpeg|png)$/i.test(value);
      }
      const file = value as File;
      return file
        ? ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
        : true;
    })
    .test("fileSize", "File size should not exceed 1 MB", (value) => {
      if (typeof value === "string") {
        return true;
      }

      const file = value as File;
      return file ? file.size <= 1 * 1024 * 1024 : true;
    }),
  location: Yup.string().trim().required("Location is required"),
  website: Yup.string()
    .trim()
    .matches(/^https?:\/\/.+/, "Invalid URL format")
    .url("Invalid URL format")
    .required("Website is required"),
  about_us: Yup.string()
    .trim()
    .min(10, "About Us must be at least 10 characters")
    .max(2000, "About Us cannot exceed 2000 characters")
    .required("About Us is required"),
  est_year: Yup.number()
    .min(1800, "Establishment year cannot be before 1800")
    .max(
      new Date().getFullYear(),
      `Establishment year cannot be after ${new Date().getFullYear()}`
    )
    .required("Establishment year is required")
    .typeError("Establishment year must be a valid number"),
  industry_type: Yup.string().trim().required("Industry type is required"),
  total_working_employees: Yup.number()
    .min(1, "There must be at least 1 working employee")
    .required("Total working employees is required")
    .typeError("Total working employees must be a valid number"),
  vision: Yup.string()
    .trim()
    .max(1000, "Vision cannot exceed 1000 characters")
    .required("Vision is required"),
});

export const jobValidationSchema = Yup.object().shape({
  job_title: Yup.string()
    .trim()
    .min(10, "Job title must be at least 10 characters")
    .max(30, "Job title must not exceed 30 characters")
    .required("Job title is required"),
  closing_date: Yup.date()
    .required("Expiry Date is required")
    .typeError("Invalid date format")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Expiry Date cannot be in the past"
    ),
  job_description: Yup.string()
    .trim()
    .min(100, "Job description must be at least 100 characters")
    .max(1000, "Job description must not exceed 1000 characters")
    .required("Job description is required"),
  location: Yup.string().required("Location is required"),
  category: Yup.string().required("Category is required"),
  min_salary: Yup.number()
    .typeError("Minimum salary must be a number")
    .required("Minimum salary is required")
    .positive("Minimum salary must be greater than 0"),
  max_salary: Yup.number()
    .typeError("Maximum salary must be a number")
    .required("Maximum salary is required")
    .positive("Maximum salary must be greater than 0")
    .moreThan(
      Yup.ref("min_salary"),
      "Maximum salary must be greater than minimum salary"
    ),
  jobType: Yup.string().required("Job type is required"),
  skills_required: Yup.array()
    .of(Yup.string().required("Skill cannot be empty"))
    .min(1, "At least one skill is required")
    .required("Skills are required"),
  experience_level: Yup.string().required("Experience level is required"),
  education: Yup.string().required("Education is required"),
});

export const ScheduleSchema = Yup.object().shape({
  date: Yup.date()
    .required("Date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Date cannot be in the past"
    ),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        return startTime && value ? value > startTime : true;
      }
    ),
});
