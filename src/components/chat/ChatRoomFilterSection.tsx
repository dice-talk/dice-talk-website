import React from 'react';
import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter'; 
import { SearchInputFilter } from '../ui/SearchInputFilter'; 
import { 
  getChatRoomStatusLabel, 
  getChatRoomTypeLabel, 
  chatRoomThemeFilterOptionsForDropdown
} from '../../lib/ChatRoomUtils'; 
import { RoomType, RoomStatus } from '../../types/chatroom/chatRoomTypes'; 

interface ChatRoomFilterSectionProps {
  themeNameFilter: string; 
  onThemeNameFilterChange: (value: string) => void; 
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  roomTypeFilter: string;
  onRoomTypeFilterChange: (value: string) => void;
  roomIdSearch: string;
  onRoomIdSearchChange: (value: string) => void;
  onResetFilters: () => void;
  onSearch: () => void; // 조회 버튼 핸들러
}

export const ChatRoomFilterSection: React.FC<ChatRoomFilterSectionProps> = ({
  themeNameFilter, onThemeNameFilterChange, 
  statusFilter, onStatusFilterChange,
  roomTypeFilter, onRoomTypeFilterChange,
  roomIdSearch, onRoomIdSearchChange,
  onResetFilters,
  onSearch, 
}) => {
  const themeOptions = chatRoomThemeFilterOptionsForDropdown;


  const statusOptions = [
    { value: 'ALL', label: '전체 상태' },
    ...Object.keys(RoomStatus).map(key => ({ value: RoomStatus[key as keyof typeof RoomStatus], label: getChatRoomStatusLabel(RoomStatus[key as keyof typeof RoomStatus])}))
  ];

  const roomTypeOptions = [
    { value: 'ALL', label: '전체 방 유형' },
    ...Object.values(RoomType).map(rt => ({ value: rt, label: getChatRoomTypeLabel(rt)}))
  ];

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <DropdownFilter
          label="테마" 
          id="themeNameFilter" // id 변경
          value={themeNameFilter} // props 이름 변경
          onValueChange={onThemeNameFilterChange} // props 이름 변경
          options={themeOptions}
          placeholder="테마 선택" // placeholder는 유지
        />

        <DropdownFilter
          label="상태"
          id="statusFilter"
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          options={statusOptions}
          placeholder="상태 선택"
        />
        
        <DropdownFilter
          label="방 유형"
          id="roomTypeFilter"
          value={roomTypeFilter}
          onValueChange={onRoomTypeFilterChange}
          options={roomTypeOptions}
          placeholder="방 유형 선택"
        />

        <SearchInputFilter
          label="채팅방 번호"
            id="roomIdSearchFilter"
            placeholder="번호 검색"
            value={roomIdSearch}
            onChange={onRoomIdSearchChange}
          />

        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button onClick={onResetFilters} variant="outline" className="w-full md:w-auto">초기화</Button>
          <Button onClick={onSearch} className="w-full md:w-auto">조회</Button> {/* 조회 버튼 추가 */}
        </div>
      </div>
    </div>
  );
};
