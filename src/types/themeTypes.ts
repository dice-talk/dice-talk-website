// src/types/themeTypes.ts

/**
 * 테마 상태 (백엔드와 동일)
 * - THEME_PLANNED: 진행 예정
 * - THEME_ON: 진행중
 * - THEME_CLOSE: 종료
 */
export type ThemeStatus = "THEME_PLANNED" | "THEME_ON" | "THEME_CLOSE";

export interface ThemeResponseDto {
  themeId: number;
  name: string;
  description: string | null;
  image: string | null; // 이미지 URL
  themeStatus: ThemeStatus;
  // 백엔드 응답에 rules가 있다면 추가
  // rules?: string | null; 
}

export interface ThemePatchDto {
  themeId: number; // 경로 변수로 사용되지만, DTO에도 포함될 수 있음
  name?: string;
  description?: string | null;
  image?: string | null; // 이미지 URL 또는 null (제거 시)
  themeStatus?: ThemeStatus;
  // rules?: string | null;
}

// ThemeEditModal 및 ThemeManagementPage에서 사용할 UI용 테마 아이템 타입 별칭
export type ThemeItem = ThemeResponseDto;