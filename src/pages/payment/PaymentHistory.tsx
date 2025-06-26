// import { useState, useEffect, useCallback } from 'react';
// import Sidebar from '../../components/sidebar/Sidebar';
// import Header from '../../components/Header';
// import { ReusableTable } from '../../components/common/ReusableTable';
// import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
// import type { PaymentAdminResponseDto } from '../../types/payment/paymentTypes';
// import { getAdminPaymentHistory, type GetAdminPaymentsParams } from '../../api/paymentApi';
// import { PaymentHistoryFilterSection } from '../../components/payment/PaymentHIstoryFilterSection';
// import { formatDateTime } from '../../lib/DataUtils'; // Changed to formatDateTime
// import { paymentSortOptions } from '../../lib/PaymentUtils'; // paymentSortOptions 임포트
// import { Pagination } from '../../components/common/Pagination';
// import StatusBadge from '../../components/ui/StatusBadge'; // StatusBadge 임포트
// import Button from '../../components/ui/Button';

// import type { PageInfo } from '../../types/common';

// interface PaymentHistoryTableItem extends PaymentAdminResponseDto, TableItem {
//   id: string; // ReusableTable 호환용, orderId 사용
// }

// export default function PaymentHistoryPage() {
//   const [historyItems, setHistoryItems] = useState<PaymentAdminResponseDto[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // 필터 상태
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [statusFilter, setStatusFilter] = useState('전체');
//   const [userSearchTerm, setUserSearchTerm] = useState(''); // UI용, DTO에 해당 필드 없음
//   const [productSearchTerm, setProductSearchTerm] = useState('');

//   // API 요청에 사용될 실제 적용된 필터 상태
//   const [appliedFilters, setAppliedFilters] = useState({
//     startDate: '',
//     endDate: '',
//     statusFilter: '전체',
//     emailSearchTerm: '', // Renamed from userSearchTerm for clarity with API
//     productSearchTerm: '',
//   });

//   const [sortValue, setSortValue] = useState('requestedAt_desc'); // 기본 정렬: 결제 요청일 최신순

//   const fetchAdminHistoryData = useCallback(async (pageToFetch: number) => {
//     setIsLoading(true);
//     setError(null);
//     const params: GetAdminPaymentsParams = {
//       page: pageToFetch - 1, // API is 0-indexed
//       size: itemsPerPage,
//       email: appliedFilters.emailSearchTerm || undefined,
//       productName: appliedFilters.productSearchTerm || undefined,
//       status: appliedFilters.statusFilter === '전체' ? undefined : appliedFilters.statusFilter,
//       start: appliedFilters.startDate ? new Date(appliedFilters.startDate).toISOString() : undefined,
//       end: appliedFilters.endDate ? new Date(new Date(appliedFilters.endDate).setHours(23,59,59,999)).toISOString() : undefined,
//       sort: sortValue.replace('_', ','), // API expects 'requestedAt,desc'
//     };
//     try {
//       const response = await getAdminPaymentHistory(params);
//       setHistoryItems(response.data);
//       setPageInfo(response.pageInfo);
//     } catch (err) {
//       console.error("결제 내역을 불러오는데 실패했습니다:", err);
//       setError("결제 내역을 불러오는데 실패했습니다. 다시 시도해주세요.");
//       setHistoryItems([]);
//       setPageInfo(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [itemsPerPage, appliedFilters, sortValue]);

//   useEffect(() => {
//     fetchAdminHistoryData(currentPage);
//   }, [currentPage, fetchAdminHistoryData]);

//   const totalItemsCount = pageInfo?.totalElements ?? 0;
//   const totalPages = pageInfo?.totalPages ?? 0;

//   const handleApplyFilters = useCallback(() => {
//     setAppliedFilters({
//       startDate: startDate,
//       endDate: endDate,
//       statusFilter: statusFilter,
//       emailSearchTerm: userSearchTerm,
//       productSearchTerm: productSearchTerm,
//     });
//     if (currentPage === 1) {
//       fetchAdminHistoryData(1);
//     } else {
//       setCurrentPage(1);
//     }
//   }, [startDate, endDate, statusFilter, userSearchTerm, productSearchTerm, currentPage, fetchAdminHistoryData]);

