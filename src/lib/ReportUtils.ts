// src/utils/reportUtils.ts
import type { ReportStatus, ReportReason } from "../types/reportTypes";


export const getReportStatusLabel = (status: ReportStatus): string => {
  switch (status) {
    case 'REPORT_RECEIVED':
      return '신고 접수';
    case 'REPORT_REJECTED':
      return '신고 반려';
    case 'REPORT_COMPLETED':
      return '처리 완료';
    case 'REPORT_DELETED':
      return '삭제됨'; // 혹은 다른 적절한 레이블
    default:
      return status;
  }
};

export const getReportStatusBadgeStyleSwitch = (status: ReportStatus): string => {
  switch (status) {
    case 'REPORT_RECEIVED': return "bg-blue-100 text-blue-700";
    case 'REPORT_REJECTED': return "bg-gray-100 text-gray-700";
    case 'REPORT_COMPLETED': return "bg-green-100 text-green-700";
    case 'REPORT_DELETED': return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700"; // 일치하는 case가 없으면 기본 회색 반환
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
