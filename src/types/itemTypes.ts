// src/types/itemTypes.ts

/**
 * 아이템 정보 응답 DTO
 * 백엔드의 ItemDto.Response 와 매칭됩니다.
 */
export interface ItemResponseDto {
  itemId: number; // long 타입이지만 TypeScript에서는 number로 처리
  itemName: string;
  description: string;
  itemImage: string | null; // 이미지 URL, 없을 경우 null
  dicePrice: number;
  createdAt: string; // LocalDateTime -> string (ISO 8601 형식)
  modifiedAt: string; // LocalDateTime -> string (ISO 8601 형식)
}

/**
 * 새로운 아이템 생성을 위한 DTO
 * 백엔드의 ItemDto.Post 와 매칭됩니다.
 * imageFile은 API 함수에서 별도로 처리합니다.
 */
export interface ItemPostDto {
  itemName: string;
  description: string;
  dicePrice: number;
}

/**
 * 아이템 수정을 위한 DTO
 * 백엔드의 ItemDto.Patch 와 매칭됩니다.
 * itemId는 경로 변수로 사용되므로 DTO에는 선택 사항으로 포함하거나 제외할 수 있습니다.
 * imageFile은 API 함수에서 별도로 처리합니다.
 */
export interface ItemPatchDto {
  itemName?: string;
  description?: string;
  dicePrice?: number;
}

// UI에서 사용할 아이템 아이템 타입 (ItemResponseDto를 기반으로 확장 가능)
export type Item = ItemResponseDto;