export const ReportStatus = {
  REPORT_RECEIVED: 'REPORT_RECEIVED', // 접수됨
  UNDER_REVIEW: 'UNDER_REVIEW',       // 검토 중
  ACTION_TAKEN: 'ACTION_TAKEN',       // 조치 완료 (예: 경고 발송)
  DISMISSED: 'DISMISSED',             // 기각됨
} as const;

export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

export interface ReportedChat {
  chatId: number;
  message: string;
  memberId: number;
  nickname: string;
  chatRoomId: number;
  createdAt: string;
}

export interface ReportItem {
  reportId: number;
  reason: string;
  reporterId: number;
  reporterEmail: string;
  reportedMemberId: number;
  reportedEmail: string;
  reportedChats: ReportedChat[]; // 여러 채팅 내용이 첨부될 수 있음을 가정
  reportStatus: ReportStatus;
  createdAt: string;
  modifiedAt: string;
}