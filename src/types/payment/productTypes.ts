export interface ProductResponseDto {
  productId: number;
  productName: string;
  productImage: string | null; // URL
  price: number;
  quantity: number; // 다이스 개수
  createdAt: string;
  modifiedAt: string;
}

export type NewProductData = Omit<ProductResponseDto, 'productId' | 'createdAt' | 'modifiedAt'>;

export type UpdateProductData = Omit<ProductResponseDto, 'createdAt' | 'modifiedAt'>;

export type ProductUpdatePayload = Omit<UpdateProductData, 'productId'>;

export interface ProductPostDto {
  productName: string;
  price: number;
  quantity: number;
  // imageFile은 API 함수에서 별도로 처리
}

export interface ProductPatchDto {
  productId?: number; // 경로 변수로도 사용되지만, DTO에 포함될 수 있음
  productName?: string;
  productImage?: string | null; // 이미지 URL 또는 null (제거 시)
  price?: number;
  quantity?: number;
  // imageFile은 API 함수에서 별도로 처리
}

export type ProductItem = ProductResponseDto;