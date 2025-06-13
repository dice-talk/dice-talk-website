// src/api/productApi.ts
import { axiosInstance } from "./axiosInstance";
import type { ProductResponseDto } from "../types/productTypes";
import type { MultiResponse } from "../types/common";

/**
 * 새로운 상품 등록
 * @param productPostDtoString 상품 생성 DTO의 JSON 문자열
 * @param imageFile 상품 이미지 파일 (선택 사항)
 * @returns 생성된 상품의 ID를 포함한 URI (Location 헤더에 있음)
 */
export const createProduct = async (
    productPostDtoString: string, 
    imageFile?: File | null): Promise<string | null> => {
  const formData = new FormData();
  formData.append("productPostDto", productPostDtoString);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axiosInstance.post<void>("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.status === 201 && response.headers.location) {
    const locationParts = response.headers.location.split('/');
    return locationParts[locationParts.length - 1];
  }
  return null;
};

export const updateProduct = async (
    productId: number, 
    productPatchDtoString: string, 
    imageFile?: File | null): Promise<ProductResponseDto> => {
  const formData = new FormData();
  formData.append("productPatchDto", productPatchDtoString);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axiosInstance.patch<ProductResponseDto>(`/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * 전체 상품 목록 조회 (페이지네이션)
 * @param params 페이지, 크기 등 페이징 파라미터
 * @returns 상품 목록과 페이지 정보
 */
export const getProducts = async (params: { page: number; size: number }): Promise<MultiResponse<ProductResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<ProductResponseDto>>("/products/", { params });
  return response.data;
};

/**
 * 특정 ID의 상품 상세 조회
 * @param productId 조회할 상품 ID
 * @returns 특정 상품 정보
 */
export const getProductDetail = async (productId: number): Promise<ProductResponseDto> => {
  const response = await axiosInstance.get<ProductResponseDto>(`/products/${productId}`);
  return response.data;
};

/**
 * 특정 ID의 상품 삭제
 * @param productId 삭제할 상품 ID
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  await axiosInstance.delete(`/products/${productId}`);
};