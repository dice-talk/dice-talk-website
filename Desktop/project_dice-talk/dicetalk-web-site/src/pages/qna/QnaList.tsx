import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { NewBadge } from '../../components/ui/NewBadge';
import { QnaFilterSection } from '../../components/qna/QnaFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination'; // Pagination 컴포넌트 임포트
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes'; // 타입 임포트 경로 변경
 
type QuestionStatusType = 'QUESTION_ANSWERED' | 'QUESTION_REGISTERED' | 'QUESTION_UPDATED';

interface QnaItem {
  questionId: number;
  title: string;
  content: string;
  authorEmail: string;
  questionStatus: QuestionStatusType;
  createdAt: string;
}

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

const mockQnas: QnaItem[] = [
  { questionId: 101, title: "비밀번호 변경은 어떻게 하나요? 비밀번호 변경 메뉴를 찾을 수 없습니다. 상세한 안내 부탁드립니다.", content: "로그인 후 마이페이지에서 비밀번호를 변경하려고 하는데, 메뉴를 찾을 수가 없습니다. 어디서 변경할 수 있나요?", authorEmail: "user1@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2025-05-28T10:00:00Z" },
  { questionId: 102, title: "앱 사용 중 오류가 발생합니다.", content: "채팅방에 입장하려고 할 때마다 앱이 강제 종료됩니다. 확인 부탁드립니다.", authorEmail: "user2@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2025-05-29T11:30:00Z" },
  { questionId: 103, title: "다이스톡 서비스 이용 문의", content: "유료 아이템 구매 시 환불 규정이 궁금합니다. 자세한 내용을 알려주세요.", authorEmail: "user3@example.com", questionStatus: "QUESTION_UPDATED", createdAt: "2025-05-30T14:15:00Z" },
  { questionId: 104, title: "친구 추가 기능이 궁금합니다. 자세히 알려주세요.", content: "친구의 아이디를 알고 있는데, 어떻게 추가해야 하나요? 친구 추가 버튼을 못 찾겠습니다.", authorEmail: "user4@example.com", questionStatus: "QUESTION_UPDATED", createdAt: "2025-05-31T14:02:20Z" }, // 'S' 제거
  { questionId: 105, title: "프로필 사진 변경 문의", content: "프로필 사진을 변경하고 싶은데 방법을 모르겠습니다. 알려주세요.", authorEmail: "user5@example.com", questionStatus: "QUESTION_REGISTERED", createdAt:"2025-06-01T09:00:00Z" },
  // 페이지네이션 테스트를 위한 추가 데이터
  { questionId: 106, title: "알림 설정은 어디서 하나요?", content: "푸시 알림을 끄고 싶은데 메뉴를 못 찾겠어요.", authorEmail: "user6@example.com", questionStatus: "QUESTION_REGISTERED", createdAt: "2025-06-02T10:00:00Z" },
  { questionId: 107, title: "채팅방 배경화면 변경 기능", content: "채팅방 배경화면을 커스텀할 수 있나요?", authorEmail: "user7@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2025-06-02T11:00:00Z" },
  { questionId: 108, title: "이모티콘 구매는 어떻게 하나요?", content: "새로운 이모티콘을 구매하고 싶은데 방법을 모르겠습니다.", authorEmail: "user8@example.com", questionStatus: "QUESTION_REGISTERED", createdAt: "2025-06-03T12:00:00Z" },
  { questionId: 109, title: "계정 탈퇴 절차가 궁금합니다.", content: "계정을 탈퇴하고 싶은데 어떻게 해야 하나요?", authorEmail: "user9@example.com", questionStatus: "QUESTION_UPDATED", createdAt: "2025-06-03T13:00:00Z" },
  { questionId: 110, title: "데이터 백업 기능 문의", content: "대화 내용을 백업할 수 있는 기능이 있나요?", authorEmail: "user10@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2025-06-04T14:00:00Z" },
  { questionId: 111, title: "다크 모드 지원 여부", content: "앱에서 다크 모드를 지원하나요?", authorEmail: "user11@example.com", questionStatus: "QUESTION_REGISTERED", createdAt: "2025-06-04T15:00:00Z" },
  { questionId: 112, title: "고객센터 운영 시간 문의", content: "고객센터는 몇 시부터 몇 시까지 운영하나요?", authorEmail: "user12@example.com", questionStatus: "QUESTION_UPDATED", createdAt: "2025-06-05T16:00:00Z" },
];

const AnswerStatusDisplay = ({ status }: { status: QuestionStatusType }) => {
  if (status === 'QUESTION_ANSWERED') {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">답변 완료</span>;
  }
  // QUESTION_REGISTERED, UPDATE는 답변 미등록으로 처리
  return <span className="text-gray-500">-</span>;
};

export default function QnaList() {
  const qnas: QnaItem[] = mockQnas; // useState 대신 const로 변경
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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