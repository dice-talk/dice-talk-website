import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { type EventItem, EventIdValues } from '../../types/eventTypes';

interface EventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventItem: EventItem | null;
  onSave: (updatedEvent: EventItem) => void;
}

export const EventEditModal: React.FC<EventEditModalProps> = ({ isOpen, onClose, eventItem, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activationTimeHours, setActivationTimeHours] = useState(0);
  const [durationHours, setDurationHours] = useState<number | undefined>(undefined);
  const [isModificationPaid, setIsModificationPaid] = useState<boolean | undefined>(false);
  const [paidModificationDetails, setPaidModificationDetails] = useState<string | undefined>('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (eventItem) {
      setName(eventItem.name);
      setDescription(eventItem.description);
      setActivationTimeHours(eventItem.activationTimeHours);
      setDurationHours(eventItem.durationHours);
      setIsModificationPaid(eventItem.isModificationPaid);
      setPaidModificationDetails(eventItem.paidModificationDetails || '');
      setIsActive(eventItem.isActive);
    }
  }, [eventItem]);

  const handleSave = () => {
    if (eventItem) {
      const updatedEvent: EventItem = {
        ...eventItem,
        name,
        description,
        activationTimeHours: Number(activationTimeHours) || 0,
        durationHours: durationHours !== undefined ? Number(durationHours) : undefined,
        isModificationPaid,
        paidModificationDetails: isModificationPaid ? paidModificationDetails : undefined,
        isActive,
      };
      onSave(updatedEvent);
    }
  };

  if (!isOpen || !eventItem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`'${eventItem.name}' 이벤트 수정`} size="lg">
      <div className="space-y-4">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
            이벤트명 (제목)
          </label>
          <Input id="eventName" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <Textarea
            id="eventDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이벤트 설명을 입력하세요."
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="eventActivationTime" className="block text-sm font-medium text-gray-700 mb-1">
            활성화 시간 (채팅방 참여 후, 시간 단위)
          </label>
          <Input id="eventActivationTime" type="number" value={activationTimeHours} onChange={(e) => setActivationTimeHours(parseInt(e.target.value, 10))} min="0" />
        </div>

        {eventItem.id === EventIdValues.CUPIDS_ARROW && (
          <>
            <div>
              <label htmlFor="eventDuration" className="block text-sm font-medium text-gray-700 mb-1">
                지속 시간 (시간 단위, 큐피트 화살 전용)
              </label>
              <Input id="eventDuration" type="number" value={durationHours || ''} onChange={(e) => setDurationHours(e.target.value ? parseInt(e.target.value, 10) : undefined)} min="0" placeholder="예: 8"/>
            </div>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="checkbox"
                id="isModificationPaid"
                checked={!!isModificationPaid}
                onChange={(e) => setIsModificationPaid(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isModificationPaid" className="text-sm font-medium text-gray-700">
                수정 유료 여부 (큐피트 화살 전용)
              </label>
            </div>
            {isModificationPaid && (
              <div>
                <label htmlFor="paidModificationDetails" className="block text-sm font-medium text-gray-700 mb-1">
                  유료 수정 상세 (예: 다이스 10개)
                </label>
                <Input id="paidModificationDetails" type="text" value={paidModificationDetails || ''} onChange={(e) => setPaidModificationDetails(e.target.value)} placeholder="예: 다이스 10개 필요"/>
              </div>
            )}
          </>
        )}
        
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이벤트 활성 상태
          </label>
          <div className="flex space-x-2 mt-1">
            <Button
              onClick={() => setIsActive(true)}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className={isActive ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              활성화
            </Button>
            <Button
              onClick={() => setIsActive(false)}
              variant={!isActive ? 'default' : 'outline'}
              size="sm"
              className={!isActive ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              비활성화
            </Button>
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
