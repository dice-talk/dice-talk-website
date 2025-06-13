// import React from 'react';
// import Button from '../ui/Button';
// import { DropdownFilter } from '../ui/DropdownFilter'; // DropdownFilter 임포트
// import { SearchInputFilter } from '../ui/SearchInputFilter'; // SearchInputFilter 임포트 (일관성을 위해)
// import { 
//   getChatRoomStatusLabel, 
//   getChatRoomTypeLabel, // getChatRoomConceptLabel은 여기서 직접 사용하지 않음
//   chatRoomConceptFilterOptionsForDropdown
// } from '../../lib/ChatRoomUtils'; 
// import { RoomType, RoomStatus } from '../../types/chatroom/chatRoomTypes'; // 타입 대신 실제 객체 import

// interface ChatRoomFilterSectionProps {
//   conceptFilter: string;
//   onConceptFilterChange: (value: string) => void;
//   statusFilter: string;
//   onStatusFilterChange: (value: string) => void;
//   roomTypeFilter: string;
//   onRoomTypeFilterChange: (value: string) => void;
//   roomIdSearch: string;
//   onRoomIdSearchChange: (value: string) => void;
//   onResetFilters: () => void;
// }

// export const ChatRoomFilterSection: React.FC<ChatRoomFilterSectionProps> = ({
//   conceptFilter, onConceptFilterChange,
//   statusFilter, onStatusFilterChange,
//   roomTypeFilter, onRoomTypeFilterChange,
//   roomIdSearch, onRoomIdSearchChange,
//   onResetFilters,
// }) => {
//   const conceptOptions = chatRoomConceptFilterOptionsForDropdown;


//   const statusOptions = [
//     { value: 'ALL', label: '전체 상태' },
//     ...Object.keys(RoomStatus).map(key => ({ value: RoomStatus[key as keyof typeof RoomStatus], label: getChatRoomStatusLabel(RoomStatus[key as keyof typeof RoomStatus])}))
//   ];

//   const roomTypeOptions = [
//     { value: 'ALL', label: '전체 방 유형' },
//     ...Object.values(RoomType).map(rt => ({ value: rt, label: getChatRoomTypeLabel(rt)}))
//   ];

//   return (
//     <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
//         <DropdownFilter
//           label="컨셉"
//           id="conceptFilter"
//           value={conceptFilter}
//           onValueChange={onConceptFilterChange}
//           options={conceptOptions}
//           placeholder="컨셉 선택"
//         />

//         <DropdownFilter
//           label="상태"
//           id="statusFilter"
//           value={statusFilter}
//           onValueChange={onStatusFilterChange}
//           options={statusOptions}
//           placeholder="상태 선택"
//         />
        
//         <DropdownFilter
//           label="방 유형"
//           id="roomTypeFilter"
//           value={roomTypeFilter}
//           onValueChange={onRoomTypeFilterChange}
//           options={roomTypeOptions}
//           placeholder="방 유형 선택"
//         />

//         <SearchInputFilter
//           label="채팅방 ID"
//             id="roomIdSearchFilter"
//             placeholder="ID 검색"
//             value={roomIdSearch}
//             onChange={onRoomIdSearchChange}
//           />

//         <div className="flex space-x-2 mt-4 md:mt-0">
//           <Button onClick={onResetFilters} variant="outline" className="w-full md:w-auto">초기화</Button>
//           {/* <Button onClick={() => {}} className="w-full md:w-auto">조회</Button> */}
//         </div>
//       </div>
//     </div>
//   );
// };
