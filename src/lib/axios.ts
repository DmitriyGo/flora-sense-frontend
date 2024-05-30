import { useAuthStore } from "@/store/auth";
import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => {
  const { user } = useAuthStore.getState();
  return user?.accessToken;
};

const setAccessToken = (token: string) => {
  const { updateToken } = useAuthStore.getState();
  updateToken(token);
};

const refreshTokens = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh-tokens");
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshTokens();
        axiosInstance.defaults.headers.common["Authorization"] = newAccessToken;
        originalRequest.headers["Authorization"] = newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
