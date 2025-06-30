export type ThemeStatusType = 'THEME_ON' | 'THEME_PLANNED' | 'THEME_CLOSE' | string;

export const getThemeLabel = (status: ThemeStatusType): string => {
  switch (status) {
    case 'THEME_ON': return '진행중';
    case 'THEME_PLANNED': return '예정';
    case 'THEME_CLOSE': return '종료';
    default: return status.toString();
  }
};

export const getThemeStyle = (status: ThemeStatusType): string => {
  switch (status) {
    case 'THEME_ON': return 'bg-green-100 text-green-700 border border-green-300';
    case 'THEME_PLANNED': return 'bg-blue-100 text-blue-700 border border-blue-300';
    case 'THEME_CLOSE': return 'bg-gray-100 text-gray-700 border border-gray-300';
    default: return 'bg-gray-100 text-gray-700 border border-gray-300';
  }
};
 
export const themeSortOptions = [
  { value: 'id_desc', label: '등록일 (최신순)' },
  { value: 'id_asc', label: '등록일 (오래된순)' },
  { value: 'name_asc', label: '테마명 (오름차순)' },
  { value: 'name_desc', label: '테마명 (내림차순)' },
  { value: 'status_on_first', label: '상태순 (진행중 우선)' },
  { value: 'status_close_first', label: '상태순 (종료 우선)' },
];