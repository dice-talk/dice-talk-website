// src/pages/notice/NoticeNewPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { NoticeForm, type NoticeFormData } from '../../components/notice/NoticeForm';
import { 
  formatDateToLocalDateTimeString, 
  mapFrontendStatusToBackend, 
  mapFrontendTypeToBackend,
  mapBackendTypeToFrontend, 
  mapBackendStatusToFrontend
  } from '../../lib/NoticeUtils';
import { isAxiosError } from 'axios';
import { createNotice2, getNoticeDetail, updateNotice } from '../../api/noticeApi'; // API 함수 임포트 (fetchNoticeDetail -> getNoticeDetail)
import {
  type NoticePostDto,
  type NoticePatchDto,
  // type NoticeTypeBack,
  type NoticeStatusBack,
  type NoticeItemView,
  type NoticeImageDto,
  NoticeStatus, 
} from '../../types/noticeTypes';
import { type ExistingImage } from '../../components/ui/ImageUpload'; // ImageUpload에서 ExistingImage 타입 가져오기

// NoticeForm이 반환할 것으로 예상되는 FormData 확장
interface ExtendedNoticeFormData extends NoticeFormData {
  newImageFiles: File[];
  keptExistingImageIds: number[]; // 유지될 기존 이미지의 ID 목록 (백엔드 DTO에 맞춤)
  allImageThumbnailFlags: boolean[]; // 현재 표시되는 모든 이미지의 썸네일 상태 배열
}

// 프론트엔드에서 사용될 공지/이벤트 타입을 정의합니다. (오류 메시지에 따라 '공지사항' | '이벤트'로 가정)
type FrontendNoticeType = '공지사항' | '이벤트';

