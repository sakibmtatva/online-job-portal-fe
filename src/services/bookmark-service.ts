import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import {
  IBookMarkRequest,
  ICandidateBookMarkRequest,
} from "../utility/interface/IBookMark";
import { IResponseWithPagination } from "../utility/interface/IResponse";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  profile_url: string;
  resume_url: string;
  position: string;
  total_experience: number;
  bookmarkId: string;
  isBookmarked: boolean;
}

const endPointBaseURL = `/api`;

const bookmarkAJob = async (data: IBookMarkRequest): Promise<AxiosResponse> =>
  httpClient.post(`${endPointBaseURL}/job-bookmark`, data);

const removeFromBookmark = async (bookmarkId: string): Promise<AxiosResponse> =>
  httpClient.delete(`${endPointBaseURL}/job-bookmark/${bookmarkId}`);

const bookmarkACandidate = async (
  data: ICandidateBookMarkRequest
): Promise<AxiosResponse> =>
  httpClient.post(`${endPointBaseURL}/candidate-bookmark`, data);

const removeCandidateFromBookmark = async (
  bookmarkId: string
): Promise<AxiosResponse> =>
  httpClient.delete(`${endPointBaseURL}/candidate-bookmark/${bookmarkId}`);

const getBookmarkedCandidateData = async (
  page: number = 1,
  perPage: number = 10
): Promise<AxiosResponse<IResponseWithPagination<UserProfile[]>>> =>
  httpClient.get<IResponseWithPagination<UserProfile[]>>(
    `${endPointBaseURL}/myBookmarkedCandidates?page=${page}&limit=${perPage}`,
    {
      skipToast: true,
    }
  );

export default {
  bookmarkAJob,
  removeFromBookmark,
  bookmarkACandidate,
  removeCandidateFromBookmark,
  getBookmarkedCandidateData,
};
