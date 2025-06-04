import { IResponse } from "./../utility/interface/IResponse";
import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { LocationRS } from "../utility/interface/ILocationResponse";

const endPointBaseURL = `/api`;

const getLocationData = async (): Promise<
  AxiosResponse<IResponse<LocationRS[]>>
> =>
  httpClient.get<IResponse<LocationRS[]>>(`${endPointBaseURL}/cities`, {
    skipToast: true,
  });

export default {
  getLocationData,
};
