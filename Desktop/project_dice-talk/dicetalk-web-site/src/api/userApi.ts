// src/api/user.ts
import axios from './axiosInstance';

export const login = (email: string, password: string) => {
  return axios.post('/auth/login', { email, password });
};