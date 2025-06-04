// src/pages/chat/ChatRoomManagementPage.tsx
import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ChatRoomFilterSection } from '../../components/chat/ChatRoomFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import Button from '../../components/ui/Button';
import { type ChatRoomItem, ChatRoomConcept, ChatRoomStatus, ChatRoomType, type ChatRoomParticipant } from '../../types/chatRoomTypes';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { 
  formatDateTime, 
  getChatRoomConceptLabel, 
  getChatRoomStatusLabel, 
  getChatRoomStatusBadgeStyle,
  getChatRoomTypeLabel,
  calculateTimeRemaining,
  getParticipantDisplay,
} from '../../lib/ChatRoomUtils';

const AUTO_NICKNAMES = [
  "하나로운하나", "호이가 계속되면 두리", "세침한 세찌", 
  "네모지만 부드러운 네몽", "단호하지만 다정한 다오", "육감적인 직감파 육댕"
];

const generateMockParticipants = (count: number, concept: ChatRoomConcept | null, roomType: ChatRoomType): ChatRoomParticipant[] => {
  const participants: ChatRoomParticipant[] = [];
  const usedNicknames = new Set<string>();
  for (let i = 0; i < count; i++) {
    let nickname = AUTO_NICKNAMES[Math.floor(Math.random() * AUTO_NICKNAMES.length)];
    while(usedNicknames.has(nickname) && usedNicknames.size < AUTO_NICKNAMES.length) {
      nickname = AUTO_NICKNAMES[Math.floor(Math.random() * AUTO_NICKNAMES.length)];
    }
    usedNicknames.add(nickname);
    
    const participant: ChatRoomParticipant = {
      memberId: `user_${Math.floor(Math.random() * 10000)}`,
      autoNickname: nickname,
    };
    if (roomType === ChatRoomType.GROUP && concept === ChatRoomConcept.HEART_SIGNAL) {
      participant.gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
    }
    participants.push(participant);
  }
  // Ensure Heart Signal (group) rooms have balanced genders if active, or varied if waiting
  if (concept === ChatRoomConcept.HEART_SIGNAL && count === 6) {
      let males = participants.filter(p => p.gender === 'MALE').length;
      let females = participants.filter(p => p.gender === 'FEMALE').length;
      participants.forEach(p => {
          if (males < 3) { if(p.gender === 'FEMALE') {p.gender = 'MALE'; males++; females--;} }
          else if (females < 3) { if(p.gender === 'MALE') {p.gender = 'FEMALE'; females++; males--;} }
      });
  }
  return participants;
};

const now = new Date();
const createTime = (offsetHours: number) => new Date(now.getTime() - offsetHours * 60 * 60 * 1000).toISOString();
const endTime = (startTime: string, roomType: ChatRoomType) => {
  const durationHours = roomType === ChatRoomType.COUPLE ? 24 : 48;
  return new Date(new Date(startTime).getTime() + durationHours * 60 * 60 * 1000).toISOString();
};

