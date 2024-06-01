import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
// import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { logout } from './auth';

import { useAuthStore } from '@/store/auth';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const axiosInstance = axios.create(defaultConfig);

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
    const response = await axiosInstance.get('/auth/refresh-tokens');
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse> => {
    const { response } = error;
    if (response && response.status === 401) {
      try {
        if (!error.config || !error?.config?.url?.includes('/refresh-tokens')) {
          const newAccessToken = await refreshTokens();
          setAccessToken(newAccessToken);

          const originalRequest: InternalAxiosRequestConfig | undefined =
            error.config;

          if (!originalRequest) return axios(defaultConfig);

          originalRequest.headers.Authorization = newAccessToken;
          return axios(originalRequest);
        } else {
          await logout();
          throw new Error('User is not authenticated');
        }
      } catch (refreshError: any) {
        if (refreshError?.response && refreshError?.response?.status === 401) {
          await logout();
          throw new Error('User is not authenticated');
        }

        throw new Error('An error occurred while processing your request.');
      }
    } else {
      throw new Error('An error occurred while processing your request.');
    }
  },
);

export default axiosInstance;
