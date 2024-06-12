import axiosInstance from './axios';

import { Role } from '@/store/auth';

export interface User {
  id: string;
  email: string;
  roles: Role[];
  updatedAt: Date;
}

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get<User[]>('/user/all');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  const response = await axiosInstance.delete(`/user/${userId}`);
  return response.data;
};
