import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { ICandidateProfileDataResponse } from "../utility/interface/ICandidateProfile";
import {
  IEmployerListResponse,
  IEmployerProfileDataResponse,
} from "../utility/interface/IEmployerProfile";
import {
  IResponse,
  IResponseWithPagination,
} from "../utility/interface/IResponse";

const endPointBaseURL = `/api`;

const candidateProfileUpdate = async (data: FormData): Promise<AxiosResponse> =>
  httpClient.put(`${endPointBaseURL}/profile`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const employerProfileUpdate = async (data: FormData): Promise<AxiosResponse> =>
  httpClient.put(`${endPointBaseURL}/profile`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const getCandidateProfileData = async (): Promise<
  AxiosResponse<IResponse<ICandidateProfileDataResponse>>
> =>
  httpClient.get<IResponse<ICandidateProfileDataResponse>>(
    `${endPointBaseURL}/profile`,
    {
      skipToast: true,
    }
  );

const getEmployerProfileData = async (): Promise<
  AxiosResponse<IResponse<IEmployerProfileDataResponse>>
> =>
  httpClient.get<IResponse<IEmployerProfileDataResponse>>(
    `${endPointBaseURL}/profile`,
    {
      skipToast: true,
    }
  );

const getEmployerProfileListData = async (
  page: number = 1,
  perPage: number = 10,
  sort?: string
): Promise<AxiosResponse<IEmployerListResponse>> =>
  httpClient.get<IEmployerListResponse>(
    `${endPointBaseURL}/profileList?user_type=Employer&page=${page}&limit=${perPage}&sortBy=${sort}`,
    {
      skipToast: true,
    }
  );

const getCandidateProfileListData = async (
  page: number = 1,
  perPage: number = 10,
  sort?: string
): Promise<
  AxiosResponse<IResponseWithPagination<ICandidateProfileDataResponse[]>>
> =>
  httpClient.get<IResponseWithPagination<ICandidateProfileDataResponse[]>>(
    `${endPointBaseURL}/profileList?user_type=Candidate&page=${page}&limit=${perPage}&sortBy=${sort}`,
    {
      skipToast: true,
    }
  );

export default {
  candidateProfileUpdate,
  getCandidateProfileData,
  employerProfileUpdate,
  getEmployerProfileData,
  getEmployerProfileListData,
  getCandidateProfileListData,
};
