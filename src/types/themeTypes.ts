// src/types/themeTypes.ts
export const ThemeId = {
  DICE_FRIENDS: 'DICE_FRIENDS',
  HEART_SIGNAL: 'HEART_SIGNAL',
} as const;
export type ThemeId = typeof ThemeId[keyof typeof ThemeId];

export interface ThemeItem {
  id: ThemeId;
  name: string;
  description: string;
  isActive: boolean;
  // 예시: 하트시그널의 경우 특별 규칙 표시용
  rules?: string; 
}
