export const EventIdValues = {
  HEART_MESSAGE: 'HEART_MESSAGE',
  CUPIDS_ARROW: 'CUPIDS_ARROW',
} as const;
export type EventId = typeof EventIdValues[keyof typeof EventIdValues];

export interface EventItem {
  id: EventId;
  name: string; // 이벤트 제목 (예: "하트 메시지")
  description: string; // 이벤트 설명
  activationTimeHours: number; // 채팅방 참여 후 활성화까지 걸리는 시간 (시간 단위)
  durationHours?: number; // 이벤트 지속 시간 (시간 단위, 예: 큐피트 화살)
  isModificationPaid?: boolean; // 수정 유료 여부 (예: 큐피트 화살)
  paidModificationDetails?: string; // 유료 수정 관련 설명 (예: "다이스 10개 필요")
  isActive: boolean; // 이벤트 전체 활성화 여부
}
