import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { NewBadge } from '../../components/ui/NewBadge';
import { QnaFilterSection } from '../../components/qna/QnaFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination'; // Pagination 컴포넌트 임포트
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
// QnaDetail.tsx에서 QnaItem, QuestionStatusType, mockQnas, formatDate를 가져옴
import { type QnaItem, type QuestionStatusType, mockQnas as importedMockQnas, formatDate } from './QnaDetail';

// ReusableTable을 위한 QnaItem 확장 (TableItem의 id와 매핑)
interface QnaTableItem extends QnaItem, TableItem {
  id: number; // questionId를 id로 사용
};

const qnaSortOptions = [
  { value: 'questionId_desc', label: '등록 최신순' },
  { value: 'questionId_asc', label: '등록 오래된순' },
];

// // 테스트를 위해 "어제" 날짜를 생성합니다.
// const yesterday = new Date();
// yesterday.setDate(yesterday.getDate() - 1);
// mockQnas를 importedMockQnas로 사용

const AnswerStatusDisplay = ({ status }: { status: QuestionStatusType }) => {
  if (status === 'QUESTION_ANSWERED') {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">답변 완료</span>;
  }
  // QUESTION_REGISTERED, UPDATE는 답변 미등록으로 처리
  return <span className="text-gray-500">-</span>;
};

export default function QnaList() {
  const qnas: QnaItem[] = useMemo(() => importedMockQnas, []); // importedMockQnas 사용 및 useMemo
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchType, setSearchType] = useState('제목'); // 기본 검색 유형
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortValue, setSortValue] = useState('questionId_desc'); // ReusableTable의 sortValue와 연결
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const itemsPerPage = 10; // 페이지당 보여줄 아이템 수
  const navigate = useNavigate();

  const handleResetFilters = () => {
    setStatusFilter('전체');
    setSearchType('제목');
    setSearchKeyword('');
  };

 
  const filteredAndSortedQnas = useMemo(() => {
    let filtered = [...qnas];

    // 상태 필터링
    if (statusFilter !== '전체') {
      filtered = filtered.filter(qna => {
        if (statusFilter === '답변 완료') {
          return qna.questionStatus === 'QUESTION_ANSWERED';
        }
        if (statusFilter === '답변 미등록') {
          return qna.questionStatus === 'QUESTION_REGISTERED' || qna.questionStatus === 'QUESTION_UPDATED';
        }
        return true; // '전체'의 경우 모든 항목 포함 (실질적으로 위에서 처리됨)
      });
    }

    // 통합 검색 필터링
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(qna => {
        if (searchType === '작성자') {
          return qna.authorEmail.toLowerCase().includes(keyword);
        } else if (searchType === '제목') {
          return qna.title.toLowerCase().includes(keyword);
        } else if (searchType === '내용') {
          return qna.content.toLowerCase().includes(keyword);
        } else if (searchType === '제목+내용') {
          return qna.title.toLowerCase().includes(keyword) || qna.content.toLowerCase().includes(keyword);
        }
        return true;
      });
    }

    // 정렬 로직은 ReusableTable에 의해 관리되므로, 여기서는 필터링된 데이터를 TableItem 형식으로 변환
    if (sortValue === 'questionId_desc') {
      filtered.sort((a, b) => b.questionId - a.questionId);
    } else if (sortValue === 'questionId_asc') {
      filtered.sort((a, b) => a.questionId - b.questionId);
    }
    // ReusableTable에 맞게 id 필드 추가
    return filtered.map(qna => ({ ...qna, id: qna.questionId } as QnaTableItem)); // 명시적 타입 캐스팅 추가
  }, [qnas, statusFilter, searchType, searchKeyword, sortValue]);

  // 페이지네이션을 위한 데이터 계산
  const paginatedQnas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedQnas.slice(startIndex, endIndex);
  }, [filteredAndSortedQnas, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedQnas.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //상세조회 페이지 이동 
  const handleRowClick = (item: QnaTableItem) => {
    navigate(`/qna/${item.questionId}`);
  };

  const columns: ColumnDefinition<QnaTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => (currentPage - 1) * itemsPerPage + index + 1, // 페이지네이션 고려한 순번
      headerClassName: 'w-1/12', // 약 8.33%
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
      headerClassName: 'w-5/12 text-left', // 약 41.67%
      cellClassName: 'text-left',
    },
    {
      key: 'authorEmail',
      header: '작성자(이메일)',
      accessor: 'authorEmail',
      headerClassName: 'w-2/12', // 약 16.67% (기존 3/12에서 조정)
      cellClassName: 'text-gray-700',
    },
    {
      key: 'questionStatus',
      header: '답변 등록',
      cellRenderer: (item) => <AnswerStatusDisplay status={item.questionStatus} />,
      headerClassName: 'w-2/12', // 약 16.67%
    },
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-2/12', cellClassName: 'text-gray-700' }, // 약 16.67%
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">QnA 관리</h2>

          {/* 필터 섹션 컴포넌트 사용 */}
          <QnaFilterSection
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
            onResetFilters={handleResetFilters}
          />

          {/* ReusableTable 사용 */}
          <ReusableTable
            columns={columns}
            data={paginatedQnas} // 페이지네이션된 데이터 사용
            totalCount={filteredAndSortedQnas.length} // 필터링된 결과의 개수를 totalCount로 사용
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={qnaSortOptions}
            emptyStateMessage="검색 결과에 해당하는 Q&A가 없습니다."
            onRowClick={handleRowClick}
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