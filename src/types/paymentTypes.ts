export type PaymentStatus = '결제 완료' | '결제 실패' | '환불 완료' | '취소됨' | '결제 대기중';
export type PaymentMethod = '신용카드' | '카카오페이' | '네이버페이' | '계좌이체' | '휴대폰결제' | '기타';

export interface PaymentHistoryItem {
  paymentId: string; // 결제 고유 ID (PG사에서 오는 ID 또는 자체 생성 ID)
  orderId: string; // 주문 ID
  userId: number;
  userEmail: string;
  productId: number;
  productName: string;
  quantity: number; // 상품 수량 (예: 다이스 100개면 100)
  amount: number; // 결제 금액
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionDate: string; // 결제/거래 일시 (YYYY-MM-DD HH:MM:SS)
  pgTransactionId?: string; // PG사 거래 ID (선택)
}