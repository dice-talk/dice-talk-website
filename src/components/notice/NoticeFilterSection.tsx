import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';
import { NoticeStatus } from './noticeUtils'; // NoticeStatus import

const noticeTypeOptions = [
  { value: '전체', label: '전체 유형' },
  { value: '공지사항', label: '공지사항' },
  { value: '이벤트', label: '이벤트' },
];

// NoticeStatus enum을 사용하여 공지 상태 옵션 생성
const noticeStatusOptions = [
  { value: '전체', label: '전체' },
  ...Object.values(NoticeStatus).map(status => ({ value: status, label: status })),
];

interface NoticeFilterSectionProps {
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  importanceFilter: string;
  onImportanceFilterChange: (value: string) => void;
  titleSearch: string;
  onTitleSearchChange: (value: string) => void;
  onResetFilters: () => void;
  noticeStatusFilter: string; // 새로운 prop
  onNoticeStatusFilterChange: (value: string) => void; // 새로운 prop
  onSearch: () => void; // 조회 버튼 클릭 핸들러 prop 추가
}

export function NoticeFilterSection({
  typeFilter,
  onTypeFilterChange,
  titleSearch,
  onTitleSearchChange,
  onResetFilters,
  noticeStatusFilter,
  onNoticeStatusFilterChange,
  onSearch, // onSearch prop 받기
}: NoticeFilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
        <DropdownFilter label="유형" value={typeFilter} onValueChange={onTypeFilterChange} options={noticeTypeOptions} placeholder="유형 선택" />
        <DropdownFilter label="공지 상태" value={noticeStatusFilter} onValueChange={onNoticeStatusFilterChange} options={noticeStatusOptions} placeholder="공지 상태 선택" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 items-end">
        <div className="lg:col-span-1">
            <SearchInputFilter
            label="제목 & 내용"
            value={titleSearch}
            onChange={onTitleSearchChange}
            placeholder="키워드 검색"
            />
        </div>
        <div className="flex justify-end gap-3 md:col-span-1 lg:col-span-2 mt-4 md:mt-0">
          <Button variant="outline" className="px-6 w-full sm:w-auto" onClick={onResetFilters}>초기화</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto" onClick={onSearch}>조회</Button>
        </div>
      </div>
    </div>
  );
}