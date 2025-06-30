import type { ReportStatus, ReportReason } from "../types/reportTypes";

export const getReportStatusLabel = (status: ReportStatus): string => {
  switch (status) {
    case "REPORT_RECEIVED":
      return "신고 접수";
    case "REPORT_REJECTED":
      return "신고 반려";
    case "REPORT_COMPLETED":
      return "처리 완료";
    case "REPORT_DELETED":
      return "신고 기각"; 
    default:
      return status;
  }
};

export const getReportStatusBadgeStyleSwitch = (
  status: ReportStatus | string // string도 허용
): string => {
  switch (status) {
    case "REPORT_RECEIVED":
    case "신고 접수":
      return "bg-blue-500 text-white font-semibold shadow-sm";
    case "REPORT_REJECTED":
    case "신고 반려":
      return "bg-orange-500 text-white font-semibold shadow-sm";
    case "REPORT_COMPLETED":
    case "처리 완료":
      return "bg-green-500 text-white font-semibold shadow-sm";
    case "REPORT_DELETED":
    case "신고 기각":
      return "bg-red-500 text-white font-semibold shadow-sm";
    default:
      return "bg-gray-500 text-white font-semibold shadow-sm";
  }
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
