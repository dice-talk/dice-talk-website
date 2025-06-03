// src/components/theme/ThemeEditModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/Input'; // Input 컴포넌트 사용
import { Textarea } from '../ui/Textarea'; // Textarea 컴포넌트 추가 가정 (없다면 Input으로 대체)
import type { ThemeItem } from '../../types/themeTypes';
import { Switch } from '../ui/Switch'; // Switch 컴포넌트 임포트

interface ThemeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeItem | null;
  onSave: (updatedTheme: ThemeItem) => void;
}

export const ThemeEditModal: React.FC<ThemeEditModalProps> = ({ isOpen, onClose, theme, onSave }) => {
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState(''); // 규칙 필드 추가
  const [isActive, setIsActive] = useState(true); // 활성 상태 추가

  useEffect(() => {
    if (theme) {
      setDescription(theme.description);
      setRules(theme.rules || ''); // 규칙이 없으면 빈 문자열
      setIsActive(theme.isActive);
    }
  }, [theme]);

  const handleSave = () => {
    if (theme) {
      onSave({ ...theme, description, rules, isActive });
    }
  };

  if (!isOpen || !theme) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`'${theme.name}' 테마 수정`} size="md">
      <div className="space-y-4">
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
        {/* 규칙 필드는 모든 테마에 대해 표시 (참가 인원 관련 정보 포함 가능) */}
          <div>
            <label htmlFor="themeRules" className="block text-sm font-medium text-gray-700 mb-1">
              참가 인원 및 규칙
            </label>
            <Input
              id="themeRules"
              type="text"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="예: 6명 랜덤 매칭 / 남3, 여3 필수"
            />
          </div>
        <div>
          <label htmlFor="themeIsActive" className="block text-sm font-medium text-gray-700 mb-1">
            활성 상태
          </label>
          <div className="flex items-center space-x-2 mt-1">
            <Switch
              id="themeIsActiveSwitch" // Switch에 id 부여
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="테마 활성 상태 토글"
            />
            <label htmlFor="themeIsActiveSwitch" className="text-sm cursor-pointer">{isActive ? '활성' : '비활성'}</label> {/* label의 htmlFor를 Switch id와 연결 */}
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
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
