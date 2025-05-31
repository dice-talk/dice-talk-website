import { useState, useMemo } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/Header';
import { NewBadge } from '../components/ui/NewBadge';
import { QnaFilterSection } from '../components/qna/QnaFilterSection';
import { ReusableTable } from '../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../components/common/reusableTableTypes'; // 타입 임포트 경로 변경
 
type QuestionStatusType = 'QUESTION_ANSWERED' | 'QUESTION_REGISTERED' | 'UPDATE';

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

// 테스트를 위해 "어제" 날짜를 생성합니다.
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const mockQnas: QnaItem[] = [
  { questionId: 103, title: "비밀번호 변경은 어떻게 하나요?", content: "로그인 후 마이페이지에서 비밀번호를 변경하려고 하는데, 메뉴를 찾을 수가 없습니다. 어디서 변경할 수 있나요?", authorEmail: "user1@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2024-05-28T10:00:00Z" },
  { questionId: 102, title: "앱 사용 중 오류가 발생합니다.", content: "채팅방에 입장하려고 할 때마다 앱이 강제 종료됩니다. 확인 부탁드립니다.", authorEmail: "user2@example.com", questionStatus: "QUESTION_REGISTERED", createdAt: "2024-05-29T11:30:00Z" },
  { questionId: 101, title: "다이스톡 서비스 이용 문의", content: "유료 아이템 구매 시 환불 규정이 궁금합니다. 자세한 내용을 알려주세요.", authorEmail: "user3@example.com", questionStatus: "UPDATE", createdAt: "2024-05-30T14:15:00Z" },
  { questionId: 104, title: "친구 추가 기능이 궁금합니다. 자세히 알려주세요.", content: "친구의 아이디를 알고 있는데, 어떻게 추가해야 하나요? 친구 추가 버튼을 못 찾겠습니다.", authorEmail: "user4@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2024-05-27T09:00:00Z" },
  { questionId: 105, title: "프로필 사진 변경 문의", content: "프로필 사진을 변경하고 싶은데 방법을 모르겠습니다. 알려주세요.", authorEmail: "user5@example.com", questionStatus: "QUESTION_REGISTERED", createdAt: yesterday.toISOString() }, // createdAt을 "어제"로 변경
];

const AnswerStatusDisplay = ({ status }: { status: QuestionStatusType }) => {
  if (status === 'QUESTION_ANSWERED') {
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">답변 완료</span>;
  }
  // QUESTION_REGISTERED, UPDATE는 답변 미등록으로 처리
  return <span className="text-gray-500">-</span>;
};

export default function QnaList() {
  const [qnas] = useState<QnaItem[]>(mockQnas);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [authorSearch, setAuthorSearch] = useState('');
  const [titleSearch, setTitleSearch] = useState('');
  const [contentSearch, setContentSearch] = useState('');
  const [sortValue, setSortValue] = useState('questionId_desc'); // ReusableTable의 sortValue와 연결

  const handleResetFilters = () => {
    setStatusFilter('전체');
    setAuthorSearch('');
    setTitleSearch('');
    setContentSearch('');
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
          return qna.questionStatus === 'QUESTION_REGISTERED' || qna.questionStatus === 'UPDATE';
        }
        return true; // '전체'의 경우 모든 항목 포함 (실질적으로 위에서 처리됨)
      });
    }

    // 작성자(이메일) 검색
    if (authorSearch) {
      filtered = filtered.filter(qna => qna.authorEmail.toLowerCase().includes(authorSearch.toLowerCase()));
    }

    // 제목 검색
    if (titleSearch) {
      filtered = filtered.filter(qna => qna.title.toLowerCase().includes(titleSearch.toLowerCase()));
    }

    // 내용 검색
    if (contentSearch) {
      filtered = filtered.filter(qna => qna.content.toLowerCase().includes(contentSearch.toLowerCase()));
    }

    // 정렬 로직은 ReusableTable에 의해 관리되므로, 여기서는 필터링된 데이터를 TableItem 형식으로 변환
    if (sortValue === 'questionId_desc') {
      filtered.sort((a, b) => b.questionId - a.questionId);
    } else if (sortValue === 'questionId_asc') {
      filtered.sort((a, b) => a.questionId - b.questionId);
    }
    // ReusableTable에 맞게 id 필드 추가
    return filtered.map(qna => ({ ...qna, id: qna.questionId }));
  }, [qnas, statusFilter, authorSearch, titleSearch, contentSearch, sortValue]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const columns: ColumnDefinition<QnaTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => index + 1, // ReusableTable에서 index를 받아 순번 표시
      headerClassName: 'w-1/12',
      cellClassName: 'text-gray-700',
    },
    {
      key: 'title',
      header: '제목',
      cellRenderer: (item) => (
        <div className="w-60 md:w-80 truncate mx-auto flex items-center justify-start text-left" title={item.title}>
          <NewBadge createdAt={item.createdAt} />
          <span className="truncate ml-1">{item.title}</span>
        </div>
      ),
      headerClassName: 'w-5/12 text-left',
      cellClassName: 'text-left',
    },
    {
      key: 'authorEmail',
      header: '작성자(이메일)',
      accessor: 'authorEmail',
      headerClassName: 'w-3/12',
      cellClassName: 'text-gray-700',
    },
    {
      key: 'questionStatus',
      header: '답변 등록',
      cellRenderer: (item) => <AnswerStatusDisplay status={item.questionStatus} />,
      headerClassName: 'w-2/12',
    },
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-2/12', cellClassName: 'text-gray-700' },
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
            authorSearch={authorSearch}
            onAuthorSearchChange={setAuthorSearch}
            titleSearch={titleSearch}
            onTitleSearchChange={setTitleSearch}
            contentSearch={contentSearch}
            onContentSearchChange={setContentSearch}
            onResetFilters={handleResetFilters}
          />

          {/* ReusableTable 사용 */}
          <ReusableTable
            columns={columns}
            data={filteredAndSortedQnas}
            totalCount={filteredAndSortedQnas.length} // 필터링된 결과의 개수를 totalCount로 사용
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={qnaSortOptions}
            emptyStateMessage="검색 결과에 해당하는 Q&A가 없습니다."
          />

        </main>
      </div>
    </div>
  );
}