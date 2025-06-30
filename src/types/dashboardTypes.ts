export interface DailyCount {
  date: string; // YYYY-MM-DD
  count: number;
  isFuture?: boolean; 
}

export interface DashboardChatRoom {
  activeChatRoom: number;
  activeGroupChatRoom: number;
  activeCoupleChatRoom: number;
}

export interface DashboardNotice {
  recentNoticeTitle: string;
  activeEventCount: number;
}

export interface TopPayer {
  memberId: number;
  email: string;
  totalAmount: number;
}

export interface DashboardPayment {
  todayTotalAmount: number;
  monthlyTotalAmount: number;
  todayItemUsageCount: number;
  topPayers: TopPayer[];
}

export interface DashboardQuestion {
  title: string;
  noAnswerQuestionCount: number;
  weeklyQuestionCount: number;
}

export interface DashboardWeekly {
  weekStartDate: string; // YYYY-MM-DD
  weekEndDate: string;   // YYYY-MM-DD
  weeklyNewMemberCount: DailyCount[];
  weeklyActiveChatRoomCount: DailyCount[];
  weeklyReportCount: DailyCount[];
  weeklyPaymentCount: DailyCount[];
}

export interface TodaySummary {
  newMemberCount: number;
  reportCount: number;
  activeChatRoomCount: number;
  paymentCount: number;
}

export interface MainDashboardResponse {
  todaySummary: TodaySummary;
  dashboardWeeklies: DashboardWeekly;
  todayMemberNames: string[];
  dashboardQuestions: DashboardQuestion[];
  recentNotices: DashboardNotice[];
  dashboardChatRooms: DashboardChatRoom[];
  dashboardPayments: DashboardPayment[];
}