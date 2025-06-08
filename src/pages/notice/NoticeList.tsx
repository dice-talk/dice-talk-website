import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { NoticeFilterSection } from '../../components/notice/NoticeFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination'; // Pagination 컴포넌트 임포트
import Button from '../../components/ui/Button'; // Button 컴포넌트 임포트
import { NoticeStatus, formatDate } from '../../components/notice/noticeUtils'; // formatDate 추가 및 경로 수정 확인
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';

interface NoticeItem extends TableItem { // TableItem을 직접 확장
  id: number;
  title: string;
  createdAt: string;
  // views: number; // 조회수 필드 제거 또는 주석 처리 (테이블에서만 제거)
  isImportant: boolean;
  type: '공지사항' | '이벤트';
  status: NoticeStatus; // 상태 필드 추가
}
 
// NoticeItem이 이미 TableItem을 확장하므로, NoticeTableItem은 NoticeItem의 별칭으로 사용
type NoticeTableItem = NoticeItem; 

const mockNotices: NoticeItem[] = [
  { id: 1, type: '공지사항', title: '[중요] 시스템 점검 안내 (06/15 02:00 ~ 04:00)', createdAt: '2024-06-10T10:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED },
  { id: 2, type: '이벤트', title: '여름맞이 주사위 증정 이벤트!', createdAt: '2024-06-08T14:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 3, type: '공지사항', title: '개인정보처리방침 개정 안내', createdAt: '2024-06-05T09:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 4, type: '공지사항', title: '서비스 이용약관 변경 사전 안내', createdAt: '2024-06-01T11:00:00Z', isImportant: false, status: NoticeStatus.CLOSED },
  { id: 5, type: '이벤트', title: '친구 초대하고 보상 받자! 시즌2', createdAt: '2024-05-28T16:00:00Z', isImportant: true, status: NoticeStatus.CLOSED },
  { id: 6, type: '공지사항', title: '다이스톡 v1.2 업데이트 안내', createdAt: '2024-05-25T13:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 7, type: '이벤트', title: '새로운 기능 사전 공개 이벤트', createdAt: '2024-07-01T00:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED },
  { id: 8, type: '공지사항', title: '서버 안정화 작업 완료 안내', createdAt: '2024-06-15T05:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  // 페이지네이션 테스트를 위한 추가 데이터
  { id: 9, type: '이벤트', title: '주말 특별 접속 보상 이벤트', createdAt: '2024-06-20T00:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 10, type: '공지사항', title: '고객센터 운영시간 변경 안내', createdAt: '2024-06-18T09:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 11, type: '이벤트', title: '신규 테마 출시 기념 할인', createdAt: '2024-06-22T10:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED },
  { id: 12, type: '공지사항', title: '앱 보안 강화 업데이트 안내', createdAt: '2024-06-25T11:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED },
  { id: 13, type: '이벤트', title: '여름 방학 맞이 출석체크 이벤트', createdAt: '2024-07-05T00:00:00Z', isImportant: false, status: NoticeStatus.SCHEDULED },
  { id: 14, type: '공지사항', title: '서비스 점검 연장 안내', createdAt: '2024-06-15T03:30:00Z', isImportant: true, status: NoticeStatus.ONGOING },
  { id: 15, type: '이벤트', title: '깜짝 퀴즈 이벤트! 정답 맞추고 선물받자', createdAt: '2024-06-19T15:00:00Z', isImportant: false, status: NoticeStatus.CLOSED },
];

const noticeSortOptions = [
  { value: 'id_desc', label: '최신 등록순 (ID)' }, // noticeId 대신 id 사용
  { value: 'id_asc', label: '오래된 등록순 (ID)' },
  { value: 'importance_desc', label: '중요도순' },
];

export default function NoticeListPage() {
  const notices: NoticeItem[] = mockNotices;
  // UI 입력을 위한 필터 상태
  const [typeFilter, setTypeFilter] = useState('전체');
  const [importanceFilter, setImportanceFilter] = useState('전체'); // statusFilter -> importanceFilter
  const [currentNoticeStatusFilter, setCurrentNoticeStatusFilter] = useState('전체'); // 새로운 공지 상태 필터
  const [titleSearch, setTitleSearch] = useState(''); // searchKeyword -> titleSearch
  const [sortValue, setSortValue] = useState('id_desc'); // 정렬 기본값 변경

  // API 요청 또는 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    type: '전체',
    importance: '전체',
    noticeStatus: '전체',
    title: '',
  });

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const itemsPerPage = 10; // 페이지당 보여줄 아이템 수
  const navigate = useNavigate();

  const handleResetFilters = () => {
    // UI 필터 상태 초기화
    setTypeFilter('전체');
    setImportanceFilter('전체');
    setCurrentNoticeStatusFilter('전체');
    setTitleSearch('');
    // 적용된 필터 상태도 초기화
    setAppliedFilters({
      type: '전체',
      importance: '전체',
      noticeStatus: '전체',
      title: '',
    });
    setCurrentPage(1); // 초기화 시 첫 페이지로 이동
  };

  const handleSearch = () => {
    setAppliedFilters({
      type: typeFilter,
      importance: importanceFilter,
      noticeStatus: currentNoticeStatusFilter,
      title: titleSearch,
    });
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const filteredAndSortedNotices = useMemo(() => {
    let filtered = [...notices];

    if (appliedFilters.type !== '전체') {
      filtered = filtered.filter(notice => notice.type === appliedFilters.type);
    }
    if (appliedFilters.importance !== '전체') {
      filtered = filtered.filter(notice => appliedFilters.importance === '중요' ? notice.isImportant : !notice.isImportant);
    }
    if (appliedFilters.noticeStatus !== '전체') {
      filtered = filtered.filter(notice => notice.status === appliedFilters.noticeStatus);
    }
    if (appliedFilters.title) {
      filtered = filtered.filter(notice => notice.title.toLowerCase().includes(appliedFilters.title.toLowerCase()));
    }

    // id 기준으로 정렬
    if (sortValue === 'id_desc') {
      filtered.sort((a, b) => b.id - a.id);
    } else if (sortValue === 'id_asc') {
      filtered.sort((a, b) => a.id - b.id);
    } else if (sortValue === 'importance_desc') {
      filtered.sort((a, b) => {
        // isImportant가 true인 항목을 우선 정렬 (true는 1, false는 0으로 간주하여 내림차순)
        if (a.isImportant !== b.isImportant) {
          return (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0);
        }
        // isImportant가 같으면 id 내림차순 (최신순)으로 정렬
        return b.id - a.id;
      });
    }

    return filtered.map(notice => ({ ...notice, id: notice.id }));
  }, [notices, appliedFilters, sortValue]);

  // 페이지네이션을 위한 데이터 계산
  const paginatedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedNotices.slice(startIndex, endIndex);
  }, [filteredAndSortedNotices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedNotices.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (item: NoticeTableItem) => {
    // TODO: 공지사항 상세 페이지 경로로 변경 필요
    navigate(`/notices/${item.id}`); 
    console.log("Navigating to notice detail:", item.id);
  };

  const columns: ColumnDefinition<NoticeTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => (currentPage - 1) * itemsPerPage + index + 1, headerClassName: 'w-[5%]' },
    { 
      key: 'type', 
      header: '유형', 
      accessor: 'type', 
      headerClassName: 'w-[15%]',
      // cellRenderer: (item) => {
      //   const typeStyle = item.type === '이벤트' ? "text-purple-600 font-medium" : "text-blue-600";
      //   return <span className={typeStyle}>{item.type}</span>;
      // }
    },
    {
      key: 'title',
      header: '제목',
      cellRenderer: (item) => (
        <div className="flex items-center text-left">
          {item.isImportant && <span className="text-red-500 font-bold mr-2">[중요]</span>}
          <span className="truncate" title={item.title}>{item.title.length > 35 ? `${item.title.substring(0, 35)}...` : item.title}</span>
        </div>
      ),
      headerClassName: 'w-[34%] text-left', // 너비 조정 (기존 45% -> 약 34%)
      cellClassName: 'text-left',
    },
    { 
      key: 'status',
      header: '상태',
      headerClassName: 'w-[15%]',
      cellRenderer: (item) => (
        <span className={
          `px-2.5 py-1 text-xs font-semibold rounded-full
          ${item.status === NoticeStatus.ONGOING ? 'bg-green-100 text-green-700' : ''}
          ${item.status === NoticeStatus.SCHEDULED ? 'bg-blue-100 text-blue-700' : ''}
          ${item.status === NoticeStatus.CLOSED ? 'bg-gray-100 text-gray-700' : ''}
        `}>
          {item.status}
        </span>
      ),
    },
    { 
      key: 'createdAt', 
      header: '등록일', 
      accessor: (item) => formatDate(item.createdAt),
      headerClassName: 'w-[15%]', // 제목 컬럼 너비 감소에 따라 등록일 컬럼 너비 소폭 증가
      cellClassName: 'text-gray-700'
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">공지사항 & 이벤트 조회</h2>
          <div className="flex justify-end mb-6">
            <Button onClick={() => navigate('/notices/new')}>새 공지/이벤트 등록</Button>
          </div>
          
          <NoticeFilterSection
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            importanceFilter={importanceFilter}
            onImportanceFilterChange={setImportanceFilter}
            noticeStatusFilter={currentNoticeStatusFilter} // 새로운 prop 전달
            onNoticeStatusFilterChange={setCurrentNoticeStatusFilter} // 새로운 prop 전달
            titleSearch={titleSearch} // searchKeyword -> titleSearch
            onTitleSearchChange={setTitleSearch} // onSearchKeywordChange -> onTitleSearchChange
            onResetFilters={handleResetFilters}
            onSearch={handleSearch} // 조회 핸들러 연결
          />
          <ReusableTable
            columns={columns}
            data={paginatedNotices} // 페이지네이션된 데이터 사용
            totalCount={filteredAndSortedNotices.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={noticeSortOptions}
            emptyStateMessage="등록된 공지사항이나 이벤트가 없습니다."
            onRowClick={handleRowClick} // 상세 페이지 이동
          />
          {/* 페이지네이션 컴포넌트 추가 */}
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