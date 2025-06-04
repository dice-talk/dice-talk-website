// src/components/product/ProductModal.tsx
import React from 'react';
import { type Product } from '../../types/productTypes';
import { ProductForm } from './ProductForm'; // ProductForm 경로 수정 (동일 디렉토리 가정)
import Modal from '../ui/Modal'; // 새로 만든 Modal 컴포넌트 import

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'productId' | 'createdAt' | 'modifiedAt'> | Product) => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
}) => {
  if (!isOpen) return null;

  const isEditMode = !!productToEdit;
  const modalTitle = isEditMode ? '상품 수정' : '새 상품 등록';

  const handleSubmit = (data: Omit<Product, 'productId' | 'createdAt' | 'modifiedAt'> | Product) => {
    onSubmit(data);
    onClose(); // 성공적으로 제출 후 모달 닫기
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