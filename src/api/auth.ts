// src/api/auth.ts
import axiosInstance from "./axiosInstance";

interface SignupRequest {
  email: string;
  name: string;
  password: string;
  phone: string;
  birth: string;
  gender: string | null;
  region: string;
}

interface LoginRequest {
  username : string, 
  password : string
}

//회원가입 api
export const adminSignup = async (data: SignupRequest) => {
  const response = await axiosInstance.post('/admin/register', data);
  return response.data;
};

//로그인 api
export const login = async (data: LoginRequest) => {
  const response = await axiosInstance.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 세션 기반 로그인 시 필수
  });
  return response.data;
};

//로그아웃 api 
export const logout = async (token : string) => {
  return await axiosInstance.post('/auth/logout', null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

