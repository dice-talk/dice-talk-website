import type { PaymentStatus } from "../types/paymentTypes"; // 이미 있다면 유지

// 기존 getPaymentStatusLabel, getStatusBadgeStyle 함수들...

export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  // 기존 로직
  return status; // 예시, 실제 구현에 맞게 수정
};

export const getStatusBadgeStyle = (status: PaymentStatus): string => {
  switch (status) {
    case '결제 완료': return 'bg-green-100 text-green-700';
    case '결제 실패': return 'bg-red-100 text-red-700';
    case '환불 완료': return 'bg-blue-100 text-blue-700';
    case '취소됨': return 'bg-yellow-100 text-yellow-700';
    case '결제 대기중': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const paymentSortOptions = [
  { value: 'transactionDate_desc', label: '결제일시 (최신순)' },
  { value: 'transactionDate_asc', label: '결제일시 (오래된순)' },
  { value: 'amount_desc', label: '결제금액 (높은순)' },
  { value: 'amount_asc', label: '결제금액 (낮은순)' },
];
