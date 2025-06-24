import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
// import { Textarea } from '../ui/Textarea'; // Event DTO에 description이 없으므로 주석 처리 또는 제거
import { type EventItem, type EventPatchDto, type EventStatus } from '../../types/chatroom/eventTypes'; // EventIdValues 제거, EventPatchDto, EventStatus 추가

interface EventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventItem: EventItem | null; // 수정 시 기존 이벤트 정보, 생성 시 null
  onSave: (updatedFields: EventPatchDto, eventId?: number) => void; // API에 전달할 필드와 ID
}

export const EventEditModal: React.FC<EventEditModalProps> = ({ isOpen, onClose, eventItem, onSave }) => {
  const [name, setName] = useState('');
  const [themeId, setThemeId] = useState<number | ''>(''); // 테마 ID는 숫자 또는 빈 문자열
  const [eventStatus, setEventStatus] = useState<EventStatus>('EVENT_OPEN');
  // description, activationTimeHours 등은 백엔드 DTO에 없으므로 제거 또는 주석 처리
  // const [description, setDescription] = useState('');
  // const [activationTimeHours, setActivationTimeHours] = useState(0);

  useEffect(() => {
    if (eventItem) {
      // 수정 모드: 기존 값으로 상태 초기화
      setName(eventItem.eventName);
      setThemeId(eventItem.themeId);
      setEventStatus(eventItem.eventStatus);
      // setDescription(eventItem.description || '');
      // setActivationTimeHours(eventItem.activationTimeHours || 0);
    } else {
      // 생성 모드: 상태 초기화
      setName('');
      setThemeId('');
      setEventStatus('EVENT_OPEN');
      // setDescription('');
      // setActivationTimeHours(0);
    }
  }, [eventItem, isOpen]); // isOpen 추가하여 모달 열릴 때마다 상태 재설정

  const handleSave = () => {
    // themeId가 빈 문자열이면 유효성 검사에서 걸리도록 하거나, 특정 기본값(예: 0 또는 null)으로 처리
    const parsedThemeId = themeId === '' ? NaN : Number(themeId); // 빈 문자열이면 NaN으로 만들어 유효성 검사
    if (!name.trim()) {
      alert("이벤트명은 필수입니다.");
      return;
    }
    if (themeId === '' || isNaN(parsedThemeId) || parsedThemeId <= 0) { // themeId가 빈 문자열인 경우도 유효성 검사
      alert("유효한 테마 ID를 입력해주세요.");
      return;
    }

    const updatedFields: EventPatchDto = {
      eventName: name,
      themeId: parsedThemeId,
      eventStatus: eventStatus,
      // description, activationTimeHours 등은 DTO에 맞게 제거 또는 수정
    };

    onSave(updatedFields, eventItem?.eventId); // 수정 시에는 eventId 전달
  };

  if (!isOpen) return null; // eventItem이 null이어도 모달은 열릴 수 있도록 수정 (생성 모드)
  const modalTitle = eventItem ? `'${eventItem.eventName}' 이벤트 수정` : '새 이벤트 등록';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="md">
      <div className="space-y-4">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
            이벤트명 (제목)
          </label>
          <Input id="eventName" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        
        <div>
          <label htmlFor="themeId" className="block text-sm font-medium text-gray-700 mb-1">
            테마 ID
          </label>
          <Input 
            id="themeId" 
            type="text" // type을 "text"로 변경하여 입력값 직접 제어
            value={themeId.toString()} 
            readOnly 
            disabled 
            className="bg-gray-100 cursor-not-allowed" // 수정 불가 시각적 피드백
            placeholder="테마 ID (수정 불가)" />
        </div>
        
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이벤트 활성 상태
          </label>
          <div className="flex space-x-2 mt-1">
            {(['EVENT_OPEN', 'EVENT_CLOSE'] as EventStatus[]).map(statusValue => (
              <Button
                key={statusValue}
                onClick={() => setEventStatus(statusValue)}
                variant={eventStatus === statusValue ? 'default' : 'outline'}
                size="sm"
                className={
                  eventStatus === statusValue
                    ? statusValue === 'EVENT_OPEN'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                    : ''
                }
              >
                {statusValue === 'EVENT_OPEN' ? '활성' : '비활성'}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
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
