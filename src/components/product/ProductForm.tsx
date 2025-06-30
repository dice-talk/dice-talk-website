import React, { useState, useEffect, useRef } from 'react';
import {
 type ProductResponseDto,
 type ProductPostDto,
 type ProductPatchDto,
} from '../../types/payment/productTypes';
import Button from '../ui/Button';
import { Input } from '../ui/Input'; 

interface ProductFormProps {
  initialData?: ProductResponseDto | null;
  onSubmit: (
    dto: ProductPostDto | ProductPatchDto,
    imageFile?: File | null
  ) => void;
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
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName);
      setPrice(initialData.price.toString()); // 숫자를 문자열로 변환
      setQuantity(initialData.quantity.toString()); // 숫자를 문자열로 변환
      setImagePreview(initialData.productImage || null);
      setImageFile(null); // 수정 모드 시작 시 파일 입력은 리셋
      if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 필드 초기화
    } else {
      setProductName('');
      setPrice(''); // 초기값 빈 문자열
      setQuantity(''); // 초기값 빈 문자열
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentPriceStr = price.trim();
    const currentQuantityStr = quantity.trim();

    if (currentPriceStr === '' || currentQuantityStr === '') {
      alert('가격과 수량을 입력해주세요.');
      return;
    }

    const numericPrice = Number(currentPriceStr);
    const numericQuantity = Number(currentQuantityStr);

    if (isNaN(numericPrice)) {
      alert('유효한 가격 형식이 아닙니다.');
      return;
    }
    if (isNaN(numericQuantity)) {
      alert('유효한 수량 형식이 아닙니다.');
      return;
    }

    if (numericPrice < 0) {
      alert('가격은 0 이상이어야 합니다.');
      return;
    }
    if (numericQuantity < 1) {
      alert('수량은 1 이상이어야 합니다.');
      return;
    }

    if (isEditMode && initialData) {
      // 상품명은 비워둘 수 없습니다.
      if (productName.trim() === '') {
        alert('상품명은 비워둘 수 없습니다.');
        return;
      }

      // 사용자가 입력한 값이 있으면 해당 값을, 없으면 초기값을 사용
      // 가격/수량은 비워진 경우 0으로 처리
      const patchDto: ProductPatchDto = {
        productName: productName,
        price: numericPrice, 
        quantity: numericQuantity, 
      };

      // 실제 변경이 있었는지 확인
      const hasChanges =
        productName !== initialData.productName ||
        numericPrice !== initialData.price ||
        numericQuantity !== initialData.quantity ||
        !!imageFile;

      if (hasChanges) {
        onSubmit(patchDto, imageFile);
      } else {
        alert("변경된 내용이 없습니다.");
        return;
      }
    } else {
      const postDto: ProductPostDto = {
        productName,
        price: numericPrice,
        quantity: numericQuantity,
      };
      onSubmit(postDto, imageFile); // imageFile도 함께 전달
    }
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
     
      setImagePreview(initialData?.productImage || null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">상품명</label>
        <Input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
      </div>
      <div>
       <label htmlFor="productImageFile" className="block text-sm font-medium text-gray-700">상품 이미지</label>
        <Input
          id="productImageFile"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        {imagePreview && <img src={imagePreview} alt={productName || "상품 이미지 미리보기"} className="mt-2 h-20 w-20 object-cover rounded" />}
       </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">가격 (₩)</label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">수량 (예: 다이스 개수)</label>
        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />
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