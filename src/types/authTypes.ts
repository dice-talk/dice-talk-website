/**
 * 관리자 회원가입 요청에 사용될 데이터 타입
 * (기존 MemberPostRequest와 유사하지만, auth 관련 타입으로 분리)
 */
export interface AdminSignupRequest {
  email: string;
  name: string;
  password: string;
  phone?: string; // 선택적 필드로 유지 (SignupForm에서 제거되었으므로)
  birth?: string; // API 명세에 따라 필요한 경우 추가
  gender?: 'MALE' | 'FEMALE' | null; // API 명세에 따라 필요한 경우 추가
  region?: string; // API 명세에 따라 필요한 경우 추가
}