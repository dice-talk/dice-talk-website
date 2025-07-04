// import { format, parseISO, isValid } from 'date-fns';
import { 
  NoticeStatus, 
  type NoticeStatusBack, 
  type NoticeTypeBack,
  type NoticeItemView
} from '../types/noticeTypes'; 
export type NoticeStatusType = 'ONGOING' | 'SCHEDULED' | 'CLOSED' | string;
export { NoticeStatus }; 

export const mapBackendTypeToFrontendList = (backendType?: NoticeTypeBack): NoticeItemView['type'] | undefined => {
  if (!backendType) return undefined;
  return backendType === 'NOTICE' ? '공지사항' : '이벤트';
};

export const mapBackendStatusToFrontendList = (backendStatus?: NoticeStatusBack): NoticeStatus | undefined => {
  if (!backendStatus) return undefined;
  switch (backendStatus) {
    case 'SCHEDULED': return NoticeStatus.SCHEDULED;
    case 'ONGOING': return NoticeStatus.ONGOING;
    case 'CLOSED': return NoticeStatus.CLOSED;
    default: return NoticeStatus.ONGOING; // 기본값 또는 unhandled 상태 처리
  }
};

export const getNoticeLabel = (status: NoticeStatusType): string => {
  switch (status) {
    case 'ONGOING':
      return NoticeStatus.ONGOING; // "진행중"
    case 'SCHEDULED':
      return NoticeStatus.SCHEDULED; // "예정"
    case 'CLOSED':
      return NoticeStatus.CLOSED; // "종료"
    default:
      return status.toString(); // 알 수 없는 상태는 그대로 표시
  }
};

export const getNoticeStyle = (status: NoticeStatusType): string => {
  switch (status) {
    case NoticeStatus.ONGOING: return 'bg-green-100 text-green-700';
    case NoticeStatus.SCHEDULED: return 'bg-blue-100 text-blue-700';
    case NoticeStatus.CLOSED: return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
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