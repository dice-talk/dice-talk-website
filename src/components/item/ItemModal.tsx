// src/components/item/ItemModal.tsx
import React from 'react';
import { type Item } from '../../types/itemTypes';
import { ItemForm } from './ItemForm';
import Modal from '../ui/Modal';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: Omit<Item, 'itemId' | 'createdAt' | 'modifiedAt'> | Item) => void;
  itemToEdit?: Item | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  itemToEdit,
}) => {
  if (!isOpen) return null;

  const isEditMode = !!itemToEdit;
  const modalTitle = isEditMode ? '아이템 수정' : '새 아이템 등록';

  const handleSubmit = (data: Omit<Item, 'itemId' | 'createdAt' | 'modifiedAt'> | Item) => {
    onSubmit(data);
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