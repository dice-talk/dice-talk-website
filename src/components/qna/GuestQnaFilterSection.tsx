import Button from "../ui/Button";
import { DropdownFilter } from "../ui/DropdownFilter";
import { SearchInputFilter } from "../ui/SearchInputFilter";

type GuestQnaStatus = "전체" | "QUESTION_GUEST" | "QUESTION_GUEST_ANSWERED";

const guestQnaStatusOptions: { value: GuestQnaStatus; label: string }[] = [
  { value: "전체", label: "전체 상태" },
  { value: "QUESTION_GUEST", label: "답변 미등록" },
  { value: "QUESTION_GUEST_ANSWERED", label: "답변 완료" },
];

const searchTypeOptions = [
  { value: "작성자", label: "작성자(이메일)" },
  { value: "제목", label: "제목" },
  { value: "내용", label: "내용" },
  { value: "작성자+제목", label: "작성자+제목" },
];

interface GuestQnaFilterSectionProps {
  statusFilter: GuestQnaStatus;
  onStatusFilterChange: (value: GuestQnaStatus) => void;
  searchType: string;
  onSearchTypeChange: (value: string) => void;
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  onResetFilters: () => void;
  onSearch: () => void;
}

export function GuestQnaFilterSection({
  statusFilter,
  onStatusFilterChange,
  searchType,
  onSearchTypeChange,
  searchKeyword,
  onSearchKeywordChange,
  onResetFilters,
  onSearch,
}: GuestQnaFilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      {/* 1행: 상태 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
        <DropdownFilter<GuestQnaStatus>
          label="상태"
          id="status-select"
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          options={guestQnaStatusOptions}
          placeholder="상태 선택"
        />
      </div>
      {/* 2행: 검색 조회 및 버튼 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4 items-end">
        <div className="md:col-span-1 lg:col-span-1">
          <DropdownFilter
            label="검색 유형"
            id="search-type-select"
            value={searchType}
            onValueChange={onSearchTypeChange}
            options={searchTypeOptions}
            placeholder="검색 유형 선택"
          />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <SearchInputFilter
            label="검색어"
            value={searchKeyword}
            onChange={onSearchKeywordChange}
            placeholder="검색어를 입력하세요"
          />
        </div>
        <div className="flex justify-end gap-3 lg:col-span-2 mt-4 md:mt-auto">
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
            조회
          </Button>
        </div>
      </div>
    </div>
  );
}
