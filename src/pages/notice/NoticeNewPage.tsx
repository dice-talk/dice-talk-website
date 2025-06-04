// src/pages/notice/NoticeNewPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { NoticeForm, type NoticeFormData } from '../../components/notice/NoticeForm';
import { NoticeStatus } from '../../components/notice/noticeUtils';

// NoticeItem 및 mockNotices는 데모용으로 NoticeDetail에서 가져옵니다.
// 실제 앱에서는 API 호출 및 상태 관리를 통해 처리해야 합니다.
import { mockNotices } from './NoticeDetail'; 

// NoticeItem 인터페이스는 공유 타입으로 분리하는 것이 좋습니다.
interface NoticeItem {
  id: number;
  type: '공지사항' | '이벤트';
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
  status: NoticeStatus;
  imageUrls?: string[];
  startDate?: string;
  endDate?: string;
}

export default function NoticeNewPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId?: string }>(); // 수정 모드를 위해 noticeId 받기
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [initialFormData, setInitialFormData] = useState<Partial<NoticeItem>>({
    type: '공지사항',
    status: NoticeStatus.SCHEDULED,
    isImportant: false,
    content: '',
  });
  const [pageTitle, setPageTitle] = useState('새 공지/이벤트 등록');
  const [submitButtonText, setSubmitButtonText] = useState('등록');

  useEffect(() => {
    if (noticeId) {
      const itemId = parseInt(noticeId, 10);
      const foundItem = mockNotices.find(n => n.id === itemId);
      if (foundItem) {
        setMode('edit');
        setPageTitle('공지/이벤트 수정');
        setSubmitButtonText('수정');
        setInitialFormData({
          ...foundItem,
          content: foundItem.content || '', // content가 undefined일 경우 빈 문자열로
        });
      } else {
        console.error("수정할 공지/이벤트 항목을 찾을 수 없습니다.");
        navigate('/notices'); // 목록으로 리디렉션 또는 404
      }
    } else {
      setMode('create');
      setPageTitle('새 공지/이벤트 등록');
      setSubmitButtonText('등록');
      setInitialFormData({ type: '공지사항', status: NoticeStatus.SCHEDULED, isImportant: false, content: '' });
    }
  }, [noticeId, navigate]);

  const handleSaveNotice = (formData: NoticeFormData) => {
    setIsSubmitting(true);

    if (mode === 'create') {
      console.log("Creating new notice:", formData);
      const newNoticeId = mockNotices.length > 0 ? Math.max(...mockNotices.map(n => n.id)) + 1 : 1;
      const newUploadedImageUrls = formData.imageFiles.map((file, index) => `https://via.placeholder.com/400x200.png?text=NewNoticeImg${newNoticeId}-${index + 1}-${file.name}`);
      const newNotice: NoticeItem = {
        id: newNoticeId,
        title: formData.title,
        content: formData.content,
        isImportant: formData.isImportant,
        status: formData.status,
        type: formData.type,
        createdAt: new Date().toISOString(),
        imageUrls: newUploadedImageUrls,
        startDate: formData.type === '이벤트' ? formData.startDate : undefined,
        endDate: formData.type === '이벤트' ? formData.endDate : undefined,
      };
      mockNotices.push(newNotice);
      alert('새 공지/이벤트가 등록되었습니다.');
      navigate(`/notices/${newNoticeId}`);
    } else if (mode === 'edit' && noticeId) {
      console.log("Updating notice:", noticeId, formData);
      const itemId = parseInt(noticeId, 10);
      const itemIndex = mockNotices.findIndex(n => n.id === itemId);
      if (itemIndex > -1) {
        const existingItem = mockNotices[itemIndex];
        const newUploadedImageUrls = formData.imageFiles.map((file, index) => `https://via.placeholder.com/400x200.png?text=UpdatedImg${itemId}-${index + 1}-${file.name}`);
        const finalImageUrls = [
          ...(existingItem.imageUrls || []).filter(url => !formData.removedImageUrls.includes(url)),
          ...newUploadedImageUrls
        ];
        const updatedItem: NoticeItem = {
          ...existingItem,
          title: formData.title,
          content: formData.content,
          isImportant: formData.isImportant,
          status: formData.status,
          type: formData.type,
          imageUrls: finalImageUrls,
          startDate: formData.type === '이벤트' ? formData.startDate : undefined,
          endDate: formData.type === '이벤트' ? formData.endDate : undefined,
        };
        mockNotices[itemIndex] = updatedItem;
        alert('공지/이벤트가 수정되었습니다.');
        navigate(`/notices/${itemId}`);
      }
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (mode === 'edit' && noticeId) {
      navigate(`/notices/${noticeId}`); // 수정 중 취소 시 해당 상세 페이지로
    } else {
      navigate('/notices'); // 등록 중 취소 시 목록 페이지로
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-6">
          {/* 페이지 제목과 버튼 영역을 main의 최상단으로 이동 */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">{pageTitle}</h1> {/* 제목 스타일 약간 변경 */}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/75"> {/* 카드 스타일 변경 */}
            {/* 페이지 제목은 위로 이동했으므로 여기서는 제거 */}
            <NoticeForm
              onSave={handleSaveNotice}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              mode={mode}
              initialData={initialFormData}
            />
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200"> {/* 버튼 영역 스타일 변경 */}
              <Button type="submit" form={`notice-form-${mode}`} disabled={isSubmitting}>{submitButtonText}</Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>취소</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}