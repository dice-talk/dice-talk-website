// src/components/product/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { type Product } from '../../types/productTypes';
import Button from '../ui/Button';
import { Input } from '../ui/Input'; // Input 컴포넌트가 있다고 가정

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (productData: Omit<Product, 'productId' | 'createdAt' | 'modifiedAt'> | Product) => void;
  onCancel: () => void;
  isEditMode: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditMode,
}) => {
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName);
      setProductImage(initialData.productImage);
      setPrice(initialData.price);
      setQuantity(initialData.quantity);
    } else {
      // Reset form for new product
      setProductName('');
      setProductImage('');
      setPrice('');
      setQuantity('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price === '' || quantity === '') {
      alert('가격과 수량을 입력해주세요.');
      return;
    }
    const productData = {
      productName,
      productImage,
      price: Number(price),
      quantity: Number(quantity),
    };

    if (isEditMode && initialData) {
      onSubmit({ ...initialData, ...productData });
    } else {
      onSubmit(productData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">상품명</label>
        <Input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">상품 이미지 URL</label>
        <Input id="productImage" type="url" value={productImage} onChange={(e) => setProductImage(e.target.value)} placeholder="https://example.com/image.png" />
        {productImage && <img src={productImage} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />}
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">가격 (₩)</label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required min="0" />
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">수량 (예: 다이스 개수)</label>
        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required min="1" />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="default">
          {isEditMode ? '수정 완료' : '상품 등록'}
        </Button>
      </div>
    </form>
  );
};

// Input 컴포넌트가 없다면 임시로 아래와 같이 정의할 수 있습니다.
// 실제 프로젝트에서는 src/components/ui/Input.tsx 와 같은 파일에 있어야 합니다.
/*
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
*/