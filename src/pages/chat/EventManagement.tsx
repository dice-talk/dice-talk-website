// src/pages/event/EventManagementPage.tsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import Button from '../../components/ui/Button';
import { EventEditModal } from '../../components/chat/EventEditModal';
import { type EventItem, type EventResponseDto, type EventPatchDto, type EventStatus } from '../../types/eventTypes'; // EventIdValues, EventId 제거, EventResponseDto, EventPatchDto, EventStatus 추가
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { getEvents, updateEvent, createEvent, deleteEvent } from '../../api/eventApi'; // API 함수 임포트
import type { MultiResponse, PageInfo } from '../../types/common'; // PageInfo 임포트
import { Pagination } from '../../components/common/Pagination'; // Pagination 임포트

// 백엔드 EventStatus를 프론트엔드 표시용 문자열로 변환 (필요시)
const mapBackendStatusToFrontendLabel = (status: EventStatus): string => {
  switch (status) {
    case 'EVENT_OPEN': return '활성';
    case 'EVENT_CLOSE': return '비활성';
    default: return status;
  }
};

// 백엔드 EventStatus에 따른 스타일 (ReusableTable에서 사용)
const getEventStatusBadgeStyle = (status: EventStatus): string => {
  switch (status) {
    case 'EVENT_OPEN': return 'bg-green-100 text-green-700 border border-green-300';
    case 'EVENT_CLOSE': return 'bg-gray-100 text-gray-700 border border-gray-300';
    default: return 'bg-yellow-100 text-yellow-700 border border-yellow-300'; // 예: 알 수 없는 상태
  }
};

// EventResponseDto를 EventItem (UI용)으로 변환하는 함수
const transformEventResponseToItem = (dto: EventResponseDto): EventItem => {
  // EventItem은 EventResponseDto와 현재 동일하므로 직접 반환
  // 만약 EventItem에 추가적인 UI 전용 필드가 있다면 여기서 매핑
  return {
    ...dto,
    // 예: themeName: dto.theme?.name || 'N/A' (theme 객체가 응답에 포함된다면)
  };
};

