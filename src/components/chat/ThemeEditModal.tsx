import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/Input'; 
import { Textarea } from '../ui/Textarea'; 
import type { ThemeItem, ThemeStatus } from '../../types/chatroom/themeTypes';

interface ThemeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeItem | null;
  onSave: (updatedFields: { 
    name?: string | null;
    description?: string | null;
    image?: string | File | null; 
    themeStatus?: ThemeStatus;
  }) => void;
}
 
export const ThemeEditModal: React.FC<ThemeEditModalProps> = ({ isOpen, onClose, theme, onSave }) => {
  const [description, setDescription] = useState('');
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [themeStatus, setThemeStatus] = useState<ThemeStatus | undefined>();

  useEffect(() => {
    if (theme) {
      setDescription(theme.description || '');
      setThemeStatus(theme.themeStatus);
      setCurrentImagePreview(theme.image || null); 
      setNewImageFile(null); 
    } else {
      setDescription('');
      setThemeStatus(undefined);
      setCurrentImagePreview(null);
      setNewImageFile(null);
    }
  }, [theme, isOpen]);

  const handleSave = () => {
    if (theme) {
      const updatedFields: Parameters<ThemeEditModalProps['onSave']>[0] = {
        description: description === theme.description ? undefined : description, // 변경된 경우에만 전달
        themeStatus: themeStatus === theme.themeStatus ? undefined : themeStatus,
      };

      if (newImageFile) { // 새 이미지가 선택된 경우
        updatedFields.image = newImageFile;
      } else if (currentImagePreview === null && theme.image !== null) { // 이미지가 제거된 경우
        updatedFields.image = null;
      }
  
      onSave(updatedFields);
    }
  };

  if (!isOpen || !theme) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`'${theme.name}' 테마 수정`} size="md">
      <div className="space-y-6 p-1"> {/* 패딩 추가 및 간격 조정 */}
        <div>
          <label htmlFor="themeName" className="block text-sm font-medium text-gray-700 mb-1">
            테마명
          </label>
          <Input id="themeName" type="text" value={theme.name} readOnly disabled className="bg-gray-100" />
        </div>
        <div>
          <label htmlFor="themeDescription" className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          {/* Textarea가 없다면 Input type="text"로 대체 가능 */}
          <Textarea
            id="themeDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="테마 설명을 입력하세요."
            rows={3}
          />
        </div>

        {/* 이미지 수정 섹션 */}
        <div>
          <label htmlFor="themeImage" className="block text-sm font-medium text-gray-700 mb-1">
            테마 이미지
          </label>
          {currentImagePreview && (
            <div className="my-2">
              <img src={currentImagePreview} alt="Theme preview" className="max-w-xs max-h-48 object-contain rounded border" />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Input
              id="themeImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setNewImageFile(file);
                  setCurrentImagePreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {currentImagePreview && (
              <Button variant="ghost" size="sm" onClick={() => {
                setNewImageFile(null);
                setCurrentImagePreview(null);
                // 파일 인풋 초기화 (선택적으로)
                const fileInput = document.getElementById('themeImage') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}>
                삭제
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">테마 상태</label>
          <div className="flex space-x-2">
            {(['THEME_ON', 'THEME_PLANNED', 'THEME_CLOSE'] as ThemeStatus[]).map(statusValue => (
            <Button
                key={statusValue}
                onClick={() => setThemeStatus(statusValue)}
                variant={themeStatus === statusValue ? 'default' : 'outline'}
              size="sm"
            >
                {statusValue === 'THEME_ON' ? '진행중' : statusValue === 'THEME_PLANNED' ? '예정' : '종료'}
            </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t mt-6"> {/* 간격 및 구분선 추가 */}
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
};
