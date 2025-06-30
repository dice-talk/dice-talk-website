import { axiosInstance } from "./axiosInstance"; // axiosInstance 경로 확인
import type { ThemePatchDto, ThemeResponseDto, ThemeStatus } from '../types/chatroom/themeTypes';
import type { MultiResponse } from "../types/common";

const THEME_BASE_URL = "/themes";

export interface GetThemesParams {
 page?: number; 
  size?: number; 
  status?: ThemeStatus | ''; // 테마 상태 (''는 전체를 의미)
  }

export const getThemes = async (params:GetThemesParams): Promise<MultiResponse<ThemeResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<ThemeResponseDto>>(`${THEME_BASE_URL}/admin`, { params });
  return response.data;
};




// 특정 ID의 테마 정보 조회
export const getThemeById = async (themeId: number): Promise<ThemeResponseDto> => {

  const response = await axiosInstance.get<ThemeResponseDto>(`${THEME_BASE_URL}/${themeId}`);
  return response.data;
};


//기존 테마 수정
export const updateTheme = async (themeData: ThemePatchDto): Promise<ThemeResponseDto> => {
const { themeId, image, ...otherPatchData } = themeData;

  const formData = new FormData();

  if (image && typeof image !== 'string') {
    formData.append('image', image);
  }

  const patchDto: Partial<Omit<ThemePatchDto, 'themeId' | 'image'>> = {
    ...otherPatchData,
  };

  formData.append(
    'themePatchDto',
    new Blob([JSON.stringify(patchDto)], { type: 'application/json' })
  );

  const response = await axiosInstance.patch<ThemeResponseDto>(`${THEME_BASE_URL}/${themeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 특정 ID의 테마 삭제
export const deleteTheme = async (themeId: number): Promise<void> => {
  await axiosInstance.delete(`${THEME_BASE_URL}/${themeId}`);
};