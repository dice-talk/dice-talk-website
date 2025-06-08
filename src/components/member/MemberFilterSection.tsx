import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';

const statusOptions = [
  { value: '전체', label: '전체 상태' },
  { value: '활동 중', label: '활동 중' },
  { value: '휴면 회원', label: '휴면 회원' },
  { value: '정지 회원', label: '정지 회원' },
  { value: '탈퇴 회원', label: '탈퇴 회원' },
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

interface MemberFilterSectionProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  genderFilter: string;
  onGenderFilterChange: (value: string) => void;
  ageGroupFilter: string;
  onAgeGroupFilterChange: (value: string) => void;
  nameSearch: string;
  onNameSearchChange: (value: string) => void;
  emailSearch: string;
  onEmailSearchChange: (value: string) => void;
  onResetFilters: () => void;
  onSearch: () => void;
}

export function MemberFilterSection({
  statusFilter,
  onStatusFilterChange,
  genderFilter,
  onGenderFilterChange,
  ageGroupFilter,
  onAgeGroupFilterChange,
  nameSearch,
  onNameSearchChange,
  emailSearch,
  onEmailSearchChange,
  onResetFilters,
  onSearch,
}: MemberFilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
        <DropdownFilter label="회원 상태" value={statusFilter} onValueChange={onStatusFilterChange} options={statusOptions} placeholder="회원 상태 선택" />
        <DropdownFilter label="성별" value={genderFilter} onValueChange={onGenderFilterChange} options={genderOptions} placeholder="성별 선택" />
        <DropdownFilter label="연령대" value={ageGroupFilter} onValueChange={onAgeGroupFilterChange} options={ageGroupOptions} placeholder="연령대 선택" />
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto" onClick={onSearch}>조회</Button>
        </div>
      </div>
    </div>
  );
}