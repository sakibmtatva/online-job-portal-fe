export interface ISignupRequest {
  user_type: string;
  user_name: string;
  full_name: string;
  email: string;
  password: string;
}

export interface ISignupResponse {
  _id: string;
  full_name: string;
  user_name: string;
  email: string;
  password: string;
  user_type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IContactUsResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IContactUsRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}
