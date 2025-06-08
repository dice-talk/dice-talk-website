import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar'; // 관리자용 페이지로 가정
import Header from '../../components/Header';
import { NewBadge } from '../../components/ui/NewBadge';
import { QnaFilterSection } from '../../components/qna/QnaFilterSection'; // 동일 필터 사용 가능
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
// QnaDetail에서 export된 타입과 데이터를 사용
import { type QnaItem,type QuestionStatusType, mockQnas, formatDate } from '../qna/QnaDetail';

// ReusableTable을 위한 QnaItem 확장 (TableItem의 id와 매핑)
interface SuspendedQnaTableItem extends QnaItem, TableItem {
  id: number; // questionId를 id로 사용
}; 

const guestQnaSortOptions = [
  { value: 'questionId_desc', label: '등록 최신순' },
  { value: 'questionId_asc', label: '등록 오래된순' },
];

// mockQnas를 GuestQna 데이터로 사용 (실제로는 API를 통해 비회원 QnA 목록을 가져와야 함)
// 여기서는 모든 QnA가 비회원 QnA라고 가정하거나, authorEmail을 기준으로 필터링할 수 있습니다.
// 요청의 맥락상, 관리자가 모든 QnA(회원/비회원 구분 없이 또는 비회원 전용)를 보는 페이지일 수 있습니다.
// 일단은 모든 mockQnas를 사용합니다.

const AnswerStatusDisplay = ({ status }: { status: QuestionStatusType }) => {
  if (status === 'QUESTION_ANSWERED') {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">답변 완료</span>;
  }
  return <span className="text-gray-500">-</span>; // 답변 미등록 (QUESTION_REGISTERED, QUESTION_UPDATED)
};

export default function SuspendedQnaListPage() { // 컴포넌트 이름은 이미 수정되어 있었습니다.
  // 비회원 QnA는 별도의 상태 관리나 API 호출이 필요할 수 있음
  // 여기서는 mockQnas를 그대로 사용
  const qnas: QnaItem[] = useMemo(() => mockQnas, []); // mockQnas는 변경되지 않으므로 useMemo로 감싸기
  // UI 입력을 위한 필터 상태
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchType, setSearchType] = useState('제목');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortValue, setSortValue] = useState('questionId_desc');

  // 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    status: '전체',
    searchType: '제목',
    searchKeyword: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleResetFilters = () => {
    // UI 필터 상태 초기화
    setStatusFilter('전체');
    setSearchType('제목');
    setSearchKeyword('');
    // 적용된 필터 상태도 초기화
    setAppliedFilters({
      status: '전체',
      searchType: '제목',
      searchKeyword: '',
    });
    setCurrentPage(1); // 초기화 시 첫 페이지로 이동
  };

  const handleSearch = () => {
    setAppliedFilters({
      status: statusFilter,
      searchType: searchType,
      searchKeyword: searchKeyword,
    });
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const filteredAndSortedQnas = useMemo(() => {
    let filtered = [...qnas];

    if (appliedFilters.status !== '전체') {
      filtered = filtered.filter(qna => {
        if (appliedFilters.status === '답변 완료') return qna.questionStatus === 'QUESTION_ANSWERED';
        if (appliedFilters.status === '답변 미등록') return qna.questionStatus === 'QUESTION_REGISTERED' || qna.questionStatus === 'QUESTION_UPDATED';
        return true;
      });
    }

    if (appliedFilters.searchKeyword) {
      const keyword = appliedFilters.searchKeyword.toLowerCase();
      filtered = filtered.filter(qna => {
        if (appliedFilters.searchType === '작성자') return qna.authorEmail.toLowerCase().includes(keyword);
        if (appliedFilters.searchType === '제목') return qna.title.toLowerCase().includes(keyword);
        if (appliedFilters.searchType === '내용') return qna.content.toLowerCase().includes(keyword);
        if (appliedFilters.searchType === '작성자+제목') return qna.authorEmail.toLowerCase().includes(keyword) || qna.title.toLowerCase().includes(keyword); // '제목+내용' -> '작성자+제목' 및 필터 로직 수정
        return true;
      });
    }

    if (sortValue === 'questionId_desc') {
      filtered.sort((a, b) => b.questionId - a.questionId);
    } else if (sortValue === 'questionId_asc') {
      filtered.sort((a, b) => a.questionId - b.questionId);
    }
    return filtered.map(qna => ({ ...qna, id: qna.questionId } as SuspendedQnaTableItem));
  }, [qnas, appliedFilters, sortValue]);
  // Note: filteredAndSortedQnas의 타입은 GuestQnaTableItem[] 이지만, SuspendedQnaTableItem과 구조가 동일하므로 여기서는 그대로 사용합니다.
  const paginatedQnas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedQnas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedQnas, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedQnas.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (item: SuspendedQnaTableItem) => {
    navigate(`/suspended-qna/${item.questionId}`); // 정지된 회원 QnA 상세 페이지로 이동
  };

  const columns: ColumnDefinition<SuspendedQnaTableItem>[] = [
    { // Note: columns 타입은 GuestQnaTableItem[] 이지만, SuspendedQnaTableItem과 구조가 동일하므로 여기서는 그대로 사용합니다.
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => (currentPage - 1) * itemsPerPage + index + 1,
      headerClassName: 'w-1/12',
      cellClassName: 'text-gray-700',
    },
    {
      key: 'title',
      header: '제목',
      cellRenderer: (item) => {
        const displayTitle = item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title;
        return (
            <div className="w-full flex items-center justify-start text-left" title={item.title}>
              <NewBadge createdAt={item.createdAt} />
              <span className="ml-1 min-w-0">{displayTitle}</span>
            </div>
        );
      },
      headerClassName: 'w-5/12 text-left',
      cellClassName: 'text-left',
    },
    {
      key: 'authorEmail',
      header: '작성자(이메일)', // 비회원 문의이므로 이메일이 중요
      accessor: 'authorEmail',
      headerClassName: 'w-3/12', // 이메일이 길 수 있으므로 너비 조정
      cellClassName: 'text-gray-700 truncate', // 내용이 길 경우 잘라내기
    },
    {
      key: 'questionStatus',
      header: '답변 상태', // '답변 등록' -> '답변 상태'
      cellRenderer: (item) => <AnswerStatusDisplay status={item.questionStatus} />,
      headerClassName: 'w-1/12', // 너비 조정
    },
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-2/12', cellClassName: 'text-gray-700' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar /> {/* 관리자가 비회원 문의를 확인하는 페이지로 가정 */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">정지된 회원 QnA 관리</h2>

          <QnaFilterSection
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
            onResetFilters={handleResetFilters}
            onSearch={handleSearch} // 조회 핸들러 연결
            // 비회원 QnA에 특화된 검색 옵션이 있다면 추가 가능 (예: 이메일만 검색)
          />

          <ReusableTable
            columns={columns}
            data={paginatedQnas}
            totalCount={filteredAndSortedQnas.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={guestQnaSortOptions}
            emptyStateMessage="검색 결과에 해당하는 비회원 Q&A가 없습니다."
            onRowClick={handleRowClick}
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