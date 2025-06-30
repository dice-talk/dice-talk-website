import { axiosInstance } from "./axiosInstance";
import type {
  PaymentAdminResponseDto,
  PaymentStatus
} from "../types/payment/paymentTypes";
import type { MultiResponse } from "../types/common";

const API_BASE_URL = "/api/v1/payments/toss"; 

export interface GetAdminPaymentsParams {
  email?: string;
  productName?: string;
  status?: PaymentStatus;
  start?: string; 
  end?: string;   
  page?: number; 
  size?: number;
  sort?: string;
}

/** 
 * 관리자용 결제 내역 조회 (GET /admin)
 * @param params 필터 및 페이지네이션 파라미터
 * @returns 페이지네이션된 결제 내역 목록
 */
export const getAdminPaymentHistory = async (
  params: GetAdminPaymentsParams
): Promise<MultiResponse<PaymentAdminResponseDto>> => {
  const response = await axiosInstance.get<MultiResponse<PaymentAdminResponseDto>>(
    `${API_BASE_URL}/admin`,
    { params }
  );
  return response.data;
};