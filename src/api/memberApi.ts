import { axiosInstance } from "./axiosInstance";
import type {
  MemberPostRequest,
  MemberMyInfoResponse,
  MemberMyPageResponse,
  DeletedMemberResponse,
  BannedMemberListResponse,
  BannedMemberDetailResponse,
  MemberListParams,
  DeletedMemberListParams,
  BannedMemberListParams,
} from "../types/memberTypes";
import type { PageInfo } from "../types/common";

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// API Functions
export const registerMember = async (data: MemberPostRequest) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response;
};

export const registerAdmin = async (data: MemberPostRequest) => {
  const response = await axiosInstance.post("/admin/register", data);
  return response;
};

export const setNotificationConsent = async (
  memberId: number,
  consent: boolean
) => {
  const response = await axiosInstance.post(
    `/notification/${memberId}?consent=${consent}`
  );
  return response;
};

export const updateMemberRegion = async (memberId: number, region: string) => {
  const response = await axiosInstance.patch<MemberMyInfoResponse>(
    `/my-info/${memberId}`,
    { region }
  );
  return response;
};

export const changePassword = async (data: PasswordChangeRequest) => {
  const response = await axiosInstance.post("/password", data);
  return response;
};

export const getMemberInfo = async (memberId: number) => {
  const response = await axiosInstance.get<MemberMyInfoResponse>(
    `/my-info/${memberId}`
  );
  return response;
};

export const getMemberMyPage = async (memberId: number) => {
  const response = await axiosInstance.get<MemberMyPageResponse>(
    `/my-page/${memberId}`
  );
  return response;
};

export const getMembers = async (params: MemberListParams) => {
  const response = await axiosInstance.get<{
    data: MemberMyInfoResponse[];
    pageInfo: PageInfo;
  }>("/admin/member-page", { params });
  return response;
};

export const deleteMember = async (memberId: number, reason: string) => {
  const response = await axiosInstance.delete(`/my-info/${memberId}`, {
    data: reason,
  });
  return response;
};

export const banMember = async (memberId: number) => {
  const response = await axiosInstance.delete(`/admin/member-page/${memberId}`);
  return response;
};

export const getDeletedMembers = async (params: DeletedMemberListParams) => {
  const response = await axiosInstance.get<{
    data: DeletedMemberResponse[];
    pageInfo: PageInfo;
  }>("/admin/deleted-members", { params });
  return response;
};

export const getBannedMembers = async (params: BannedMemberListParams) => {
  const response = await axiosInstance.get<{
    data: BannedMemberListResponse[];
    pageInfo: PageInfo;
  }>("/admin/banned-members", { params });
  return response;
};

export const getBannedMemberDetail = async (
  memberId: number
): Promise<BannedMemberDetailResponse> => {
  const response = await axiosInstance.get<{
    data: BannedMemberDetailResponse;
  }>(`/admin/banned-members/${memberId}`);
  return response.data.data;
};
