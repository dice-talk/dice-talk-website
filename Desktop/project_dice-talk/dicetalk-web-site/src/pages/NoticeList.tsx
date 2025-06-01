import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/Header';
import { NoticeFilterSection } from '../components/notice/NoticeFilterSection';
import { ReusableTable } from '../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../components/common/reusableTableTypes';

type NoticeType = '공지사항' | '이벤트';

interface NoticeItem extends TableItem { // TableItem을 직접 확장
  id: number;
  type: NoticeType;
  title: string;
  createdAt: string;
  views: number;
  isImportant: boolean;
}

// NoticeItem이 이미 TableItem을 확장하므로, NoticeTableItem은 NoticeItem의 별칭으로 사용
type NoticeTableItem = NoticeItem; 

const mockNotices: NoticeItem[] = [
  { id: 1, type: '공지사항', title: '[중요] 시스템 점검 안내 (06/15 02:00 ~ 04:00)', createdAt: '2024-06-10T10:00:00Z', views: 1024, isImportant: true },
  { id: 2, type: '이벤트', title: '여름맞이 주사위 증정 이벤트!', createdAt: '2024-06-08T14:00:00Z', views: 512, isImportant: false },
  { id: 3, type: '공지사항', title: '개인정보처리방침 개정 안내', createdAt: '2024-06-05T09:00:00Z', views: 340, isImportant: false },
  { id: 4, type: '공지사항', title: '서비스 이용약관 변경 사전 안내', createdAt: '2024-06-01T11:00:00Z', views: 450, isImportant: false },
  { id: 5, type: '이벤트', title: '친구 초대하고 보상 받자! 시즌2', createdAt: '2024-05-28T16:00:00Z', views: 880, isImportant: true },
  { id: 6, type: '공지사항', title: '다이스톡 v1.2 업데이트 안내', createdAt: '2024-05-25T13:00:00Z', views: 620, isImportant: false },
];

const noticeSortOptions = [
  { value: 'createdAt_desc', label: '최신 등록순' },
  { value: 'createdAt_asc', label: '오래된 등록순' },
  { value: 'views_desc', label: '조회수 높은순' },
  // { value: 'views_asc', label: '조회수 낮은순' }, // 필요시 추가
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export default function NoticeListPage() {
  const notices: NoticeItem[] = mockNotices;
  const [typeFilter, setTypeFilter] = useState('전체');
  const [importanceFilter, setImportanceFilter] = useState('전체');
  const [titleSearch, setTitleSearch] = useState('');
  const [sortValue, setSortValue] = useState('createdAt_desc');
  const navigate = useNavigate();

  const handleResetFilters = () => {
    setTypeFilter('전체');
    setImportanceFilter('전체');
    setTitleSearch('');
  };

  const filteredAndSortedNotices = useMemo(() => {
    let filtered = [...notices];

    if (typeFilter !== '전체') {
      filtered = filtered.filter(notice => notice.type === typeFilter);
    }
    if (importanceFilter !== '전체') {
      filtered = filtered.filter(notice => 
        importanceFilter === '중요' ? notice.isImportant : !notice.isImportant
      );
    }
    if (titleSearch) {
      filtered = filtered.filter(notice => notice.title.toLowerCase().includes(titleSearch.toLowerCase()));
    }

    if (sortValue === 'createdAt_desc') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortValue === 'createdAt_asc') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortValue === 'views_desc') {
      filtered.sort((a, b) => b.views - a.views);
    }

    return filtered.map(notice => ({ ...notice, id: notice.id }));
  }, [notices, typeFilter, importanceFilter, titleSearch, sortValue]);

  const handleRowClick = (item: NoticeTableItem) => {
    // TODO: 공지사항 상세 페이지 경로로 변경 필요
    // 예: navigate(`/admin/notices/${item.id}`) 또는 `/admin/events/${item.id}`
    // 현재는 QnA 상세 페이지로 임시 연결
    navigate(`/qna/${item.id}`); 
    console.log("Navigating to notice detail:", item.id);
  };

  const columns: ColumnDefinition<NoticeTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index + 1, headerClassName: 'w-[5%]' },
    { 
      key: 'type', 
      header: '유형', 
      accessor: 'type', 
      headerClassName: 'w-[10%]',
      cellRenderer: (item) => {
        // Badge 대신 간단한 텍스트 스타일링으로 변경
        const typeStyle = item.type === '이벤트' ? "text-purple-600 font-medium" : "text-blue-600";
        return <span className={typeStyle}>{item.type}</span>;
      }
    },
    {
      key: 'title',
      header: '제목',
      cellRenderer: (item) => (
        <div className="flex items-center text-left">
          {item.isImportant && <span className="text-red-500 font-bold mr-2">[중요]</span>}
          <span className="truncate" title={item.title}>{item.title.length > 40 ? `${item.title.substring(0, 40)}...` : item.title}</span>
        </div>
      ),
      headerClassName: 'w-[50%] text-left',
      cellClassName: 'text-left',
    },
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-[15%]' },
    { key: 'views', header: '조회수', accessor: 'views', headerClassName: 'w-[10%]' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">공지사항 & 이벤트 조회</h2>
          {/* TODO: "등록" 버튼 추가 위치 (예: 필터 섹션 위 또는 테이블 위) */}
          {/* <Button onClick={() => navigate('/admin/notices/new')} className="mb-4">새 공지/이벤트 등록</Button> */}
          <NoticeFilterSection
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            importanceFilter={importanceFilter}
            onImportanceFilterChange={setImportanceFilter}
            titleSearch={titleSearch}
            onTitleSearchChange={setTitleSearch}
            onResetFilters={handleResetFilters}
          />
          <ReusableTable
            columns={columns}
            data={filteredAndSortedNotices}
            totalCount={filteredAndSortedNotices.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={noticeSortOptions}
            emptyStateMessage="등록된 공지사항이나 이벤트가 없습니다."
            onRowClick={handleRowClick} // 상세 페이지 이동
          />
        </main>
      </div>
    </div>
  );
}