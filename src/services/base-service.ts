import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../redux/store";

declare module "axios" {
  interface AxiosRequestConfig {
    skipToast?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const skipToast = response.config?.skipToast;
    if (!skipToast) {
      const message = response.data?.message;
      if (message) {
        toast.success(message);
      }
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!";

    if (status === 401) {
      toast.error("Unauthorized! Please login again.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
