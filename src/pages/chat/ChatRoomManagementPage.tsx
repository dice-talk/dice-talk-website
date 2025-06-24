// src/pages/chat/ChatRoomManagementPage.tsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ChatRoomFilterSection } from '../../components/chat/ChatRoomFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import Button from '../../components/ui/Button';
import { 
  RoomStatus as ChatRoomStatusEnum, 
  RoomType as ChatRoomTypeEnum 
} from '../../types/chatroom/chatRoomTypes'; 
import type { ChatRoomMultiResponseDto } from '../../types/chatroom/chatRoomTypes';
import type { MultiResponse, PageInfo } from '../../types/common'; 
import { getChatRooms, deleteChatRoom } from '../../api/chatRoomApi'; 
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import StatusBadge from '../../components/ui/StatusBadge'; 
import { formatDateTime } from '../../lib/DataUtils';
import { getChatRoomTypeLabel } from '../../lib/ChatRoomUtils';

interface ChatRoomTableItem extends ChatRoomMultiResponseDto, TableItem {
  id: number; 
}

export default function ChatRoomManagementPage() {
  const [allChatRooms, setAllChatRooms] = useState<ChatRoomMultiResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  // UI 입력을 위한 필터 상태
  const [themeNameFilter, setThemeNameFilter] = useState('ALL'); // conceptFilter -> themeNameFilter
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [roomIdSearch, setRoomIdSearch] = useState('');

  // API 요청에 사용될 실제 적용된 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    themeName: 'ALL', // concept -> themeName
    status: 'ALL',
    roomType: 'ALL',
    roomId: '',
  });

  const [sortValue, setSortValue] = useState('createdAt_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Can be made configurable
  const navigate = useNavigate(); // useNavigate 훅 사용

  const fetchAndSetChatRooms = useCallback(async (pageToFetch: number, size: number, isSearchTriggered: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof getChatRooms>[0] = { // getChatRooms 파라미터 타입에 맞게 수정
        page: pageToFetch,
        size: size,
        themeName: appliedFilters.themeName === 'ALL' ? undefined : appliedFilters.themeName, // concept -> themeName
        roomStatus: appliedFilters.status === 'ALL' ? undefined : appliedFilters.status as ChatRoomStatusEnum,
        roomType: appliedFilters.roomType === 'ALL' ? undefined : appliedFilters.roomType as ChatRoomTypeEnum,
        chatRoomId: appliedFilters.roomId ? Number(appliedFilters.roomId) : undefined,
        // sort: sortValue.replace('_',','), // API가 sort 파라미터를 지원한다면 추가
      };
      const response: MultiResponse<ChatRoomMultiResponseDto> = await getChatRooms(params);
      setAllChatRooms(response.data);
      setPageInfo(response.pageInfo);
      if (isSearchTriggered && currentPage !== 1) {
        setCurrentPage(1); // "조회" 버튼 클릭 시 첫 페이지로 (이미 1페이지면 useEffect가 처리)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '채팅방 목록을 불러오는 데 실패했습니다.');
      setAllChatRooms([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters, currentPage]); // sortValue와 itemsPerPage 제거

  useEffect(() => {
    fetchAndSetChatRooms(currentPage, itemsPerPage, false);
  }, [currentPage, itemsPerPage, appliedFilters, sortValue, fetchAndSetChatRooms]); // fetchAndSetChatRooms 추가

  const handleResetFilters = () => {
    setThemeNameFilter('ALL'); // conceptFilter -> themeNameFilter
    setStatusFilter('ALL');
    setRoomTypeFilter('ALL');
    setRoomIdSearch('');
    setSortValue('createdAt_desc');
    setAppliedFilters({ // 적용된 필터도 초기화
      themeName: 'ALL', // concept -> themeName
      status: 'ALL',
      roomType: 'ALL',
      roomId: '',
    });
    // 현재 페이지가 1이 아니면 1로 설정 (useEffect가 데이터 로드), 이미 1이면 직접 로드
    if (currentPage !== 1) setCurrentPage(1);
    else fetchAndSetChatRooms(1, itemsPerPage, true);
  };

  const handleForceCloseRoom = async (chatRoomId: number) => {
    if (window.confirm(`채팅방 ID ${chatRoomId}을(를) 강제 종료하시겠습니까?`)) {
      try {
        await deleteChatRoom(chatRoomId);
        alert(`채팅방 ID ${chatRoomId}이(가) 강제 종료되었습니다.`);
        // Refresh the list
        fetchAndSetChatRooms(currentPage, itemsPerPage, false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '채팅방 강제 종료에 실패했습니다.');
        alert(`오류: 채팅방 강제 종료에 실패했습니다.`);
      }
    }
  };

  const handleViewDetails = (chatRoomId: number) => {
    navigate(`/chatrooms/${chatRoomId}`); // 상세 페이지로 이동
  };

  const filteredAndSortedChatRooms = useMemo(() => {
    // API에서 필터링 및 정렬을 처리하므로, 클라이언트 사이드 필터링/정렬 로직은 제거하거나 단순화합니다.
    // API가 정렬된 데이터를 반환한다고 가정합니다.
    const dataToDisplay = [...allChatRooms];

    // 클라이언트 사이드 정렬 (API가 정렬을 지원하지 않거나 추가 정렬이 필요한 경우)
    // 현재는 API가 sort 파라미터를 지원하지 않는다고 가정하고 클라이언트 정렬 유지
    dataToDisplay.sort((a, b) => {
      switch (sortValue) {
        case 'createdAt_asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });
    
    return dataToDisplay.map(room => ({
      ...room,
      id: room.chatRoomId, // for ReusableTable key
    }));
  }, [allChatRooms, sortValue]); // 클라이언트 필터링 상태 제거, sortValue는 유지

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearch = () => {
    setAppliedFilters({
      themeName: themeNameFilter, // conceptFilter -> themeNameFilter
      status: statusFilter,
      roomType: roomTypeFilter,
      roomId: roomIdSearch,
    });
    // setCurrentPage(1); // useEffect가 appliedFilters 변경을 감지하여 첫 페이지 데이터 로드
  };

  const columns: ColumnDefinition<ChatRoomTableItem>[] = [
    { key: 'chatRoomId', header: '채팅방 번호', accessor: 'chatRoomId', headerClassName: 'w-[10%]' },
    { key: 'roomType', header: '방 유형', accessor: (item) => getChatRoomTypeLabel(item.roomType as ChatRoomTypeEnum), headerClassName: 'w-[15%]' },
    { key: 'themeName', header: '테마', accessor: (item) => item.themeName || '-', headerClassName: 'w-[15%]' },
    { 
      key: 'roomStatus', 
      header: '상태', 
      accessor: 'roomStatus',
      headerClassName: 'w-[10%]',
      cellRenderer: (item) => <StatusBadge status={item.roomStatus} type="chatRoom" />,
    },
    { key: 'createdAt', header: '생성일', accessor: (item) => formatDateTime(item.createdAt), headerClassName: 'w-[20%]' },
    // 'timeRemainingOrStatus', 'reportedCount' columns removed
    {
      key: 'actions',
      header: '관리',
      headerClassName: 'w-[15%]', // 너비 조정
      cellRenderer: (item) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleViewDetails(item.chatRoomId)}>조회</Button>
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
   ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">채팅방 관리</h2>
          
          <ChatRoomFilterSection
            themeNameFilter={themeNameFilter} onThemeNameFilterChange={setThemeNameFilter} // props 이름 변경
            statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
            roomTypeFilter={roomTypeFilter} onRoomTypeFilterChange={setRoomTypeFilter}
            roomIdSearch={roomIdSearch} onRoomIdSearchChange={setRoomIdSearch}
            onResetFilters={handleResetFilters}
            onSearch={handleSearch} // 조회 핸들러 전달
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