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

// /**
//  * 공지/이벤트 생성 (POST /notices)
//  * @param noticePostDtoString JSON 문자열 형태의 NoticePostDtoP
//  * @param imageFiles 이미지 파일 목록 (optional)
//  * @param thumbnailFlagsStr 썸네일 플래그 문자열 목록 (optional)
//  * @returns 생성된 공지/이벤트의 ID (Location 헤더에서 추출)
//  */
// export const createNotice = async (
//   noticePostDtoString: string,
//   imageFiles?: File[],
//   thumbnailFlagsStr?: string[]
// ): Promise<string | null> => {
//   const formData = new FormData();
//   formData.append("noticePostDto", noticePostDtoString);

//   if (imageFiles) {
//     imageFiles.forEach((file) => formData.append("images", file));
//   }
//   if (thumbnailFlagsStr) {
//     thumbnailFlagsStr.forEach((flag) => formData.append("thumbnailFlags", flag));
//   }

//   const response = await axiosInstance.post<void>("/notices", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   const locationHeader = response.headers.location || response.headers['Location']; // Axios는 헤더 키를 소문자로 정규화하지만, 대문자도 확인
//   console.log("[API] Location Header from server:", locationHeader); // 실제 헤더 값 로깅
//   if (locationHeader) {
//     const parts = locationHeader.split('/');
//     return parts[parts.length -1];
//   }
//   console.error("Location header is missing in createNotice response."); // 이 메시지가 현재 발생 중
//   return null;
// };

// /**
//  * 공지/이벤트 수정 (PATCH /notices/{noticeId})
//  * @param noticeId 수정할 공지/이벤트 ID
//  * @param noticePatchDtoString JSON 문자열 형태의 NoticePatchDtoP
//  * @param imageFiles 이미지 파일 목록 (optional)
//  * @param thumbnailFlags 썸네일 플래그 목록 (optional)
//  * @returns 수정된 공지/이벤트 정보
//  */
// export const updateNotice = async (
//   noticeId: number,
//   noticePatchDtoString: string,
//   imageFiles?: File[],
//   thumbnailFlags?: boolean[]
// ): Promise<NoticeResponseDto> => {
//   const formData = new FormData();
//   formData.append("noticePatchDto", noticePatchDtoString);

//   if (imageFiles) {
//     imageFiles.forEach((file) => formData.append("images", file));
//   }
//   if (thumbnailFlags) {
//     thumbnailFlags.forEach((flag) => formData.append("thumbnailFlags", flag.toString()));
//   }

//   const response = await axiosInstance.patch<{ data: NoticeResponseDto }>( // 백엔드가 SingleResponseDto로 감싸서 반환
//     `/notices/${noticeId}`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
//   return response.data.data; // SingleResponseDto의 data 필드 접근
// };

/**
 * 공지/이벤트 상세 조회 (GET /notices/{noticeId})
 * @param noticeId 조회할 공지/이벤트 ID
 * @returns 공지/이벤트 상세 정보
 */
export const getNoticeDetail = async (noticeId: number): Promise<NoticeResponseDto> => {
  const response = await axiosInstance.get<{ data: NoticeResponseDto }>(`/notices/${noticeId}`); // SingleResponseDto
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
  importance?: number
}): Promise<MultiResponse<NoticeResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<NoticeResponseDto>>("/notices", { params });
  return response.data;
};

/**
 * 공지/이벤트 삭제 (DELETE /notices/{noticeId})
 * @param noticeId 삭제할 공지/이벤트 ID
 */
export const deleteNotice = async (noticeId: number): Promise<void> => {
  await axiosInstance.delete(`/notices/${noticeId}`);
};

export const createNotice2 = (data: NoticePostDto, images?: File[], thumbnailFlags?: boolean[]) => {
  const formData = new FormData();
  formData.append("noticePostDto", JSON.stringify(data));
  if (images && thumbnailFlags) {
    images.forEach((file:File) => formData.append("images", file));
    thumbnailFlags.forEach((flag:boolean) => formData.append("thumbnailFlags", String(flag)));
  }
  return axiosInstance.post('notices', formData,);
  
};


export const createNotice = async (
  noticeDto: NoticePostDto,
  imageFiles?: File[] | null,
  thumbnailFlags?: boolean[] | null 
): Promise<string | null> => {
  const formData = new FormData();

  // 1. DTO 파트: 백엔드는 "noticePostDto" 이름으로 JSON 문자열을 기대
  formData.append('noticePostDto', new Blob([JSON.stringify(noticeDto)], { type: 'application/json' }));

  // 2. 이미지 파일 파트: 백엔드는 "images" 이름으로 각 파일을 기대
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }

  // 3. 썸네일 플래그 파트: 백엔드는 "thumbnailFlags" 이름으로 각 플래그 문자열을 기대
  if (thumbnailFlags && thumbnailFlags.length > 0) {
    thumbnailFlags.forEach((flag) => {
      formData.append('thumbnailFlags', String(flag)); // boolean을 string으로 변환
    });
  }

  const response = await axiosInstance.post('/notices', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  // 백엔드가 Location 헤더에 생성된 리소스의 URI를 반환한다고 가정
  return response.headers.location || null;
};

// updateNotice 함수도 유사하게 파트 이름을 백엔드 명세에 맞춰야 합니다.
export const updateNotice = async (
  noticeId: number,
  noticeDto: NoticePatchDto,
  imageFiles?: File[] | null,
  thumbnailFlags?: boolean[] | null
): Promise<NoticeResponseDto> => {
  const formData = new FormData();

  // 백엔드 PATCH API의 @RequestPart 이름을 확인하여 "noticePatchDto"로 수정
  formData.append('noticePatchDto', new Blob([JSON.stringify(noticeDto)], { type: 'application/json' }));

  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }

  // 백엔드 PATCH API의 @RequestPart 이름을 확인하여 "thumbnailFlags"로 수정
  // 백엔드가 List<Boolean>을 받으므로, 문자열로 보내도 Spring이 변환해줄 가능성이 높음
  if (thumbnailFlags && thumbnailFlags.length > 0) {
    thumbnailFlags.forEach((flag) => { // updateNotice의 thumbnailFlags는 boolean[] 타입
      formData.append('thumbnailFlags', String(flag)); // boolean을 string으로 변환
    }); 
  }

  const response = await axiosInstance.patch<NoticeResponseDto>(`/notices/${noticeId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ... 기타 API 함수들 ...
