// src/pages/report/ReportListPage.tsx
import { useState, useMemo, useEffect } from "react";
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
import type { ChatResponse } from "../../types/chatTypes";
import type {
  ColumnDefinition,
  TableItem,
} from "../../components/common/reusableTableTypes";
import { formatDate } from "../../lib/ReportUtils";
import { getReports } from "../../api/reportApi";

interface ReportTableItem extends TableItem {
  reportId: number;
  reportReason: ReportReason;
  reporterId: number;
  reporterEmail: string;
  reportedMemberId: number;
  reportedEmail: string;
  reportedChats: ChatResponse[];
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
  const [sortValue, setSortValue] = useState("createdAt_desc");

  // 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    status: "전체",
    term: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReports(currentPage, itemsPerPage);
      setReports(response.data.data);
      setTotalCount(response.data.pageInfo.totalElements);
    } catch (error) {
      console.error("신고 목록을 불러오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setStatusFilter("전체");
    setSearchTerm("");
    setSortValue("createdAt_desc");
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
    setCurrentPage(1);
  };

  const filteredAndSortedReports = useMemo(() => {
    let filtered = [...reports];

    if (appliedFilters.status !== "전체") {
      filtered = filtered.filter(
        (report) => report.reportStatus === appliedFilters.status
      );
    }
    if (appliedFilters.term) {
      const lowerSearchTerm = appliedFilters.term.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.reporterEmail.toLowerCase().includes(lowerSearchTerm) ||
          report.reporterId.toString().includes(lowerSearchTerm) ||
          report.reportedEmail.toLowerCase().includes(lowerSearchTerm) ||
          report.reportedMemberId.toString().includes(lowerSearchTerm)
      );
    }

    if (sortValue === "createdAt_desc") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortValue === "createdAt_asc") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return filtered.map((r) => ({
      ...r,
      id: r.reportId,
      reporterInfo: `${r.reporterEmail} (ID: ${r.reporterId})`,
      reportedInfo: `${r.reportedEmail} (ID: ${r.reportedMemberId})`,
    }));
  }, [reports, appliedFilters, sortValue]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowClick = (item: ReportTableItem) =>
    navigate(`/reports/${item.reportId}`);

  const columns: ColumnDefinition<ReportTableItem>[] = [
    {
      key: "reportId",
      header: "신고 ID",
      accessor: "reportId",
      headerClassName: "w-[10%]",
    },
    {
      key: "reportReason",
      header: "신고 사유",
      cellRenderer: (item) => item.reportReason,
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
      cellRenderer: (item) => item.reportStatus,
    },
    {
      key: "createdAt",
      header: "신고일",
      accessor: (item) => formatDate(item.createdAt),
      headerClassName: "w-[15%]",
    },
  ];

  const reportSortOptions = [
    { value: "createdAt_desc", label: "최신 신고순" },
    { value: "createdAt_asc", label: "오래된 신고순" },
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
