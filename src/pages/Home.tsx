import { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { Panel } from '../components/Panel';
import DashboardChartTabs from '../components/DashboardChartTabs';

export default function Home() {
const [selectedType, setSelectedType] = useState<'가입자 수' | '신고 수' | '채팅방 수' | '결제 수'>('가입자 수');
  useEffect(() => {
    document.title = 'DICE TALK | Dashboard';
  }, []);

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
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center mb-10 mt-6">
          <SummaryCard 
            title="Today" 
            value="05.24" 
            className="!bg-slate-100 !border-slate-300 !text-slate-700 cursor-default" // Today 카드는 선택 불가 및 다른 스타일 적용
          />
          <SummaryCard
            title="신규 가입자 수"
            value= '52'
            selected={selectedType === '가입자 수'}
            onClick={() => setSelectedType('가입자 수')}
          />
          <SummaryCard
            title="신고 수"
            value= '6'
            selected={selectedType === '신고 수'}
            onClick={() => setSelectedType('신고 수')}
          />
          <SummaryCard
            title="채팅방 수"
            value='21'
            selected={selectedType === '채팅방 수'}
            onClick={() => setSelectedType('채팅방 수')}
          />
          <SummaryCard
            title="결제 수"
            value='12'
            selected={selectedType === '결제 수'}
            onClick={() => setSelectedType('결제 수')}
          />
          </section>

          {/* ✅ 차트 탭 */}
          <div className="mx-auto w-full max-w-screen-lg xl:max-w-screen-xl mb-10">
            {/* <div className="w-full max-w-screen-md"></div> */}
              <DashboardChartTabs selectedType={selectedType} />
            {/* </div> */}
          </div>

          {/* 상세 영역 */}
          {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-8"> */}
          <section className="w-full max-w-screen-lg xl:max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 mt-8 mb-8">
            <Panel
              title="QnA 관리"
              items={[
                '최근 7일간 등록된 질문: 23건',
                '미답변 질문 수: 6건'
              ]}
            />
            <Panel
              title="공지사항"
              items={[
                '최근 등록: 새로운 기능 업데이트 안내',
                '등록일: 2025-05-13',
                '진행 중인 이벤트 수: 2건'
              ]}
            />
            <Panel
              title="결제"
              items={[
                '오늘 다이스 충전 금액: 35,000원',
                '이번 달 다이스 충전: 520,000원',
                '아이템 사용 건수: 18건'
              ]}
            />
           </section>

            {/* 최근 활동 로그 */}
           {/* <section className="mt-6"> */}
           <section className="w-full max-w-screen-lg xl:max-w-screen-xl mx-auto mt-8">
            <Panel
              title="최근 활동 로그"
              className="col-span-3"
              items={[
                "새로운 QnA '사진 업로드 용량'이 등록되었습니다.",
                "새로운 QnA '기록 분류'에 등록되었습니다.",
                "공지사항 '새로운 기능 업데이트 안내: 편리해진 사용자 인터페이스'가 작성되었습니다.",
                "공지사항 '특별 이벤트 소식 – 참여하고 보상을 받아보세요!'가 작성되었습니다."
              ]}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
