import axiosInstance from "./axiosInstance";
import type {
  ReportPostDto,
  ReportResponse,
  ReportReasonResponse,
} from "../types/reportTypes";
import type { PageInfo } from "../types/common";

// 신고 등록
export const postReport = (data: ReportPostDto) =>
  axiosInstance.post<void>("/reports", data);

// 신고 상세 조회
export const getReport = (reportId: number) =>
  axiosInstance.get<{ data: ReportResponse }>(`/reports/${reportId}`);

// 전체 신고 목록 조회 (페이지네이션)
export const getReports = (page: number, size: number) =>
  axiosInstance.get<{ data: ReportResponse[]; pageInfo: PageInfo }>(
    "/reports",
    {
      params: { page, size },
    }
  );

// 신고 처리 완료 (관리자)
export const completeReport = (reportId: number) =>
  axiosInstance.patch<ReportResponse>(`/reports/${reportId}/complete`);

// 신고 반려 (관리자)
export const rejectReport = (reportId: number) =>
  axiosInstance.patch<ReportResponse>(`/reports/${reportId}/reject`);

// 신고 삭제 (관리자)
export const deleteReport = (reportId: number) =>
  axiosInstance.delete<void>(`/reports/${reportId}`);

// 신고 사유 목록 조회
export const getReportReasons = () =>
  axiosInstance.get<{ data: ReportReasonResponse[] }>("/reports/reasons");
