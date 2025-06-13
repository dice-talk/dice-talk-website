// src/types/chatRoomTypes.ts
// ChatDto.Response 및 RoomEventDto.Response 타입은 실제 정의에 맞게 수정 필요
import { type ChatResponseDto } from './chatTypes';
import { type EventResponseDto } from './eventTypes';
import { type ChatPartResponseDto } from './chatPart';
import { type MultiResponse } from '../common';

// ChatRoom.java의 RoomType enum
export const RoomType = {
  GROUP: 'GROUP', // 단체 채팅방
  COUPLE:'COUPLE', // 1:1 채팅방
} as const;

export type RoomType = typeof RoomType[keyof typeof RoomType];

// ChatRoom.java의 RoomStatus enum
export const RoomStatus = {
  ROOM_ACTIVE: 'ROOM_ACTIVE', // 활성화
  ROOM_DEACTIVE: 'ROOM_DEACTIVE', // 비활성화
} as const;

export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export interface ChatRoomParticipant {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER'; // 예시 필드
  // ... 기타 필요한 참가자 정보 필드 ...
}

// ChatRoomDto.SingleResponse
export interface ChatRoomSingleResponseDto {
  chatRoomId: number; // 채팅방 ID
  roomType: RoomType; // 채팅방 유형
  roomStatus: RoomStatus; // 채팅방 상태
  themeId: number | null 
  themeName: string; // 테마 이름
  chats: MultiResponse<ChatResponseDto>; // ChatDto.Response 타입으로 변경 필요
  chatParts: ChatPartResponseDto[];
  roomEvents: EventResponseDto[]; // RoomEventDto.Response 타입으로 변경 필요
  createdAt: string; // LocalDateTime은 string으로 처리 (ISO 8601 형식)
  modifiedAt: string; // LocalDateTime은 string으로 처리 (ISO 8601 형식)
}

// ChatRoomDto.MultiResponse
export interface ChatRoomMultiResponseDto {
  chatRoomId: number; // 채팅방 ID
  roomType: RoomType; // 채팅방 유형
  roomStatus: RoomStatus; // 채팅방 상태
  lastChat: string | null; // 최근 채팅 내용 (null일 수 있음)
  themeId?: number | null; // 테마 ID (컨셉 구분을 위해 추가)
  themeName?: string;
  createdAt: string; // LocalDateTime은 string으로 처리
  modifiedAt: string; // LocalDateTime은 string으로 처리
}