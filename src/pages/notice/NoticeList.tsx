import { useState, useEffect, useCallback } from 'react'; // useCallback 추가
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { NoticeFilterSection } from '../../components/notice/NoticeFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge'; // StatusBadge 임포트
import {
  mapFrontendStatusToBackendForFilter,
  mapBackendTypeToFrontendList, // 이전 단계에서 이동된 함수
  mapBackendStatusToFrontendList // 이전 단계에서 이동된 함수
} from '../../lib/NoticeUtils';
import type { ColumnDefinition } from '../../components/common/reusableTableTypes';
import { getNotices } from '../../api/noticeApi'
import { type NoticeResponseDto, type NoticeImageDto, type NoticeTypeBack,  NoticeStatus, type NoticeItemView } from '../../types/noticeTypes'; 
import type { PageInfo } from '../../types/common';
import { formatDate } from '../../lib/DataUtils';

// 프론트엔드 표시용 NoticeItemView를 테이블 아이템으로 사용
type NoticeTableItem = NoticeItemView;

const noticeSortOptions = [
  { value: 'id_desc', label: '최신 등록순 (ID)' }, 
  { value: 'id_asc', label: '오래된 등록순 (ID)' },
  { value: 'importance_desc', label: '중요도순' },
];

export default function NoticeListPage() {
  const [notices, setNotices] = useState<NoticeItemView[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchNotices = useCallback(async (isReset: boolean = false) => {
    setIsLoading(true);
    try {
      const params: Parameters<typeof getNotices>[0] = {
        page: isReset ? 1 : currentPage,
        size: itemsPerPage,
        keyword: isReset ? undefined : appliedFilters.title.trim() || undefined,
        sort: sortValue === 'id_desc' 
          ? 'noticeId,desc' 
          : sortValue === 'id_asc' 
          ? 'noticeId,asc'
          : sortValue === 'importance_desc'
          ? 'noticeImportance,desc' // 'importance_desc'를 'noticeImportance,desc'로 변경
          : sortValue.replace('_', ','), 
        type: isReset || appliedFilters.type === '전체'
          ? undefined
          : (appliedFilters.type === '공지사항' ? 'NOTICE' : 'EVENT') as NoticeTypeBack,
        status: mapFrontendStatusToBackendForFilter(appliedFilters.noticeStatus as NoticeStatus | '전체'), // status 매핑 함수 사용
        // 중요도 필터링을 위한 파라미터 추가
        importance: isReset || appliedFilters.importance === '전체' 
          ? undefined 
          : (appliedFilters.importance === '중요' ? 1 : 0),
      };

      console.log("Fetching notices with params:", params);
      const response = await getNotices(params);
      const transformedNotices = response.data.map((notice: NoticeResponseDto): NoticeItemView => ({
        id: notice.noticeId,
        title: notice.title,
        content: notice.content,
        createdAt: notice.createdAt,
        isImportant: notice.noticeImportance === 1,
        type: mapBackendTypeToFrontendList(notice.noticeType)!, // Non-null assertion if type is guaranteed
        status: mapBackendStatusToFrontendList(notice.noticeStatus)!, 
        imageUrls: notice.noticeImages?.map((img: NoticeImageDto) => img.imageUrl),
        startDate: notice.startDate,
        endDate: notice.endDate,
      }));
      setNotices(transformedNotices);
      setPageInfo(response.pageInfo);
    } catch (error) {
      console.error("공지 목록을 불러오는데 실패했습니다:", error);
      setNotices([]); // 오류 발생 시 목록 비우기
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedFilters, sortValue, setIsLoading, setNotices, setPageInfo]); // fetchNotices가 의존하는 값들을 배열에 추가

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]); // 의존성 배열에 fetchNotices 추가

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
    if (currentPage !== 1) setCurrentPage(1); else fetchNotices(true); // 이미 1페이지면 바로 fetch
  };

  const handleSearch = () => {
    setAppliedFilters({
      type: typeFilter,
      importance: importanceFilter,
      noticeStatus: currentNoticeStatusFilter,
      title: titleSearch,
    });
    if (currentPage !== 1) setCurrentPage(1); // 검색 시 첫 페이지로 이동 (이미 1페이지면 useEffect가 처리)
  };

  // 서버에서 받아온 데이터를 바로 사용하므로, 클라이언트 사이드 필터링/정렬 로직 제거
  // const filteredAndSortedNotices = useMemo(() => { ... });
  // const paginatedNotices = useMemo(() => { ... });

  const totalPages = pageInfo ? pageInfo.totalPages : 0;
  // const currentItemsCount = notices.length; // 현재 페이지에 표시된 아이템 수 (API 응답 기반)
  const totalItemsCount = pageInfo ? pageInfo.totalElements : 0; // 전체 아이템 수

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (item: NoticeTableItem) => {
    // TODO: 공지사항 상세 페이지 경로로 변경 필요
    navigate(`/notices/${item.id}`);
    console.log("Navigating to notice detail:", item.id);
  };

  const columns: ColumnDefinition<NoticeTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => (pageInfo ? (pageInfo.page - 1) * pageInfo.size + index + 1 : index + 1), headerClassName: 'w-[5%]' },    { 
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
      cellRenderer: (item: NoticeTableItem) => <StatusBadge status={item.status} type="notice" />,
    },
    { 
      key: 'createdAt', 
      header: '등록일', 
      cellRenderer: (item) => formatDate(item.createdAt), // accessor 대신 cellRenderer 사용
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
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">목록을 불러오는 중입니다...</p>
            </div>
          ) : (
            <>
            <ReusableTable
              columns={columns}
              data={notices} // API에서 받아온 현재 페이지 데이터 사용
              totalCount={totalItemsCount} // 전체 아이템 수
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}