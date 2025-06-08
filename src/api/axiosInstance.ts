// src/api/axiosInstance.ts -> 인터셉터로 토큰 자동 포함
import axios from "axios";
// import { useUserStore } from '../stores/useUserStore';

// 인증이 필요한 요청을 위한 인스턴스
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 인증이 필요 없는 공개 요청을 위한 인스턴스
export const publicAxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

export default axiosInstance;
