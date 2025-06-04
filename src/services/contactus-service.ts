import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { IResponse } from "../utility/interface/IResponse";
import {
  IContactUsRequest,
  IContactUsResponse,
} from "../utility/interface/ISignup";

const endPointBaseURL = `/api`;

const contactUs = async (
  data: IContactUsRequest
): Promise<AxiosResponse<IResponse<IContactUsResponse>>> =>
  httpClient.post<IResponse<IContactUsResponse>>(
    `${endPointBaseURL}/contactus`,
    data
  );

export default { contactUs };
