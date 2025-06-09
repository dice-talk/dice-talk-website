import { axiosInstance } from "./axiosInstance"; // axiosInstance 경로 확인
import type { AdminSignupRequest } from "../types/authTypes"; // AdminSignupRequest 타입 임포트

/**
 * 로그인 요청에 사용될 데이터 타입
 */
export interface LoginRequest {
  username: string; // API 명세에 따라 'email' 또는 'loginId' 등이 될 수 있습니다.
  password: string;
}

/**
 * 로그인 API (POST /auth/login)
 * @param credentials 로그인 정보 (username, password)
 * @returns 서버 응답 (axiosInstance의 응답 인터셉터가 토큰을 처리)
 */
export const login = async (credentials: LoginRequest): Promise<string | null> => {
  // axiosInstance의 응답 인터셉터가 응답 헤더의 Authorization 토큰을
  // localStorage에 저장한다고 가정합니다.
  const response = await axiosInstance.post("/auth/login", credentials);
  // 응답 헤더에서 직접 토큰 추출
  const authorizationHeader = response.headers['authorization'] || response.headers['Authorization'];
  if (authorizationHeader) {
    const token = authorizationHeader.replace('Bearer ', '');
    if (token) return token;
  }
  return null; // 토큰이 없는 경우 null 반환
};

/**
 * 관리자 회원가입 API (POST /admin/register)
 * @param data 회원가입 정보 (MemberPostRequest 타입)
 * @param data 회원가입 정보 (AdminSignupRequest 타입)
 * @returns 서버 응답
 */
export const adminSignup = async (data: AdminSignupRequest) => {
  // 회원가입 성공 시에도 토큰이 반환된다면,
  // axiosInstance의 응답 인터셉터가 이를 처리할 수 있습니다.
  const response = await axiosInstance.post("/admin/register", data);
  return response.data;
};

// TODO: 필요한 다른 인증 관련 API 함수들 추가 (예: 일반 사용자 회원가입, 토큰 갱신 등)

/**
 * 로그아웃 API (실제 로그아웃 API가 있다면 호출, 없다면 클라이언트 측 처리만)
 * @returns Promise<void>
 */
export const logout = async (): Promise<void> => {
  // 예시: 서버에 로그아웃 요청을 보내는 경우
  // await axiosInstance.post("/auth/logout");
  // 클라이언트 측에서 토큰 제거 및 상태 변경
  localStorage.removeItem("accessToken");
  // useAuthStore.getState().logout(); // Zustand 스토어의 logout 액션 호출
};