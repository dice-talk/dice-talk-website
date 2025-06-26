// /**
//  * 결제 상태 Enum (Payment.java의 PaymentStatus)
//  */
// // export const PaymentStatus = {
// //   PENDING: '결제 대기',
// //   COMPLETED: '결제 완료', 
// //   FAILED: '결제 실패', 
// //   CANCELED: '결제 취소', 
// //   REFUNDED: '환불 완료', 
// // } as const;

// // export const PaymentStatusEnum = {
// //   PENDING: 'PENDING',
// //   COMPLETED: 'COMPLETED',
// //   FAILED: 'FAILED',
// //   CANCELED: 'CANCELED',
// //   REFUNDED: 'REFUNDED',
// // } as const

// export enum PaymentStatus {
//   COMPLETED = 'COMPLETED',
//   FAILED = 'FAILED',
//   REFUNDED = 'REFUNDED',
//   CANCELED = 'CANCELED',
//   PENDING = 'PENDING',
// };

// // export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];


// export interface PaymentAdminResponseDto {
//   orderId: string;
//   email: string;
//   memberId: number; 
//   productName: string;
//   amount: number;
//   diceAmount: number;
//   paymentStatus: PaymentStatus; 
//   requestedAt: string; 
//   completedAt: string | null; 
// }

 
