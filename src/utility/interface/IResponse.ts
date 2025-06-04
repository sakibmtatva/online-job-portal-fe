export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IResponseWithPagination<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: IPagination;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalJobs?: string | number;
  totalEmployers?: string | number,
  totalCandidates?: string | number,
}
