// import { PageInfo } from "../types/common";
import type { ChatResponseDto } from "./chatroom/chatTypes";

export type ReportStatus = string;

export type ReportReason = string;

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
  reportReason: string;
  reporterId: number;
  reporterEmail: string;
  reportedMemberId: number;
  reportedEmail: string;
  reportedChats: ChatResponseDto[];
  chatRoomId: number;
  reportStatus: ReportStatus;
  createdAt: string;
  modifiedAt: string;
}

export interface ReportReasonResponse {
  code: ReportReason;
  description: string;
}
