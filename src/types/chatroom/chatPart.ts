// ChatPart.java의 ExitStatus enum
const ExitStatus = {
  MEMBER_ENTER: 'MEMBER_ENTER', // 참여중
  MEMBER_EXIT: 'MEMBER_EXIT', // 퇴장
} as const;

type ExitStatus = typeof ExitStatus[keyof typeof ExitStatus];

// ChatPartDto.Post
export interface ChatPartPostDto {
  nickname: string; // 참가자 닉네임
  memberId: number; // 회원 ID
}

// ChatPartDto.Response
export interface ChatPartResponseDto {
  partId: number; // 참여 ID
  nickname: string; // 참가자 닉네임
  memberId: number; // 회원 ID
  chatRoomId: number; // 채팅방 ID
  exitStatus: ExitStatus; // 참여 상태
}
