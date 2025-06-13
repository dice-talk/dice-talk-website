// src/api/itemApi.ts
import { axiosInstance } from "./axiosInstance"; // 가정: axiosInstance가 설정된 파일
import type { ItemResponseDto } from "../types/itemTypes";
import type { MultiResponse } from "../types/common"; // 가정: 공통 응답 타입

const ITEM_DEFAULT_URL = "/items";

/**
 * 새로운 아이템 등록
 * @param itemPostDtoString 아이템 생성 DTO의 JSON 문자열
 * @param imageFile 아이템 이미지 파일 (선택 사항)
 * @returns 생성된 아이템의 ID를 포함한 URI (Location 헤더에서 추출된 ID)
 */
export const createItem = async (
  itemPostDtoString: string,
  imageFile?: File | null
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("itemPostDto", itemPostDtoString);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axiosInstance.post<void>(ITEM_DEFAULT_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // HTTP 상태 코드가 201 Created 이고 Location 헤더가 존재하면 ID 추출
  if (response.status === 201 && response.headers.location) {
    const locationParts = response.headers.location.split('/');
    return locationParts[locationParts.length - 1]; // 마지막 부분이 ID
  }
  return null;
};

/**
 * 기존 아이템 수정
 * @param itemId 수정할 아이템 ID
 * @param itemPatchDtoString 아이템 수정 DTO의 JSON 문자열
 * @param imageFile 아이템 이미지 파일 (선택 사항)
 * @returns 수정된 아이템 정보
 */
export const updateItem = async (
  itemId: number,
  itemPatchDtoString: string,
  imageFile?: File | null
): Promise<ItemResponseDto> => {
  const formData = new FormData();
  formData.append("itemPatchDto", itemPatchDtoString); // 백엔드가 기대하는 "itemPatchDto" 이름으로 추가
  if (imageFile) {
    formData.append("image", imageFile); // 백엔드가 기대하는 "image" 이름으로 추가
  }

  const response = await axiosInstance.patch<ItemResponseDto>(
    `${ITEM_DEFAULT_URL}/${itemId}`, // itemId를 URL 경로에 포함
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * 아이템 목록 조회 (페이지네이션 및 정렬) - 관리자용
 * @param params 페이지, 크기, 정렬 파라미터
 * @returns 아이템 목록과 페이지 정보
 */
export const getItemsAdmin = async (params: { page: number; size: number; sort?: string }): Promise<MultiResponse<ItemResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<ItemResponseDto>>(`${ITEM_DEFAULT_URL}/admin`, { params });
  return response.data;
};

/**
 * 특정 ID의 아이템 상세 조회
 * @param itemId 조회할 아이템 ID
 * @returns 특정 아이템 정보
 */
export const getItemDetail = async (itemId: number): Promise<ItemResponseDto> => {
  const response = await axiosInstance.get<ItemResponseDto>(`${ITEM_DEFAULT_URL}/${itemId}`);
  return response.data // SingleResponseDto 구조에 따라 실제 데이터 반환
};

/**
 * 특정 ID의 아이템 삭제
 * @param itemId 삭제할 아이템 ID
 */
export const deleteItem = async (itemId: number): Promise<void> => {
  await axiosInstance.delete(`${ITEM_DEFAULT_URL}/${itemId}`);
};