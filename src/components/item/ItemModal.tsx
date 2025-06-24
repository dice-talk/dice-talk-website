// src/components/item/ItemModal.tsx
import React from 'react';
import {
  type ItemResponseDto,
  type ItemPostDto,
  type ItemPatchDto,
} from '../../types/payment/itemTypes';
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
        // 백엔드 PATCH API도 유사한 방식으로 DTO와 파일을 받는지 확인 필요
        // 여기서는 createItem과 동일한 방식으로 FormData를 구성한다고 가정
        await itemApi.updateItem(
          itemToEdit.itemId,
          dto as ItemPatchDto, // DTO 객체 직접 전달
          imageFile
        );
        onItemSubmitted(); // 성공 시 목록 새로고침 알림
      } else {
        // ItemPostDto로 단언
        // const itemPostDtoString = JSON.stringify(dto as ItemPostDto); // itemApi.createItem에서 처리
        const responseLocation = await itemApi.createItem(
          dto as ItemPostDto, // DTO 객체 직접 전달
          imageFile
        );
        // 백엔드가 Location 헤더에 생성된 리소스 URI를 반환한다고 가정
        if (responseLocation) {
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