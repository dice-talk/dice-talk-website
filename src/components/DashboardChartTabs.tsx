import { useEffect, useState } from 'react';
// import axiosInstance from '../api/axiosInstance';
import WeeklyLineChart from './WeeklyLineChart';

interface DailyCount {
  date: string;
  count: number;
}

interface DashboardWeekly {
  weekStartDate: string;
  weekEndDate: string;
  weeklyNewMemberCount: DailyCount[];
  weeklyActiveChatRoomCount: DailyCount[];
  weeklyReportCount?: DailyCount[];
  weeklyPaymentCount?: DailyCount[];
}

type SummaryType = '가입자 수' | '채팅방 수' | '신고 수' | '결제 수';

const dummyData: DashboardWeekly = {
  weekStartDate: '2025-05-22',
  weekEndDate: '2025-05-28',
  weeklyNewMemberCount: [
    { date: '2025-05-22', count: 3 },
    { date: '2025-05-23', count: 1 },
    { date: '2025-05-24', count: 5 },
    { date: '2025-05-25', count: 10 },
    { date: '2025-05-26', count: 11 },
    { date: '2025-05-27', count: 8 },
    { date: '2025-05-28', count: 12 }
  ],
  weeklyActiveChatRoomCount: [
    { date: '2025-05-22', count: 11 },
    { date: '2025-05-23', count: 8 },
    { date: '2025-05-24', count: 10 },
    { date: '2025-05-25', count: 9 },
    { date: '2025-05-26', count: 6 },
    { date: '2025-05-27', count: 7 },
    { date: '2025-05-28', count: 12 }
  ],
  weeklyReportCount: [
    { date: '2025-05-22', count: 1 },
    { date: '2025-05-23', count: 3 },
    { date: '2025-05-24', count: 2 },
    { date: '2025-05-25', count: 1 },
    { date: '2025-05-26', count: 4 },
    { date: '2025-05-27', count: 1 },
    { date: '2025-05-28', count: 1 }
  ],
  weeklyPaymentCount: [
    { date: '2025-05-22', count: 4 },
    { date: '2025-05-23', count: 1 },
    { date: '2025-05-24', count: 2 },
    { date: '2025-05-25', count: 2 },
    { date: '2025-05-26', count: 2 },
    { date: '2025-05-27', count: 4 },
    { date: '2025-05-28', count: 6 }
  ]
};

export default function DashboardChartTabs({ selectedType }: { selectedType: SummaryType }) {
  const [weeklyData, setWeeklyData] = useState<DashboardWeekly | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weekly = dummyData;
        setWeeklyData(weekly);
      } catch (err) {
        console.error('대시보드 주간 데이터 요청 실패:', err);
        setError('데이터를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const colorMap: Record<SummaryType, string> = {
    '가입자 수': '#3B82F6',
    '채팅방 수': '#8B5CF6',
    '신고 수': '#F59E0B',
    '결제 수': '#10B981'
  };

  const dataMap: Record<SummaryType, DailyCount[]> = {
    '가입자 수': weeklyData?.weeklyNewMemberCount ?? [],
    '채팅방 수': weeklyData?.weeklyActiveChatRoomCount ?? [],
    '신고 수': weeklyData?.weeklyReportCount ?? [],
    '결제 수': weeklyData?.weeklyPaymentCount ?? []
  };

  const titlePrefix = '최근 7일';
  const dateRange = `${dummyData.weekStartDate.slice(5)} ~ ${dummyData.weekEndDate.slice(5)}`;

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-gray-500 text-center">데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <WeeklyLineChart
          title={`${titlePrefix} ${selectedType} (${dateRange})`}
          data={dataMap[selectedType]}
          color={colorMap[selectedType]}
        />
      )}
    </div>
  );
}
