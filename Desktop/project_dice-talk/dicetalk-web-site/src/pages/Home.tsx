import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { Panel } from '../components/Panel';

export default function Home() {
  useEffect(() => {
    document.title = 'DICE TALK | Dashboard';
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-white p-10 shadow-inner">
          <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>

          {/* 요약 카드 */}
          <section className="grid grid-cols-3 gap-6 mb-8">
            <SummaryCard title="전체 가입자 수" value="1,204" />
            <SummaryCard title="현재 활성 채팅방" value="56" />
            <SummaryCard title="신고 수" value="12" />
          </section>

          {/* 상세 영역 */}
          <section className="grid grid-cols-3 gap-6">
            <Panel title="대기열 현황" items={['하트시그널 - 4/6', '하트시그널 - 3/6', '다이스프렌즈 - 2/6', '다이스프렌즈 - 1/6']} />
            <Panel title="종료 예정 채팅방" items={['#A1024 - 00:12:36', '#A0918 - 01:05:47', '#A2572 - 02:20:15']} />
            <Panel title="가입 추이" items={['(그래프 자리)']} heightClass="h-32 flex items-center justify-center text-gray-400" />
            <Panel title="최근 신고" className="col-span-2" items={[
              '익명유저568 - 사모 구사 / 립밤 삽입',
              '익명유저568 - 번쩍 야간 / 립밤 삽입',
            ]} />

            <Panel title="공지사항" items={['[04.23] 사스픈 국전 안내', '[04.24] 블린이 특판 이벤트']} />
          </section>
        </main>
      </div>
    </div>
  );
}

