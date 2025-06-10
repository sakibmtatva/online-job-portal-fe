import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import {
  IResponse,
  IResponseWithPagination,
} from "../utility/interface/IResponse";

const endPointBaseURL = `/api`;

export interface Meeting {
  _id: string;
  candidate: Candidate;
  job: Job;
  scheduled_by: string & ScheduledBy;
  date: string;
  start_time: string;
  end_time: string;
  status: "Scheduled" | "Completed" | "Cancelled" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EmployerProfileInfo {
  _id: string;
  user: string;
  profile_url: string;
}

export interface ScheduledBy {
  _id: string;
  full_name: string;
  email: string;
  id: string;
  ["employer-profile-info"]: EmployerProfileInfo;
}

export interface Candidate {
  _id: string;
  full_name: string;
  email: string;
  id: string;
}

export interface Job {
  _id: string;
  job_title: string;
}

const scheduleMeetingWithCandidate = async (
  jobId: string,
  formData: FormData
): Promise<AxiosResponse> => {
  return httpClient.post(
    `${endPointBaseURL}/schedulemeeting/${jobId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const getScheduleMeetingsList = async (
  page?: number,
  limit?: number
): Promise<AxiosResponse<IResponseWithPagination<Meeting[]>>> =>
  httpClient.get<IResponseWithPagination<Meeting[]>>(
    `${endPointBaseURL}/schedulemeeting`,
    {
      params: {
        page,
        limit,
      },
      skipToast: true,
    }
  );

const getCandidateScheduleMeetingsList = async (
  page?: number,
  limit?: number
): Promise<AxiosResponse<IResponseWithPagination<Meeting[]>>> =>
  httpClient.get<IResponseWithPagination<Meeting[]>>(
    `${endPointBaseURL}/candidateschedulemeeting`,
    {
      params: {
        page,
        limit,
      },
      skipToast: true,
    }
  );

const changeStatusToCancelled = async (
  meetingId: string
): Promise<AxiosResponse> =>
  httpClient.delete(`${endPointBaseURL}/meeting/${meetingId}`);

const editMeeting = async (
  meetingId: string,
  formData: FormData
): Promise<AxiosResponse> => {
  return httpClient.put(`${endPointBaseURL}/meeting/${meetingId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getMeeting = async (
  meetingId: string
): Promise<AxiosResponse<IResponse<Meeting>>> =>
  httpClient.get<IResponse<Meeting>>(
    `${endPointBaseURL}/meeting/${meetingId}`,
    {
      skipToast: true,
    }
  );

export default {
  scheduleMeetingWithCandidate,
  getScheduleMeetingsList,
  getCandidateScheduleMeetingsList,
  changeStatusToCancelled,
  editMeeting,
  getMeeting,
};
