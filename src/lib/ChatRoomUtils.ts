import {
    RoomStatus as ChatRoomStatusEnum,
    type RoomType as ChatRoomTypeEnum,
    type ChatRoomParticipant, 
} from '../types/chatroom/chatRoomTypes';

export const THEME_NAME_TO_LABEL_DETAILS = {
  "다이스 프렌즈": { label: "다이스 프렌즈" }, 
  "하트 시그널": { label: "하트 시그널" }, 
};
export type ConceptThemeId = keyof typeof THEME_NAME_TO_LABEL_DETAILS;


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
];
export const getParticipantDisplay = (participants: ChatRoomParticipant[]): string => {
  const currentCount = participants.length;
  return currentCount.toString();
};
