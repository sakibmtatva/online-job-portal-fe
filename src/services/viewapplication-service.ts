import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import {
  IResponse,
  IResponseWithPagination,
} from "../utility/interface/IResponse";
import { Application, Column } from "../utility/interface/IApplicationResponse";

const endPointBaseURL = `/api`;

const getAllApplicationsByJobID = async (
  jobId: string,
  page: number = 1,
  perPage: number = 10
): Promise<AxiosResponse<IResponseWithPagination<Application[]>>> =>
  httpClient.get<IResponseWithPagination<Application[]>>(
    `${endPointBaseURL}/getApplications/${jobId}?page=${page}&limit=${perPage}`,
    {
      skipToast: true,
    }
  );
const getAllApplicationsWithoutpage = async (
  jobId: string
): Promise<AxiosResponse<IResponseWithPagination<Application[]>>> =>
  httpClient.get<IResponseWithPagination<Application[]>>(
    `${endPointBaseURL}/getApplications/${jobId}`,
    {
      skipToast: true,
    }
  );
const addColumn = async (
  columnName: string,
  jobId: string
): Promise<AxiosResponse> =>
  httpClient.post<IResponseWithPagination<Application[]>>(
    `${endPointBaseURL}/trello`,
    { name: columnName, jobId: jobId }
  );
const editColumn = async (
  columnName: string,
  columnId: string,
  jobId: string
): Promise<AxiosResponse> =>
  httpClient.put<IResponseWithPagination<Application[]>>(
    `${endPointBaseURL}/trello?columnId=${columnId}&jobId=${jobId}&name=${columnName}`
  );
const deleteColumn = async (
  columnId: string,
  jobId: string
): Promise<AxiosResponse> =>
  httpClient.delete<IResponseWithPagination<Application[]>>(
    `${endPointBaseURL}/trello?columnId=${columnId}&jobId=${jobId}`
  );
const getColumn = async (jobId: string): Promise<AxiosResponse> =>
  httpClient.get<IResponse<Column[]>>(
    `${endPointBaseURL}/trello?jobId=${jobId}`,
    {
      skipToast: true,
    }
  );
const changeColumn = async (
  _id: string,
  trello_name: string
): Promise<AxiosResponse> =>
  httpClient.put<AxiosResponse>(
    `${endPointBaseURL}/getApplication/${_id}?trello_name=${trello_name}`,
    {
      skipToast: true,
    }
  );

export default {
  getAllApplicationsByJobID,
  getAllApplicationsWithoutpage,
  addColumn,
  getColumn,
  editColumn,
  deleteColumn,
  changeColumn,
};
