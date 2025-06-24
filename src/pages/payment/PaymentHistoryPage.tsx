// src/pages/payment/PaymentHistoryPage.tsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import { Pagination } from '../../components/common/Pagination';
import { PaymentHistoryFilterSection } from '../../components/payment/PaymentHIstoryFilterSection';
import type { PaymentAdminResponseDto, PaymentStatus } from '../../types/payment/paymentTypes'; // PageInfo, GetAdminPaymentsParams 추가, PaymentStatus -> PaymentStatusType
import { getAdminPaymentHistory, type GetAdminPaymentsParams } from '../../api/paymentApi'; // getPaymentHistory -> getAdminPaymentHistory
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { formatDateTime } from '../../lib/DataUtils'; // 날짜 포맷팅 유틸
import StatusBadge from '../../components/ui/StatusBadge'; // StatusBadge 임포트
import { paymentSortOptions } from '../../lib/PaymentUtils'; // paymentSortOptions 임포트
import Button from '../../components/ui/Button';
import type { PageInfo } from '../../types/common';

interface PaymentHistoryTableItem extends PaymentAdminResponseDto, TableItem {
  id: string; // orderId를 id로 사용
}

export default function PaymentHistoryPage() {
  const [historyItems, setHistoryItems] = useState<PaymentAdminResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);


  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | '전체'>('전체'); // API 'status' 파라미터용
  const [emailSearchTerm, setEmailSearchTerm] = useState(''); // API 'email' 파라미터용
  const [productSearchTerm, setProductSearchTerm] = useState(''); // API 'productName' 파라미터용
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sort state (ReusableTable에 필요하지만, 현재 페이지에서는 사용하지 않음)
  const [sortValue, setSortValue] = useState('requestedAt_desc'); // 기본 정렬: 결제 요청일 최신순

  const fetchAdminHistoryData = useCallback(async (pageToFetch: number) => {
    setIsLoading(true);
    setError(null);
    const params: GetAdminPaymentsParams = {
    page: pageToFetch - 1, // API는 0-indexed
    size: itemsPerPage,
    email: emailSearchTerm || undefined,
    productName: productSearchTerm || undefined,
    status: statusFilter === '전체' ? undefined : statusFilter,
    start: startDate ? new Date(startDate).toISOString() : undefined,
    end: endDate ? new Date(new Date(endDate).setHours(23,59,59,999)).toISOString() : undefined, 
    // sort: sortValue, // API가 정렬 파라미터를 받는다면 추가
    };
    try {
       const response = await getAdminPaymentHistory(params);
      setHistoryItems(response.data);
      setPageInfo(response.pageInfo);
    } catch (err) {
      console.error("결제 내역을 불러오는데 실패했습니다:", err);
      setError("결제 내역을 불러오는데 실패했습니다. 다시 시도해주세요.");
      setHistoryItems([]);
      setPageInfo(null);  
    } finally {
      setIsLoading(false);
    }
  // API 호출에 필요한 모든 상태를 의존성 배열에 포함
  }, [itemsPerPage, emailSearchTerm, productSearchTerm, statusFilter, startDate, endDate, sortValue]); 

  useEffect(() => {
    fetchAdminHistoryData(currentPage);
  }, [currentPage, fetchAdminHistoryData]); // fetchAdminHistoryData는 useCallback으로 감싸져 있으므로 의존성 변경 시에만 재실행

  const filteredAndSortedHistory = useMemo(() => {
     const processedHistory = [...historyItems];

    // 정렬
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
        case 'completedAt_desc': // completedAt이 null일 수 있음을 고려
          return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
        case 'completedAt_asc':
          return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
        default:
          return 0;
      }
    });
    return processedHistory;
  }, [historyItems, sortValue]);

  const paginatedHistory = useMemo(() => {
    return filteredAndSortedHistory;
  }, [filteredAndSortedHistory]);

  const totalItemsCount = pageInfo?.totalElements ?? 0;
  const totalPages = pageInfo?.totalPages ?? 0;

  const handleApplyFilters = () => {
      if (currentPage === 1) {
      fetchAdminHistoryData(1);
    } else {
      setCurrentPage(1); // useEffect가 currentPage 변경을 감지하여 fetchAdminHistoryData(1) 호출
    }
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('전체');
    setEmailSearchTerm('');
    setProductSearchTerm('');
    setCurrentPage(1);
  };
  
  const handleSortChange = (newSortValue: string) => {
    setSortValue(newSortValue);
    // fetchAdminHistoryData(1); // 정렬 변경 시 첫 페이지부터 다시 조회
  };

  const columns: ColumnDefinition<PaymentHistoryTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => (currentPage - 1) * itemsPerPage + index + 1,
      headerClassName: 'w-[5%] text-center',
      cellClassName: 'text-center',
    },
    { key: 'orderId', header: '주문 ID', accessor: 'orderId', headerClassName: 'w-[12%]' },
    { key: 'email', header: '이메일', accessor: 'email', headerClassName: 'w-[15%]' },
    { key: 'memberId', header: '회원 ID', accessor: (item) => item.memberId.toString(), headerClassName: 'w-[8%] text-center', cellClassName: 'text-center' },
    { key: 'productName', header: '상품명', accessor: 'productName', headerClassName: 'w-[15%]' },
    { key: 'diceAmount', header: '다이스', accessor: 'diceAmount', headerClassName: 'w-[7%] text-center', cellClassName: 'text-center' },
    { key: 'amount', header: '결제 금액', accessor: 'amount', cellRenderer: (item) => `${item.amount.toLocaleString()}원`, headerClassName: 'w-[8%] text-right', cellClassName: 'text-right' },
    {
      key: 'paymentStatus', header: '결제 상태', headerClassName: 'w-[8%] text-center', cellClassName: 'text-center',
      cellRenderer: (item) => <StatusBadge status={item.paymentStatus as PaymentStatus} type="payment" />
    },
    { key: 'requestedAt', header: '결제 요청일', accessor: 'requestedAt', cellRenderer: (item) => formatDateTime(item.requestedAt), headerClassName: 'w-[12%]' },
    { key: 'completedAt', header: '결제 완료일', accessor: 'completedAt', cellRenderer: (item) => item.completedAt ? formatDateTime(item.completedAt) : '-', headerClassName: 'w-[12%]' },
  ];

  const tableData = paginatedHistory.map(item => ({
    ...item,
    id: item.orderId, // ReusableTable의 key로 사용
  }));

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">결제 내역 관리</h2>
          
          <PaymentHistoryFilterSection
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            statusFilter={statusFilter as string}  // PaymentHistoryFilterSection props가 string을 받는다고 가정
            onStatusFilterChange={(value) => setStatusFilter(value as PaymentStatus | '전체')} // PaymentStatus -> PaymentStatusType
            // methodFilter와 onMethodFilterChange props는 이제 선택적이므로 전달하지 않아도 됩니다.
            userSearchTerm={emailSearchTerm} // userSearchTerm prop을 emailSearchTerm으로 대체
            onUserSearchTermChange={setEmailSearchTerm} // userSearchTerm prop을 emailSearchTerm으로 대체
            productSearchTerm={productSearchTerm}
            onProductSearchTermChange={setProductSearchTerm}
            onApplyFilters={handleApplyFilters} // "조회" 버튼 핸들러 연결
            onResetFilters={handleResetFilters}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">결제 내역을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchAdminHistoryData(currentPage)} variant="outline">다시 시도</Button>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={tableData}
                totalCount={totalItemsCount}
                sortValue={sortValue} // 추가
                onSortChange={handleSortChange} // 수정: setSortValue -> handleSortChange
                // paymentSortOptions가 PaymentHistoryDto 필드와 호환된다고 가정
                // 예: { value: 'requestedAt_desc', label: '요청일 최신순' }
                // 필요시 PaymentUtils.ts의 paymentSortOptions를 업데이트하거나 여기서 직접 정의
                sortOptions={paymentSortOptions} 
                emptyStateMessage="결제 내역이 없습니다."
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