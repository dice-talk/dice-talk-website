// import { PageInfo } from "../types/common";
import type { ChatResponse } from "./chatTypes";

export type ReportStatus =
  | "REPORT_RECEIVED"
  | "REPORT_REJECTED"
  | "REPORT_COMPLETED"
  | "REPORT_DELETED";

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "SCAM"
  | "ABUSE"
  | "PRIVACY_VIOLATION";

export interface ReportPostDto {
  reportReason: ReportReason;
  reporterId: number;
  chatReports?: ChatReportPost[];
  reportedMemberIds: number[];
}

export interface ChatReportPost {
  chatId: number;
}

export interface ReportResponse {
  reportId: number;
  reportReason: ReportReason;
  reporterId: number;
  reporterEmail: string;
  reportedMemberId: number;
  reportedEmail: string;
  reportedChats: ChatResponse[];
  chatRoomId: number;
  reportStatus: ReportStatus;
  createdAt: string;
  modifiedAt: string;
}

export interface ReportReasonResponse {
  code: ReportReason;
  description: string;
}
