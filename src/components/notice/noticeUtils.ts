// src/components/notice/noticeUtils.ts
export const NoticeStatus = {
  ONGOING: "진행중",
  CLOSED: "종료",
  SCHEDULED: "진행예정"
} as const;

// NoticeStatus 객체의 값들로부터 유니온 타입을 생성합니다.
export type NoticeStatus = typeof NoticeStatus[keyof typeof NoticeStatus];
 
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};