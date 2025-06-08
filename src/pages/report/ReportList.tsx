// src/pages/report/ReportListPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReportFilterSection } from '../../components/report/ReportFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import { type ReportItem, ReportStatus } from '../../types/reportTypes';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { formatDate, getReportStatusLabel, getReportStatusBadgeStyle } from '../../lib/ReportUtils';
 
// mockReports는 실제 API 호출로 대체되어야 합니다.
// ReportDetailPage와 상태를 공유하려면 Zustand, Redux 또는 Context API 사용을 고려하세요.
export const mockReports: ReportItem[] = [
  { reportId: 1, reason: "부적절한 채팅 내용: 욕설 사용", reporterId: 123, reporterEmail: "reporter1@example.com", reportedMemberId: 456, reportedEmail: "user2@gmail.com", reportedChats: [{ chatId: 101, message: "이런 메시지는 정말 불쾌해요.", memberId: 456, nickname: "악성유저1", chatRoomId: 10, createdAt: "2025-06-02T09:50:00Z" }, { chatId: 102, message: "신고합니다.", memberId: 456, nickname: "악성유저1", chatRoomId: 10, createdAt: "2025-06-02T09:51:00Z" }], reportStatus: ReportStatus.REPORT_RECEIVED, createdAt: "2025-06-02T09:55:01Z", modifiedAt: "2025-06-02T09:55:01Z" },
  { reportId: 2, reason: "스팸 및 광고 메시지 발송", reporterId: 789, reporterEmail: "reporter2@example.com", reportedMemberId: 101, reportedEmail: "spammer@example.com", reportedChats: [{ chatId: 201, message: "광고입니다. 클릭하세요!", memberId: 101, nickname: "스패머99", chatRoomId: 20, createdAt: "2025-06-01T15:20:00Z" }], reportStatus: ReportStatus.UNDER_REVIEW, createdAt: "2025-06-01T15:22:30Z", modifiedAt: "2025-06-01T18:00:00Z" },
  { reportId: 3, reason: "개인정보 요구", reporterId: 234, reporterEmail: "reporter3@example.com", reportedMemberId: 876, reportedEmail: "phisher@example.com", reportedChats: [{ chatId: 301, message: "계좌번호 알려주세요.", memberId: 876, nickname: "수상한녀석", chatRoomId: 30, createdAt: "2025-05-30T11:10:00Z" }], reportStatus: ReportStatus.ACTION_TAKEN, createdAt: "2025-05-30T11:15:22Z", modifiedAt: "2025-05-31T10:00:00Z" },
  { reportId: 4, reason: "단순 비매너 채팅", reporterId: 567, reporterEmail: "reporter4@example.com", reportedMemberId: 321, reportedEmail: "rude_user@example.com", reportedChats: [{ chatId: 401, message: "흥", memberId: 321, nickname: "까칠이", chatRoomId: 40, createdAt: "2025-06-03T12:00:00Z" }], reportStatus: ReportStatus.DISMISSED, createdAt: "2025-06-03T12:05:00Z", modifiedAt: "2025-06-03T14:00:00Z" },
  // 페이지네이션 테스트를 위한 추가 데이터
  ...Array.from({ length: 10 }, (_, i) => ({
    reportId: 5 + i,
    reason: `테스트 신고 사유 ${5 + i}`,
    reporterId: 1000 + i,
    reporterEmail: `reporter_test${5 + i}@example.com`,
    reportedMemberId: 2000 + i,
    reportedEmail: `reported_test${5 + i}@example.com`,
    reportedChats: [{ chatId: 500 + i, message: `테스트 채팅 메시지 ${500 + i}`, memberId: 2000 + i, nickname: `테스트유저${5 + i}`, chatRoomId: 50 + i, createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString() }],
    reportStatus: Object.values(ReportStatus)[i % 4],
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    modifiedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  })),
];

// ReportDetailPage에서 mockReports를 직접 수정할 수 있도록 함수 제공 (실제로는 API 사용)
export const updateMockReport = (updatedReport: ReportItem) => {
  const index = mockReports.findIndex(r => r.reportId === updatedReport.reportId);
  if (index !== -1) {
    mockReports[index] = updatedReport;
  }
};

interface ReportTableItem extends TableItem {
  reportId: number;
  reason: string;
  reporterInfo: string;
  reportedInfo: string;
  reportStatus: ReportStatus;
  createdAt: string;
}

