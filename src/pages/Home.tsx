import { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { Panel } from '../components/Panel';
import DashboardChartTabs from '../components/DashboardChartTabs';
import { getDashboardData } from '../api/dashboardApi';
import type { MainDashboardResponse } from '../types/dashboardTypes'; // Import DashboardChatRoom

export default function Home() { 
  const [selectedType, setSelectedType] = useState<'가입자 수' | '신고 수' | '채팅방 수' | '결제 수'>('가입자 수');
  const [dashboardData, setDashboardData] = useState<MainDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'DICE TALK | Dashboard';

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('대시보드 데이터 요청 실패:', err);
        setError('대시보드 데이터를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format numbers with commas
  const formatNumber = (num: number | undefined) => {
    return num !== undefined ? num.toLocaleString() : 'N/A';
  };

  // Helper function to get today's date in MM.DD format
  const getTodayDate = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${month}.${day}`;
  };

  // Prepare data for Panel components
  const qnaPanelItems = dashboardData?.dashboardQuestions?.[0] ? [
    `최근 7일간 등록된 질문: ${formatNumber(dashboardData.dashboardQuestions[0].weeklyQuestionCount)}건`,
    `미답변 질문 수: ${formatNumber(dashboardData.dashboardQuestions[0].noAnswerQuestionCount)}건`
  ] : ['데이터를 불러오는 중입니다...'];

  const noticePanelItems = dashboardData?.recentNotices?.[0] ? [
    `최근 등록: ${dashboardData.recentNotices[0].recentNoticeTitle || '없음'}`,
    `진행 중인 이벤트 수: ${formatNumber(dashboardData.recentNotices[0].activeEventCount)}건`
  ] : ['데이터를 불러오는 중입니다...'];

  const paymentPanelItems = dashboardData?.dashboardPayments?.[0] ? [
    `오늘 다이스 충전 금액: ${formatNumber(dashboardData.dashboardPayments[0].todayTotalAmount)}원`,
    `이번 달 다이스 충전: ${formatNumber(dashboardData.dashboardPayments[0].monthlyTotalAmount)}원`,
    `아이템 사용 건수: ${formatNumber(dashboardData.dashboardPayments[0].todayItemUsageCount)}건`
  ] : ['데이터를 불러오는 중입니다...'];

  // NEW: Chat Room Panel Items
  const chatRoomPanelItems = dashboardData?.dashboardChatRooms?.[0] ? [
    `활성화 중인 전체 채팅방: ${formatNumber(dashboardData.dashboardChatRooms[0].activeChatRoom)}개`,
    `활성화 중인 단체 채팅방: ${formatNumber(dashboardData.dashboardChatRooms[0].activeGroupChatRoom)}개`,
    `활성화 중인 1대1 채팅방: ${formatNumber(dashboardData.dashboardChatRooms[0].activeCoupleChatRoom)}개`,
  ] : ['데이터를 불러오는 중입니다...'];

  const recentActivityLogItems = [
    ...(dashboardData?.todayMemberNames?.map(name => `새로운 회원 '${name}'이 가입했습니다.`) || []),
    ...(dashboardData?.dashboardQuestions?.map(q => `새로운 QnA '${q.title}'이 등록되었습니다.`) || []),
    ...(dashboardData?.recentNotices?.map(n => `공지사항 '${n.recentNoticeTitle}'이 작성되었습니다.`) || []),
  ].slice(0, 5); // Limit to a reasonable number of logs

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {/* 메인 콘텐츠 영역: 배경색 변경, 패딩 조정, 내부 그림자 제거, 좌상단 모서리 둥글게 */}
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          {/* <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1> */}

          {/* 요약 카드 */}
          {/* <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center mb-10"> */}
          {loading ? (
            <p className="text-gray-500 text-center py-10">데이터를 불러오는 중입니다...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center mb-10 mt-6">
              <SummaryCard
                title="Today"
                value={getTodayDate()}
                className="!bg-slate-100 !border-slate-300 !text-slate-700 cursor-default"
              />
              <SummaryCard
                title="신규 가입자 수"
                value={formatNumber(dashboardData?.todaySummary?.newMemberCount)}
                selected={selectedType === '가입자 수'}
                onClick={() => setSelectedType('가입자 수')}
              />
              <SummaryCard
                title="신고 수"
                value={formatNumber(dashboardData?.todaySummary?.reportCount)}
                selected={selectedType === '신고 수'}
                onClick={() => setSelectedType('신고 수')}
              />
              <SummaryCard
                title="채팅방 수"
                value={formatNumber(dashboardData?.todaySummary?.activeChatRoomCount)}
                selected={selectedType === '채팅방 수'}
                onClick={() => setSelectedType('채팅방 수')}
              />
              <SummaryCard
                title="결제 수"
                value={formatNumber(dashboardData?.todaySummary?.paymentCount)}
                selected={selectedType === '결제 수'}
                onClick={() => setSelectedType('결제 수')}
              />
            </section>
          )}

          {/* ✅ 차트 탭 */}
          <div className="mx-auto w-full max-w-screen-lg xl:max-w-screen-xl mb-10">
            <DashboardChartTabs
              selectedType={selectedType}
              weeklyData={dashboardData?.dashboardWeeklies || null}
              loading={loading}
              error={error}
            />
          </div>

          {/* 상세 영역 */}
          {/* Changed grid to md:grid-cols-2 lg:grid-cols-4 to accommodate 4 panels */}
          <section className="w-full max-w-screen-lg xl:max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 mt-8 mb-8">
            <Panel
              title="QnA 관리"
              items={qnaPanelItems}
            />
            <Panel
              title="공지사항"
              items={noticePanelItems}
            />
            <Panel
              title="결제"
              items={paymentPanelItems}
            />
            {/* NEW: Chat Room Panel */}
            <Panel
              title="채팅방 관리"
              items={chatRoomPanelItems}
            />
           </section>

            {/* 최근 활동 로그 */}
           {/* <section className="mt-6"> */}
           <section className="w-full max-w-screen-lg xl:max-w-screen-xl mx-auto mt-8">
            <Panel
              title="최근 활동 로그" // The backend DTO doesn't provide a direct "activity log" list. I'll construct it from available data.
              items={recentActivityLogItems.length > 0 ? recentActivityLogItems : ['최근 활동 로그가 없습니다.']}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
