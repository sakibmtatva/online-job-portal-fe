export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponseUser {
  _id: string;
  full_name: string;
  user_name: string;
  email: string;
  user_type: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  profile_url: string | null;
  __v: number;
}

export interface ILoginResponse {
  message: string;
  token: string;
  user: ILoginResponseUser;
}
