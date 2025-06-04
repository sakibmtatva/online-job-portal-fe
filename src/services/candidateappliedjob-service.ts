import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { IResponseWithPagination } from "../utility/interface/IResponse";
import { Job } from "../utility/interface/IJobResponse";
import { FavoriteJobApplication } from "../utility/interface/IFavoriteJobResponse";

const endPointBaseURL = `/api`;

const getCandidateAppliedJobsData = async (
  page: number = 1,
  perPage: number = 10
): Promise<AxiosResponse<IResponseWithPagination<Job[]>>> =>
  httpClient.get<IResponseWithPagination<Job[]>>(
    `${endPointBaseURL}/candidateappliedjobs?page=${page}&limit=${perPage}`,
    {
      skipToast: true,
    }
  );

const getCandidateBookmarkedJobsData = async (
  page: number = 1,
  perPage: number = 10
): Promise<AxiosResponse<IResponseWithPagination<FavoriteJobApplication[]>>> =>
  httpClient.get<IResponseWithPagination<FavoriteJobApplication[]>>(
    `${endPointBaseURL}/myBookmarkedJobs?page=${page}&limit=${perPage}`,
    {
      skipToast: true,
    }
  );

export default {
  getCandidateAppliedJobsData,
  getCandidateBookmarkedJobsData,
};
