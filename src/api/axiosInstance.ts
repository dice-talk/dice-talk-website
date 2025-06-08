// src/api/axiosInstance.ts -> 인터셉터로 토큰 자동 포함 
import axios from 'axios';
// import { useUserStore } from '../stores/useUserStore';

// 인증이 필요한 요청을 위한 인스턴스
const axiosInstance = axios.create({
  baseURL: 'https://www.dicetalk.co.kr',
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = "Bearer " + localStorage.getItem("accessToken");
  console.log('Token in interceptor:', token); // 토큰 값 확인
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
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

// 인증이 필요 없는 공개 요청을 위한 인스턴스
export const publicAxiosInstance = axios.create({
  baseURL: 'https://www.dicetalk.co.kr',
  timeout: 5000,
});

export default axiosInstance;