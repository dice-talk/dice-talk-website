export type ThemeStatus = "THEME_PLANNED" | "THEME_ON" | "THEME_CLOSE";

export interface ThemeResponseDto {
  themeId: number;
  name: string;
  description: string | null;
  image: string | null; 
  themeStatus: ThemeStatus;
}

export interface ThemePatchDto {
  themeId: number; // 경로 변수로 사용되지만, DTO에도 포함될 수 있음
  name?: string;
  description?: string | null;
  image?: string | null; 
  themeStatus?: ThemeStatus;
}

export type ThemeItem = ThemeResponseDto;