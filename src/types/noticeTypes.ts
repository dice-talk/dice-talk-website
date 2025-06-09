// src/types/noticeTypes.ts

/**
 * 공지/이벤트의 상태 (프론트엔드용)
 * 백엔드의 Notice.NoticeStatus와 매핑됩니다.
 */
export const NoticeStatus = {
  ONGOING: '진행중',
  CLOSED: '종료',
  SCHEDULED: '진행예정',
} as const; // 'as const'를 사용하여 각 프로퍼티를 리터럴 타입으로 만듭니다.
export type NoticeStatus = typeof NoticeStatus[keyof typeof NoticeStatus];

/**
 * 공지/이벤트의 유형 (프론트엔드용)
 * 백엔드의 Notice.NoticeType과 매핑됩니다.
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
                     // 하지만 백엔드 DTO에는 포함되어 있으므로 유지
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
  startDate?: string; // LocalDateTime은 문자열로 받습니다.
  endDate?: string;   // LocalDateTime은 문자열로 받습니다.
  noticeType: NoticeTypeBack;
  noticeStatus: NoticeStatusBack;
  noticeImportance: number;
  createdAt: string;    // LocalDateTime은 문자열로 받습니다.
  modifiedAt: string;   // LocalDateTime은 문자열로 받습니다.
}

/**
 * 공지/이벤트 생성 요청 DTO (백엔드 기준)
 * POST /notices
 */
export interface NoticePostDto { // 'P' for Post/Payload
  title: string;
  content: string;
  startDate?: string; // LocalDateTime은 문자열로 전송합니다.
  endDate?: string;
  noticeType: NoticeTypeBack;
  noticeStatus: NoticeStatusBack; // 'PUBLISHED' 등이 될 수 있음
  noticeImportance: number;
}

/**
 * 공지/이벤트 수정 요청 DTO (백엔드 기준)
 * PATCH 또는 PUT /notices/{noticeId}
 */
export interface NoticePatchDto { // 'P' for Patch/Payload
  // noticeId는 URL 파라미터로 전달되므로 DTO 본문에는 포함되지 않을 수 있습니다.
  // 백엔드 DTO에는 noticeId가 있지만, API 경로에 ID가 있다면 중복될 수 있습니다.
  // 여기서는 백엔드 DTO를 따르되, 실제 API 호출 시 경로 ID를 우선합니다.
  // noticeId?: number; // 경로에 ID가 있다면 생략 가능
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
  createdAt: string; // API 응답의 createdAt을 그대로 사용하거나, 포맷팅된 문자열
  isImportant: boolean;
  status: NoticeStatus; // 프론트엔드용 상태
  imageUrls?: string[];
  startDate?: string; // API 응답의 startDate를 그대로 사용하거나, 포맷팅된 문자열
  endDate?: string;   // API 응답의 endDate를 그대로 사용하거나, 포맷팅된 문자열
}