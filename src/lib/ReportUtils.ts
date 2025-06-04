// src/utils/reportUtils.ts
import { ReportStatus } from '../types/reportTypes';

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getReportStatusLabel = (status: ReportStatus): string => {
  const labels: Record<ReportStatus, string> = {
    [ReportStatus.REPORT_RECEIVED]: '접수됨',
    [ReportStatus.UNDER_REVIEW]: '검토 중',
    [ReportStatus.ACTION_TAKEN]: '조치 완료',
    [ReportStatus.DISMISSED]: '기각됨',
  };
  return labels[status] || status;
};

export const getReportStatusBadgeStyle = (status: ReportStatus): string => {
  const styles: Record<ReportStatus, string> = {
    [ReportStatus.REPORT_RECEIVED]: 'bg-blue-100 text-blue-700',
    [ReportStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-700',
    [ReportStatus.ACTION_TAKEN]: 'bg-green-100 text-green-700',
    [ReportStatus.DISMISSED]: 'bg-gray-100 text-gray-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
};