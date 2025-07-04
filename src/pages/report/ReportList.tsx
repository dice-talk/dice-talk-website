import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import { ReportFilterSection } from "../../components/report/ReportFilterSection";
import { ReusableTable } from "../../components/common/ReusableTable";
import { Pagination } from "../../components/common/Pagination";
import type {
  ReportResponse,
  ReportStatus,
  ReportReason,
} from "../../types/reportTypes";
import type { ChatResponseDto } from "../../types/chatroom/chatTypes";
import type {
  ColumnDefinition,
  TableItem,
} from "../../components/common/reusableTableTypes";
import { getReportReasonLabel } from "../../lib/ReportUtils";
import { getReports, type GetReportsParams } from "../../api/reportApi";
import StatusBadge from "../../components/ui/StatusBadge";
import { formatDate } from "../../lib/DataUtils";

interface ReportTableItem extends TableItem {
  reportId: number;
  reportReason: ReportReason;
  reporterId: number;
  reporterEmail: string;
  reportedMemberId: number;
  reportedEmail: string;
  reportedChats: ChatResponseDto[];
  reportStatus: ReportStatus;
  createdAt: string;
  modifiedAt: string;
  reporterInfo: string;
  reportedInfo: string;
}

export default function ReportListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // UI 입력을 위한 필터 상태
  const [statusFilter, setStatusFilter] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("DESC");

  // 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    status: "전체",
    term: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      const cleanParams: GetReportsParams = {
        page: currentPage,
        size: itemsPerPage,
        ...(appliedFilters.status !== "전체"
          ? { reportStatus: appliedFilters.status as ReportStatus }
          : {}),
        ...(appliedFilters.term ? { searchTerm: appliedFilters.term } : {}),
        ...(sortValue ? { sort: sortValue } : {}),
      };
      console.log("🔍 필터 파라미터", cleanParams);

      const response = await getReports(cleanParams);
      setReports(response.data.data);
      setTotalCount(response.data.pageInfo.totalElements);
    } catch (error) {
      console.error("신고 목록을 불러오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedFilters, sortValue]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleResetFilters = () => {
    setStatusFilter("전체");
    setSearchTerm("");
    setSortValue("DESC");
    setAppliedFilters({
      status: "전체",
      term: "",
    });
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setAppliedFilters({
      status: statusFilter,
      term: searchTerm,
    });
    if (currentPage === 1) {
      fetchReports();
    } else {
      setCurrentPage(1); 
    }
  };

  const filteredAndSortedReports = useMemo(() => {
   
    return reports.map((r) => ({
      ...r,
      id: r.reportId,
      reporterInfo: `${r.reporterEmail} (ID: ${r.reporterId})`,
      reportedInfo: `${r.reportedEmail} (ID: ${r.reportedMemberId})`,
    }));
  }, [reports]); // appliedFilters와 sortValue 의존성 제거 (API가 처리)

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowClick = (item: ReportTableItem) =>
    navigate(`/reports/${item.reportId}`);

  const columns: ColumnDefinition<ReportTableItem>[] = [
    {
      key: "reportId",
      header: "신고 ID",
      accessor: "reportId",
      headerClassName: "w-[8%]",
    },
    {
      key: "reportReason",
      header: "신고 사유",
      cellRenderer: (item) => getReportReasonLabel(item.reportReason),
    },
    {
      key: "reporterInfo",
      header: "신고자",
      accessor: "reporterInfo",
      headerClassName: "w-[20%]",
    },
    {
      key: "reportedInfo",
      header: "피신고자",
      accessor: "reportedInfo",
      headerClassName: "w-[20%]",
    },
    {
      key: "reportStatus",
      header: "상태",
      cellRenderer: (item) => (
        <StatusBadge status={item.reportStatus} type="report" />
      ),
    },
    {
      key: "createdAt",
      header: "신고일",
      accessor: (item) => formatDate(item.createdAt),
      headerClassName: "w-[15%]",
    },
  ];

  const reportSortOptions = [
    { value: "createdAt_desc", label: "신고일 (최신순)" },
    { value: "createdAt_asc", label: "신고일 (오래된순)" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            사용자 신고 관리
          </h2>

          <ReportFilterSection
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onResetFilters={handleResetFilters}
            onSearch={handleSearch}
          />
          <ReusableTable
            columns={columns}
            data={filteredAndSortedReports}
            totalCount={totalCount}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={reportSortOptions}
            emptyStateMessage="접수된 신고가 없습니다."
            onRowClick={handleRowClick}
            isLoading={loading}
          />
          {totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
