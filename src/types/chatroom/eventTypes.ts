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
  eventId?: number; 
  eventName?: string;
  eventStatus?: EventStatus;
  themeId?: number;
}

export type EventItem = EventResponseDto;
