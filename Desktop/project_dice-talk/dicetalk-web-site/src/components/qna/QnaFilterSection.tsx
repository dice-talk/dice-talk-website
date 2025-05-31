import Input from '../ui/Input';
import Button from '../ui/Button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/Select';

const qnaStatusOptions = [
  { value: '전체', label: '전체 상태' },
  { value: '답변 완료', label: '답변 완료' },
  { value: '답변 미등록', label: '답변 미등록' },
];

interface QnaFilterSectionProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  authorSearch: string;
  onAuthorSearchChange: (value: string) => void;
  titleSearch: string;
  onTitleSearchChange: (value: string) => void;
  contentSearch: string;
  onContentSearchChange: (value: string) => void;
  onResetFilters: () => void;
  // onApplyFilters: () => void; // 필요시 조회 버튼 핸들러 추가
}

export function QnaFilterSection({
  statusFilter,
  onStatusFilterChange,
  authorSearch,
  onAuthorSearchChange,
  titleSearch,
  onTitleSearchChange,
  contentSearch,
  onContentSearchChange,
  onResetFilters,
}: QnaFilterSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      {/* 1행: 상태 선택 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-4">
        <div className="flex flex-col md:col-span-1">
          <label htmlFor="status-select" className="mb-1 text-sm font-medium text-gray-700">상태</label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger id="status-select">
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              {qnaStatusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* 2행: 검색 조회 및 버튼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-4 items-end">
        <div className="flex flex-col lg:col-span-1">
          <label htmlFor="author-input" className="mb-1 text-sm font-medium text-gray-700">작성자(이메일)</label>
          <Input id="author-input" placeholder="이메일 입력" value={authorSearch} onChange={(e) => onAuthorSearchChange(e.target.value)} />
        </div>
        <div className="flex flex-col lg:col-span-1">
          <label htmlFor="title-input" className="mb-1 text-sm font-medium text-gray-700">제목</label>
          <Input id="title-input" placeholder="제목 입력" value={titleSearch} onChange={(e) => onTitleSearchChange(e.target.value)} />
        </div>
        <div className="flex flex-col lg:col-span-1">
          <label htmlFor="content-input" className="mb-1 text-sm font-medium text-gray-700">내용</label>
          <Input id="content-input" placeholder="내용 입력" value={contentSearch} onChange={(e) => onContentSearchChange(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 lg:col-span-2 mt-4 lg:mt-0">
          <Button variant="outline" className="px-6 w-full sm:w-auto" onClick={onResetFilters}>초기화</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto">조회</Button>
        </div>
      </div>
    </div>
  );
}