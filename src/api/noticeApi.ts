// // src/api/noticeApi.ts
// import axiosInstance from './axiosInstance';
// // BackendNoticeResponseDto 타입을 공유 위치로 옮기는 것이 좋지만, 여기서는 NoticeDetail에서 가져옵니다.
// // import type BackendNoticeResponseDto from '../pages/notice/NoticeDetail';

// /**
//  * 새 공지/이벤트 생성 (POST /notices)
//  * @param requestFormData FormData (noticePostDto: string, images?: File[])
//  * @returns 생성된 공지/이벤트 ID 또는 null
//  */
// export const createNotice = async (requestFormData: FormData): Promise<string | null> => {
//   const response = await axiosInstance.post<void>('/notices', requestFormData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   const locationHeader = response.headers.location;
//   if (locationHeader) {
//     return locationHeader.substring(locationHeader.lastIndexOf('/') + 1);
//   }
//   console.error("Location header is missing in createNotice response.");
//   return null;
// };

// /**
//  * 공지/이벤트 상세 정보 조회 (GET /notices/{noticeId})
//  * @param noticeId 조회할 공지/이벤트 ID
//  * @returns 공지/이벤트 상세 정보
//  */
// export const fetchNoticeDetail = async (noticeId: number): Promise<BackendNoticeResponseDto> => {
//   const response = await axiosInstance.get<BackendNoticeResponseDto>(`/notices/${noticeId}`);
//   return response.data;
// };

// /**
//  * 공지/이벤트 수정 (PUT /notices/{noticeId})
//  * @param noticeId 수정할 공지/이벤트 ID
//  * @param requestFormData FormData (noticePutDto: string, images?: File[], removedImageUrls?: string[])
//  */
// export const updateNotice = async (noticeId: number, requestFormData: FormData): Promise<void> => {
//   await axiosInstance.put(`/notices/${noticeId}`, requestFormData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

// /**
//  * 공지/이벤트 삭제 (DELETE /notices/{noticeId})
//  * @param noticeId 삭제할 공지/이벤트 ID
//  */
// export const deleteNotice = async (noticeId: number): Promise<void> => {
//   await axiosInstance.delete(`/notices/${noticeId}`);
// };
