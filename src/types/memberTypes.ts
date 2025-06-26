import type { PageInfo } from "./common";

export type MemberStatus =
  | "MEMBER_ACTIVE"
  | "MEMBER_BANNED"
  | "MEMBER_DELETED"
  | "MEMBER_SLEEP";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface MemberPostRequest {
  email: string;
  password: string;
  name: string;
  birth: string;
  gender: Gender;
  region: string;
}

export interface MemberMyInfoResponse {
  memberId: number;
  email: string;
  name: string;
  birth: string;
  gender: Gender;
  region: string;
  totalDice: number;
  memberStatus: MemberStatus;
  ageGroup: string;
  notification: string;
}

export interface MemberMyPageResponse {
  memberId: number;
  nickname: string;
  exitStatus: "ROOM_ENTER" | "ROOM_EXIT";
  ageGroup: string;
  totalDice: number;
}

export interface MemberListParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  memberStatus?: MemberStatus;
  gender?: Gender;
  ageGroup?: string;
}

export interface DeletedMemberListParams {
  page?: number;
  size?: number;
  search?: string;
  gender?: Gender;
  ageGroup?: string;
  reason?: string;
  sort?: string;
  deletedAtStart?: string;
  deletedAtEnd?: string;
}

export interface BannedMemberListParams {
  page?: number;
  size?: number;
  search?: string;
  gender?: Gender;
  ageGroup?: string;
  sort?: string;
  bannedAtStart?: string;
  bannedAtEnd?: string;
}

export interface DeletedMemberResponse {
  memberId: number;
  email: string;
  name: string;
  birth: string;
  region: string;
  deleteReason: string;
  ageGroup: string;
  gender: Gender;
  deletedAt: string;
}

export interface BannedMemberListResponse {
  memberId: number;
  email: string;
  name: string;
  birth: string;
  region: string;
  gender: Gender;
  memberStatus: MemberStatus;
  ageGroup: string;
  bannedAt: string;
}

export interface BannedMemberDetailResponse extends BannedMemberListResponse {
  reports: ReportResponse[];
}

export interface ReportResponse {
  reportId: number;
  reportReason: string;
  createdAt: string;
}

export interface MyInfoResponseDto {
  memberId: number;
  email: string;
  phone?: string | null;
  name: string;
  birth: string;
  gender?: Gender;
  region?: string | null;
  totalDice?: number | null;
  memberStatus: MemberStatus;
  notification?: boolean | null;
  lastLogin?: string;
  reason?: string;
  deletedAt?: string;
  suspensionReason?: string;
  suspensionStartDate?: string;
  warnings?: WarningDetail[];
}

export interface WarningDetail {
  warningId: string;
  reason: string;
  reportedAt: string;
  chatTime?: string;
}

export interface MemberDetailResponseDto extends MyInfoResponseDto {
  warnings?: WarningDetail[];
  lastLogin?: string;
  reason?: string;
  deletedAt?: string;
  suspensionReason?: string;
  suspensionStartDate?: string;
}

export interface MemberUpdateRequestDto {
  name?: string;
  phone?: string;
  region?: string;
  notification?: boolean;
}

export interface MemberStatusUpdateRequestDto {
  memberStatus: MemberStatus;
  reason?: string;
}

export interface MemberSearchParams {
  page: number;
  size: number;
  search?: string;
  sort?: string;
  memberStatus?: MemberStatus;
  gender?: Gender;
  ageGroup?: string;
}

export interface MemberSearchResponseDto {
  data: MyInfoResponseDto[];
  pageInfo: PageInfo;
}
