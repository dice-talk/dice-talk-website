// src/components/member/SuspendedMemberFilterSection.tsx
import React from 'react';
import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';

interface SuspendedMemberFilterSectionProps {
  genderFilter: string;
  onGenderFilterChange: (value: string) => void;
  ageGroupFilter: string;
  onAgeGroupFilterChange: (value: string) => void;
  suspensionReasonFilter: string; // 'reasonFilter'에서 'suspensionReasonFilter'로 변경
  onSuspensionReasonFilterChange: (value: string) => void; // 핸들러 이름 변경
  nameSearch: string;
  onNameSearchChange: (value: string) => void;
  emailSearch: string;
  onEmailSearchChange: (value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void; 
  // 정지 기간 필터는 필요시 추가 (예: startDate, endDate)
}

const genderOptions = [
  { value: '전체', label: '전체 성별' },
  { value: '남성', label: '남성' },
  { value: '여성', label: '여성' },
];

const ageGroupOptions = [
  { value: '전체', label: '전체 연령대' },
  { value: '10대', label: '10대' },
  { value: '20대', label: '20대' },
  { value: '30대', label: '30대' },
  { value: '40대', label: '40대' },
  { value: '50대 이상', label: '50대 이상' },
];

// 정지 사유 예시 (실제 데이터에 맞게 조정 필요)
const suspensionReasonOptions = [
  { value: '전체', label: '전체 정지 사유' },
  { value: '부적절한 언행', label: '부적절한 언행' },
  { value: '스팸/광고', label: '스팸/광고' },
  { value: '운영규칙 위반', label: '운영규칙 위반' },
  { value: '기타', label: '기타' },
];

export const SuspendedMemberFilterSection: React.FC<SuspendedMemberFilterSectionProps> = ({
  genderFilter,
  onGenderFilterChange,
  ageGroupFilter,
  onAgeGroupFilterChange,
  suspensionReasonFilter,
  onSuspensionReasonFilterChange,
  nameSearch,
  onNameSearchChange,
  emailSearch,
  onEmailSearchChange,
  onResetFilters,
}) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200/75">
      {/* 첫 번째 행: 드롭다운 필터 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end mb-4">
        <DropdownFilter
          label="성별"
          id="genderFilter"
          value={genderFilter}
          onValueChange={onGenderFilterChange}
          options={genderOptions}
        />
        <DropdownFilter
          label="연령대"
          id="ageGroupFilter"
          value={ageGroupFilter}
          onValueChange={onAgeGroupFilterChange}
          options={ageGroupOptions}
        />
        <DropdownFilter
          label="정지 사유"
          id="suspensionReasonFilter"
          value={suspensionReasonFilter}
          onValueChange={onSuspensionReasonFilterChange}
          options={suspensionReasonOptions}
        />
      </div>

      {/* 두 번째 행: 검색 필터 및 초기화 버튼 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
        <SearchInputFilter
          label="이름 검색"
          id="nameSearch"
          placeholder="이름으로 검색"
          value={nameSearch}
          onChange={onNameSearchChange}
        />
        <SearchInputFilter
          label="이메일 검색"
          id="emailSearch"
          placeholder="이메일로 검색"
          value={emailSearch}
          onChange={onEmailSearchChange}
        />
        <div className="flex items-end justify-end md:col-start-3 space-x-2"> {/* 버튼들을 오른쪽 끝으로 정렬하고 간격 추가 */}
          {/* <Button
            variant="default" // 조회 버튼은 default variant
            onClick={onApplyFilters}
            className="w-full sm:w-auto"
          >
            조회
          </Button> */}
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="w-full sm:w-auto" // 작은 화면에서는 전체 너비, sm 이상에서는 자동 너비
          >
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
};