
export type EventStatusType = 'EVENT_OPEN' | 'EVENT_CLOSE' | string; // string은 알 수 없는 상태를 위함

export const mapBackendStatusToFrontendLabel = (status: EventStatusType): string => {
 switch (status) {
    case 'EVENT_OPEN':
      return '진행중'; // 또는 '이벤트 오픈' 등
    case 'EVENT_CLOSE':
      return '종료'; // 또는 '이벤트 종료' 등
    default:
      return `알 수 없음 (${status})`; // 알 수 없는 상태 처리
  }
};

export const getEventStatusBadgeStyle = (status: EventStatusType): string => {
  switch (status) {
    case 'EVENT_OPEN': return 'bg-green-100 text-green-700 border border-green-300';
    case 'EVENT_CLOSE': return 'bg-gray-100 text-gray-700 border border-gray-300';
    default: return 'bg-yellow-100 text-yellow-700 border border-yellow-300'; // 예: 알 수 없는 상태
  }
};
