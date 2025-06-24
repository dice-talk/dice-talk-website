// src/api/eventApi.ts
import { axiosInstance } from "./axiosInstance";
import type { EventPostDto, EventPatchDto, EventResponseDto, EventStatus } from "../types/chatroom/eventTypes";
import type { MultiResponse } from "../types/common"; // SingleResponseDto 추가

const EVENT_BASE_URL = "/events";

/**
 * 새로운 이벤트 등록
 * @param postDto 이벤트 등록 정보
 * @returns 생성된 이벤트의 ID를 포함한 URI (Location 헤더에 있음)
 */
export const createEvent = async (postDto: EventPostDto): Promise<string | null> => {
  const response = await axiosInstance.post<void>(EVENT_BASE_URL, postDto);
  // 생성 성공 시 (201) Location 헤더에서 ID 추출
  if (response.status === 201 && response.headers.location) {
    const locationParts = response.headers.location.split('/');
    return locationParts[locationParts.length - 1]; // 마지막 부분이 ID
  }
  return null;
};

/** 
 * 이벤트 수정
 * @param eventId 수정할 이벤트 ID
 * @param patchDto 이벤트 수정 정보
 * @returns 수정된 이벤트 정보
 */
export const updateEvent = async (eventId: number, patchDto: EventPatchDto): Promise<EventResponseDto> => {
  const response = await axiosInstance.patch<EventResponseDto>(`${EVENT_BASE_URL}/${eventId}`, patchDto);
  return response.data; // SingleResponseDto의 data 필드에서 실제 이벤트 데이터 추출
};

/**
 * 전체 이벤트 목록 조회 (페이지네이션)
 * @param params 페이지, 크기, 상태, 테마 ID 등 필터링 및 페이징 파라미터
 * @returns 이벤트 목록과 페이지 정보
 */
export const getEvents = async (params: {
  page: number;
  size: number;
  eventStatus?: EventStatus;
  themeId?: number;
}): Promise<MultiResponse<EventResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<EventResponseDto>>(EVENT_BASE_URL, { params });
  return response.data;
};

/**
 * 특정 ID의 이벤트 상세 조회
 * @param eventId 조회할 이벤트 ID
 * @returns 특정 이벤트 정보
 */
export const getEventDetail = async (eventId: number): Promise<EventResponseDto> => {
  const response = await axiosInstance.get<EventResponseDto>(`${EVENT_BASE_URL}/${eventId}`);
  return response.data; // SingleResponseDto의 data 필드에서 실제 이벤트 데이터 추출
};

/**
 * 특정 ID의 이벤트 비활성화 (삭제)
 * @param eventId 비활성화할 이벤트 ID
 */
export const deleteEvent = async (eventId: number): Promise<void> => {
  await axiosInstance.delete(`${EVENT_BASE_URL}/${eventId}`);
};