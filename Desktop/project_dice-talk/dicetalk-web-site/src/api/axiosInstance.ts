// src/api/axiosInstance.ts -> 인터셉터로 토큰 자동 포함 
import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if(err.response?.status === 401 ) {
      console.warn('인증오류 발생');
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;