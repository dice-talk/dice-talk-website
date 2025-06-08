// src/components/report/ReportFilterSection.tsx
import React from 'react';
import { ReportStatus } from '../../types/reportTypes';
import { getReportStatusLabel } from '../../lib/ReportUtils';
import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';

interface ReportFilterSectionProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onResetFilters: () => void;
  onSearch: () => void; // 조회 핸들러 prop 추가
}
 
export const ReportFilterSection: React.FC<ReportFilterSectionProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
  onResetFilters,
  onSearch, // onSearch prop 받기
}) => {
  const reportStatusOptions = [
    { value: '전체', label: '전체 상태' },
    ...Object.values(ReportStatus).map(status => ({
      value: status,
      label: getReportStatusLabel(status),
    })),
  ];

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200/75">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        {/* 상태 필터 */}
        <div>
          <DropdownFilter
            label="신고 상태"
            id="statusFilter"
            value={statusFilter}
            onValueChange={onStatusFilterChange}
            options={reportStatusOptions}
            placeholder="전체 상태"
          />
        </div>

        {/* 검색어 필터 (신고자/피신고자 이메일 또는 ID) */}
        <div>
          <SearchInputFilter
            label="검색 (ID/이메일)"
            id="searchTerm"
            placeholder="신고자/피신고자 ID 또는 이메일"
            value={searchTerm}
            onChange={onSearchTermChange}
          />

        </div>

        {/* 필터 초기화 버튼 */}
        <div className="md:col-start-3 lg:col-start-4 flex justify-end gap-3"> {/* gap-3 추가 */}
          <Button variant="outline" onClick={onResetFilters} className="w-full md:w-auto">
            초기화
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full md:w-auto" onClick={onSearch}>조회</Button> {/* 조회 버튼 추가 */}
        </div>
      </div>
    </div>
  );
};