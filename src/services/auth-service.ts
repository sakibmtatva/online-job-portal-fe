import { AxiosResponse } from "axios";
import httpClient from "./base-service";
import { ISignupRequest, ISignupResponse } from "../utility/interface/ISignup";
import { IResponse } from "../utility/interface/IResponse";
import { ILoginRequest, ILoginResponse } from "../utility/interface/ILogin";

const endPointBaseURL = `/api`;

const signup = async (
  data: ISignupRequest
): Promise<AxiosResponse<IResponse<ISignupResponse>>> =>
  httpClient.post<IResponse<ISignupResponse>>(
    `${endPointBaseURL}/signup`,
    data
  );

const login = async (
  data: ILoginRequest
): Promise<AxiosResponse<ILoginResponse>> =>
  httpClient.post<ILoginResponse>(`${endPointBaseURL}/login`, data);

const logout = async (
  fcmToken: string
): Promise<AxiosResponse<IResponse<boolean>>> =>
  httpClient.post<IResponse<boolean>>(`${endPointBaseURL}/logout`, {
    fcmToken,
  });

const verifyEmail = async (
  token: string
): Promise<AxiosResponse<IResponse<boolean>>> =>
  httpClient.get<IResponse<boolean>>(`${endPointBaseURL}/verify-email`, {
    params: { token },
  });

const forgotPassword = async (
  email: string
): Promise<AxiosResponse<IResponse<boolean>>> =>
  httpClient.post<IResponse<boolean>>(`${endPointBaseURL}/forgot-password`, {
    email,
  });

const verifyOtp = async (data: {
  email: string;
  otp: string;
}): Promise<AxiosResponse<{ message: string; data: { resetToken: string } }>> =>
  httpClient.post<{ message: string; data: { resetToken: string } }>(
    `${endPointBaseURL}/verify-otp`,
    data
  );

const resetPassword = async (data: {
  email: string;
  newPassword: string;
}): Promise<AxiosResponse<IResponse<boolean>>> =>
  httpClient.post<IResponse<boolean>>(
    `${endPointBaseURL}/reset-password`,
    data
  );

// Add to exports
export default {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
};
