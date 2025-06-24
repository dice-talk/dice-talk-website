// src/api/itemApi.ts
import { axiosInstance } from "./axiosInstance"; // 가정: axiosInstance가 설정된 파일
import type { ItemPostDto, ItemPatchDto, ItemResponseDto } from "../types/payment/itemTypes";
import type { MultiResponse } from "../types/common"; // 가정: 공통 응답 타입

const ITEM_DEFAULT_URL = "/items";

export interface GetItemsAdminParams {
  page?: number;
  size?: number;
  sort?: string;
}

// /**
//  * 새로운 아이템 등록
//  * @param itemPostDtoString 아이템 생성 DTO의 JSON 문자열
//  * @param imageFile 아이템 이미지 파일 (선택 사항)
//  * @returns 생성된 아이템의 ID를 포함한 URI (Location 헤더에서 추출된 ID)
//  */
// export const createItem = async (
//   itemPostDtoString: string,
//   imageFile?: File | null
// ): Promise<string | null> => {
//   const formData = new FormData();
//   formData.append("itemPostDto", itemPostDtoString);
//   if (imageFile) {
//     formData.append("image", imageFile);
//   }

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

  // const response = await axiosInstance.post<void>(ITEM_DEFAULT_URL, formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });

  // // HTTP 상태 코드가 201 Created 이고 Location 헤더가 존재하면 ID 추출
  // if (response.status === 201 && response.headers.location) {
  //   const locationParts = response.headers.location.split('/');
  //   return locationParts[locationParts.length - 1]; // 마지막 부분이 ID
  // }
  // return null;


/**
 * 기존 아이템 수정
 * @param itemId 수정할 아이템 ID
 * @param itemPatchDtoString 아이템 수정 DTO의 JSON 문자열
 * @param imageFile 아이템 이미지 파일 (선택 사항)
 * @returns 수정된 아이템 정보
 */
// export const updateItem = async (
//   itemId: number,
//   itemPatchDtoString: string,
//   imageFile?: File | null
// ): Promise<ItemResponseDto> => {
//   const formData = new FormData();
//   formData.append("itemPatchDto", itemPatchDtoString); // 백엔드가 기대하는 "itemPatchDto" 이름으로 추가
//   if (imageFile) {
//     formData.append("image", imageFile); // 백엔드가 기대하는 "image" 이름으로 추가
//   }

//   const response = await axiosInstance.patch<ItemResponseDto>(
//     `${ITEM_DEFAULT_URL}/${itemId}`, // itemId를 URL 경로에 포함
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
//   return response.data;
// };




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