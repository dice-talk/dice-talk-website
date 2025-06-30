import { axiosInstance } from "./axiosInstance"; // 가정: axiosInstance가 설정된 파일
import type { ItemPostDto, ItemPatchDto, ItemResponseDto } from "../types/payment/itemTypes";
import type { MultiResponse } from "../types/common"; // 가정: 공통 응답 타입

const ITEM_DEFAULT_URL = "/items";

export interface GetItemsAdminParams {
  page?: number;
  size?: number;
  sort?: string;
}

  export const createItem = async (
  itemDto: ItemPostDto,
  imageFile?: File | null
  ): Promise<string | null> => { 
    const formData = new FormData();
  formData.append('itemPostDtoString', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await axiosInstance.post(ITEM_DEFAULT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.headers.location || null;
  };


export const updateItem = async (
  itemId: number,
  itemDto: ItemPatchDto,
  imageFile?: File | null
): Promise<ItemResponseDto> => { 
  const formData = new FormData();
  // 백엔드 PATCH API가 DTO를 받는 파트 이름을 확인해야 합니다. (예: 'itemPatchDto')
  formData.append('itemPatchDtoString', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  const response = await axiosInstance.patch<ItemResponseDto>(`${ITEM_DEFAULT_URL}/${itemId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const getItemsAdmin = async (params: GetItemsAdminParams): Promise<MultiResponse<ItemResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<ItemResponseDto>>(`${ITEM_DEFAULT_URL}/admin`, { params });
  return response.data;
};


export const getItemDetail = async (itemId: number): Promise<ItemResponseDto> => {
  const response = await axiosInstance.get<ItemResponseDto>(`${ITEM_DEFAULT_URL}/${itemId}`);
  return response.data // SingleResponseDto 구조에 따라 실제 데이터 반환
};


export const deleteItem = async (itemId: number): Promise<void> => {
  await axiosInstance.delete(`${ITEM_DEFAULT_URL}/${itemId}`);
};