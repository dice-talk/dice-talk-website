// src/api/themeApi.ts
import { axiosInstance } from "./axiosInstance"; // axiosInstance 경로 확인
import type { ThemePatchDto, ThemeResponseDto, ThemeStatus } from '../types/themeTypes';
import type { MultiResponse } from "../types/common";


// 모든 테마 목록 조회
export const getThemesForAdmin = async (params?: {
  page?: number;
  size?: number;
  status?: ThemeStatus;
}): Promise<MultiResponse<ThemeResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<ThemeResponseDto>>("/themes", { params });
  return response.data;
};


// 특정 ID의 테마 정보 조회
export const getThemeById = async (themeId: number): Promise<ThemeResponseDto> => {

  const response = await axiosInstance.get<ThemeResponseDto>(`/themes/${themeId}`);
  return response.data; // SingleResponseDto의 data 필드에서 실제 테마 데이터 추출
};


//기존 테마 수정
export const updateTheme = async (themeData: ThemePatchDto): Promise<ThemeResponseDto> => {
const { themeId, ...otherPatchData } = themeData;

  const formData = new FormData();
  // themePatchDto는 themeId를 포함하지 않아야 할 수 있음 (컨트롤러에서 path variable로 받음)
  // 또는 DTO 내 themeId는 무시하고 path variable을 우선시 할 수 있음.
  // 여기서는 DTO에서 themeId를 제외한 나머지를 JSON 문자열로 전달합니다.
  // 백엔드 patchDto.setThemeId(themeId) 코드가 있으므로, DTO에 themeId가 없어도 됩니다.
  const patchDtoStringCompatible = { name: otherPatchData.name, description: otherPatchData.description, image: otherPatchData.image, themeStatus: otherPatchData.themeStatus };
  formData.append("themePatchDto", JSON.stringify(patchDtoStringCompatible));

  if (themeData.image && typeof themeData.image !== 'string') { // imageFile이 File 객체인 경우 (새 이미지 업로드 시)
     // 이 부분은 프론트엔드에서 imageFile을 어떻게 관리하는지에 따라 수정 필요
     // ThemePatchDto의 image 필드가 string URL인지 File 객체인지 명확해야 함.
     // 여기서는 imageFile 파라미터를 별도로 받는 것으로 가정하고 수정합니다.
     // formData.append("image", imageFile); // 만약 imageFile을 별도 파라미터로 받는다면
  }

  const response = await axiosInstance.patch<ThemeResponseDto>(`/themes/${themeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; // SingleResponseDto의 data 필드에서 실제 테마 데이터 추출
};

// 특정 ID의 테마를 삭제합니다.
export const deleteTheme = async (themeId: number): Promise<void> => {
  await axiosInstance.delete(`/themes/${themeId}`);
};