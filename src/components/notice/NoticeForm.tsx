// src/components/notice/NoticeForm.tsx
import { useState, useEffect } from 'react';
import { ImageUpload } from '../ui/ImageUpload';
import { NoticeStatus } from './noticeUtils';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/Select'; // 커스텀 Select 컴포넌트 임포트

// NoticeItem 인터페이스는 앱 전역에서 사용되므로, src/types/noticeTypes.ts 와 같은
// 공유 파일로 이동하여 관리하는 것이 좋습니다. 여기서는 설명을 위해 간단히 정의합니다.
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
}

export interface NoticeFormData {
  title: string;
  content: string;
  isImportant: boolean;
  status: NoticeStatus;
  type: '공지사항' | '이벤트';
  imageFiles: File[];
  removedImageUrls: string[];
  startDate?: string;
  endDate?: string;
}

interface NoticeFormProps {
  initialData?: Partial<NoticeItemForForm>;
  onSave: (data: NoticeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

export const NoticeForm: React.FC<NoticeFormProps> = ({
  initialData = {},
  onSave,
  isSubmitting = false,
  mode,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [status, setStatus] = useState<NoticeStatus>(NoticeStatus.ONGOING);
  const [type, setType] = useState<'공지사항' | '이벤트'>('공지사항');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>([]);

  useEffect(() => {
    setTitle(initialData.title || '');
    setContent(initialData.content || '');
    setIsImportant(initialData.isImportant || false);
    setStatus(initialData.status || NoticeStatus.ONGOING);
    setType(initialData.type || '공지사항');
    setStartDate(initialData.startDate || '');
    setEndDate(initialData.endDate || '');
    setCurrentImageUrls(initialData.imageUrls || []);
    setImageFiles([]);
    setRemovedImageUrls([]);
  }, [initialData]);

  const handleImageChange = (newFiles: File[], newRemovedUrls: string[]) => {
    setImageFiles(newFiles);
    setRemovedImageUrls(newRemovedUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: NoticeFormData = {
      title,
      content,
      isImportant,
      status,
      type,
      imageFiles,
      removedImageUrls,
      startDate: type === '이벤트' ? startDate : undefined,
      endDate: type === '이벤트' ? endDate : undefined,
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
        <Select value={type} onValueChange={(value) => setType(value as '공지사항' | '이벤트')} disabled={isSubmitting}>
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
            {Object.values(NoticeStatus).map(sVal => (<SelectItem key={sVal} value={sVal}>{sVal}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {type === '이벤트' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isSubmitting} required={type === '이벤트'} />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" disabled={isSubmitting} required={type === '이벤트'} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="noticeContent" className="block text-sm font-medium text-gray-700 mb-1">본문 내용</label>
        <textarea id="noticeContent" value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" disabled={isSubmitting} />
      </div>
      
      <ImageUpload onImagesChange={handleImageChange} existingImageUrls={currentImageUrls} label="이미지 첨부 (선택 사항)" maxFiles={5} disabled={isSubmitting} />
    </form>
  );
};