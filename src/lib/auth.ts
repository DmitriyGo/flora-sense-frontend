import axiosInstance from './axios';

import { Role, useAuthStore } from '@/store/auth';

interface LoginResponse {
  accessToken: string;
}

interface RegisterResponse {
  email: string;
  id: string;
  roles: Role[];
  updatedAt: string;
}

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    const { accessToken } = response.data;
    const { saveUser } = useAuthStore.getState();
    saveUser({ email, roles: [], accessToken });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const getRoles = async () => {
  try {
    const response = await axiosInstance.get('/user');
    const { roles } = response.data;
    const { updateRoles } = useAuthStore.getState();
    updateRoles(roles);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const register = async (
  email: string,
  password: string,
  passwordRepeat: string,
) => {
  try {
    const { data: user } = await axiosInstance.post<RegisterResponse>(
      '/auth/register',
      {
        email,
        password,
        passwordRepeat,
      },
    );
    const {
      data: { accessToken },
    } = await axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    const { saveUser } = useAuthStore.getState();
    const userData = { email, roles: user.roles, accessToken };

    saveUser(userData);
    return userData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    const { clearUser } = useAuthStore.getState();
    clearUser();
    await axiosInstance.get('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export { login, register, getRoles, logout };