const generateCoupleParticipants = (): ChatRoomParticipant[] => {
  const nicknames = [...AUTO_NICKNAMES].sort(() => 0.5 - Math.random()).slice(0, 2);
  return [
    { memberId: `user_${Math.floor(Math.random() * 10000)}`, autoNickname: nicknames[0], gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE' },
    { memberId: `user_${Math.floor(Math.random() * 10000)}`, autoNickname: nicknames[1], gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE' },
  ];
};

export const mockChatRooms: ChatRoomItem[] = [
   { roomId: "1", roomType: ChatRoomType.GROUP, concept: ChatRoomConcept.DICE_FRIENDS, participants: generateMockParticipants(6, ChatRoomConcept.DICE_FRIENDS, ChatRoomType.GROUP), maxParticipants: 6, status: ChatRoomStatus.ACTIVE, createdAt: createTime(5), endsAt: endTime(createTime(5), ChatRoomType.GROUP), reportedCount: 0 },
  { roomId: "2", roomType: ChatRoomType.GROUP, concept: ChatRoomConcept.HEART_SIGNAL, participants: generateMockParticipants(6, ChatRoomConcept.HEART_SIGNAL, ChatRoomType.GROUP), maxParticipants: 6, status: ChatRoomStatus.ACTIVE, createdAt: createTime(24), endsAt: endTime(createTime(24), ChatRoomType.GROUP), reportedCount: 2 },
  { roomId: "3", roomType: ChatRoomType.GROUP, concept: ChatRoomConcept.DICE_FRIENDS, participants: generateMockParticipants(3, ChatRoomConcept.DICE_FRIENDS, ChatRoomType.GROUP), maxParticipants: 6, status: ChatRoomStatus.WAITING_FOR_MEMBERS, createdAt: createTime(1), endsAt: endTime(createTime(1), ChatRoomType.GROUP), reportedCount: 0 },
  { roomId: "4", roomType: ChatRoomType.GROUP, concept: ChatRoomConcept.HEART_SIGNAL, participants: generateMockParticipants(4, ChatRoomConcept.HEART_SIGNAL, ChatRoomType.GROUP), maxParticipants: 6, status: ChatRoomStatus.WAITING_FOR_MEMBERS, createdAt: createTime(0.5), endsAt: endTime(createTime(0.5), ChatRoomType.GROUP), reportedCount: 0 },
  { roomId: "5", roomType: ChatRoomType.GROUP, concept: ChatRoomConcept.DICE_FRIENDS, participants: generateMockParticipants(6, ChatRoomConcept.DICE_FRIENDS, ChatRoomType.GROUP), maxParticipants: 6, status: ChatRoomStatus.CLOSING_SOON, createdAt: createTime(47.5), endsAt: endTime(createTime(47.5), ChatRoomType.GROUP), reportedCount: 1 },
  { roomId: "6", roomType: ChatRoomType.GROUP, concept: ChatRoomConcept.HEART_SIGNAL, participants: generateMockParticipants(6, ChatRoomConcept.HEART_SIGNAL, ChatRoomType.GROUP), maxParticipants: 6, status: ChatRoomStatus.ENDED, createdAt: createTime(50), endsAt: endTime(createTime(50), ChatRoomType.GROUP), reportedCount: 0 },
  { roomId: "7", roomType: ChatRoomType.GROUP, concept: ChatRoomConcept.DICE_FRIENDS, participants: generateMockParticipants(6, ChatRoomConcept.DICE_FRIENDS, ChatRoomType.GROUP), maxParticipants: 6, status: ChatRoomStatus.FORCE_CLOSED_BY_ADMIN, createdAt: createTime(10), endsAt: endTime(createTime(10), ChatRoomType.GROUP), reportedCount: 3 },
  // 1:1 채팅방 목 데이터 추가
  { roomId: "8", roomType: ChatRoomType.COUPLE, concept: null, participants: generateCoupleParticipants(), maxParticipants: 2, status: ChatRoomStatus.ACTIVE, createdAt: createTime(5), endsAt: endTime(createTime(5), ChatRoomType.COUPLE), reportedCount: 0 },
  { roomId: "9", roomType: ChatRoomType.COUPLE, concept: null, participants: generateCoupleParticipants(), maxParticipants: 2, status: ChatRoomStatus.ENDED, createdAt: createTime(25), endsAt: endTime(createTime(25), ChatRoomType.COUPLE), reportedCount: 1 },
  { roomId: "10", roomType: ChatRoomType.COUPLE, concept: null, participants: generateCoupleParticipants(), maxParticipants: 2, status: ChatRoomStatus.CLOSING_SOON, createdAt: createTime(23.5), endsAt: endTime(createTime(23.5), ChatRoomType.COUPLE), reportedCount: 0 },
 ...Array.from({ length: 8 }, (_, i) => {
 const roomType = i % 3 === 0 ? ChatRoomType.COUPLE : ChatRoomType.GROUP; // 1:1 방도 섞음
    const created = createTime(Math.random() * (roomType === ChatRoomType.COUPLE ? 20 : 40) );

    if (roomType === ChatRoomType.COUPLE) {
      return {
        roomId: `CP${String(100 + i).padStart(3, '0')}`,
        roomType,
        concept: null,
        participants: generateCoupleParticipants(),
        maxParticipants: 2,
        status: ChatRoomStatus.ACTIVE, // 단순화를 위해 ACTIVE로 시작
        createdAt: created,
        endsAt: endTime(created, roomType),
        reportedCount: Math.floor(Math.random() * 2),
      } as ChatRoomItem;
    } else {
      const concept = i % 2 === 0 ? ChatRoomConcept.DICE_FRIENDS : ChatRoomConcept.HEART_SIGNAL;
      const participantCount = Math.floor(Math.random() * 5) + 2; // 2 to 6 participants
      return {
        roomId: `CR${String(100 + i).padStart(3, '0')}`,
        roomType,
        concept,
        participants: generateMockParticipants(participantCount, concept, roomType),
        maxParticipants: 6,
        status: participantCount < 6 ? ChatRoomStatus.WAITING_FOR_MEMBERS : ChatRoomStatus.ACTIVE,
        createdAt: created,
        endsAt: endTime(created, roomType),
        reportedCount: Math.floor(Math.random() * 3),
      } as ChatRoomItem;
    }
  }),
];

interface ChatRoomTableItem extends TableItem, Omit<ChatRoomItem, 'participants' | 'maxParticipants'> {
  id: string; // roomId
  participantDisplay: string;
  timeRemainingOrStatus: string;
}

export default function ChatRoomManagementPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>(mockChatRooms);
  const [conceptFilter, setConceptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [roomIdSearch, setRoomIdSearch] = useState('');
  const [sortValue, setSortValue] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Periodically update time remaining for active/closing soon rooms
  useEffect(() => {
    const interval = setInterval(() => {
      setChatRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.status === ChatRoomStatus.ACTIVE || room.status === ChatRoomStatus.CLOSING_SOON) {
            const endsDate = new Date(room.endsAt);
            const nowDate = new Date();
            if (endsDate.getTime() - nowDate.getTime() < 60 * 60 * 1000 && room.status === ChatRoomStatus.ACTIVE) {
              return {...room, status: ChatRoomStatus.CLOSING_SOON};
            }
            if (endsDate < nowDate) {
              return {...room, status: ChatRoomStatus.ENDED};
            }
          }
          return room;
        })
      );
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleResetFilters = () => {
    setConceptFilter('ALL');
    setStatusFilter('ALL');
    setRoomTypeFilter('ALL');
    setRoomIdSearch('');
    setSortValue('createdAt_desc');
  };

  const handleForceCloseRoom = (roomId: string) => {
    if (window.confirm(`채팅방 ${roomId}을(를) 강제 종료하시겠습니까?`)) {
      setChatRooms(prevRooms =>
        prevRooms.map(room =>
          room.roomId === roomId
            ? { ...room, status: ChatRoomStatus.FORCE_CLOSED_BY_ADMIN, endsAt: new Date().toISOString() }
            : room
        )
      );
      // TODO: API call to force close room
      alert(`채팅방 ${roomId}이(가) 강제 종료되었습니다.`);
    }
  };

  const handleViewDetails = (roomId: string) => {
    // TODO: Implement chat room detail view/modal
    // This view should allow admins to see chat logs (read-only) and report details.
    alert(`채팅방 ${roomId} 상세 보기 기능은 준비 중입니다.\n이곳에서 신고 내역 및 채팅 로그를 조회할 수 있습니다.`);
  };

  const filteredAndSortedChatRooms = useMemo(() => {
    let filtered = [...chatRooms];

    if (conceptFilter !== 'ALL') {
      filtered = filtered.filter(room => room.concept === conceptFilter);
    }
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(room => room.status === statusFilter);
    }
    if (roomTypeFilter !== 'ALL') {
      filtered = filtered.filter(room => room.roomType === roomTypeFilter);
    }
    if (roomIdSearch) {
      filtered = filtered.filter(room => room.roomId.toLowerCase().includes(roomIdSearch.toLowerCase()));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortValue) {
        case 'createdAt_asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'endsAt_asc': return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
        case 'reportedCount_desc': return b.reportedCount - a.reportedCount;
        default: return 0;
      }
    });

    return filtered.map(room => ({
      ...room,
      id: room.roomId,
      participantDisplay: getParticipantDisplay(room.participants), // 인자를 participants만 전달
      timeRemainingOrStatus: calculateTimeRemaining(room.endsAt, room.status),
    }));
  }, [chatRooms, conceptFilter, statusFilter, roomTypeFilter, roomIdSearch, sortValue]);

  const paginatedChatRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedChatRooms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedChatRooms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedChatRooms.length / itemsPerPage);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const columns: ColumnDefinition<ChatRoomTableItem>[] = [
    { key: 'roomId', header: '방 ID', accessor: 'roomId', headerClassName: 'w-[5%]' },
    { key: 'roomType', header: '방 유형', accessor: (item) => getChatRoomTypeLabel(item.roomType), headerClassName: 'w-[10%]' },
    { key: 'concept', header: '테마', accessor: (item) => getChatRoomConceptLabel(item.concept), headerClassName: 'w-[10%]' },
    { 
      key: 'status', 
      header: '상태', 
      accessor: 'status',
      headerClassName: 'w-[12%]',
      cellRenderer: (item) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getChatRoomStatusBadgeStyle(item.status)}`}>
          {getChatRoomStatusLabel(item.status)}
        </span>
      ),
    },
    { key: 'participantDisplay', header: '참여 인원', accessor: 'participantDisplay', headerClassName: 'w-[10%]' },
    { key: 'createdAt', header: '생성일', accessor: (item) => formatDateTime(item.createdAt), headerClassName: 'w-[15%]' },
    { key: 'timeRemainingOrStatus', header: '남은 시간/종료', accessor: 'timeRemainingOrStatus', headerClassName: 'w-[15%]' },
    { key: 'reportedCount', header: '신고 건수', accessor: 'reportedCount', headerClassName: 'w-[8%]' , cellRenderer: (item) => <span className={item.reportedCount > 0 ? "text-red-600 font-bold" : ""}>{item.reportedCount}</span>},
    {
      key: 'actions',
      header: '관리',
      headerClassName: 'w-[15%]', // 너비 조정
      cellRenderer: (item) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewDetails(item.roomId)}>조회</Button>
          {item.status !== ChatRoomStatus.ENDED && item.status !== ChatRoomStatus.FORCE_CLOSED_BY_ADMIN && (
            <Button variant="destructive" size="sm" onClick={() => handleForceCloseRoom(item.roomId)}>강제종료</Button>
          )}
        </div>
      ),
    },
  ];

  const chatRoomSortOptions = [
    { value: 'createdAt_desc', label: '생성일 (최신순)' },
    { value: 'createdAt_asc', label: '생성일 (오래된순)' },
    { value: 'endsAt_asc', label: '종료 임박순' },
    { value: 'reportedCount_desc', label: '신고 많은 순' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">채팅방 관리</h2>
          
          <ChatRoomFilterSection
            conceptFilter={conceptFilter} onConceptFilterChange={setConceptFilter}
            statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
            roomTypeFilter={roomTypeFilter} onRoomTypeFilterChange={setRoomTypeFilter}
            roomIdSearch={roomIdSearch} onRoomIdSearchChange={setRoomIdSearch}
            onResetFilters={handleResetFilters}
          />
          <ReusableTable
            columns={columns}
            data={paginatedChatRooms}
            totalCount={filteredAndSortedChatRooms.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={chatRoomSortOptions}
            emptyStateMessage="관리할 채팅방이 없습니다."
            // onRowClick={(item) => handleViewDetails(item.id)} // Alternative to action button
          />
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}