import Button from "../ui/Button";
import { DropdownFilter } from "../ui/DropdownFilter";
import { SearchInputFilter } from "../ui/SearchInputFilter";

const genderOptions = [
  { value: "전체", label: "전체 성별" },
  { value: "남성", label: "남성" },
  { value: "여성", label: "여성" },
];
const ageGroupOptions = [
  { value: "전체", label: "전체 연령대" },
  { value: "10대", label: "10대" },
  { value: "20대", label: "20대" },
  { value: "30대", label: "30대" },
  { value: "40대", label: "40대" },
  { value: "50대 이상", label: "50대 이상" },
];
const reasonOptions = [
  { value: "전체", label: "전체 사유" },
  { value: "원하는 기능이 부족해서", label: "원하는 기능이 부족해서" },
  { value: "더 나은 서비스를 찾아서", label: "더 나은 서비스를 찾아서" },
  {
    value: "이용 중 불편한 경험이 있어서",
    label: "이용 중 불편한 경험이 있어서",
  },
  { value: "기타", label: "기타" },
];

interface DeletedMemberFilterSectionProps {
  genderFilter: string;
  onGenderFilterChange: (value: string) => void;
  ageGroupFilter: string;
  onAgeGroupFilterChange: (value: string) => void;
  reasonFilter: string;
  onReasonFilterChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onResetFilters: () => void;
}

export function DeletedMemberFilterSection({
  genderFilter,
  onGenderFilterChange,
  ageGroupFilter,
  onAgeGroupFilterChange,
  reasonFilter,
  onReasonFilterChange,
  search,
  onSearchChange,
  onSearch,
  onResetFilters,
}: DeletedMemberFilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
        <DropdownFilter
          label="성별"
          value={genderFilter}
          onValueChange={onGenderFilterChange}
          options={genderOptions}
          placeholder="성별 선택"
        />
        <DropdownFilter
          label="연령대"
          value={ageGroupFilter}
          onValueChange={onAgeGroupFilterChange}
          options={ageGroupOptions}
          placeholder="연령대 선택"
        />
        <DropdownFilter
          label="탈퇴 사유"
          value={reasonFilter}
          onValueChange={onReasonFilterChange}
          options={reasonOptions}
          placeholder="탈퇴 사유 선택"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">
        <SearchInputFilter
          label="이름/이메일 검색"
          value={search}
          onChange={onSearchChange}
          placeholder="이름 또는 이메일 입력"
        />
        <div className="flex justify-end gap-3 md:col-span-2 lg:col-span-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            className="px-6 w-full sm:w-auto"
            onClick={onResetFilters}
          >
            초기화
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto"
            onClick={onSearch}
          >
            검색
          </Button>
        </div>
      </div>
    </div>
  );
}
