// src/pages/payment/PaymentHistoryPage.tsx
import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import { PaymentHistoryFilterSection } from '../../components/payment/PaymentHIstoryFilterSection';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../lib/DataUtils';
import { paymentSortOptions } from '../../lib/PaymentUtils';
import { getAdminPaymentHistory } from '../../api/paymentApi';
import type { PageInfo } from '../../types/common';
import type { PaymentAdminResponseDto, PaymentStatus } from '../../types/payment/paymentTypes';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';

interface PaymentHistoryTableItem extends PaymentAdminResponseDto, TableItem {
  id: string;
}

export default function PaymentHistoryPage() {
  const [historyItems, setHistoryItems] = useState<PaymentAdminResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [emailSearchTerm, setEmailSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('requestedAt_desc');

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: '',
    endDate: '',
    status: undefined as PaymentStatus | undefined,
    email: '',
    productName: '',
    sort: 'requestedAt_desc',
  });

  const fetchAdminHistoryData = useCallback(
    async (pageToFetch: number, filters = appliedFilters) => {
      setIsLoading(true);
      setError(null);

      console.log('🔍 정렬 필터:', filters.sort);
      try {
        const response = await getAdminPaymentHistory({
          page: pageToFetch - 1,
          size: itemsPerPage,
          email: filters.email || undefined,
          productName: filters.productName || undefined,
          status: filters.status,
          start: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
          end: filters.endDate ? new Date(new Date(filters.endDate).setHours(23, 59, 59, 999)).toISOString() : undefined,
          sort: filters.sort.replace('_', ','),
        });
        setHistoryItems(response.data);
        setPageInfo(response.pageInfo);
      } catch (err) {
        console.error('결제 내역을 불러오는데 실패했습니다:', err);
        setError('결제 내역을 불러오는데 실패했습니다. 다시 시도해주세요.');
        setHistoryItems([]);
        setPageInfo(null);
      } finally {
        setIsLoading(false);
      }
    },
    [appliedFilters, itemsPerPage]
  );

  useEffect(() => {
    fetchAdminHistoryData(currentPage);
  }, [currentPage, sortValue, fetchAdminHistoryData]);

const handleApplyFilters = () => {
  setAppliedFilters({
    startDate,
    endDate,
    status: statusFilter === '전체' ? undefined : (statusFilter as PaymentStatus),
    email: emailSearchTerm,
    productName: productSearchTerm,
    sort: sortValue,
  });
  setCurrentPage(1);
};

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status); // 상태만 바꿈
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('전체');
    setEmailSearchTerm('');
    setProductSearchTerm('');
    setSortValue('requestedAt_desc');
    setAppliedFilters({
      startDate: '',
      endDate: '',
      status: undefined,
      email: '',
      productName: '',
      sort: 'requestedAt_desc',
    });
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortValue(newSort);
  
    const updatedFilters = {
      ...appliedFilters,
      sort: newSort,
    };

    setAppliedFilters(updatedFilters); 
    fetchAdminHistoryData(currentPage, updatedFilters);

  };


  const columns: ColumnDefinition<PaymentHistoryTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => (pageInfo ? (pageInfo.page - 1) * pageInfo.size + index + 1 : index + 1),
      headerClassName: 'w-[5%] text-center',
      cellClassName: 'text-center',
    },
    { key: 'email', header: '이메일', accessor: 'email' },
    { key: 'productName', header: '상품명', accessor: 'productName' },
    { key: 'diceAmount', header: '다이스', accessor: 'diceAmount' },
    {
      key: 'amount',
      header: '결제 금액',
      accessor: 'amount',
      cellRenderer: (item) => `${item.amount.toLocaleString()}원`,
    },
    {
      key: 'paymentStatus',
      header: '결제 상태',
      cellRenderer: (item) => <StatusBadge status={item.paymentStatus} type="payment" />,
    },
    {
      key: 'requestedAt',
      header: '결제 요청일',
      accessor: 'requestedAt',
      cellRenderer: (item) => formatDateTime(item.requestedAt),
    },
    {
      key: 'completedAt',
      header: '결제 완료일',
      accessor: 'completedAt',
      cellRenderer: (item) => item.completedAt ? formatDateTime(item.completedAt) : '-',
    },
  ];

  const tableData = historyItems.map((item) => ({ ...item, id: item.orderId }));

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">결제 내역 조회</h2>

          <PaymentHistoryFilterSection
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            userSearchTerm={emailSearchTerm}
            onUserSearchTermChange={setEmailSearchTerm}
            productSearchTerm={productSearchTerm}
            onProductSearchTermChange={setProductSearchTerm}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          {isLoading ? (
            <div className="flex justify-center py-10 text-gray-500">결제 내역을 불러오는 중입니다...</div>
          ) : error ? (
            <div className="flex flex-col items-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchAdminHistoryData(currentPage)} variant="outline">다시 시도</Button>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={tableData}
                totalCount={pageInfo?.totalElements ?? 0}
                sortValue={sortValue}
                onSortChange={handleSortChange}
                sortOptions={paymentSortOptions}
                emptyStateMessage="조회된 결제 내역이 없습니다."
              />
              {pageInfo && pageInfo.totalPages > 0 && (
                <Pagination currentPage={currentPage} totalPages={pageInfo.totalPages} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}