// import { PaymentStatus, PaymentStatusEnum } from "../types/payment/paymentTypes"; // 이미 있다면 유지

// // export const getPaymentStatusLabel = (status: PaymentStatus): string => {
// //   return status; 
// // };

// // 라벨 매핑
// const paymentStatusLabelMap: Record<PaymentStatusEnum, string> = {
//   COMPLETED: '결제 완료',
//   FAILED: '결제 실패',
//   REFUNDED: '환불 완료',
//   CANCELED: '결제 취소',
//   PENDING: '결제 대기',
// };


// export const getPaymentStatusLabel = (status: PaymentStatus): string => {
//   return paymentStatusLabelMap[status] || status;
// };

// export const getStatusBadgeStyle = (status: PaymentStatus): string => {
//   switch (status) {
//     case 'COMPLETED':
//       return 'bg-green-100 text-green-700';
//     case 'FAILED':
//       return 'bg-red-100 text-red-700';
//     case 'REFUNDED':
//       return 'bg-blue-100 text-blue-700';
//     case 'CANCELED':
//       return 'bg-yellow-100 text-yellow-700';
//     case 'PENDING':
//       return 'bg-gray-100 text-gray-700';
//     default:
//       return 'bg-gray-100 text-gray-700';
//   }
// };

// export const mapFrontendStatusToBackendKey = (frontendStatus: string): string | undefined => {
//   switch (frontendStatus) {
//     case '결제 완료': return 'COMPLETED';
//     case '결제 실패': return 'FAILED';
//     case '환불 완료': return 'REFUNDED';
//     case '취소됨': return 'CANCELED';
//     case '결제 대기중': return 'PENDING';
//     case '전체': return undefined; // '전체' 필터는 API에 파라미터 전달 안함
//     default: return undefined; // Fallback for unknown status
//   }
// };

// // export const paymentSortOptions = [
// //   { value: 'transactionDate_desc', label: '결제일시 (최신순)' },
// //   { value: 'transactionDate_asc', label: '결제일시 (오래된순)' },
// //   { value: 'amount_desc', label: '결제금액 (높은순)' },
// //   { value: 'amount_asc', label: '결제금액 (낮은순)' },
// // ];
 
// export const paymentSortOptions = [
//   { value: 'requestedAt_desc', label: '결제 요청일 (최신순)' },
//   { value: 'requestedAt_asc', label: '결제 요청일 (오래된순)' },
//   { value: 'amount_desc', label: '결제금액 (높은순)' },
//   { value: 'amount_asc', label: '결제금액 (낮은순)' },
//   { value: 'paymentStatus_asc', label: '결제 상태 (가나다순)' },
//   { value: 'paymentStatus_desc', label: '결제 상태 (가나다역순)' },
//   { value: 'completedAt_desc', label: '결제 완료일 (최신순)' },
//   { value: 'completedAt_asc', label: '결제 완료일 (오래된순)' },
// ];