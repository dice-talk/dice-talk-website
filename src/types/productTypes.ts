export interface ProductResponseDto {
  productId: number;
  productName: string;
  productImage: string | null; // URL
  price: number;
  quantity: number; // 예: 다이스 개수
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
// ProductResponseDto는 Product 인터페이스와 동일하므로,
// UI에서 사용할 때는 Product 타입을 직접 사용하거나, 필요시 아래와 같이 별칭을 만들 수 있습니다.
// export type ProductResponseDto = Product;

// UI에서 사용할 상품 아이템 타입 (Product 인터페이스를 기반으로 확장 가능)
export type ProductItem = ProductResponseDto;