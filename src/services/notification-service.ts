import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { IResponse } from "../utility/interface/IResponse";

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data: { [key: string]: string };
}

interface NotificationResponse {
  data:{message: string;
  notifications: Notification[];}
}

const endPointBaseURL = `/api`;

const getNotifications = async (
  page: number,
  limit: number
): Promise<AxiosResponse<NotificationResponse>> =>
  httpClient.get<NotificationResponse>(`${endPointBaseURL}/notification`, {
    params: {
      page,
      limit,
    },
  });

const markNotificationAsRead = async (
  notificationId: string
): Promise<AxiosResponse> =>
  httpClient.put(`${endPointBaseURL}/notification/${notificationId}`);

const markAllNotificationsAsRead = async (): Promise<AxiosResponse> =>
  httpClient.put(`${endPointBaseURL}/notification`);

const addFcmToken = async (
  fcmToken: string
): Promise<AxiosResponse<IResponse<{fcmToken: string | null}>>> =>
  httpClient.post<IResponse<{fcmToken: string | null}>>(`${endPointBaseURL}/add-fcm-token`, {
    fcmToken,
  });

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addFcmToken,
};
