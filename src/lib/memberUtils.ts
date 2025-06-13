import type { MemberStatus } from '../types/memberTypes'; // 실제 MemberStatus 타입을 가져옵니다.

export const getMemberLabel = (status: MemberStatus | string): string => {
  switch (status) {
    case 'MEMBER_ACTIVE':
      return "활동 중";
    case 'MEMBER_BANNED':
      return "정지 회원";
    case 'MEMBER_DELETED':
      return "탈퇴 회원";
    // case 'MEMBER_DORMANT': // 휴면 회원이 있다면 추가
    //   return "휴면 회원";
    default:
      return status.toString(); // 알 수 없는 상태는 그대로 표시
  }};

export const getMemberStyle = (status: MemberStatus | string): string => {
  switch (status) {
    case 'MEMBER_ACTIVE': return "bg-green-100 text-green-700";
    case 'MEMBER_BANNED': return "bg-red-100 text-red-700";
    case 'MEMBER_DELETED': return "bg-yellow-100 text-yellow-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export const mapFrontendStatusToBackend = (frontendStatus: string): MemberStatus | undefined => {
  if (frontendStatus === "활동 중") return "MEMBER_ACTIVE";
  if (frontendStatus === "정지 회원") return "MEMBER_BANNED";
  if (frontendStatus === "탈퇴 회원") return "MEMBER_DELETED";
  // if (frontendStatus === "휴면 회원") return "MEMBER_DORMANT";
  if (frontendStatus === "전체") return undefined;
  console.warn(`Unhandled frontend status for backend mapping: ${frontendStatus}`);
  return undefined;
};