// import { useEffect, useState } from 'react'; // Keep these imports if they are used elsewhere in the file, otherwise remove
// import axiosInstance from '../api/axiosInstance';
import WeeklyLineChart from './WeeklyLineChart';
import type { DashboardWeekly, DailyCount } from '../types/dashboardTypes'; // Import types from new file

type SummaryType = '가입자 수' | '채팅방 수' | '신고 수' | '결제 수';

interface DashboardChartTabsProps {
  selectedType: SummaryType;
  weeklyData: DashboardWeekly | null; // Now received as a prop
  loading: boolean; // Now received as a prop
  error: string | null; // Now received as a prop
}

export default function DashboardChartTabs({
  selectedType,
  weeklyData,
  loading,
  error,
}: DashboardChartTabsProps) {
  // No internal state for weeklyData, loading, error, or useEffect for fetching.
  // These are now props from the parent Home component.

  const colorMap: Record<SummaryType, string> = {
    '가입자 수': '#3B82F6',
    '채팅방 수': '#8B5CF6',
    '신고 수': '#F59E0B',
    '결제 수': '#10B981'
  };
  // Helper to add isFuture flag based on weekEndDate
  const processDailyCounts = (counts: DailyCount[]): DailyCount[] => {
    if (!weeklyData || counts.length === 0) return [];
    const endDate = new Date(weeklyData.weekEndDate);
    return counts.map(item => ({
      ...item,
      isFuture: new Date(item.date) > endDate,
    }));
  };
  const processedDataMap: Record<SummaryType, DailyCount[]> = {
    '가입자 수': processDailyCounts(weeklyData?.weeklyNewMemberCount || []),
    '채팅방 수': processDailyCounts(weeklyData?.weeklyActiveChatRoomCount || []),
    '신고 수': processDailyCounts(weeklyData?.weeklyReportCount || []),
    '결제 수': processDailyCounts(weeklyData?.weeklyPaymentCount || [])
  };
  const titlePrefix = '최근 7일';
  const dateRange = weeklyData ? `${weeklyData.weekStartDate.slice(5)} ~ ${weeklyData.weekEndDate.slice(5)}` : '';

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-gray-500 text-center">데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <WeeklyLineChart
          title={`${titlePrefix} ${selectedType} (${dateRange})`}
          data={processedDataMap[selectedType]}
          color={colorMap[selectedType]}
        />
      )}
    </div>
  );
}
