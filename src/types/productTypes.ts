export interface Product {
  productId: number;
  productName: string;
  productImage: string; // URL
  price: number;
  quantity: number; // 예: 다이스 개수
  createdAt: string;
  modifiedAt: string;
}