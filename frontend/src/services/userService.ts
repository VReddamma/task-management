import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export const getAllUsers = async () => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
};
