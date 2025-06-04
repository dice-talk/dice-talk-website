import { ChatRoomConcept, ChatRoomStatus, ChatRoomType, type ChatRoomParticipant } from '../types/chatRoomTypes';

export const getChatRoomConceptLabel = (concept: ChatRoomConcept | null): string => {
  if (!concept) return '해당 없음'; // 1:1 채팅방 또는 컨셉 없는 방
  switch (concept) {
    case ChatRoomConcept.DICE_FRIENDS: return '다이스 프렌즈';
    case ChatRoomConcept.HEART_SIGNAL: return '하트시그널';
    default: return concept || '알 수 없음';
  }
};

export const getChatRoomTypeLabel = (roomType: ChatRoomType): string => {
  switch (roomType) {
    case ChatRoomType.GROUP: return '단체 채팅방';
    case ChatRoomType.COUPLE: return '1:1 채팅방';
    default: return roomType || '알 수 없음';
  }
}

export const getChatRoomStatusLabel = (status: ChatRoomStatus): string => {
  switch (status) {
    case ChatRoomStatus.WAITING_FOR_MEMBERS: return '인원 모집 중';
    case ChatRoomStatus.ACTIVE: return '진행 중';
    case ChatRoomStatus.CLOSING_SOON: return '종료 임박';
    case ChatRoomStatus.ENDED: return '종료됨';
    case ChatRoomStatus.FORCE_CLOSED_BY_ADMIN: return '강제 종료됨';
    default: return status || '알 수 없음';
  }
};

export const getChatRoomStatusBadgeStyle = (status: ChatRoomStatus): string => {
  switch (status) {
    case ChatRoomStatus.WAITING_FOR_MEMBERS: return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
    case ChatRoomStatus.ACTIVE: return 'bg-green-100 text-green-700 border border-green-300';
    case ChatRoomStatus.CLOSING_SOON: return 'bg-orange-100 text-orange-700 border border-orange-300';
    case ChatRoomStatus.ENDED: return 'bg-gray-100 text-gray-700 border border-gray-300';
    case ChatRoomStatus.FORCE_CLOSED_BY_ADMIN: return 'bg-red-100 text-red-700 border border-red-300';
    default: return 'bg-gray-100 text-gray-500 border border-gray-300';
  }
};

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

export const calculateTimeRemaining = (endsAt?: string, status?: ChatRoomStatus): string => {
  if (!endsAt || status === ChatRoomStatus.ENDED || status === ChatRoomStatus.FORCE_CLOSED_BY_ADMIN) {
    return getChatRoomStatusLabel(status || ChatRoomStatus.ENDED);
  }
  
  const now = new Date();
  const endDate = new Date(endsAt);
  const diffMs = endDate.getTime() - now.getTime();

  if (diffMs <= 0) return getChatRoomStatusLabel(ChatRoomStatus.ENDED);

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let remainingStr = '';
  if (diffHours > 0) {
    remainingStr += `${diffHours}시간 `;
  }
  remainingStr += `${diffMinutes}분 남음`;
  
  return remainingStr;
};

export const getParticipantDisplay = (participants: ChatRoomParticipant[] /*, concept: ChatRoomConcept | null, roomType: ChatRoomType, maxParticipants: number */): string => {
  const currentCount = participants.length;
  return currentCount.toString();
  // if (roomType === ChatRoomType.GROUP && concept === ChatRoomConcept.HEART_SIGNAL) {
  //   const maleCount = participants.filter(p => p.gender === 'MALE').length;
  //   const femaleCount = participants.filter(p => p.gender === 'FEMALE').length;
  //   // Assuming Heart Signal aims for 3 males, 3 females
  //   return `남 ${maleCount}/${maxParticipants/2}, 여 ${femaleCount}/${maxParticipants/2} (총 ${currentCount}/${maxParticipants})`;
  // }
  // if (roomType === ChatRoomType.COUPLE) {
  //   // 1:1 채팅방의 경우 성별 표시가 필요하다면 여기서 추가 가능
  //   return `${currentCount}/${maxParticipants} (1:1)`;
  // }
  // return `${currentCount}/${maxParticipants}`;
};
