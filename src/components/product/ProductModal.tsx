import React from 'react';
import {
 type ProductResponseDto,
 type ProductPostDto,
 type ProductPatchDto,
} from '../../types/payment/productTypes';
import { ProductForm } from './ProductForm'; 
import Modal from '../ui/Modal'; 
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
        const productPatchDtoString = JSON.stringify(dto as ProductPatchDto);
        await updateProduct(
          productToEdit.productId,
          productPatchDtoString,
          imageFile 
        );
        onProductSubmitted();
      } else {
        // ProductPostDto로 단언
        const productPostDtoString = JSON.stringify(dto as ProductPostDto);
        const newProductIdString = await createProduct(productPostDtoString, imageFile);
        if (newProductIdString) {
      
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