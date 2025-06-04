// src/components/item/ItemForm.tsx
import React, { useState, useEffect } from 'react';
import { type Item } from '../../types/itemTypes';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import defaultItemImage from '../../assets/product.png'; // 상품 이미지 재활용 또는 새 아이템 기본 이미지

interface ItemFormProps {
  initialData?: Item | null;
  onSubmit: (itemData: Omit<Item, 'itemId' | 'createdAt' | 'modifiedAt'> | Item) => void;
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
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState(defaultItemImage);
  const [diceCost, setDiceCost] = useState<number | ''>('');

  useEffect(() => {
    if (initialData) {
      setItemName(initialData.itemName);
      setItemDescription(initialData.itemDescription || '');
      setItemImage(initialData.itemImage || defaultItemImage);
      setDiceCost(initialData.diceCost);
    } else {
      // Reset form for new item
      setItemName('');
      setItemDescription('');
      setItemImage(defaultItemImage);
      setDiceCost('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (diceCost === '' || Number(diceCost) < 0) {
      alert('올바른 다이스 소모량을 입력해주세요.');
      return;
    }
    const itemData = {
      itemName,
      itemDescription,
      itemImage, // 실제로는 이미지 업로드 로직 필요 또는 URL 입력
      diceCost: Number(diceCost),
    };

    if (isEditMode && initialData) {
      onSubmit({ ...initialData, ...itemData });
    } else {
      onSubmit(itemData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">아이템명</label>
        <Input id="itemName" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">아이템 설명 (선택)</label>
        <Input id="itemDescription" type="text" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
      </div>
      <div>
        <label htmlFor="itemImage" className="block text-sm font-medium text-gray-700">아이템 이미지 URL</label>
        <Input id="itemImage" type="url" value={itemImage} onChange={(e) => setItemImage(e.target.value)} placeholder="https://example.com/image.png" />
        {itemImage && <img src={itemImage} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />}
      </div>
      <div>
        <label htmlFor="diceCost" className="block text-sm font-medium text-gray-700">다이스 소모량</label>
        <Input id="diceCost" type="number" value={diceCost} onChange={(e) => setDiceCost(Number(e.target.value))} required min="0" />
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