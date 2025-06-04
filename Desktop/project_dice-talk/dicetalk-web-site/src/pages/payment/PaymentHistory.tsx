import { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import type { PaymentHistoryItem, PaymentStatus, PaymentMethod } from '../../types/paymentTypes';
import { PaymentHistoryFilterSection } from '../../components/payment/PaymentHIstoryFilterSection';
import { formatDate } from '../../lib/ReportUtils'; // formatDate 유틸리티 경로 확인
import { Pagination } from '../../components/common/Pagination';

interface PaymentHistoryTableItem extends PaymentHistoryItem, TableItem {
  id: string; // ReusableTable 호환용, paymentId 사용
}

// Mock 데이터 (실제로는 API 호출)
const mockPayments: PaymentHistoryItem[] = [
  { paymentId: 'pay_1abc123', orderId: 'order_xyz789', userId: 123, userEmail: 'user1@example.com', productId: 1, productName: '다이스 100개', quantity: 100, amount: 10000, paymentMethod: '신용카드', paymentStatus: '결제 완료', transactionDate: '2025-06-04 10:30:15', pgTransactionId: 'pg_tr_abc123' },
  { paymentId: 'pay_2def456', orderId: 'order_uvw456', userId: 456, userEmail: 'user2@example.com', productId: 2, productName: '다이스 200개', quantity: 200, amount: 19000, paymentMethod: '카카오페이', paymentStatus: '결제 완료', transactionDate: '2025-06-03 15:00:00', pgTransactionId: 'pg_tr_def456' },
  { paymentId: 'pay_3ghi789', orderId: 'order_rst123', userId: 789, userEmail: 'user3@example.com', productId: 1, productName: '다이스 100개', quantity: 100, amount: 10000, paymentMethod: '네이버페이', paymentStatus: '결제 실패', transactionDate: '2025-06-03 09:10:00' },
  { paymentId: 'pay_4jkl012', orderId: 'order_opq890', userId: 123, userEmail: 'user1@example.com', productId: 3, productName: '다이스 500개', quantity: 500, amount: 40000, paymentMethod: '신용카드', paymentStatus: '환불 완료', transactionDate: '2025-06-02 11:00:00', pgTransactionId: 'pg_tr_ghi789' },
  { paymentId: 'pay_5mno345', orderId: 'order_lmn567', userId: 101, userEmail: 'user4@example.com', productId: 1, productName: '다이스 100개', quantity: 100, amount: 10000, paymentMethod: '계좌이체', paymentStatus: '결제 대기중', transactionDate: '2025-06-05 00:05:00' },
  // 페이지네이션 테스트용 추가 데이터
  ...Array.from({ length: 15 }, (_, i) => ({
    paymentId: `pay_mock_${i + 6}`, orderId: `order_mock_${i + 6}`, userId: 200 + i, userEmail: `mockuser${i+6}@example.com`, productId: (i % 3) + 1, productName: `다이스 ${( (i % 3) + 1) * 100}개`, quantity: ((i % 3) + 1) * 100, amount: ((i % 3) + 1) * 10000 - (i%2 === 0 ? 0 : 1000), paymentMethod: (['신용카드', '카카오페이', '네이버페이'] as PaymentMethod[])[i % 3], paymentStatus: (['결제 완료', '결제 실패', '환불 완료', '취소됨', '결제 대기중'] as PaymentStatus[])[i % 5], transactionDate: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString().replace('T', ' ').substring(0, 19)
  }))
];

const paymentSortOptions = [
  { value: 'transactionDate_desc', label: '결제일시 (최신순)' },
  { value: 'transactionDate_asc', label: '결제일시 (오래된순)' },
  { value: 'amount_desc', label: '결제금액 (높은순)' },
  { value: 'amount_asc', label: '결제금액 (낮은순)' },
];

const getStatusBadgeStyle = (status: PaymentStatus): string => {
  switch (status) {
    case '결제 완료': return 'bg-green-100 text-green-700';
    case '결제 실패': return 'bg-red-100 text-red-700';
    case '환불 완료': return 'bg-blue-100 text-blue-700';
    case '취소됨': return 'bg-yellow-100 text-yellow-700';
    case '결제 대기중': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function PaymentHistoryPage() {
  const [payments] = useState<PaymentHistoryItem[]>(mockPayments);
  // 필터 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [methodFilter, setMethodFilter] = useState('전체');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('transactionDate_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleApplyFilters = () => {
    // 실제 API 호출 시 이 함수에서 필터링된 데이터를 요청합니다.
    // 현재는 mock 데이터이므로, useMemo에서 필터링합니다.
    setCurrentPage(1); // 필터 적용 시 첫 페이지로
    console.log("Filters applied:", { startDate, endDate, statusFilter, methodFilter, userSearchTerm, productSearchTerm });
  };

  const handleResetFilters = () => {
    setStartDate(''); setEndDate('');
    setStatusFilter('전체'); setMethodFilter('전체');
    setUserSearchTerm(''); setProductSearchTerm('');
    setSortValue('transactionDate_desc');
    setCurrentPage(1);
  };

  const filteredAndSortedPayments = useMemo(() => {
    let filteredPayments = [...payments];

    // 필터링
    filteredPayments = filteredPayments.filter(p => {
      if (startDate && endDate) {
        const transactionDateOnly = p.transactionDate.split(' ')[0];
        if (!(transactionDateOnly >= startDate && transactionDateOnly <= endDate)) {
          return false;
        }
      }
      if (statusFilter !== '전체' && p.paymentStatus !== statusFilter) return false;
      if (methodFilter !== '전체' && p.paymentMethod !== methodFilter) return false;
      if (userSearchTerm && !(p.userEmail.includes(userSearchTerm) || p.userId.toString().includes(userSearchTerm))) return false;
      if (productSearchTerm && !(p.productName.includes(productSearchTerm) || p.productId.toString().includes(productSearchTerm))) return false;
      return true;
    });

    // 정렬
    const sortedPayments = [...filteredPayments].sort((a, b) => {
      switch (sortValue) {
        case 'transactionDate_desc':
          return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
        case 'transactionDate_asc':
          return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return sortedPayments.map(p => ({ ...p, id: p.paymentId }));
  }, [payments, startDate, endDate, statusFilter, methodFilter, userSearchTerm, productSearchTerm, sortValue]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPayments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedPayments.length / itemsPerPage);

  const columns: ColumnDefinition<PaymentHistoryTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index + 1 + (currentPage - 1) * itemsPerPage, headerClassName: 'w-[5%]' },
    { key: 'orderId', header: '주문ID', accessor: 'orderId', headerClassName: 'w-[10%]' },
    { key: 'user', header: '구매자', accessor: (item) => `${item.userEmail} (ID:${item.userId})`, headerClassName: 'w-[15%]' },
    { key: 'productName', header: '상품명', accessor: 'productName', headerClassName: 'w-[15%]' },
    { key: 'amount', header: '결제금액', accessor: (item) => `₩${item.amount.toLocaleString()}`, headerClassName: 'w-[10%]' },
    { key: 'paymentMethod', header: '결제수단', accessor: 'paymentMethod', headerClassName: 'w-[10%]' },
    {
      key: 'paymentStatus', header: '결제상태', headerClassName: 'w-[10%]',
      cellRenderer: (item) => <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(item.paymentStatus)}`}>{item.paymentStatus}</span>
    },
    { key: 'transactionDate', header: '결제일시', accessor: (item) => formatDate(item.transactionDate.split(' ')[0]) + ' ' + item.transactionDate.split(' ')[1] , headerClassName: 'w-[15%]' },
    // { key: 'pgTransactionId', header: 'PG 거래 ID', accessor: 'pgTransactionId', headerClassName: 'w-[10%]' }, // 필요시 추가
  ];

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
            methodFilter={methodFilter} onMethodFilterChange={setMethodFilter}
            userSearchTerm={userSearchTerm} onUserSearchTermChange={setUserSearchTerm}
            productSearchTerm={productSearchTerm} onProductSearchTermChange={setProductSearchTerm}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
          <ReusableTable
            columns={columns}
            data={paginatedPayments}
            totalCount={filteredAndSortedPayments.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={paymentSortOptions}
            emptyStateMessage="조회된 결제 내역이 없습니다."
          />
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}