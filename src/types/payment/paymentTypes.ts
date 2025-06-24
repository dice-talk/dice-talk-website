/**
 * 결제 상태 Enum (Payment.java의 PaymentStatus)
 */
export const PaymentStatus = {
  PENDING: 'PENDING', // 결제 대기
  COMPLETED: 'COMPLETED', // 결제 완료
  FAILED: 'FAILED', // 결제 실패
  CANCELED: 'CANCELED', // 결제 취소
  REFUNDED: 'REFUNDED', // 결제 환불
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];


export interface PaymentAdminResponseDto {
  orderId: string;
  email: string;
  memberId: number; 
  productName: string;
  amount: number;
  diceAmount: number;
  paymentStatus: PaymentStatus; 
  requestedAt: string; 
  completedAt: string | null; 
}