export default function NoticeNewPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId?: string }>(); // 수정 모드를 위해 noticeId 받기
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  // NoticeForm에 전달할 초기 데이터 타입 정의
  // NoticeItemView에서 'type'도 Omit하여 InitialFormDataTypeForNoticeForm에서 FrontendNoticeType으로 재정의합니다.
  interface InitialFormDataTypeForNoticeForm extends Partial<Omit<NoticeItemView, 'noticeImages' | 'imageUrls' | 'thumbnailFlags' | 'type'>> {
    existingImages?: ExistingImage[];
    type?: FrontendNoticeType; // string 대신 구체적인 프론트엔드 타입 사용
    status?: NoticeStatus;
    isImportant?: boolean;
    title?: string;
  }

  const [initialFormData, setInitialFormData] = useState<InitialFormDataTypeForNoticeForm>({
    type: '공지사항',
    status: NoticeStatus.SCHEDULED, // NoticeStatus가 프론트엔드 상태 표현으로 적합하다고 가정
    isImportant: false,
    content: '',
    existingImages: [],
  });
  const [pageTitle, setPageTitle] = useState('새 공지/이벤트 등록');
  const [submitButtonText, setSubmitButtonText] = useState('등록');

  useEffect(() => {
    const loadNoticeForEdit = async (id: number) => {
      try {
        const itemToEdit = await getNoticeDetail(id); // API 함수 사용 (fetchNoticeDetail -> getNoticeDetail)
        const existingImages: ExistingImage[] = itemToEdit.noticeImages?.map((img: NoticeImageDto) => ({
          url: img.imageUrl,
          isThumbnail: img.isThumbnail,
          id: img.noticeImageId, // ImageUpload에서 제거 시 ID를 사용하기 위함
        })) || [];

        setInitialFormData({
          id: itemToEdit.noticeId,
          title: itemToEdit.title,
          content: itemToEdit.content || '',
          type: mapBackendTypeToFrontend(itemToEdit.noticeType) as FrontendNoticeType | undefined, // 반환 타입을 FrontendNoticeType으로 단언
          status: mapBackendStatusToFrontend(itemToEdit.noticeStatus as NoticeStatusBack), // 공통 유틸리티 함수 사용 (이름 변경에 주의)
          isImportant: itemToEdit.noticeImportance === 1,
          existingImages: existingImages, // ImageUpload를 위해 변환된 데이터
          startDate: itemToEdit.startDate ? itemToEdit.startDate.split('T')[0] : undefined,
          endDate: itemToEdit.endDate ? itemToEdit.endDate.split('T')[0] : undefined,
          createdAt: itemToEdit.createdAt,
        });
        setMode('edit');
        setPageTitle('공지/이벤트 수정');
        setSubmitButtonText('수정');
      } catch (error) {
        console.error("수정할 공지/이벤트 항목을 불러오는 데 실패했습니다:", error);
        alert('데이터를 불러오지 못했습니다. 목록 페이지로 이동합니다.');
        navigate('/notices');
      }
    };

    if (noticeId) {
      const itemId = parseInt(noticeId, 10);
      if (!isNaN(itemId)) {
        loadNoticeForEdit(itemId);
      } else {
        console.error("잘못된 공지사항 ID입니다:", noticeId);
        alert('잘못된 공지사항 ID입니다. 목록 페이지로 이동합니다.');
        navigate('/notices');
      }
    } else {
      setMode('create');
      setPageTitle('새 공지/이벤트 등록');
      setSubmitButtonText('등록');
      setInitialFormData({ 
        type: '공지사항', 
        status: NoticeStatus.SCHEDULED, 
        isImportant: false, 
        content: '', 
        title: '',
        existingImages: [] // 생성 모드 시 빈 배열로 초기화
      });    }
  }, [noticeId, navigate]);

  const handleSaveNotice = async (formData: ExtendedNoticeFormData) => { // 타입 변경
    setIsSubmitting(true);

    if (mode === 'create') {
      const apiPayload: NoticePostDto = { // NoticePostDtoP 타입 사용
        title: formData.title,
        content: formData.content,
        startDate: formatDateToLocalDateTimeString(formData.startDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        endDate: formatDateToLocalDateTimeString(formData.endDate),     // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        noticeType: mapFrontendTypeToBackend(formData.type),
        noticeStatus: mapFrontendStatusToBackend(formData.status),
        noticeImportance: formData.isImportant ? 1 : 0,
      };

      // formData.allImageThumbnailFlags (boolean 배열)를 직접 사용
      const thumbnailFlagsForCreate: boolean[] | undefined = formData.allImageThumbnailFlags?.filter(
        (flag): flag is boolean => typeof flag === 'boolean'
      );

      try {
        console.log("📝 보낸 데이터 (noticePostDto):", apiPayload); // DTO 부분만 로깅
        console.log("🖼️ 새 이미지 파일:", formData.newImageFiles);
        console.log("🚩 썸네일 플래그:", thumbnailFlagsForCreate);

        const response = await createNotice2(apiPayload, formData.newImageFiles, thumbnailFlagsForCreate);
        console.log("RRRRRRRRResponse", response)
        // Location 헤더에서 ID 추출 (예시, 실제 API 응답에 따라 다를 수 있음)
        const locationHeaderValue = response.headers && (response.headers.location || response.headers['Location']);
        console.log("LLLLLLLocationHeaderValue", locationHeaderValue);
        const newNoticeId = locationHeaderValue ? locationHeaderValue.split('/').pop() : null;
        console.log("NNNNNNNNNNNoticeId", newNoticeId);
        
        if (newNoticeId) {
          alert('새 공지/이벤트가 등록되었습니다.');
          navigate(`/notices/${newNoticeId}`); // 추출한 ID로 네비게이션
        } else {
          console.error("Location header is missing in the response.");
          alert('공지/이벤트 등록은 성공했으나, 상세 페이지로 이동할 수 없습니다. (Location 헤더 누락)');
          navigate('/notices'); // 목록 페이지로 이동 또는 다른 오류 처리
        }

      } catch (error) {
        console.error("Error creating notice:", error);
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        if (isAxiosError(error)) { // axios에서 직접 가져온 isAxiosError 사용
          // AxiosError 타입으로 단언되었으므로 error.response 등에 안전하게 접근 가능
          errorMessage = error.response?.data?.message || error.message || '서버 요청 중 오류가 발생했습니다.';
        } else if (error instanceof Error) { // 일반 Error 객체인지 확인
          errorMessage = error.message;
        }
        alert(`공지/이벤트 등록에 실패했습니다. ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }

    } else if (mode === 'edit' && noticeId) {
      const itemId = parseInt(noticeId, 10);
      const apiPayload: NoticePatchDto = { // NoticePatchDtoP 타입 사용
        title: formData.title,
        content: formData.content,
        startDate: formatDateToLocalDateTimeString(formData.startDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        endDate: formatDateToLocalDateTimeString(formData.endDate),     // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        noticeType: mapFrontendTypeToBackend(formData.type), // mapFrontendTypeToBackend 함수의 반환 값 사용
        noticeStatus: mapFrontendStatusToBackend(formData.status), // mapFrontendStatusToBackend 함수의 반환 값 사용
        noticeImportance: formData.isImportant ? 1 : 0,
        keepImageIds: formData.keptExistingImageIds, // 유지할 기존 이미지 ID 목록
      };

      // formData.allImageThumbnailFlags는 ImageUpload에서 관리되어 NoticeForm을 통해 전달됨
      // 이 플래그는 (유지되는 기존 이미지 + 새로 추가된 이미지)의 순서에 해당해야 함
      const thumbnailFlagsForUpdate = formData.allImageThumbnailFlags?.map((flag) =>
        flag ?? false 
      );

      console.log("🔄 업데이트 데이터 (noticePatchDto):", apiPayload);
      console.log("🖼️ 새로 추가된 이미지 파일:", formData.newImageFiles);
      console.log("💾 유지 요청된 기존 이미지 ID:", formData.keptExistingImageIds);
      console.log("🚩 전체 이미지 썸네일 플래그:", thumbnailFlagsForUpdate);

      try {
        // updateNotice API는 새 파일, 썸네일 플래그를 받음.
        // apiPayload (NoticePatchDto)에 removedImageIds가 포함되어야 함.
        await updateNotice(
          itemId, 
          apiPayload, 
          formData.newImageFiles, 
          // boolean[] 타입으로 변환 (undefined 제거)
          // API가 boolean[]을 기대한다고 가정
          thumbnailFlagsForUpdate?.filter((flag): flag is boolean => typeof flag === 'boolean') 
        ); // API 함수 사용
        alert('공지/이벤트가 수정되었습니다.');
        navigate(`/notices/${itemId}`);
      } catch (error) {
        console.error("Error updating notice:", error);
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        if (isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message || '서버 요청 중 오류가 발생했습니다.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        alert(`공지/이벤트 수정에 실패했습니다. ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    }
    // setIsSubmitting(false); // finally 블록에서 이미 처리됨
  };

  const handleCancel = () => {
    // No changes needed for cancel logic based on the request
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