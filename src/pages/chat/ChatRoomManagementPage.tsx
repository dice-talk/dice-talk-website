// src/pages/chat/ChatRoomManagementPage.tsx
import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ChatRoomFilterSection } from '../../components/chat/ChatRoomFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import Button from '../../components/ui/Button';
import { 
  RoomStatus as ChatRoomStatusEnum, 
  RoomType as ChatRoomTypeEnum 
} from '../../types/chatroom/chatRoomTypes'; // Using enums/consts from chatRoomTypes
import type { ChatRoomMultiResponseDto } from '../../types/chatroom/chatRoomTypes';
import type { MultiResponse, PageInfo } from '../../types/common'; // For API response structure
import { getChatRooms, deleteChatRoom } from '../../api/chatRoomApi'; // API functions
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import StatusBadge from '../../components/ui/StatusBadge'; // StatusBadge 임포트
import { formatDateTime, getChatRoomTypeLabel } from '../../lib/ChatRoomUtils'; // 필요한 유틸리티만 남김

// Remove mock data and related functions

// Interface for table items, derived from API response DTO
interface ChatRoomTableItem extends ChatRoomMultiResponseDto, TableItem {
  id: number; // Use chatRoomId as the unique key for the table
}

export default function ChatRoomManagementPage() {
  const [allChatRooms, setAllChatRooms] = useState<ChatRoomMultiResponseDto[]>([]); // Stores all fetched rooms for current page
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const [conceptFilter, setConceptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [roomIdSearch, setRoomIdSearch] = useState('');
  const [sortValue, setSortValue] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Can be made configurable

  const fetchAndSetChatRooms = async (page: number, size: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // API uses 0-indexed page
      const response: MultiResponse<ChatRoomMultiResponseDto> = await getChatRooms(page - 1, size);
      setAllChatRooms(response.data);
      setPageInfo(response.pageInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : '채팅방 목록을 불러오는 데 실패했습니다.');
      setAllChatRooms([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetChatRooms(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setConceptFilter('ALL');
    setStatusFilter('ALL');
    setRoomTypeFilter('ALL');
    setRoomIdSearch('');
    setSortValue('createdAt_desc');
    setCurrentPage(1); // Reset to first page
  };

  const handleForceCloseRoom = async (chatRoomId: number) => {
    if (window.confirm(`채팅방 ID ${chatRoomId}을(를) 강제 종료하시겠습니까?`)) {
      try {
        await deleteChatRoom(chatRoomId);
        alert(`채팅방 ID ${chatRoomId}이(가) 강제 종료되었습니다.`);
        // Refresh the list
        fetchAndSetChatRooms(currentPage, itemsPerPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : '채팅방 강제 종료에 실패했습니다.');
        alert(`오류: 채팅방 강제 종료에 실패했습니다.`);
      }
    }
  };

  const handleViewDetails = (roomId: string) => {
    // TODO: Implement chat room detail view/modal
    // This view should allow admins to see chat logs (read-only) and report details.
    alert(`채팅방 ${roomId} 상세 보기 기능은 준비 중입니다.\n이곳에서 신고 내역 및 채팅 로그를 조회할 수 있습니다.`);
    // Example: navigate(`/admin/chat-rooms/${roomId}`);
  };

  const filteredAndSortedChatRooms = useMemo(() => {
    let filtered = [...allChatRooms];

    // Note: ChatRoomMultiResponseDto does not have 'concept'.
    // Concept filtering will not work unless 'concept' is added to ChatRoomMultiResponseDto
    // or handled differently (e.g. if themeName implies concept).
    // if (conceptFilter !== 'ALL') {
    //   filtered = filtered.filter(room => room.conceptProperty === conceptFilter);
    // }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(room => room.roomStatus === statusFilter);
    }
    if (roomTypeFilter !== 'ALL') {
      filtered = filtered.filter(room => room.roomType === roomTypeFilter);
    }
    if (roomIdSearch) {
      filtered = filtered.filter(room => room.chatRoomId.toString().includes(roomIdSearch));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortValue) {
        case 'createdAt_asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // Add other sort options based on available fields in ChatRoomMultiResponseDto
        default: return 0;
      }
    });

    return filtered.map(room => ({
      ...room,
      id: room.chatRoomId, // for ReusableTable key
    }));
  }, [allChatRooms, statusFilter, roomTypeFilter, roomIdSearch, sortValue]);

  // Pagination is now handled by the API, so client-side slicing is not needed for 'paginatedChatRooms'
  // The 'filteredAndSortedChatRooms' can be directly used for display if client-side filtering/sorting is still desired on the current page's data.
  // For simplicity, we'll use filteredAndSortedChatRooms which applies client-side filters to the API-fetched page.

  const handlePageChange = (page: number) => setCurrentPage(page);

  const columns: ColumnDefinition<ChatRoomTableItem>[] = [
    { key: 'chatRoomId', header: '방 ID', accessor: 'chatRoomId', headerClassName: 'w-[10%]' },
    { key: 'roomType', header: '방 유형', accessor: (item) => getChatRoomTypeLabel(item.roomType as ChatRoomTypeEnum), headerClassName: 'w-[15%]' },
    // 'concept' column removed as it's not in ChatRoomMultiResponseDto
    // { key: 'concept', header: '컨셉', accessor: (item) => item.concept ? getChatRoomConceptLabel(item.concept) : '-', headerClassName: 'w-[15%]' },
    { 
      key: 'roomStatus', 
      header: '상태', 
      accessor: 'roomStatus',
      headerClassName: 'w-[15%]',
      cellRenderer: (item) => <StatusBadge status={item.roomStatus} type="chatRoom" />,
    },
    { key: 'lastChat', header: '최근 채팅', accessor: (item) => item.lastChat || '-', headerClassName: 'w-[25%]' },
    { key: 'createdAt', header: '생성일', accessor: (item) => formatDateTime(item.createdAt), headerClassName: 'w-[20%]' },
    // 'timeRemainingOrStatus', 'reportedCount' columns removed
    {
      key: 'actions',
      header: '관리',
      headerClassName: 'w-[15%]', // 너비 조정
      cellRenderer: (item) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewDetails(item.chatRoomId.toString())}>조회</Button>
          {/* 강제 종료는 roomStatus에 따라 결정. ROOM_DEACTIVE가 이미 종료된 상태일 수 있음 */}
          {item.roomStatus !== ChatRoomStatusEnum.ROOM_DEACTIVE && (
            <Button variant="destructive" size="sm" onClick={() => handleForceCloseRoom(item.chatRoomId)}>강제종료</Button>
          )}
        </div>
      ),
    },
  ];

  const chatRoomSortOptions = [
    { value: 'createdAt_desc', label: '생성일 (최신순)' },
    { value: 'createdAt_asc', label: '생성일 (오래된순)' },
    // Add other sort options based on ChatRoomMultiResponseDto fields
    // { value: 'lastChat_asc', label: '최근 채팅 (오름차순)' }, 
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
            data={filteredAndSortedChatRooms} // Display client-side filtered/sorted data from the current page
            totalCount={pageInfo?.totalElements ?? 0}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={chatRoomSortOptions}
            emptyStateMessage="관리할 채팅방이 없습니다."
            // onRowClick={(item) => handleViewDetails(item.id)} // Alternative to action button
          />
          {isLoading && <p className="text-center py-4">채팅방 목록을 불러오는 중...</p>}
          {error && <p className="text-center py-4 text-red-500">오류: {error}</p>}
          {!isLoading && !error && allChatRooms.length === 0 && (
            <p className="text-center py-4">표시할 채팅방이 없습니다.</p>
          )}

          {pageInfo && pageInfo.totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pageInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}