//   const handleResetFilters = useCallback(() => {
//     setStartDate('');
//     setEndDate('');
//     setStatusFilter('전체');
//     setUserSearchTerm('');
//     setProductSearchTerm('');
//     setSortValue('requestedAt_desc');

//     setAppliedFilters({
//       startDate: '',
//       endDate: '',
//       statusFilter: '전체',
//       emailSearchTerm: '',
//       productSearchTerm: '',
//     });
//     if (currentPage === 1) {
//       fetchAdminHistoryData(1);
//     } else {
//       setCurrentPage(1);
//     }
//   }, [currentPage, fetchAdminHistoryData]);

//   const handleSortChange = useCallback((newSortValue: string) => {
//     setSortValue(newSortValue);
//     if (currentPage === 1) {
//       fetchAdminHistoryData(1);
//     } else {
//       setCurrentPage(1);
//     }
//   }, [currentPage, fetchAdminHistoryData]);

//   const columns: ColumnDefinition<PaymentHistoryTableItem>[] = [
//     {
//       key: 'no',
//       header: 'No',
//       cellRenderer: (_item, index) => (pageInfo ? (pageInfo.page - 1) * pageInfo.size + index + 1 : index + 1),
//       headerClassName: 'w-[5%] text-center',
//       cellClassName: 'text-center',
//     },
//     { key: 'email', header: '이메일', accessor: 'email', headerClassName: 'w-[15%]' },
//     { key: 'productName', header: '상품명', accessor: 'productName', headerClassName: 'w-[20%]' },
//     { key: 'diceAmount', header: '다이스', accessor: 'diceAmount', headerClassName: 'w-[10%] text-center', cellClassName: 'text-center' },
//     { key: 'amount', header: '결제 금액', accessor: 'amount', cellRenderer: (item) => `${item.amount.toLocaleString()}원`, headerClassName: 'w-[10%] text-right', cellClassName: 'text-right' },
//     {
//       key: 'paymentStatus', header: '결제 상태', headerClassName: 'w-[8%] text-center', cellClassName: 'text-center',
//       cellRenderer: (item) => <StatusBadge status={item.paymentStatus} type="payment" />,
//     },
//     { key: 'requestedAt', header: '결제 요청일', accessor: 'requestedAt', cellRenderer: (item) => formatDateTime(item.requestedAt), headerClassName: 'w-[15%]' },
//     { key: 'completedAt', header: '결제 완료일', accessor: 'completedAt', cellRenderer: (item) => item.completedAt ? formatDateTime(item.completedAt) : '-', headerClassName: 'w-[15%]' },
//   ];

//   const tableData = historyItems.map(item => ({
//     ...item,
//     id: item.orderId, // ReusableTable's key
//   }));

//   return (
//     <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Header />
//         <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8">결제 내역 조회</h2>
//           <PaymentHistoryFilterSection
//             startDate={startDate} onStartDateChange={setStartDate}
//             endDate={endDate} onEndDateChange={setEndDate}
//             statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
//             userSearchTerm={userSearchTerm} onUserSearchTermChange={setUserSearchTerm}
//             productSearchTerm={productSearchTerm} onProductSearchTermChange={setProductSearchTerm}
//             onApplyFilters={handleApplyFilters}
//             onResetFilters={handleResetFilters}
//           />
//           {isLoading ? (
//             <div className="flex justify-center items-center py-10"><p className="text-gray-500">결제 내역을 불러오는 중입니다...</p></div>
//           ) : error ? (
//             <div className="flex flex-col items-center justify-center py-10">
//               <p className="text-red-500 mb-4">{error}</p>
//               <Button onClick={() => fetchAdminHistoryData(currentPage)} variant="outline">다시 시도</Button>
//             </div>
//           ) : (
//             <>
//               <ReusableTable
//                 columns={columns}
//                 data={tableData}
//                 totalCount={totalItemsCount}
//                 sortValue={sortValue}
//                 onSortChange={handleSortChange}
//                 sortOptions={paymentSortOptions}
//                 emptyStateMessage="조회된 결제 내역이 없습니다."
//               />
//               {totalPages > 0 && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={setCurrentPage}
//                 />
//               )}
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }