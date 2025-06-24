// src/api/noticeApi.ts
import { axiosInstance } from "./axiosInstance"; // axiosInstance 경로 확인 필요
import type {
  NoticePostDto,
  NoticePatchDto,
  NoticeResponseDto,
  NoticeTypeBack,
  NoticeStatusBack,
} from "../types/noticeTypes"; // 타입 경로 확인 필요
import type { MultiResponse } from "../types/common"; // 공통 타입 경로 확인 필요

export const createNotice = async (
  noticePostDtoString: string,
  imageFiles?: File[],
  thumbnailFlags?: boolean[]
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("noticePostDto", noticePostDtoString);

  if (imageFiles) {
    imageFiles.forEach((file) => formData.append("images", file));
  }

  // thumbnailFlags를 URL 쿼리 파라미터로 전송
  const params = new URLSearchParams();
  if (thumbnailFlags && thumbnailFlags.length > 0) {
    thumbnailFlags.forEach((flag) =>
      params.append("thumbnailFlags", flag.toString())
    );
  }

  const url = params.toString() ? `/notices?${params.toString()}` : "/notices";

  const response = await axiosInstance.post<void>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const locationHeader =
    response.headers.location || response.headers["Location"]; // Axios는 헤더 키를 소문자로 정규화하지만, 대문자도 확인
  console.log("[API] Location Header from server:", locationHeader); // 실제 헤더 값 로깅
  if (locationHeader) {
    const parts = locationHeader.split("/");
    return parts[parts.length - 1];
  }
  console.error("Location header is missing in createNotice response."); // 이 메시지가 현재 발생 중
  return null;
};


export const updateNotice = async (
  noticeId: number,
  noticePatchDtoString: string,
  imageFiles?: File[],
  thumbnailFlags?: boolean[]
): Promise<NoticeResponseDto> => {
  const formData = new FormData();
  formData.append("noticePatchDto", noticePatchDtoString);

  if (imageFiles) {
    imageFiles.forEach((file) => formData.append("images", file));
  }

  // thumbnailFlags를 URL 쿼리 파라미터로 전송
  const params = new URLSearchParams();
  if (thumbnailFlags && thumbnailFlags.length > 0) {
    thumbnailFlags.forEach((flag) =>
      params.append("thumbnailFlags", flag.toString())
    );
  }

  const url = params.toString()
    ? `/notices/${noticeId}?${params.toString()}`
    : `/notices/${noticeId}`;

  const response = await axiosInstance.patch<{ data: NoticeResponseDto }>( // 백엔드가 SingleResponseDto로 감싸서 반환
    url,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data; // SingleResponseDto의 data 필드 접근
};


/**
 * 공지/이벤트 상세 조회 (GET /notices/{noticeId})
 * @param noticeId 조회할 공지/이벤트 ID
 * @returns 공지/이벤트 상세 정보
 */
export const getNoticeDetail = async (
  noticeId: number
): Promise<NoticeResponseDto> => {
  const response = await axiosInstance.get<{ data: NoticeResponseDto }>(
    `/notices/${noticeId}`
  ); // SingleResponseDto
  return response.data.data;
};

/**
 * 공지/이벤트 목록 조회 (GET /notices)
 * @param params 조회 파라미터 (type, status, keyword, page, size, sort)
 * @returns 공지/이벤트 목록 및 페이지 정보
 */
export const getNotices = async (params: {
  type?: NoticeTypeBack;
  status?: NoticeStatusBack;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
  importance?: number;
}): Promise<MultiResponse<NoticeResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<NoticeResponseDto>>(
    "/notices",
    { params }
  );
  return response.data;
};

/**
 * 공지/이벤트 삭제 (DELETE /notices/{noticeId})
 * @param noticeId 삭제할 공지/이벤트 ID
 */
export const deleteNotice = async (noticeId: number): Promise<void> => {
  await axiosInstance.delete(`/notices/${noticeId}`);
};

