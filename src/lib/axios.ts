import { useAuthStore } from "@/store/auth";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://your-api-base-url.com",
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
    console.log("request token ==>", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
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
