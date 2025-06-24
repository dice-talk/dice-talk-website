import type { ChatRoomSingleResponseDto, ChatRoomMultiResponseDto, RoomStatus, RoomType } from '../types/chatroom/chatRoomTypes';
import type { MultiResponse } from '../types/common';
import { axiosInstance } from './axiosInstance'; 

const API_BASE_URL = '/chat-rooms'; 

interface GetChatRoomsParams {
  page: number;
  size: number;
  themeName?: string;
  roomStatus?: RoomStatus
  roomType?: RoomType;   
  chatRoomId?: number;
  sort?: string;
}

export const getChatRooms = async (params: GetChatRoomsParams): Promise<MultiResponse<ChatRoomMultiResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<ChatRoomMultiResponseDto>>(API_BASE_URL, {
    params,
  });
  return response.data;
};

export const getChatRoom = async (
  chatRoomId: number,
  page: number,
  size: number
): Promise<ChatRoomSingleResponseDto> => {
    const response = await axiosInstance.get<ChatRoomSingleResponseDto>(`${API_BASE_URL}/${chatRoomId}`, {
    params: { page, size }, // 페이지 번호 조정
  });
  return response.data;
};

/**
 * 채팅방 강제 종료 (관리자용)
 * @param chatRoomId 강제종료 대상 채팅방의 ID
 */
export const deleteChatRoom = async (chatRoomId: number): Promise<void> => {
  // AuthorizationUtils.isAdmin() 호출은 백엔드에서 처리됩니다.
  await axiosInstance.delete (`${API_BASE_URL}/office/${chatRoomId}`)
};
