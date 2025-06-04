export const ChatRoomConcept = {
  DICE_FRIENDS: 'DICE_FRIENDS',
  HEART_SIGNAL: 'HEART_SIGNAL',
} as const;
export type ChatRoomConcept = typeof ChatRoomConcept[keyof typeof ChatRoomConcept];

export const ChatRoomStatus = {
  WAITING_FOR_MEMBERS: 'WAITING_FOR_MEMBERS',
  ACTIVE: 'ACTIVE',
  CLOSING_SOON: 'CLOSING_SOON', // e.g., less than 1 hour remaining
  ENDED: 'ENDED',
  FORCE_CLOSED_BY_ADMIN: 'FORCE_CLOSED_BY_ADMIN',
} as const;
export type ChatRoomStatus = typeof ChatRoomStatus[keyof typeof ChatRoomStatus];

export const ChatRoomType = {
  GROUP: 'GROUP',
  COUPLE: 'COUPLE',
} as const;
export type ChatRoomType = typeof ChatRoomType[keyof typeof ChatRoomType];

export interface ChatRoomParticipant {
  memberId: string; // Actual user ID
  autoNickname: string;
  gender?: 'MALE' | 'FEMALE'; // Required for HEART_SIGNAL
}

export interface ChatRoomItem {
  roomId: string;
  roomType: ChatRoomType;
  concept: ChatRoomConcept | null; // 1:1 채팅방은 컨셉이 없을 수 있음
  participants: ChatRoomParticipant[];
  maxParticipants: number; // Always 6 as per description
  status: ChatRoomStatus;
  createdAt: string; // ISO Date string
  endsAt: string;    // ISO Date string (createdAt + 48 hours)
  reportedCount: number;
}
