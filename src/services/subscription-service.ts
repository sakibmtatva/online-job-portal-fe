import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { ISubscriptionRequest, SessionData } from "../utility/interface/ISubscription";
import { IResponse } from "../utility/interface/IResponse";

const endPointBaseURL = `/api`;

const checkoutSubscription = async (
  data: ISubscriptionRequest
): Promise<AxiosResponse<{ data: { id: string } }>> =>
  httpClient.post(`${endPointBaseURL}/create-checkout-session`, data, {
    headers: {
      "Content-Type": "application/json",
    },
    skipToast: true,
  });

const getSessionData = async (
  sessionId: string
): Promise<AxiosResponse<IResponse<SessionData>>> =>
  httpClient.get<IResponse<SessionData>>(`${endPointBaseURL}/session/${sessionId}`, {
    skipToast: true,
  });
export default {
  checkoutSubscription,
  getSessionData,
};
