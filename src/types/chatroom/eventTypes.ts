/**
 * 이벤트 상태 (백엔드와 동일)
 * - EVENT_OPEN: 활성화
 * - EVENT_CLOSE: 비활성화
 */
export type EventStatus = "EVENT_OPEN" | "EVENT_CLOSE";

export interface EventResponseDto {
  eventId: number;
  eventName: string;
  eventStatus: EventStatus;
  themeId: number;
}
export interface EventPostDto {
  eventName: string;
  themeId: number;
}

export interface EventPatchDto {
  eventId?: number; // 경로 변수로도 사용되지만, DTO에 포함될 수 있음
  eventName?: string;
  eventStatus?: EventStatus;
  themeId?: number;
}

// UI에서 사용할 이벤트 아이템 타입 (EventResponseDto를 기반으로 확장 가능)
export type EventItem = EventResponseDto & {
  // UI에 필요한 추가적인 필드가 있다면 여기에 정의할 수 있습니다.
  // 예를 들어, themeName을 별도로 관리하고 싶다면 추가할 수 있습니다.
  // themeName?: string; 
};