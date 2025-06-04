export interface Item {
  itemId: number;
  itemName: string;
  itemDescription?: string; // 아이템 설명 (선택)
  itemImage: string; // 아이템 이미지 URL 또는 로컬 경로
  diceCost: number; // 사용 시 소모되는 다이스 개수
  createdAt: string;
  modifiedAt: string;
}