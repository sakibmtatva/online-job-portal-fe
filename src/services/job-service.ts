import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { IJobPostRequest } from "../utility/interface/IJobPost";
import { Job, SingleJob } from "../utility/interface/IJobResponse";
import { ApplyJobInitialValueTypes } from "../components/custom/ApplyJobModal";
import {
  IResponse,
  IResponseWithPagination,
} from "../utility/interface/IResponse";
import { JobCategory } from "../utility/interface/IJobCategories";
import { Filter } from "../pages/FindJobs/FindJobListing";

const endPointBaseURL = `/api`;

const postAJob = async (data: IJobPostRequest): Promise<AxiosResponse> =>
  httpClient.post(`${endPointBaseURL}/jobs`, data);

const getJobCategoryData = async (): Promise<
  AxiosResponse<IResponse<JobCategory[]>>
> =>
  httpClient.get<IResponse<JobCategory[]>>(
    `${endPointBaseURL}/job-categories`,
    {
      skipToast: true,
    }
  );

const editAJob = async (
  jobId: string,
  data: IJobPostRequest
): Promise<AxiosResponse> =>
  httpClient.put(`${endPointBaseURL}/jobs/${jobId}`, data);

const deleteAJob = async (jobId: string): Promise<AxiosResponse> =>
  httpClient.delete(`${endPointBaseURL}/jobs/${jobId}`);

const getEmployerJobsData = async (
  page: number,
  limit: number
): Promise<AxiosResponse<IResponseWithPagination<Job[]>>> =>
  httpClient.get<IResponseWithPagination<Job[]>>(`${endPointBaseURL}/myjobs`, {
    params: {
      page,
      limit,
    },
    skipToast: true,
  });

const getAllJobsData = async (
  page: number,
  limit: number,
  filter: Filter,
  sortBy: string = "asc"
): Promise<AxiosResponse<IResponseWithPagination<Job[]>>> =>
  httpClient.get<IResponseWithPagination<Job[]>>(
    `${endPointBaseURL}/jobs?jobTitle=${filter.jobTitle}&location=${filter.location}&category=${filter.category}&experienceLevel=${filter.experienceLevel}&jobType=${filter.jobType}&salaryRange=${filter.salaryRange}&sortBy=${sortBy}`,
    {
      params: {
        page,
        limit,
      },
      skipToast: true,
    }
  );

const getAllEmployerJobsData = async (
  employerId: string,
  page: number,
  limit: number,
  sortBy: string = "asc"
): Promise<AxiosResponse<IResponseWithPagination<Job[]>>> =>
  httpClient.get<IResponseWithPagination<Job[]>>(
    `${endPointBaseURL}/employerjobs/${employerId}?sortBy=${sortBy}`,
    {
      params: {
        page,
        limit,
      },
      skipToast: true,
    }
  );

const getSingleJobData = async (
  jobId: string
): Promise<AxiosResponse<IResponse<SingleJob>>> =>
  httpClient.get<IResponse<SingleJob>>(`${endPointBaseURL}/jobs/${jobId}`, {
    skipToast: true,
  });

const applyForJob = async (
  jobId: string,
  applyJobData: ApplyJobInitialValueTypes
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("cover_letter", applyJobData.cover_letter || "");
  if (applyJobData.resume) {
    formData.append("resume", applyJobData.resume);
  }
  return httpClient.post(`${endPointBaseURL}/apply/${jobId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const featureJob = async (
  jobId: string,
  is_featured: boolean
): Promise<AxiosResponse> => {
  return httpClient.put(`${endPointBaseURL}/jobs`, {
    jobId: jobId,
    is_featured: is_featured,
  });
};

export default {
  postAJob,
  getEmployerJobsData,
  getAllJobsData,
  getAllEmployerJobsData,
  getSingleJobData,
  applyForJob,
  editAJob,
  deleteAJob,
  getJobCategoryData,
  featureJob,
};
