import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';

const statusOptions = [
  { value: '전체', label: '전체 상태' },
  // { value: '활동 중', label: '활동 중' }, // 탈퇴 회원이므로 필요 없음
  // { value: '휴면 회원', label: '휴면 회원' }, // 탈퇴 회원이므로 필요 없음
  // { value: '정지 회원', label: '정지 회원' }, // 탈퇴 회원이므로 필요 없음
  { value: '탈퇴 회원', label: '탈퇴 회원' }, // 기본적으로 탈퇴 회원만 표시될 것이므로, 이 필터가 꼭 필요한지 고려
];
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
const reasonOptions = [
  { value: '전체', label: '전체 사유' },
  { value: '원하는 기능이 부족해서', label: '원하는 기능이 부족해서' },
  { value: '더 나은 서비스를 찾아서', label: '더 나은 서비스를 찾아서' },
  { value: '이용 중 불편한 경험이 있어서', label: '이용 중 불편한 경험이 있어서' },
  { value: '기타', label: '기타' },
];

interface DeletedMemberFilterSectionProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  genderFilter: string;
  onGenderFilterChange: (value: string) => void;
  ageGroupFilter: string;
  onAgeGroupFilterChange: (value: string) => void;
  reasonFilter: string;
  onReasonFilterChange: (value: string) => void;
  nameSearch: string;
  onNameSearchChange: (value: string) => void;
  emailSearch: string;
  onEmailSearchChange: (value: string) => void;
  onResetFilters: () => void;
}

export function DeletedMemberFilterSection({
  statusFilter,
  onStatusFilterChange,
  genderFilter,
  onGenderFilterChange,
  ageGroupFilter,
  onAgeGroupFilterChange,
  reasonFilter,
  onReasonFilterChange,
  nameSearch,
  onNameSearchChange,
  emailSearch,
  onEmailSearchChange,
  onResetFilters,
}: DeletedMemberFilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-6">
        <DropdownFilter label="회원 상태" value={statusFilter} onValueChange={onStatusFilterChange} options={statusOptions} placeholder="회원 상태 선택" />
        <DropdownFilter label="성별" value={genderFilter} onValueChange={onGenderFilterChange} options={genderOptions} placeholder="성별 선택" />
        <DropdownFilter label="연령대" value={ageGroupFilter} onValueChange={onAgeGroupFilterChange} options={ageGroupOptions} placeholder="연령대 선택" />
        <DropdownFilter label="탈퇴 사유" value={reasonFilter} onValueChange={onReasonFilterChange} options={reasonOptions} placeholder="탈퇴 사유 선택" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">
        <SearchInputFilter
          label="이름"
          value={nameSearch}
          onChange={onNameSearchChange}
          placeholder="이름 입력"
        />
        <SearchInputFilter
          label="이메일"
          value={emailSearch}
          onChange={onEmailSearchChange}
          placeholder="이메일 입력"
        />
        <div className="flex justify-end gap-3 md:col-span-1 lg:col-span-2 mt-4 md:mt-0">
          <Button variant="outline" className="px-6 w-full sm:w-auto" onClick={onResetFilters}>초기화</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto">조회</Button>
        </div>
      </div>
    </div>
  );
}