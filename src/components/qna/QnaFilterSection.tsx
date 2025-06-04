import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';

const qnaStatusOptions = [
  { value: '전체', label: '전체 상태' },
  { value: '답변 완료', label: '답변 완료' },
  { value: '답변 미등록', label: '답변 미등록' },
];

const searchTypeOptions = [
  { value: '작성자', label: '작성자(이메일)' },
  { value: '제목', label: '제목' },
  { value: '내용', label: '내용' },
  { value: '작성자+제목', label: '작성자+제목' },
];

interface QnaFilterSectionProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchType: string;
  onSearchTypeChange: (value: string) => void;
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  onResetFilters: () => void;
}

export function QnaFilterSection({
  statusFilter,
  onStatusFilterChange,
  searchType,
  onSearchTypeChange,
  searchKeyword,
  onSearchKeywordChange,
  onResetFilters,
}: QnaFilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      {/* 1행: 상태 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6"> {/* mb-4에서 mb-6으로 변경하여 간격 조정 */}
        <DropdownFilter
          label="상태"
          id="status-select"
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          options={qnaStatusOptions}
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
          <SearchInputFilter label="검색어" value={searchKeyword} onChange={onSearchKeywordChange} placeholder="검색어를 입력하세요" />
        </div>
        <div className="flex justify-end gap-3 lg:col-span-2 mt-4 md:mt-auto"> {/* md:mt-auto 추가 */}
          <Button variant="outline" className="px-6 w-full sm:w-auto" onClick={onResetFilters}>초기화</Button>
          {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto">조회</Button> */}
        </div>
      </div>
    </div>
  );
}