export default function ReportListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportItem[]>(mockReports);

  // ReportDetailPage에서 상태 변경 시 목록을 새로고침하기 위한 useEffect
  // 실제 앱에서는 API 호출 후 데이터를 다시 fetch 하거나, 전역 상태 관리 라이브러리를 통해 동기화합니다.
  useEffect(() => {
    setReports([...mockReports]); // mockReports 배열의 복사본으로 상태 업데이트
  }, []); // 최초 마운트 시에만 실행되도록 설정. 상세 페이지에서 변경 후 돌아올 때 반영되려면 다른 방식 필요.

  // UI 입력을 위한 필터 상태
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('createdAt_desc');

  // 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    status: '전체',
    term: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleResetFilters = () => {
    // UI 필터 상태 초기화
    setStatusFilter('전체');
    setSearchTerm('');
    setSortValue('createdAt_desc');
    // 적용된 필터 상태도 초기화
    setAppliedFilters({
      status: '전체',
      term: '',
    });
    setCurrentPage(1); // 초기화 시 첫 페이지로 이동
  };

  const handleSearch = () => {
    setAppliedFilters({
      status: statusFilter,
      term: searchTerm,
    });
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const filteredAndSortedReports = useMemo(() => {
    let filtered = [...reports];

    if (appliedFilters.status !== '전체') {
      filtered = filtered.filter(report => report.reportStatus === appliedFilters.status);
    }
    if (appliedFilters.term) {
      const lowerSearchTerm = appliedFilters.term.toLowerCase();
      filtered = filtered.filter(report =>
        report.reporterEmail.toLowerCase().includes(lowerSearchTerm) ||
        report.reporterId.toString().includes(lowerSearchTerm) ||
        report.reportedEmail.toLowerCase().includes(lowerSearchTerm) ||
        report.reportedMemberId.toString().includes(lowerSearchTerm)
      );
    }

    if (sortValue === 'createdAt_desc') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortValue === 'createdAt_asc') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return filtered.map(r => ({
      ...r, // TableItem 호환을 위해 id 대신 reportId 사용
      id: r.reportId, // ReusableTable이 id를 기본 키로 사용할 수 있으므로 추가
      reporterInfo: `${r.reporterEmail} (ID: ${r.reporterId})`,
      reportedInfo: `${r.reportedEmail} (ID: ${r.reportedMemberId})`,
    }));
  }, [reports, appliedFilters, sortValue]);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedReports, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedReports.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowClick = (item: ReportTableItem) => navigate(`/reports/${item.reportId}`);

  const columns: ColumnDefinition<ReportTableItem>[] = [
    { key: 'reportId', header: '신고 ID', accessor: 'reportId', headerClassName: 'w-[10%]' },
    { key: 'reason', header: '신고 사유', accessor: 'reason', cellRenderer: (item) => <span className="truncate" title={item.reason}>{item.reason.length > 30 ? `${item.reason.substring(0,30)}...` : item.reason}</span> , headerClassName: 'w-[25%]' },
    { key: 'reporterInfo', header: '신고자', accessor: 'reporterInfo', headerClassName: 'w-[20%]' },
    { key: 'reportedInfo', header: '피신고자', accessor: 'reportedInfo', headerClassName: 'w-[20%]' },
    {
      key: 'reportStatus',
      header: '상태',
      accessor: 'reportStatus',
      headerClassName: 'w-[10%]',
      cellRenderer: (item) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getReportStatusBadgeStyle(item.reportStatus)}`}>
          {getReportStatusLabel(item.reportStatus)}
        </span>
      ),
    },
    { key: 'createdAt', header: '신고일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-[15%]' },
  ];

  const reportSortOptions = [
    { value: 'createdAt_desc', label: '최신 신고순' },
    { value: 'createdAt_asc', label: '오래된 신고순' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">사용자 신고 관리</h2>
          
          <ReportFilterSection
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onResetFilters={handleResetFilters}
            onSearch={handleSearch} // 조회 핸들러 연결
          />
          <ReusableTable
            columns={columns}
            data={paginatedReports}
            totalCount={filteredAndSortedReports.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={reportSortOptions}
            emptyStateMessage="접수된 신고가 없습니다."
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