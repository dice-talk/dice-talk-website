import axiosInstance from './axiosInstance';

interface DailyCount {
  date: string; // ISO 문자열, 예: '2025-05-25'
  count: number;
  isFuture: boolean;
}

interface DashboardWeekly {
  weeklyNewMemberCount: DailyCount[];
  weeklyActiveChatRoomCount: DailyCount[];
  // 추후 신고 수, 결제 수 등 추가 가능
}

export const adminSignup = async (data: DashboardWeekly) => {
  const response = await axiosInstance.post('/admin/dashboard', data);
  return response.data;
};
