// import type { RoomStatus as ChatRoomStatusEnum, RoomType as ChatRoomTypeEnum } from '../types/chatroom/chatRoomTypes';

// export const THEME_ID_TO_CONCEPT_DETAILS = {
//   1: { key: 'DICE_FRIENDS', label: '다이스 프렌즈' },
//   2: { key: 'HEART_SIGNAL', label: '하트시그널' },
//   // 필요에 따라 다른 테마 ID와 컨셉 정보를 추가합니다.
// } as const;

// export type ConceptThemeId = keyof typeof THEME_ID_TO_CONCEPT_DETAILS;

// /**
//  * themeId를 기반으로 채팅방 컨셉 레이블을 반환합니다.
//  * @param themeId - 채팅방의 테마 ID
//  * @returns 컨셉 레이블 문자열
//  */
// export function getChatRoomConceptLabel(themeId: number | null | undefined): string {
//   if (themeId === null || themeId === undefined) {
//     return '일반'; // 예: 1:1 채팅방 또는 특정 컨셉이 없는 방
//   }
//   const details = THEME_ID_TO_CONCEPT_DETAILS[themeId as ConceptThemeId];
//   return details ? details.label : `테마 ID: ${themeId}`;
// }

// export const getChatRoomTypeLabel = (type: ChatRoomTypeEnum): string => {
//  switch (type) {
//     case 'GROUP': return '그룹채팅';
//     case 'COUPLE': return '1:1 채팅';
//     default:
//       {
//       const exhaustiveCheck: never = type;
//       return `알 수 없는 타입: ${exhaustiveCheck}`;
//       }
//   }
// };


// export const getChatRoomStatusLabel = (status: ChatRoomStatusEnum): string => {

//   switch (status) {
//     case 'ROOM_ACTIVE': return '활성화';
//     case 'ROOM_DEACTIVE': return '비활성화';
//     default:
//       {
//       const exhaustiveCheck: never = status;
//       return `알 수 없는 상태: ${exhaustiveCheck}`;
//       }
//   }
// };

// export const getChatRoomStatusBadgeStyle = (status: ChatRoomStatusEnum): string => {
//   switch (status) {
//     case 'ROOM_ACTIVE': return 'bg-green-100 text-green-800';
//     case 'ROOM_DEACTIVE': return 'bg-red-100 text-red-800';
//     default: 
//       {
//       const exhaustiveCheck: never = status;
//       return `bg-gray-100 text-gray-600: ${exhaustiveCheck}`;
//       }
//   }
// };   

// export const formatDateTime = (isoString?: string): string => {
//   if (!isoString) return '-';
//   try {
//     const date = new Date(isoString);
//     if (isNaN(date.getTime())) return 'Invalid Date';
//     return date.toLocaleString('ko-KR', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   } catch {
//     return 'Invalid Date';
//   }
// };

// export const calculateTimeRemaining = (endsAt?: string, status?: RoomStatus): string => {
//   if (!endsAt || status === RoomStatus.ENDED || status === RoomStatus.FORCE_CLOSED_BY_ADMIN) {
//     return getChatRoomStatusLabel(status || RoomStatus.ENDED);
//   }
  
//   const now = new Date();
//   const endDate = new Date(endsAt);
//   const diffMs = endDate.getTime() - now.getTime();

//   if (diffMs <= 0) return getChatRoomStatusLabel(RoomStatus.ENDED);

//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

//   let remainingStr = '';
//   if (diffHours > 0) {
//     remainingStr += `${diffHours}시간 `;
//   }
//   remainingStr += `${diffMinutes}분 남음`;
  
//   return remainingStr;
// };

// // ChatRoomFilterSection에서 사용할 컨셉 필터 옵션
// export const chatRoomConceptFilterOptionsForDropdown = [
//   { value: 'ALL', label: '전체 컨셉' },
//   ...Object.entries(THEME_ID_TO_CONCEPT_DETAILS).map(([themeId, details]) => ({
//     value: themeId, // 필터 값으로 themeId (문자열) 사용
//     label: details.label,
//   })),
//   // 필요하다면 '컨셉 없음'에 대한 필터 옵션 추가
//   // { value: 'NONE', label: '일반 (컨셉 없음)' },
// ];
// export const getParticipantDisplay = (participants: ChatRoomParticipant[] /*, concept: ChatRoomConcept | null, roomType: ChatRoomType, maxParticipants: number */): string => {
//   const currentCount = participants.length;
//   return currentCount.toString();
//   // if (roomType === ChatRoomType.GROUP && concept === ChatRoomConcept.HEART_SIGNAL) {
//   //   const maleCount = participants.filter(p => p.gender === 'MALE').length;
//   //   const femaleCount = participants.filter(p => p.gender === 'FEMALE').length;
//   //   // Assuming Heart Signal aims for 3 males, 3 females
//   //   return `남 ${maleCount}/${maxParticipants/2}, 여 ${femaleCount}/${maxParticipants/2} (총 ${currentCount}/${maxParticipants})`;
//   // }
//   // if (roomType === ChatRoomType.COUPLE) {
//   //   // 1:1 채팅방의 경우 성별 표시가 필요하다면 여기서 추가 가능
//   //   return `${currentCount}/${maxParticipants} (1:1)`;
//   // }
//   // return `${currentCount}/${maxParticipants}`;
// };
