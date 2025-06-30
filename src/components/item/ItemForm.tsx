// src/components/item/ItemForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  type ItemResponseDto,
  type ItemPostDto,
  type ItemPatchDto,
} from '../../types/payment/itemTypes';
import Button from '../ui/Button';
import { Input } from '../ui/Input';

interface ItemFormProps {
  initialData?: ItemResponseDto | null;
  onSubmit: (
    dto: ItemPostDto | ItemPatchDto,
    imageFile?: File | null
  ) => void;
  onCancel: () => void;
  isEditMode: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditMode,
}) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState(''); 
  const [diceCost, setDiceCost] = useState<string>(''); 
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setItemName(initialData.itemName);
      setDescription(initialData.description || ''); // description 사용
      setDiceCost(initialData.dicePrice.toString()); // dicePrice 사용, 숫자를 문자열로 변환
      setImagePreview(initialData.itemImage || null);
      setImageFile(null); // 수정 모드 시작 시 파일 입력 리셋
      if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 필드 초기화
    } else {
      // Reset form for new item
      setItemName('');
      setDescription('');
      setDiceCost('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 필드 초기화
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (diceCost === '' || Number(diceCost) < 0) {
      alert('다이스 소모량을 0 이상으로 입력해주세요.');
      return;
    }

    const numericDiceCost = Number(diceCost);

    if (isNaN(numericDiceCost)) {
      alert('유효한 다이스 소모량 형식이 아닙니다.');
      return;
    }

    if (numericDiceCost < 0) {
       alert('다이스 소모량은 0 이상이어야 합니다.');
       return;
    }

    if (isEditMode && initialData) {
      const trimmedItemName = itemName.trim();
      const trimmedDescription = description.trim();

      if (trimmedItemName === '') {
        alert('아이템명은 비워둘 수 없습니다.');
        return;
      }
      if (trimmedDescription === '') {
        alert('아이템 설명은 비워둘 수 없습니다.');
        return;
      }

      const patchDto: ItemPatchDto = {
        itemName: trimmedItemName, 
        description: trimmedDescription.replace(/\n/g, ' '), // 개행 문자를 공백으로 대체
        dicePrice: numericDiceCost, // dicePrice 사용
      };

      // 실제 변경이 있었는지 확인 (선택 사항: 변경 없으면 API 호출 안 함)
      const hasChanges =
        itemName !== initialData.itemName ||
        description !== initialData.description ||
        numericDiceCost !== initialData.dicePrice || // 이미 numericDiceCost로 비교 중
        !!imageFile;

      if (hasChanges) {
        onSubmit(patchDto, imageFile);
      } else {
        alert("변경된 내용이 없습니다.");
        return;
      }
    } else {
      // 새 아이템 등록 시에도 itemName과 description 유효성 검사 추가
      const trimmedItemName = itemName.trim();
      const trimmedDescription = description.trim();

      if (trimmedItemName === '') {
        alert('아이템명은 비워둘 수 없습니다.');
        return;
      }
      if (trimmedDescription === '') {
        alert('아이템 설명은 비워둘 수 없습니다.');
        return;
      }

      const postDto: ItemPostDto = {
        itemName: trimmedItemName,
        description: trimmedDescription,
        dicePrice: numericDiceCost,
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
      // 파일 선택 취소 시
      setImageFile(null);
      // 수정 모드이고 기존 이미지가 있었다면 기존 이미지 미리보기를 유지할 수 있음
      setImagePreview(initialData?.itemImage || null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">아이템명</label>
        <Input id="itemName" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">아이템 설명</label>
        <Input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="itemImageFile" className="block text-sm font-medium text-gray-700">아이템 이미지</label>
        <Input
          id="itemImageFile"
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
        {imagePreview && <img src={imagePreview} alt={itemName || "아이템 이미지 미리보기"} className="mt-2 h-20 w-20 object-cover rounded" />}
      </div>
      <div>
        <label htmlFor="diceCost" className="block text-sm font-medium text-gray-700">다이스 소모량</label>
        <Input id="diceCost" type="number" value={diceCost} onChange={(e) => setDiceCost(e.target.value)} required min="0" />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="default">
          {isEditMode ? '수정 완료' : '아이템 등록'}
        </Button>
      </div>
    </form>
  );
};