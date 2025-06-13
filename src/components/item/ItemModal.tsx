// src/components/item/ItemModal.tsx
import React from 'react';
import {
  type ItemResponseDto,
  type ItemPostDto,
  type ItemPatchDto,
} from '../../types/itemTypes';
import { ItemForm } from './ItemForm';
import Modal from '../ui/Modal';
import * as itemApi from '../../api/itemApi';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemSubmitted: () => void; // 성공 시 호출, 목록 새로고침용
  itemToEdit?: ItemResponseDto | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  onItemSubmitted,
}) => {
  if (!isOpen) return null;

  const isEditMode = !!itemToEdit;
  const modalTitle = isEditMode ? '아이템 수정' : '새 아이템 등록';

  const handleSubmit = async (
    dto: ItemPostDto | ItemPatchDto,
    imageFile?: File | null
  ) => {
    try {
      if (isEditMode && itemToEdit) {
        // ItemPatchDto로 단언
        const itemPatchDtoString = JSON.stringify(dto as ItemPatchDto);
        await itemApi.updateItem(
          itemToEdit.itemId,
          itemPatchDtoString,
          imageFile
        );
        onItemSubmitted(); // 성공 시 목록 새로고침 알림
      } else {
        // ItemPostDto로 단언
        const itemPostDtoString = JSON.stringify(dto as ItemPostDto);
        const newItemIdString = await itemApi.createItem(itemPostDtoString, imageFile);
        if (newItemIdString) {
           onItemSubmitted(); // 성공 시 목록 새로고침 알림
        } else {
           throw new Error('아이템 생성 후 ID를 받지 못했습니다.');
        }
      }
      onClose(); // 성공 시 모달 닫기
    } catch (error) {
      console.error("아이템 처리 중 오류 발생:", error);
      alert(`오류: ${error instanceof Error ? error.message : String(error)}`);
      // 실패 시 모달을 닫지 않음
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <ItemForm
        initialData={itemToEdit}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isEditMode={isEditMode}
      />
    </Modal>
  );
};