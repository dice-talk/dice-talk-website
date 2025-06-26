// src/pages/notice/NoticeNewPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import {
  NoticeForm,
  type NoticeFormData,
} from "../../components/notice/NoticeForm";
import {
  formatDateToLocalDateTimeString,
  mapFrontendStatusToBackend,
  mapFrontendTypeToBackend,
  mapBackendTypeToFrontend,
  mapBackendStatusToFrontend,
  NoticeStatus,
} from "../../lib/NoticeUtils";
import { isAxiosError } from "axios";
import {
  createNotice,
  getNoticeDetail,
  updateNotice,
} from "../../api/noticeApi"; // API 함수 임포트 (fetchNoticeDetail -> getNoticeDetail)
import {
  type NoticePostDto,
  type NoticePatchDto,
  // type NoticeTypeBack,
  type NoticeStatusBack,
  type NoticeItemView,
  type NoticeImageDto,
} from "../../types/noticeTypes"; // 타입 경로 수정

export default function NoticeNewPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId?: string }>(); // 수정 모드를 위해 noticeId 받기
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialFormData, setInitialFormData] = useState<
    Partial<NoticeItemView>
  >({
    // NoticeItemView 사용
    type: "공지사항",
    status: NoticeStatus.SCHEDULED,
    isImportant: false,
    content: "",
  });
  const [pageTitle, setPageTitle] = useState("새 공지/이벤트 등록");
  const [submitButtonText, setSubmitButtonText] = useState("등록");

  useEffect(() => {
    const loadNoticeForEdit = async (id: number) => {
      try {
        const itemToEdit = await getNoticeDetail(id); // API 함수 사용 (fetchNoticeDetail -> getNoticeDetail)
        setInitialFormData({
          id: itemToEdit.noticeId,
          title: itemToEdit.title,
          content: itemToEdit.content || "",
          type: mapBackendTypeToFrontend(itemToEdit.noticeType)!, // Non-null assertion if type is guaranteed
          status: mapBackendStatusToFrontend(
            itemToEdit.noticeStatus as NoticeStatusBack
          ), // 공통 유틸리티 함수 사용 (이름 변경에 주의)
          isImportant: itemToEdit.noticeImportance === 1,
          imageUrls:
            itemToEdit.noticeImages?.map(
              (img: NoticeImageDto) => img.imageUrl
            ) || [], // img 타입 지정
          startDate: itemToEdit.startDate
            ? itemToEdit.startDate.split("T")[0]
            : undefined,
          endDate: itemToEdit.endDate
            ? itemToEdit.endDate.split("T")[0]
            : undefined,
          createdAt: itemToEdit.createdAt,
        });
        setMode("edit");
        setPageTitle("공지/이벤트 수정");
        setSubmitButtonText("수정");
      } catch (error) {
        console.error(
          "수정할 공지/이벤트 항목을 불러오는 데 실패했습니다:",
          error
        );
        alert("데이터를 불러오지 못했습니다. 목록 페이지로 이동합니다.");
        navigate("/notices");
      }
    };

    if (noticeId) {
      const itemId = parseInt(noticeId, 10);
      if (!isNaN(itemId)) {
        loadNoticeForEdit(itemId);
      } else {
        console.error("잘못된 공지사항 ID입니다:", noticeId);
        alert("잘못된 공지사항 ID입니다. 목록 페이지로 이동합니다.");
        navigate("/notices");
      }
    } else {
      setMode("create");
      setPageTitle("새 공지/이벤트 등록");
      setSubmitButtonText("등록");
      setInitialFormData({
        type: "공지사항",
        status: NoticeStatus.SCHEDULED,
        isImportant: false,
        content: "",
        title: "",
      });
    }
  }, [noticeId, navigate]);

  const handleSaveNotice = async (formData: NoticeFormData) => {
    setIsSubmitting(true);

    if (mode === "create") {
      const apiPayload: NoticePostDto = {
        // NoticePostDtoP 타입 사용
        title: formData.title,
        content: formData.content,
        startDate: formatDateToLocalDateTimeString(formData.startDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        endDate: formatDateToLocalDateTimeString(formData.endDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        noticeType: mapFrontendTypeToBackend(formData.type),
        noticeStatus: mapFrontendStatusToBackend(formData.status),
        noticeImportance: formData.isImportant ? 1 : 0,
      };

      // createNotice API 함수는 이제 DTO 객체를 직접 받지 않고, 문자열과 파일들을 받습니다.
      // 따라서 apiPayload를 문자열로 변환해야 합니다.
      const noticePostDtoString = JSON.stringify(apiPayload);

      try {
        console.log("📝 보낸 데이터 (noticePostDto):", apiPayload); // DTO 부분만 로깅

        // thumbnailFlags 생성: 첫 번째 이미지는 썸네일(true), 나머지는 false
        const thumbnailFlags =
          formData.newImageFiles && formData.newImageFiles.length > 0
            ? formData.newImageFiles.map(
                (_: File, index: number) => index === 0
              )
            : undefined;

        const newNoticeId = await createNotice(
          noticePostDtoString,
          formData.newImageFiles,
          thumbnailFlags
        ); // thumbnailFlags 추가

        if (newNoticeId) {
          alert("새 공지/이벤트가 등록되었습니다.");
          navigate(`/notices/${newNoticeId}`); // 추출한 ID로 네비게이션
        } else {
          console.error("Location header is missing in the response.");
          alert(
            "공지/이벤트 등록은 성공했으나, 상세 페이지로 이동할 수 없습니다. (Location 헤더 누락)"
          );
          navigate("/notices"); // 목록 페이지로 이동 또는 다른 오류 처리
        }
      } catch (error) {
        console.error("Error creating notice:", error);
        let errorMessage = "알 수 없는 오류가 발생했습니다.";
        if (isAxiosError(error)) {
          // axios에서 직접 가져온 isAxiosError 사용
          // AxiosError 타입으로 단언되었으므로 error.response 등에 안전하게 접근 가능
          errorMessage =
            error.response?.data?.message ||
            error.message ||
            "서버 요청 중 오류가 발생했습니다.";
        } else if (error instanceof Error) {
          // 일반 Error 객체인지 확인
          errorMessage = error.message;
        }
        alert(`공지/이벤트 등록에 실패했습니다. ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === "edit" && noticeId) {
      const itemId = parseInt(noticeId, 10);
      const apiPayload: NoticePatchDto = {
        // NoticePatchDtoP 타입 사용
        title: formData.title,
        content: formData.content,
        startDate: formatDateToLocalDateTimeString(formData.startDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        endDate: formatDateToLocalDateTimeString(formData.endDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
        noticeType: mapFrontendTypeToBackend(formData.type), // mapFrontendTypeToBackend 함수의 반환 값 사용
        noticeStatus: mapFrontendStatusToBackend(formData.status), // mapFrontendStatusToBackend 함수의 반환 값 사용
        noticeImportance: formData.isImportant ? 1 : 0,
        // keepImageIds는 NoticeForm에서 관리되지 않으므로, 필요시 추가 구현
        // 예: keepImageIds: initialFormData.imageUrls?.filter(url => !formData.removedImageUrls.includes(url)).map(url => /* URL에서 ID 추출 로직 */)
      };

      const noticePatchDtoString = JSON.stringify(apiPayload);

      // 수정 시에도 thumbnailFlags 등이 필요하면 추가
      console.log("Updating notice (noticePutDto):", noticeId, apiPayload);

      // thumbnailFlags 생성: 첫 번째 이미지는 썸네일(true), 나머지는 false
      const thumbnailFlags =
        formData.newImageFiles && formData.newImageFiles.length > 0
          ? formData.newImageFiles.map((_: File, index: number) => index === 0)
          : undefined;

      try {
        // updateNotice API는 thumbnailFlags도 받으므로, 필요시 전달
        await updateNotice(
          itemId,
          noticePatchDtoString,
          formData.newImageFiles,
          thumbnailFlags
        ); // thumbnailFlags 추가
        alert("공지/이벤트가 수정되었습니다.");
        navigate(`/notices/${itemId}`);
      } catch (error) {
        console.error("Error updating notice:", error);
        let errorMessage = "알 수 없는 오류가 발생했습니다.";
        if (isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message ||
            error.message ||
            "서버 요청 중 오류가 발생했습니다.";
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
    if (mode === "edit" && noticeId) {
      navigate(`/notices/${noticeId}`); // 수정 중 취소 시 해당 상세 페이지로
    } else {
      navigate("/notices"); // 등록 중 취소 시 목록 페이지로
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
            <h1 className="text-3xl font-semibold text-gray-800">
              {pageTitle}
            </h1>{" "}
            {/* 제목 스타일 약간 변경 */}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/75">
            {" "}
            {/* 카드 스타일 변경 */}
            {/* 페이지 제목은 위로 이동했으므로 여기서는 제거 */}
            <NoticeForm
              onSave={handleSaveNotice}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              mode={mode}
              initialData={initialFormData}
            />
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              {" "}
              {/* 버튼 영역 스타일 변경 */}
              <Button
                type="submit"
                form={`notice-form-${mode}`}
                disabled={isSubmitting}
              >
                {submitButtonText}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
