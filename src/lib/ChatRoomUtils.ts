import {
    RoomStatus as ChatRoomStatusEnum,
    type RoomType as ChatRoomTypeEnum,
    type ChatRoomParticipant, // ChatRoomManagementPage에서 사용하던 타입
} from '../types/chatroom/chatRoomTypes';

// export const THEME_ID_TO_CONCEPT_DETAILS = {
//   1: { key: 'DICE_FRIENDS', label: '다이스 프렌즈' },
//   2: { key: 'HEART_SIGNAL', label: '하트시그널' },
//   // 필요에 따라 다른 테마 ID와 컨셉 정보를 추가합니다.
// } as const;

// export type ConceptThemeId = keyof typeof THEME_ID_TO_CONCEPT_DETAILS;
export const THEME_NAME_TO_LABEL_DETAILS = {
  "다이스 프렌즈": { label: "다이스 프렌즈" }, // value와 label이 같을 수도 있고, 다를 수도 있습니다.
  "하트시그널": { label: "하트시그널" },
};
 export type ConceptThemeId = keyof typeof THEME_NAME_TO_LABEL_DETAILS;

/**
 * themeId를 기반으로 채팅방 컨셉 레이블을 반환합니다.
 * @param themeId - 채팅방의 테마 ID
 * @returns 컨셉 레이블 문자열
 */
// export function getChatRoomThemeLabel(themeId: number | null | undefined): string {
//   if (themeId === null || themeId === undefined) {
//     return '일반'; // 예: 1:1 채팅방 또는 특정 컨셉이 없는 방
//   }
//   const details = THEME_NAME_TO_LABEL_DETAILS[theas ConceptThemeName];
//   return details ? details.label : `테마 ID: ${themeId}`;
// }

export const getChatRoomTypeLabel = (type: ChatRoomTypeEnum): string => {
 switch (type) {
    case 'GROUP': return '그룹채팅';
    case 'COUPLE': return '1:1 채팅';
    default:
      {
      const exhaustiveCheck: never = type;
      return `알 수 없는 타입: ${exhaustiveCheck}`;
      }
  }
};


export const getChatRoomStatusLabel = (status: ChatRoomStatusEnum): string => {

  switch (status) {
    case 'ROOM_ACTIVE': return '활성화';
    case 'ROOM_DEACTIVE': return '비활성화';
    default:
      {
      const exhaustiveCheck: never = status;
      return `알 수 없는 상태: ${exhaustiveCheck}`;
      }
  }
};

export const getChatRoomStatusBadgeStyle = (status: ChatRoomStatusEnum): string => {
  switch (status) {
    case 'ROOM_ACTIVE': return 'bg-green-100 text-green-800';
    case 'ROOM_DEACTIVE': return 'bg-red-100 text-red-800';
    default:
      return `bg-gray-100 text-gray-600`;
  }
};


export const calculateTimeRemaining = (endsAt?: string, status?: ChatRoomStatusEnum): string => {
  if (!endsAt || status === ChatRoomStatusEnum.ROOM_DEACTIVE) { // ROOM_DEACTIVE를 종료 상태로 간주
    return getChatRoomStatusLabel(status || ChatRoomStatusEnum.ROOM_DEACTIVE);
  }
  
  const now = new Date();
  const endDate = new Date(endsAt);
  const diffMs = endDate.getTime() - now.getTime();

  if (diffMs <= 0) return getChatRoomStatusLabel(ChatRoomStatusEnum.ROOM_DEACTIVE);

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let remainingStr = '';
  if (diffHours > 0) {
    remainingStr += `${diffHours}시간 `;
  }
  remainingStr += `${diffMinutes}분 남음`;
  
  return remainingStr;
};

// ChatRoomFilterSection에서 사용할 컨셉 필터 옵션
export const chatRoomThemeFilterOptionsForDropdown = [
  { value: 'ALL', label: '전체 테마' },
  ...Object.entries(THEME_NAME_TO_LABEL_DETAILS).map(([themeName, details]) => ({
    value: themeName,
    label: details.label,
  })),
  // 필요하다면 '컨셉 없음'에 대한 필터 옵션 추가
  // { value: 'NONE', label: '일반 (컨셉 없음)' },
];
export const getParticipantDisplay = (participants: ChatRoomParticipant[]): string => {
  const currentCount = participants.length;
  return currentCount.toString();
};
