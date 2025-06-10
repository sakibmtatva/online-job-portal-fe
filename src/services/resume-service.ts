import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { IResponse } from "../utility/interface/IResponse";

const endPointBaseURL = `/api`;

interface IResumePayload {
  fullName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  email: string;
  phone: string;

}
export interface ResumeResponse {
  success: boolean;
  message: string;
  data: ResumeData;
}

export interface ResumeData {
  color: string;
  about: string;
  _id: string;
  user: string;
  fullName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  educationDetails: [
    {
      university: { type: String },
      degree: { type: String },
      major: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      description: { type: String },
    }
  ],
  professionalExperience: [
    {
      positionTitle: { type: String },
      companyName: { type: String },
      city: { type: String },
      state: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      summary: { type: String },
    }
  ],

}


const createResume = async (data: IResumePayload): Promise<AxiosResponse> =>
  httpClient.post(`${endPointBaseURL}/resume`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

const getResumeData = async (): Promise<
  AxiosResponse<IResponse<ResumeData>>
> =>
  httpClient.get<IResponse<ResumeData>>(
    `${endPointBaseURL}/resume`,
    {
      skipToast: true,
    }
  );

export default {
  createResume,
  getResumeData
};
