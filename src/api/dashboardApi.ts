import axiosInstance from './axiosInstance';
import type { MainDashboardResponse } from '../types/dashboardTypes';

const DASHBOARD_BASE_URL = "/admin";

/**
 * 대시보드 메인 데이터를 조회합니다.
 * @returns MainDashboardResponse 타입의 대시보드 데이터
 */
export const getDashboardData = async (): Promise<MainDashboardResponse> => {
  const response = await axiosInstance.get<MainDashboardResponse>(`${DASHBOARD_BASE_URL}/dashboard`);
  return response.data;
};