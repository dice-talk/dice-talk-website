// src/utils/reportUtils.ts
import type { ReportStatus, ReportReason } from "../types/reportTypes";

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getReportStatusLabel = (status: ReportStatus): string => {
  const labels: Record<ReportStatus, string> = {
    REPORT_RECEIVED: "신고 접수됨",
    REPORT_REJECTED: "신고 기각됨",
    REPORT_COMPLETED: "신고 조치 완료",
    REPORT_DELETED: "신고 삭제됨",
  };
  return labels[status] || status;
};

export const getReportStatusBadgeStyle = (status: ReportStatus): string => {
  const styles: Record<ReportStatus, string> = {
    REPORT_RECEIVED: "bg-blue-100 text-blue-700",
    REPORT_REJECTED: "bg-gray-100 text-gray-700",
    REPORT_COMPLETED: "bg-green-100 text-green-700",
    REPORT_DELETED: "bg-red-100 text-red-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};

export const getReportReasonLabel = (reason: ReportReason): string => {
  const labels: Record<ReportReason, string> = {
    SPAM: "스팸",
    HARASSMENT: "성희롱",
    SCAM: "사기",
    ABUSE: "욕설/비방",
    PRIVACY_VIOLATION: "개인정보 침해",
  };
  return labels[reason] || reason;
};
