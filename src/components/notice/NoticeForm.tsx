import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; 
import { ImageUpload } from '../ui/ImageUpload';
import { NoticeStatus } from '../../lib/NoticeUtils'; 
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/Select'; 
import Button from '../ui/Button'; // Button 컴포넌트 임포트
import { Popover, PopoverTrigger, PopoverContent } from '../ui/Popover'; 
import type { ExistingImage } from '../ui/ImageUpload'; // ExistingImage 타입 가져옴

interface NoticeItemForForm { 
  id?: number;
  type: '공지사항' | '이벤트';
  title: string;
  content?: string;
  isImportant: boolean;
  status: NoticeStatus; 
  imageUrls?: string[];
  startDate?: string;
  endDate?: string;
  thumbnailFlags?: boolean[]; 
}

export interface NoticeFormData {
  title: string;
  content: string;
  isImportant: boolean;
  status: NoticeStatus; 
  type: '공지사항' | '이벤트';
  startDate?: string;
  endDate?: string;
  // ImageUpload 관련 필드 추가
  newImageFiles: File[];
  keptExistingImageIds: number[];
  allImageThumbnailFlags: boolean[];
}

interface NoticeFormProps {
  initialData?: Partial<NoticeItemForForm & { existingImages?: ExistingImage[] }>; // existingImages 추가
  onSave: (data: NoticeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "h-4 w-4"}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const NoticeForm: React.FC<NoticeFormProps> = ({
  initialData = {},
  onSave,
  isSubmitting = false,
  mode,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [status, setStatus] = useState<NoticeStatus>(NoticeStatus.ONGOING); // NoticeStatusFrontend 사용
  const [type, setType] = useState<'공지사항' | '이벤트'>('공지사항');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ImageUpload 관련 상태
  const [newlyAddedFiles, setNewlyAddedFiles] = useState<File[]>([]);
  const [removedExistingOriginalUrls, setRemovedExistingOriginalUrls] = useState<string[]>([]); // ImageUpload에서 제거된 '기존' 이미지의 URL
  const [currentAllThumbnailFlags, setCurrentAllThumbnailFlags] = useState<boolean[]>([]);
  const [initialExistingImages, setInitialExistingImages] = useState<ExistingImage[]>([]);

  useEffect(() => {
    setTitle(initialData.title || '');
    setContent(initialData.content || '');
    setIsImportant(initialData.isImportant || false);
    setStatus(initialData.status || NoticeStatus.SCHEDULED); // NoticeNewPage의 초기값과 일치 또는 적절한 기본값
    setType(initialData.type || '공지사항');
    setStartDate(initialData.startDate || '');
    setEndDate(initialData.endDate || '');

    const existingImagesFromProps = initialData.existingImages || [];
    setInitialExistingImages(existingImagesFromProps);

    // ImageUpload 상태 초기화
    setNewlyAddedFiles([]);
    setRemovedExistingOriginalUrls([]);
    // 초기 썸네일 플래그는 existingImagesFromProps에서 가져오거나, 없다면 모두 false로 설정
    setCurrentAllThumbnailFlags(existingImagesFromProps.map(img => img.isThumbnail));

  }, [initialData]);

  const handleImageChange = (
    newFiles: File[], 
    removedUrls: string[], // ImageUpload에서 제거된 이미지 URL (기존 이미지 URL 또는 Blob URL)
    allThumbFlags: boolean[] // ImageUpload에 현재 표시된 모든 이미지의 썸네일 플래그
  ) => {
    setNewlyAddedFiles(newFiles);
    setRemovedExistingOriginalUrls(removedUrls.filter(url => initialExistingImages.some(img => img.url === url))); // 제거된 URL 중 '기존' 이미지의 URL만 필터링
    setCurrentAllThumbnailFlags(allThumbFlags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === '이벤트' && (!startDate || !endDate)) {
      alert('이벤트 유형의 경우 시작일과 종료일을 모두 선택해주세요.');
      return;
    }

    const today = format(new Date(), "yyyy-MM-dd");

    const keptExistingImageIds = initialExistingImages
      .filter(img => img.id !== undefined && !removedExistingOriginalUrls.includes(img.url))
      .map(img => img.id!);

    const formData: NoticeFormData = {
      title,
      content,
      isImportant,
      status,
      type,
      startDate: type === '공지사항' ? today : (startDate || undefined),
      endDate: type === '공지사항' ? today : (endDate || undefined),
      // ImageUpload 관련 데이터
      newImageFiles: newlyAddedFiles,
      keptExistingImageIds: keptExistingImageIds,
      allImageThumbnailFlags: currentAllThumbnailFlags,
    };
    onSave(formData);
  };
  return (
    <form id={`notice-form-${mode}`} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="noticeTitle" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
        <input
          type="text"
          id="noticeTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="noticeIsImportant"
          checked={isImportant}
          onChange={(e) => setIsImportant(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          disabled={isSubmitting}
        />
        <label htmlFor="noticeIsImportant" className="ml-2 block text-sm text-gray-900">중요 공지/이벤트</label>
      </div>

      <div>
        <label htmlFor="noticeType" className="block text-sm font-medium text-gray-700 mb-1">유형</label>
        <Select value={type} onValueChange={(value) => {
          const newType = value as '공지사항' | '이벤트';
          setType(newType);
          if (newType === '공지사항') {
            setStartDate(''); // 공지사항으로 변경 시 날짜 초기화
            setEndDate('');
          }
        }} disabled={isSubmitting}>
          <SelectTrigger id="noticeType">
            <SelectValue placeholder="유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="공지사항">공지사항</SelectItem>
            <SelectItem value="이벤트">이벤트</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="noticeStatus" className="block text-sm font-medium text-gray-700 mb-1">상태</label>
        <Select value={status} onValueChange={(value) => setStatus(value as NoticeStatus)} disabled={isSubmitting}>
          <SelectTrigger id="noticeStatus">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            {(Object.values(NoticeStatus) as NoticeStatus[]).map(sVal => (<SelectItem key={sVal} value={sVal}>{sVal}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {/* 이벤트 유형일 때만 날짜 범위 선택 UI 표시 */}
      {type === '이벤트' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"> {/* 날짜 범위 선택기를 전체 너비로 확장 */}
            <label htmlFor="eventDateRange" className="block text-sm font-medium text-gray-700 mb-1">이벤트 기간</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="eventDateRange"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!(startDate && endDate) ? "text-gray-500" : "text-gray-900"}`}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate && endDate ? (
                    `${format(new Date(startDate), "PPP", { locale: ko })} - ${format(new Date(endDate), "PPP", { locale: ko })}`
                  ) : startDate ? (
                    `${format(new Date(startDate), "PPP", { locale: ko })} - 종료일 선택`
                  ) : (
                    <span>날짜 범위 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-white p-2 shadow-lg" align="start">
                <DayPicker
                  mode="range" // "single"에서 "range"로 변경
                  selected={{
                    from: startDate ? new Date(startDate) : undefined,
                    to: endDate ? new Date(endDate) : undefined,
                  }}
                  onSelect={(range: DateRange | undefined) => {
                    setStartDate(range?.from ? format(range.from, "yyyy-MM-dd") : '');
                    setEndDate(range?.to ? format(range.to, "yyyy-MM-dd") : '');
                  }}
                  locale={ko}
                  numberOfMonths={2} // 두 달을 표시하여 범위 선택 용이
                  disabled={isSubmitting}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
      <div>
        <label htmlFor="noticeContent" className="block text-sm font-medium text-gray-700 mb-1">본문 내용</label>
        <textarea id="noticeContent" value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" disabled={isSubmitting} />
      </div>
      
      <ImageUpload 
        onImagesChange={handleImageChange} 
        existingImageUrls={initialExistingImages}
        label="이미지 첨부 (선택 사항)" 
        maxFiles={5} 
        disabled={isSubmitting}
      />
    </form>
  );
};