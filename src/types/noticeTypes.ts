/**
 * 백엔드의 Notice.NoticeStatus
 */
export const NoticeStatus = {
  ONGOING: '진행중',
  CLOSED: '종료',
  SCHEDULED: '진행예정',
} as const; 
export type NoticeStatus = typeof NoticeStatus[keyof typeof NoticeStatus];

/**
 * 공지/이벤트의 유형 (프론트엔드용)
 * 백엔드의 Notice.NoticeType과 매핑
 */
export type NoticeType = '공지사항' | '이벤트';

/**
 * 백엔드 API에서 사용하는 공지/이벤트 유형
 */
export type NoticeTypeBack = 'NOTICE' | 'EVENT';

/**
 * 백엔드 API에서 사용하는 공지/이벤트 상태
 */
export type NoticeStatusBack = 'ONGOING' | 'CLOSED' | 'SCHEDULED';

/**
 * 공지 이미지 DTO (백엔드 응답 기준)
 */
export interface NoticeImageDto { // 'R' for Response
  noticeImageId: number;
  noticeId: number;
  imageUrl: string;
  isThumbnail: boolean;
}

/**
 * 공지 이미지 생성 요청 DTO (백엔드 기준)
 * NoticeImageDto.Post
 */
export interface NoticeImagePostDto {
  noticeId?: number; // 새 공지 생성 시에는 noticeId가 없을 수 있음 (백엔드에서 처리)
  imageUrl: string;
  isThumbnail: boolean;
}

/**
 * 공지 이미지 수정 요청 DTO (백엔드 기준)
 * NoticeImageDto.Patch
 */
export interface NoticeImagePatchDto {
  noticeImageId: number;
  noticeId?: number; // 일반적으로 수정 시에는 noticeId가 필요 없을 수 있음 (noticeImageId로 식별)
  imageUrl: string;
  isThumbnail: boolean;
}

/**
 * 공지/이벤트 응답 DTO (백엔드 기준)
 * GET /notices/{noticeId}
 */
export interface NoticeResponseDto {
  noticeId: number;
  title: string;
  content: string;
  noticeImages: NoticeImageDto[];
  startDate?: string; 
  endDate?: string;  
  noticeType: NoticeTypeBack;
  noticeStatus: NoticeStatusBack;
  noticeImportance: number;
  createdAt: string;    
  modifiedAt: string; 
}

/**
 * 공지/이벤트 생성 요청 DTO (백엔드 기준)
 * POST /notices
 */
export interface NoticePostDto { 
  title: string;
  content: string;
  startDate?: string; 
  endDate?: string;
  noticeType: NoticeTypeBack;
  noticeStatus: NoticeStatusBack; 
  noticeImportance: number;
}


export interface NoticePatchDto { 
  title: string;
  content: string;
  keepImageIds?: number[]; // 유지할 이미지 ID 목록
  startDate?: string;
  endDate?: string;
  noticeType: NoticeTypeBack;
  noticeStatus: NoticeStatusBack;
  noticeImportance: number;
}

// 프론트엔드에서 사용하는 공지/이벤트 아이템의 일반적인 형태
export interface NoticeItemView {
  id: number;
  type: NoticeType;
  title: string;
  content: string;
  createdAt: string; 
  isImportant: boolean;
  status: NoticeStatus;
  imageUrls?: string[];
  startDate?: string; // API 응답의 startDate를 그대로 사용하거나, 포맷팅된 문자열
  endDate?: string;   // API 응답의 endDate를 그대로 사용하거나, 포맷팅된 문자열
  thumbnailFlags?: boolean[]; // 각 이미지 파일에 대한 썸네일 여부

}