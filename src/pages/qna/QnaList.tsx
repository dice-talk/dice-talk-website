import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import { NewBadge } from "../../components/ui/NewBadge";
import { QuestionStatusBadge } from "../../components/ui/QuestionStatusBadge";
import { QnaFilterSection } from "../../components/qna/QnaFilterSection";
import { ReusableTable } from "../../components/common/ReusableTable";
import { Pagination } from "../../components/common/Pagination";
import type {
  ColumnDefinition,
  TableItem,
} from "../../components/common/reusableTableTypes";
import { getQuestions } from "../../api/questionApi";
import type { QuestionResponse } from "../../types/questionTypes";
import type { PageInfo } from "../../types/common";

type QnaStatus = "전체" | "QUESTION_REGISTERED" | "QUESTION_ANSWERED";

interface QnaTableItem extends QuestionResponse, TableItem {
  id: number; 
}

const qnaSortOptions = [
  { value: "desc", label: "등록일 (최신순)" },
  { value: "asc", label: "등록일 (오래된순)" },
];

const getStatusParam = (status: string) => {
  return status === "전체" ? undefined : status;
};

export default function QnaList() {
  const [qnas, setQnas] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    size: 10,
  });

  // UI 입력을 위한 필터 상태
  const [statusFilter, setStatusFilter] = useState<QnaStatus>("전체");
  const [searchType, setSearchType] = useState("제목"); // 기본 검색 유형
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortValue, setSortValue] = useState("desc");

  // 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    status: "전체" as QnaStatus,
    searchType: "제목",
    searchKeyword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQnas = async () => {
      setLoading(true);
      try {
        const statusParam = getStatusParam(appliedFilters.status);
        const params: {
          page: number;
          size: number;
          status?: string;
          sort: "desc" | "asc";
          keyword?: string;
          searchType?: "TITLE" | "AUTHOR" | "TITLE_AUTHOR" | "CONTENT";
        } = {
          page: pageInfo.page,
          size: pageInfo.size,
          sort: sortValue as "desc" | "asc",
        };
        if (statusParam) {
          params.status = statusParam;
        }
        if (appliedFilters.searchKeyword) {
          params.keyword = appliedFilters.searchKeyword;
          params.searchType = getSearchTypeValue(appliedFilters.searchType);
        }
        console.log("QnA 목록 요청 URL:", `/questions/admin`, params);
        const response = await getQuestions(params);
        if (response.data) {
          setQnas(response.data.data);
          setPageInfo(response.data.pageInfo);
        }
      } catch (error) {
        console.error("QnA 목록을 불러오는데 실패했습니다:", error);
        // TODO: 사용자에게 에러 메시지 표시
      } finally {
        setLoading(false);
      }
    };
    fetchQnas();
  }, [pageInfo.page, pageInfo.size, appliedFilters, sortValue]);

  const getSearchTypeValue = (
    searchType: string
  ): "TITLE" | "AUTHOR" | "TITLE_AUTHOR" | "CONTENT" | undefined => {
    switch (searchType) {
      case "제목":
        return "TITLE";
      case "작성자":
        return "AUTHOR";
      case "작성자+제목":
        return "TITLE_AUTHOR";
      case "내용":
        return "CONTENT";
      default:
        return undefined;
    }
  };

  const handleResetFilters = () => {
    // UI 필터 상태 초기화
    setStatusFilter("전체");
    setSearchType("제목");
    setSearchKeyword("");
    setAppliedFilters({
      status: "전체",
      searchType: "제목",
      searchKeyword: "",
    });
    setPageInfo((prev) => ({ ...prev, page: 1 })); // 초기화 시 첫 페이지로 이동
  };

  const handleSearch = () => {
    setAppliedFilters({
      status: statusFilter,
      searchType: searchType,
      searchKeyword: searchKeyword,
    });
    setPageInfo((prev) => ({ ...prev, page: 1 })); // 검색 시 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setPageInfo((prev) => ({ ...prev, page }));
  };

  //상세조회 페이지 이동
  const handleRowClick = (item: QnaTableItem) => {
    navigate(`/qna/${item.questionId}`);
  };

  const columns: ColumnDefinition<QnaTableItem>[] = [
    {
      key: "no",
      header: "No",
      cellRenderer: (item) => item.questionId, // questionId 그대로 출력
      headerClassName: "w-1/12", 
      cellClassName: "text-gray-700",
    },
    {
      key: "title",
      header: "제목",
      cellRenderer: (item) => {
        const displayTitle =
          item.title.length > 30
            ? `${item.title.substring(0, 30)}...`
            : item.title;
        return (
          <div
            className="w-full flex items-center justify-start text-left"
            title={item.title}
          >
            <NewBadge createdAt={item.createdAt} />
            <span className="ml-1 min-w-0">{displayTitle}</span>
          </div>
        );
      },
      headerClassName: "w-5/12 text-left",
      cellClassName: "text-left",
    },
    {
      key: "email",
      header: "작성자(이메일)",
      accessor: "email",
      headerClassName: "w-2/12",
      cellClassName: "text-gray-700",
    },
    {
      key: "questionStatus",
      header: "답변 등록",
      cellRenderer: (item) => (
        <QuestionStatusBadge status={item.questionStatus} />
      ),
      headerClassName: "w-2/12", 
    },
    {
      key: "createdAt",
      header: "등록일",
      accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
      headerClassName: "w-2/12",
      cellClassName: "text-gray-700",
    },
  ];

  const tableData = useMemo(
    () => qnas.map((qna) => ({ ...qna, id: qna.questionId } as QnaTableItem)),
    [qnas]
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <p className="text-white text-xl">데이터를 불러오는 중...</p>
          </div>
        )}
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
            onSearch={handleSearch}
          />

          {/* ReusableTable 사용 */}
          <ReusableTable
            columns={columns}
            data={tableData}
            totalCount={pageInfo.totalElements}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={qnaSortOptions}
            emptyStateMessage="검색 결과에 해당하는 Q&A가 없습니다."
            onRowClick={handleRowClick}
          />

          {/* 페이지네이션 컴포넌트 추가 */}
          {pageInfo.totalPages > 0 && (
            <Pagination
              currentPage={pageInfo.page}
              totalPages={pageInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
