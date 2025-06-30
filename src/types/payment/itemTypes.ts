export interface ItemResponseDto {
  itemId: number; 
  itemName: string;
  description: string;
  itemImage: string | null; // 이미지 URL, 없을 경우 null
  dicePrice: number;
  createdAt: string; 
  modifiedAt: string;
}

/**
 * 새로운 아이템 생성
 * 백엔드의 ItemDto.Post 와 매칭
 */
export interface ItemPostDto {
  itemName: string;
  description: string;
  dicePrice: number;
}

/**
 * 아이템 수정
 * 백엔드의 ItemDto.Patch 와 매칭
 * imageFile은 API 함수에서 별도로 처리
 */
export interface ItemPatchDto {
  itemName?: string;
  description?: string;
  dicePrice?: number;
}

export type Item = ItemResponseDto;