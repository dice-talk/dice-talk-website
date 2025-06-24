// src/components/product/ProductModal.tsx
import React from 'react';
import {
 type ProductResponseDto,
 type ProductPostDto,
 type ProductPatchDto,
} from '../../types/payment/productTypes';
import { ProductForm } from './ProductForm'; // ProductForm 경로 수정 (동일 디렉토리 가정)
import Modal from '../ui/Modal'; // 새로 만든 Modal 컴포넌트 import
import { createProduct, updateProduct } from '../../api/productApi';


interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSubmitted: () => void; // 성공 시 호출, 목록 새로고침 또는 업데이트용
  productToEdit?: ProductResponseDto | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onProductSubmitted,
  productToEdit,
}) => {
  if (!isOpen) return null;

  const isEditMode = !!productToEdit;
  const modalTitle = isEditMode ? '상품 수정' : '새 상품 등록';

   const handleSubmit = async (
    dto: ProductPostDto | ProductPatchDto,
    imageFile?: File | null
  ) => {
    try {
      if (isEditMode && productToEdit) {
        // ProductPatchDto로 단언. 비어있는 DTO일 수도 있음 (이미지만 변경 시)
        const productPatchDtoString = JSON.stringify(dto as ProductPatchDto);
        await updateProduct(
          productToEdit.productId,
          productPatchDtoString,
          imageFile // imageFile이 null이면 API에서 기존 이미지 유지 또는 제거 (API 명세에 따름)
        );
        onProductSubmitted(); // updatedProduct를 전달하지 않음
      } else {
        // ProductPostDto로 단언
        const productPostDtoString = JSON.stringify(dto as ProductPostDto);
        const newProductIdString = await createProduct(productPostDtoString, imageFile);
        if (newProductIdString) {
          // 생성 성공 시, 상세 정보를 다시 가져오거나 목록을 새로고침.
          // 여기서는 onProductSubmitted를 호출하여 ProductList에서 처리하도록 함.
          // 필요하다면 getProductDetail(Number(newProductIdString)) 호출 후 onProductSubmitted(newProductDetail)
          onProductSubmitted(); 
        } else {
          throw new Error('상품 생성 후 ID를 받지 못했습니다.');
        }
      }
      onClose(); // 성공 시 모달 닫기
    } catch (error) {
      console.error("상품 처리 중 오류 발생:", error);
      alert(`오류: ${error instanceof Error ? error.message : String(error)}`);
      // 실패 시 모달을 닫지 않음
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <ProductForm
        initialData={productToEdit}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isEditMode={isEditMode}
      />
    </Modal>
  );
};