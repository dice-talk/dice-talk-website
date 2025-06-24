import { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import type { PaymentAdminResponseDto, PaymentStatus } from '../../types/payment/paymentTypes'; // Updated type import, PaymentStatus -> PaymentStatusType
import { getAdminPaymentHistory } from '../../api/paymentApi'; // API import: getPaymentHistory -> getAdminPaymentHistory
import { PaymentHistoryFilterSection } from '../../components/payment/PaymentHIstoryFilterSection';
import { formatDateTime } from '../../lib/DataUtils'; // Changed to formatDateTime
import { paymentSortOptions } from '../../lib/PaymentUtils'; // paymentSortOptions 임포트
import { Pagination } from '../../components/common/Pagination';
import StatusBadge from '../../components/ui/StatusBadge'; // StatusBadge 임포트
import Button from '../../components/ui/Button';

interface PaymentHistoryTableItem extends PaymentAdminResponseDto, TableItem {
  id: string; // ReusableTable 호환용, orderId 사용
}

export default function PaymentHistoryPage() {
  const [allHistory, setAllHistory] = useState<PaymentAdminResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [userSearchTerm, setUserSearchTerm] = useState(''); // UI용, DTO에 해당 필드 없음
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('requestedAt_desc'); // 기본 정렬: 결제 요청일 최신순
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPaymentHistoryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAdminPaymentHistory({}); // Pass empty params or actual filter params
      // 초기 정렬 (API에서 정렬해서 주지 않는 경우)
      // setAllHistory(historyData.sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()));
      setAllHistory(response.data); // API가 이미 정렬해서 준다고 가정하거나, 아래 useMemo에서 정렬
    } catch (err) {
      console.error("결제 내역을 불러오는데 실패했습니다:", err);
      setError("결제 내역을 불러오는데 실패했습니다. 다시 시도해주세요.");
      setAllHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentHistoryData();
  }, [fetchPaymentHistoryData]);

  const handleApplyFilters = () => {
    // 필터 값은 이미 상태에 반영되어 있고, filteredAndSortedHistory가 useMemo로 자동 업데이트됨
    setCurrentPage(1); // 필터 적용 시 첫 페이지로
    console.log("Filters applied:", { startDate, endDate, statusFilter, userSearchTerm, productSearchTerm });
  };

  const handleResetFilters = () => {
    setStartDate(''); setEndDate('');
    setStatusFilter('전체'); 
    setUserSearchTerm(''); setProductSearchTerm('');
    setSortValue('requestedAt_desc'); // 정렬 초기화
    setCurrentPage(1);
  };

  const filteredAndSortedHistory = useMemo(() => {
    let processedHistory = [...allHistory];

    // 필터링
    processedHistory = processedHistory.filter(item => {
      const requestedDate = new Date(item.requestedAt);
      // 날짜 필터
      if (startDate && requestedDate < new Date(startDate)) return false;
      if (endDate && requestedDate > new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))) return false; // endDate는 해당 날짜의 끝까지 포함
      // 상태 필터 (PaymentStatusType으로 캐스팅)
      if (statusFilter !== '전체' && item.paymentStatus !== statusFilter as PaymentStatus) return false;
      // 상품명 필터
      if (productSearchTerm && !item.productName.toLowerCase().includes(productSearchTerm.toLowerCase())) return false;
      
      // TODO: methodFilter와 userSearchTerm은 PaymentHistoryDto에 해당 필드가 없으므로,
      // 백엔드 API가 해당 필터링을 지원하거나 DTO에 필드가 추가되어야 실제 동작합니다.
      // 현재는 이 필터들은 클라이언트 사이드에서 동작하지 않습니다.

      return true;
    });

    // 정렬
    // paymentSortOptions는 { value: 'requestedAt_desc', label: '결제 요청일 (최신순)' } 등을 포함해야 함
    processedHistory.sort((a, b) => {
      switch (sortValue) {
        case 'requestedAt_desc':
          return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
        case 'requestedAt_asc':
          return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        // completedAt 정렬 추가 가능
        case 'completedAt_desc':
          return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
        case 'completedAt_asc':
          return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
        default:
          return 0;
      }
    });

    return processedHistory.map(item => ({ ...item, id: item.orderId }));
  }, [allHistory, startDate, endDate, statusFilter, productSearchTerm, sortValue /* methodFilter, userSearchTerm removed as they are not in DTO */]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedHistory, currentPage, itemsPerPage]);

  const totalItemsCount = filteredAndSortedHistory.length;
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  const columns: ColumnDefinition<PaymentHistoryTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => (currentPage - 1) * itemsPerPage + index + 1,
      headerClassName: 'w-[5%] text-center',
      cellClassName: 'text-center',
    },
    { key: 'orderId', header: '주문 ID', accessor: 'orderId', headerClassName: 'w-[15%]' },
    { key: 'productName', header: '상품명', accessor: 'productName', headerClassName: 'w-[20%]' },
    { key: 'diceAmount', header: '다이스', accessor: 'diceAmount', headerClassName: 'w-[10%] text-center', cellClassName: 'text-center' },
    { key: 'amount', header: '결제 금액', accessor: 'amount', cellRenderer: (item) => `${item.amount.toLocaleString()}원`, headerClassName: 'w-[10%] text-right', cellClassName: 'text-right' },
    {
      key: 'paymentStatus', header: '결제 상태', headerClassName: 'w-[10%] text-center', cellClassName: 'text-center',
      cellRenderer: (item) => <StatusBadge status={item.paymentStatus} type="payment" />
    },
    { key: 'requestedAt', header: '결제 요청일', accessor: 'requestedAt', cellRenderer: (item) => formatDateTime(item.requestedAt), headerClassName: 'w-[15%]' },
    { key: 'completedAt', header: '결제 완료일', accessor: 'completedAt', cellRenderer: (item) => item.completedAt ? formatDateTime(item.completedAt) : '-', headerClassName: 'w-[15%]' },
  ];

  // `paymentSortOptions` should be updated to reflect `PaymentHistoryDto` fields, e.g.:
  // const adaptedSortOptions = [
  //   { value: 'requestedAt_desc', label: '결제 요청일 (최신순)' },
  //   { value: 'requestedAt_asc', label: '결제 요청일 (오래된순)' },
  //   { value: 'amount_desc', label: '결제금액 (높은순)' },
  //   { value: 'amount_asc', label: '결제금액 (낮은순)' },
  //   // ... other options like completedAt
  // ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">결제 내역 조회</h2>
          <PaymentHistoryFilterSection
            startDate={startDate} onStartDateChange={setStartDate}
            endDate={endDate} onEndDateChange={setEndDate}
            statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
            userSearchTerm={userSearchTerm} onUserSearchTermChange={setUserSearchTerm}
            productSearchTerm={productSearchTerm} onProductSearchTermChange={setProductSearchTerm}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">결제 내역을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchPaymentHistoryData} variant="outline">다시 시도</Button>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={paginatedHistory}
                totalCount={totalItemsCount}
                sortValue={sortValue}
                onSortChange={setSortValue}
                // Pass adaptedSortOptions or ensure paymentSortOptions from PaymentUtils is updated
                sortOptions={paymentSortOptions.map(opt => ({ // Example adaptation if structure is similar
                  ...opt,
                  value: opt.value.replace('transactionDate', 'requestedAt')
                }))}
                emptyStateMessage="조회된 결제 내역이 없습니다."
              />
              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}