// src/pages/event/EventManagementPage.tsx
import { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import Button from '../../components/ui/Button';
import { EventEditModal } from '../../components/chat/EventEditModal';
import { type EventItem, EventIdValues, type EventId } from '../../types/eventTypes';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';

// 초기 이벤트 데이터 (실제로는 API에서 가져옴)
const initialEvents: EventItem[] = [
  {
    id: EventIdValues.HEART_MESSAGE,
    name: '하트 메시지',
    description: '채팅방 참여 12시간 후, 호감가는 상대에게 익명으로 간단한 한 문장 메시지를 보낼 수 있습니다.',
    activationTimeHours: 12,
    isActive: true,
  },
  {
    id: EventIdValues.CUPIDS_ARROW,
    name: '큐피트의 화살',
    description: '채팅방 참여 40시간 후, 1:1 채팅을 원하는 상대에게 큐피트의 화살을 날릴 수 있습니다. 화살은 8시간 뒤 종료되며, 수정은 유료로 가능합니다.',
    activationTimeHours: 40,
    durationHours: 8,
    isModificationPaid: true,
    paidModificationDetails: '다이스 10개',
    isActive: true,
  },
];

// TableItem likely has an 'id' property (e.g., string | number).
// EventItem has 'id: EventId'.
// To resolve the conflict, Omit 'id' from EventItem and explicitly define it.
interface EventTableItem extends Omit<EventItem, 'id'>, TableItem {
  id: EventId; // Ensures the id from EventItem (EventId) is used.
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [sortValue, setSortValue] = useState('name_asc'); // 정렬 상태 추가

  const handleOpenEditModal = (eventItem: EventItem) => {
    setSelectedEvent(eventItem);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedEvent(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEvent = (updatedEvent: EventItem) => {
    setEvents(prevEvents =>
      prevEvents.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    handleCloseEditModal();
    // TODO: API 호출하여 서버에 저장
    alert(`'${updatedEvent.name}' 이벤트 정보가 수정되었습니다.`);
  };
  
  // 이벤트 정렬 옵션
  const eventSortOptions = [
    { value: 'name_asc', label: '이벤트명 (오름차순)' },
    { value: 'name_desc', label: '이벤트명 (내림차순)' },
    { value: 'activationTimeHours_asc', label: '활성화 시간 (빠른순)' },
    { value: 'activationTimeHours_desc', label: '활성화 시간 (느린순)' },
    { value: 'isActive_desc', label: '상태 (활성 먼저)' },
  ];

  const tableData = useMemo((): EventTableItem[] => {
    const sortedEvents = [...events].sort((a, b) => {
      if (sortValue === 'name_asc') return a.name.localeCompare(b.name);
      if (sortValue === 'name_desc') return b.name.localeCompare(a.name);
      if (sortValue === 'activationTimeHours_asc') return a.activationTimeHours - b.activationTimeHours;
      if (sortValue === 'activationTimeHours_desc') return b.activationTimeHours - a.activationTimeHours;
      if (sortValue === 'isActive_desc') return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0);
      return 0;
    });
    return sortedEvents.map(eventItem => ({
        ...eventItem,
    }));
  }, [events, sortValue]);

  const columns: ColumnDefinition<EventTableItem>[] = [
    {
      key: 'name',
      header: '이벤트명',
      accessor: 'name',
      headerClassName: 'w-[15%]',
    },
    {
      key: 'description',
      header: '설명',
      accessor: 'description',
      headerClassName: 'w-[35%]',
      cellRenderer: (item) => {
        const maxLength = 30;
        const displayText = item.description.length > maxLength 
          ? `${item.description.substring(0, maxLength)}...` 
          : item.description;
        return <span className="block" title={item.description}>{displayText}</span>;
      }
    },
    {
      key: 'activationTimeHours',
      header: '활성화 조건',
      accessor: (item) => `${item.activationTimeHours}시간 후`,
      headerClassName: 'w-[15%] text-center',
      cellClassName: 'text-center',
    },
    {
        key: 'details',
        header: '추가 정보',
        headerClassName: 'w-[15%] text-center',
        cellClassName: 'text-center text-xs',
        cellRenderer: (item) => (
            <div className="space-y-0.5">
                {item.durationHours && <div>지속: {item.durationHours}시간</div>}
                {item.isModificationPaid && <div>수정: {item.paidModificationDetails || '유료'}</div>}
                {(!item.durationHours && !item.isModificationPaid) && '-'}
            </div>
        )
    },
    {
      key: 'isActive',
      header: '상태',
      headerClassName: 'w-[10%] text-center',
      cellClassName: 'text-center',
      cellRenderer: (item) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full
            ${item.isActive ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
        >
          {item.isActive ? '활성' : '비활성'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '관리',
      headerClassName: 'w-[10%] text-center',
      cellClassName: 'text-center',
      cellRenderer: (item) => (
        <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(item)}>
          수정
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">채팅 이벤트 관리</h2>
            {/* <Button onClick={() => alert('새 이벤트 추가 기능은 준비 중입니다.')}>새 이벤트 추가</Button> */}
          </div>
          
          <ReusableTable
            columns={columns}
            data={tableData}
            totalCount={tableData.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={eventSortOptions}
            emptyStateMessage="관리할 이벤트가 없습니다."
          />
        </main>
        <EventEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          eventItem={selectedEvent}
          onSave={handleSaveEvent}
        />
      </div>
    </div>
  );
}
