// src/api/auth.ts
import axiosInstance, { publicAxiosInstance } from "./axiosInstance";

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
  const response = await publicAxiosInstance.post('/admin/register', data);
              console.log(`❤️ baseURL: `+ axiosInstance.defaults.baseURL)

  return response.data;
};

//로그인 api
export const login = async (data: LoginRequest) => {
  const response = await publicAxiosInstance.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 세션 기반 로그인 시 필수
  });
  console.log(response.data);
  console.log(response.headers);
  const accessToken: string = response.headers.authorization;
  const pureToken: string = accessToken.slice(7)
  console.log(pureToken);
  localStorage.setItem("accessToken", pureToken)
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
