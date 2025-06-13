// src/lib/NoticeUtils.ts
import { format, parseISO, isValid } from 'date-fns';
import { 
  NoticeStatus, 
  type NoticeStatusBack, 
  type NoticeTypeBack,
  type NoticeItemView
} from '../types/noticeTypes'; // 타입 경로 확인

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      console.warn("Invalid date string provided to formatDate:", dateString);
      return 'Invalid Date';
    }
    return format(date, 'yyyy.MM.dd');
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Invalid Date';
  }
};

export const formatDateToLocalDateTimeString = (dateString?: string): string | undefined => {
  if (!dateString) return undefined;
  return `${dateString}T00:00:00`;
};

export const mapFrontendStatusToBackend = (frontendStatus: NoticeStatus): NoticeStatusBack => {
  if (frontendStatus === NoticeStatus.SCHEDULED) return 'SCHEDULED';
  if (frontendStatus === NoticeStatus.ONGOING) return 'ONGOING';
  if (frontendStatus === NoticeStatus.CLOSED) return 'CLOSED';
  console.warn(`Unhandled frontend status for backend mapping: ${frontendStatus}, defaulting to SCHEDULED`);
  return 'SCHEDULED';
};

export const mapFrontendStatusToBackendForFilter = (frontendStatus: NoticeStatus | '전체'): NoticeStatusBack | undefined => {
  if (frontendStatus === '전체') return undefined;
  return mapFrontendStatusToBackend(frontendStatus);
};

export const mapBackendStatusToFrontend = (backendStatus: NoticeStatusBack): NoticeStatus => {
  switch (backendStatus) {
    case 'SCHEDULED': return NoticeStatus.SCHEDULED;
    case 'ONGOING':
      return NoticeStatus.ONGOING;
    case 'CLOSED': return NoticeStatus.CLOSED;
    default:
      console.warn(`Unhandled backend status for frontend mapping: ${backendStatus}, defaulting to ONGOING`);
      return NoticeStatus.ONGOING;
  }
};

export const mapFrontendTypeToBackend = (frontendType: NoticeItemView['type']): NoticeTypeBack => {
  return frontendType === '공지사항' ? 'NOTICE' : 'EVENT';
};

export const mapBackendTypeToFrontend = (backendType: NoticeTypeBack): NoticeItemView['type'] => {
  return backendType === 'NOTICE' ? '공지사항' : '이벤트';
};