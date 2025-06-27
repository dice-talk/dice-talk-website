
export const PaymentStatus = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
  REFUNDED: 'REFUNDED',
PENDING: 'PENDING',
} as const

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

 
