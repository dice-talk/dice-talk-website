import type { ChatRoomSingleResponseDto, ChatRoomMultiResponseDto } from '../types/chatroom/chatRoomTypes';
import { type MultiResponse } from '../types/common';

// API_BASE_URL은 실제 환경에 맞게 설정해야 합니다.
const API_BASE_URL = '/api/chat-rooms'; // 예시 URL, 실제 백엔드 엔드포인트에 맞게 수정

/**
 * API 호출을 위한 기본 fetch 함수 (에러 처리 및 JSON 파싱 포함)
 * 실제 애플리케이션에서는 axios와 같은 라이브러리 사용을 고려하세요.
 */
async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Authorization 헤더 등 필요에 따라 추가
      // 'Authorization': `Bearer ${getToken()}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // 실제 에러 객체를 throw 하거나, 애플리케이션의 에러 처리 방식에 맞게 수정
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) { // No Content
    return undefined as T; // or handle as Promise<void> specifically
  }
  return response.json() as Promise<T>;
}

/**
 * 전체 채팅방 목록 조회 (관리자용)
 * @param page 조회할 페이지 번호 (1부터 시작)
 * @param size 한 페이지당 항목 수
 */
export const getChatRooms = (page: number, size: number): Promise<MultiResponse<ChatRoomMultiResponseDto>> => {
  // MultiResponseDto<ChatRoomDto.MultiResponse>를 Page<ChatRoomMultiResponse>로 가정합니다.
  // 백엔드의 MultiResponseDto 구조에 따라 반환 타입 조정이 필요할 수 있습니다.
  // AuthorizationUtils.isAdmin() 호출은 백엔드에서 처리되므로, 클라이언트는 토큰을 통해 권한을 증명해야 합니다.
  return apiClient<MultiResponse<ChatRoomMultiResponseDto>>(`?page=${page}&size=${size}`, {
    method: 'GET',
    // 관리자 권한이 필요한 API 호출 시, 인증 토큰을 헤더에 포함해야 합니다.
  });
};

/**
 * 특정 채팅방 상세 정보 조회
 * @param chatRoomId 조회할 채팅방의 ID
 * @param page 채팅 내역 조회 시 페이지 번호
 * @param size 채팅 내역 조회 시 한 페이지당 항목 수
 */
export const getChatRoom = (
  chatRoomId: number,
  page: number,
  size: number
): Promise<ChatRoomSingleResponseDto> => {
  // SingleResponseDto<ChatRoomDto.SingleResponse>를 ChatRoomSingleResponseDto로 가정합니다.
  // 백엔드의 SingleResponseDto 구조에 따라 반환 타입 조정이 필요할 수 있습니다.
  // @AuthenticationPrincipal은 백엔드에서 처리됩니다. 클라이언트는 인증된 사용자의 토큰을 보내야 합니다.
  return apiClient<ChatRoomSingleResponseDto>(`/${chatRoomId}?page=${page}&size=${size}`, {
    method: 'GET',
  });
};

/**
 * 채팅방 강제 종료 (관리자용)
 * @param chatRoomId 강제종료 대상 채팅방의 ID
 */
export const deleteChatRoom = (chatRoomId: number): Promise<void> => {
  // AuthorizationUtils.isAdmin() 호출은 백엔드에서 처리됩니다.
  return apiClient<void>(`/office/${chatRoomId}`, {
    method: 'DELETE',
    // 관리자 권한이 필요한 API 호출 시, 인증 토큰을 헤더에 포함해야 합니다.
  });
};

// 참고:
// - getToken(): 실제 인증 토큰을 가져오는 함수로 대체해야 합니다.
// - 백엔드의 `MultiResponseDto`와 `SingleResponseDto`가 단순 데이터 래퍼라면,
//   위의 `Page<ChatRoomMultiResponse>`나 `ChatRoomSingleResponseDto`로 직접 매핑될 수 있습니다.
//   만약 추가적인 메타데이터 (e.g., { data: ActualType, pageInfo: PageInfoType })를 포함한다면,
//   API 함수의 반환 타입과 apiClient의 파싱 로직을 그에 맞게 수정해야 합니다.
// - Java의 `Page<ChatRoom>`이 `MultiResponseDto`의 `chatRoomPage`로 전달되는 것을 보면,
//   `getChatRooms`의 반환 타입은 `Page<ChatRoomMultiResponse>`가 적절해 보입니다.
//   `MultiResponseDto`가 `data` 필드와 `pageInfo` 필드를 갖는 구조라면 아래와 같이 수정될 수 있습니다:
//   interface BackendMultiResponse<T> { data: T[]; pageInfo: Page<any>; } /* 실제 구조에 맞게 */
//   그리고 apiClient와 getChatRooms 반환 타입을 조정합니다.
//   현재는 Spring Data JPA의 Page 객체가 직렬화되어 클라이언트에 Page 인터페이스와 유사한 형태로 전달된다고 가정했습니다.