// TableItem likely has an 'id' property (e.g., string | number).
// EventItem has 'id: EventId'.
// To resolve the conflict, Omit 'id' from EventItem and explicitly define it.
interface EventTableItem extends EventItem, TableItem {
  id: number; // EventResponseDto의 eventId를 사용
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [sortValue, setSortValue] = useState('id_desc'); // 기본 정렬 ID 내림차순으로 변경
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  // TODO: 필터 상태 추가 (필요시)
  // const [filterThemeId, setFilterThemeId] = useState<number | undefined>();
  // const [filterStatus, setFilterStatus] = useState<EventStatus | undefined>();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: MultiResponse<EventResponseDto> = await getEvents({
        page: currentPage,
        size: itemsPerPage,
        // eventStatus: filterStatus, // 필터 적용 시
        // themeId: filterThemeId,    // 필터 적용 시
      });
      setEvents(response.data.map(transformEventResponseToItem));
      setPageInfo(response.pageInfo);
    } catch (err) {
      console.error("이벤트 목록을 불러오는데 실패했습니다:", err);
      setError("이벤트 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
      setEvents([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage /*, filterStatus, filterThemeId */]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenEditModal = (eventItem: EventItem) => {
    setSelectedEvent(eventItem);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedEvent(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEvent = async (updatedFields: EventPatchDto, eventIdToUpdate?: number) => {
    if (!selectedEvent && !eventIdToUpdate) { // eventIdToUpdate는 새 이벤트 생성 시에는 없음
      console.error("수정 또는 생성할 이벤트 정보가 없습니다.");
      return;
    }

    const id = eventIdToUpdate || selectedEvent?.eventId;
    if (!id && !updatedFields.eventName) { // 새 이벤트 생성 시 eventName은 필수
        alert("새 이벤트 생성 시 이벤트명은 필수입니다.");
        return;
    }

    try {
      let savedEventDto: EventResponseDto;
      if (selectedEvent && id) { // 수정 모드
        savedEventDto = await updateEvent(id, updatedFields);
        alert(`'${savedEventDto.eventName}' 이벤트 정보가 수정되었습니다.`);
      } else if (updatedFields.eventName && updatedFields.themeId) { // 생성 모드 (EventPostDto 형태)
        // createEvent는 ID를 반환하므로, 상세 정보를 다시 조회하거나, 응답 구조가 다르다면 조정 필요
        const newEventIdString = await createEvent({
            eventName: updatedFields.eventName,
            themeId: updatedFields.themeId,
            // eventStatus는 EventPostDto에 없으므로, 백엔드에서 기본값 설정 가정
        });
        if (newEventIdString) {
            // 생성 후 목록 새로고침 또는 해당 아이템만 추가/업데이트
            alert('새 이벤트가 등록되었습니다.');
        } else {
            throw new Error("이벤트 생성 후 ID를 받지 못했습니다.");
        }
      } else {
        alert("이벤트 정보가 충분하지 않습니다.");
        return;
      }
      fetchEvents(); // 목록 새로고침
    } catch (err) {
      console.error("이벤트 저장에 실패했습니다:", err);
      alert("이벤트 저장에 실패했습니다.");
    } finally {
      handleCloseEditModal();
    }
  };
  
  // 이벤트 정렬 옵션
  const eventSortOptions = [
    { value: 'id_desc', label: 'ID (최신순)' },
    { value: 'id_asc', label: 'ID (오래된순)' },
    { value: 'name_asc', label: '이벤트명 (오름차순)' },
    { value: 'name_desc', label: '이벤트명 (내림차순)' },
    // { value: 'activationTimeHours_asc', label: '활성화 시간 (빠른순)' }, // 백엔드 필드명과 맞추거나 제거
    // { value: 'activationTimeHours_desc', label: '활성화 시간 (느린순)' },// 백엔드 필드명과 맞추거나 제거
    { value: 'status_open_first', label: '상태 (활성 먼저)' },
  ];

  const tableData = useMemo((): EventTableItem[] => {
    // API에서 정렬을 지원한다면 클라이언트 사이드 정렬은 제거 가능
    const sortedEvents = [...events].sort((a, b) => {
      if (sortValue === 'id_desc') return b.eventId - a.eventId;
      if (sortValue === 'id_asc') return a.eventId - b.eventId;
      if (sortValue === 'name_asc') return a.eventName.localeCompare(b.eventName);
      if (sortValue === 'name_desc') return b.eventName.localeCompare(a.eventName);
      // if (sortValue === 'activationTimeHours_asc') return a.activationTimeHours - b.activationTimeHours; // 제거 또는 수정
      // if (sortValue === 'activationTimeHours_desc') return b.activationTimeHours - a.activationTimeHours; // 제거 또는 수정
      if (sortValue === 'status_open_first') {
        return (a.eventStatus === 'EVENT_OPEN' ? -1 : 1) - (b.eventStatus === 'EVENT_OPEN' ? -1 : 1);
      }
      return 0;
    });
    return sortedEvents.map(eventItem => ({
        ...eventItem,
        id: eventItem.eventId, // TableItem의 id와 매핑
    }));
  }, [events, sortValue]);

  const columns: ColumnDefinition<EventTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      // 페이지네이션을 고려한 No 계산: (현재 페이지 - 1) * 페이지당 아이템 수 + 인덱스 + 1
      cellRenderer: (_item, index) => (pageInfo ? (pageInfo.page - 1) * itemsPerPage + index + 1 : index + 1),
      headerClassName: 'w-[5%] text-center',
      cellClassName: 'text-center',
    },
    {
      key: 'name',
      header: '이벤트명',
      headerClassName: 'w-[25%]', // 너비 조정
      accessor: 'eventName',
    },
    {
      key: 'themeId',
      header: '연결된 테마 번호',
      accessor: 'themeId',
      headerClassName: 'w-[15%] text-center', // 너비 조정
      cellClassName: 'text-center',
    },
    // { // description, activationTimeHours 등은 상세 조회나 수정 모달에서 확인하도록 변경
    //   key: 'description',
    //   header: '설명',
    //   accessor: 'description',
    //   headerClassName: 'w-[35%]',
    //   cellRenderer: (item) => {
    //     const maxLength = 30;
    //     const displayText = item.description.length > maxLength 
    //       ? `${item.description.substring(0, maxLength)}...` 
    //       : item.description;
    //     return <span className="block" title={item.description}>{displayText}</span>;
    //   }
    // },
    {
      key: 'eventStatus',
      header: '상태',
      accessor: 'eventStatus',
      headerClassName: 'w-[15%] text-center', // 너비 조정
      cellClassName: 'text-center',
      cellRenderer: (item) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${getEventStatusBadgeStyle(item.eventStatus)}`}
        >
          {mapBackendStatusToFrontendLabel(item.eventStatus)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '관리',
      headerClassName: 'w-[15%]', // 너비 조정
      cellClassName: 'text-center space-x-1',
      cellRenderer: (item) => (
        <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(item)}>
          수정
        </Button>
      ),
    },
  ];
  const totalItemsCount = pageInfo ? pageInfo.totalElements : 0;
  const totalPages = pageInfo ? pageInfo.totalPages : 0;
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">채팅 이벤트 관리</h2>
            {/* <Button onClick={() => {
              setSelectedEvent(null); // 새 이벤트 추가 시 selectedEvent는 null
              setIsEditModalOpen(true);
            }}>새 이벤트 추가</Button> */}
          </div>
          
          {/* TODO: 필터 섹션 추가 (필요시) */}

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">이벤트 목록을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchEvents()} variant="outline">다시 시도</Button>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={tableData}
                totalCount={totalItemsCount}
                sortValue={sortValue}
                onSortChange={setSortValue}
                sortOptions={eventSortOptions}
                emptyStateMessage="관리할 이벤트가 없습니다."
              />
              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </main>
        {isEditModalOpen && ( // 모달이 열려있을 때만 렌더링
          <EventEditModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            eventItem={selectedEvent} // 수정 시에는 selectedEvent 전달, 생성 시에는 null
            onSave={handleSaveEvent}
          />
        )}
      </div>
    </div>
  );
}
