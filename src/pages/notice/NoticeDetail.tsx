// src/pages/NoticeDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { formatDate } from '../../components/notice/noticeUtils'
import { isAxiosError } from 'axios'; // isAxiosError 임포트
import { getNoticeDetail, deleteNotice } from '../../api/noticeApi'; // updateNotice -> getNoticeDetail
import {
  type NoticeResponseDto as NoticeResponseDto, // Alias for consistency if needed, or use NoticeResponseDto directly
  type NoticeImageDto,
  type NoticeTypeBack,
  type NoticeStatusBack,
  NoticeStatus,
  type NoticeItemView // Import NoticeItemView
} from '../../types/noticeTypes';
// NoticeList.tsx와 동일한 NoticeItem 타입 및 mockNotices 데이터를 사용한다고 가정합니다.
// 실제 애플리케이션에서는 이들을 공유 모듈에서 가져오는 것이 좋습니다.

// 백엔드 응답 DTO의 noticeType을 프론트엔드 type으로 변환하는 함수
const mapBackendTypeToFrontend = (backendType: NoticeTypeBack): NoticeItemView['type'] => {
  return backendType === 'NOTICE' ? '공지사항' : '이벤트';
};

// 백엔드 응답 DTO의 noticeStatus를 프론트엔드 NoticeStatus enum으로 변환하는 함수
const mapBackendStatusToFrontend = (backendStatus: NoticeStatusBack): NoticeStatus => {
  switch (backendStatus) {
    case 'SCHEDULED': // 백엔드에서 "SCHEDULED"로 온다고 가정
      return NoticeStatus.SCHEDULED;
    case 'ONGOING': // 백엔드에서 "ONGOING"로 온다고 가정
      return NoticeStatus.ONGOING;
    case 'CLOSED': // 백엔드에서 "CLOSED"로 온다고 가정
      return NoticeStatus.CLOSED;
    default:
      console.warn(`Unhandled backend notice status: ${backendStatus}, defaulting to ONGOING`);
      return NoticeStatus.ONGOING; // 기본값 또는 오류 처리
  }
};

// 백엔드 API 응답 타입 (제공된 DTO 기반)
// BackendNoticeResponseDto, BackendNoticeImageDto는 noticeTypes.ts에서 import

export default function NoticeDetailPage() {
  const { noticeId: noticeIdParam } = useParams<{ noticeId: string }>(); // noticeId 파라미터 값을 직접 가져옵니다.
  const navigate = useNavigate();
  const [noticeItem, setNoticeItem] = useState<NoticeItemView | null>(null); // NoticeItem -> NoticeItemView
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // isEditing 상태와 isSubmitting 상태는 NoticeNewPage (수정 모드)에서 관리됩니다.
  // const [isSubmitting, setIsSubmitting] = useState(false); // 이 컴포넌트에서는 더 이상 필요하지 않음

  useEffect(() => {
    if (noticeIdParam) { // URL에서 가져온 noticeIdParam 문자열을 확인합니다.
      const itemId = parseInt(noticeIdParam, 10);

      if (isNaN(itemId)) {
        console.error("Invalid noticeId parameter:", noticeIdParam);
        setError("잘못된 공지사항 ID입니다. ID는 숫자여야 합니다.");
        setIsLoading(false);
        // 필요하다면 목록 페이지나 에러 페이지로 이동시킵니다.
        // navigate('/notices');
        return;
      }

      setIsLoading(true);
      setError(null);
      const loadNoticeDetail = async () => {
        try {
          const backendData: NoticeResponseDto = await getNoticeDetail(itemId); // getNoticeDetail 사용 및 타입 명시

          // 백엔드 데이터를 프론트엔드 NoticeItem으로 변환
          const transformedItem: NoticeItemView = { // NoticeItem -> NoticeItemView
            id: backendData.noticeId,
            title: backendData.title,
            content: backendData.content || '',
            type: mapBackendTypeToFrontend(backendData.noticeType),
            status: mapBackendStatusToFrontend(backendData.noticeStatus),
            isImportant: backendData.noticeImportance === 1,
            createdAt: backendData.createdAt,
            imageUrls: backendData.noticeImages?.map((img: NoticeImageDto) => img.imageUrl) || [], // img 타입 지정
            startDate: backendData.startDate,
            endDate: backendData.endDate,
          };
          setNoticeItem(transformedItem);
        } catch (err) {
          console.error("Error fetching notice detail:", err);
          if (isAxiosError(err) && err.response?.status === 404) {
            setError("공지/이벤트 항목을 찾을 수 없습니다.");
          } else {
            setError("공지/이벤트 정보를 불러오는데 실패했습니다.");
          }
          // navigate('/404'); 또는 목록 페이지로 리디렉션 고려
        } finally {
          setIsLoading(false);
        }
      };

      loadNoticeDetail();
    } else {
      // noticeIdParam이 undefined인 경우 (예: 라우트 설정 오류 또는 ID 없이 직접 접근)
      console.warn("Notice ID parameter is missing from URL.");
      setError("공지사항 ID가 URL에 제공되지 않았습니다.");
      setIsLoading(false);
    }
  }, [noticeIdParam, navigate]); // 의존성 배열에 noticeIdParam을 사용합니다.

  const handleListButton = () => {
    navigate('/notices'); // 공지사항 목록 페이지 경로
  };

  const handleEditButton = () => {
    if (noticeItem) {
      navigate(`/notices/${noticeItem.id}/edit`);
    }
  };

  const handleDeleteButton = async () => { // async 키워드 추가
    if (noticeItem && window.confirm(`'${noticeItem.title}' 공지/이벤트를 정말 삭제하시겠습니까?`)) {
      try { // API 함수 사용
        await deleteNotice(noticeItem.id);
        alert('공지/이벤트가 삭제되었습니다.');
        navigate('/notices');
      } catch (deleteError) {
        console.error("Error deleting notice:", deleteError);
        alert('공지/이벤트 삭제에 실패했습니다.');
      }
    }
  };

  // 관리자 여부 (실제로는 useAuthStore 등에서 가져옴)
  const isAdmin = true; 

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center bg-slate-50"><p>공지/이벤트 정보를 불러오는 중...</p></div>;
  }

  if (error || !noticeItem) {
    // 오류 메시지를 표시하거나, noticeItem이 null일 때 (예: 404)도 오류로 간주
    return <div className="min-h-screen flex justify-center items-center bg-slate-50"><p>공지/이벤트 정보를 불러오는 중이거나 찾을 수 없습니다...</p></div>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative"> {/* 'relative' 추가 */}

            {/* 조회 모드 UI 항상 표시 */}
              <>
                {/* Row 1: 제목, 수정/삭제 버튼 */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {noticeItem.isImportant && <span className="text-red-500">[중요] </span>}
                    {noticeItem.title}
                  </h2>
                  {/* 오른쪽: 목록으로 버튼 (조회 모드에서만) */}
                  <div>
                    <Button variant="outline" onClick={handleListButton}>목록으로</Button>
                  </div>
                </div>

                {/* Row 2: 등록일, 상태, 이벤트 기간 */}
                <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 mb-6 border-b pb-4 gap-y-2">
                  {/* 상태 및 이벤트 기간 그룹 (왼쪽 정렬 유지) */}
                  <div className="flex items-center gap-x-4">
                    <span className={
                      `px-2.5 py-1 text-xs font-semibold rounded-full
                      ${noticeItem.status === NoticeStatus.ONGOING ? 'bg-green-100 text-green-700' : ''}
                      ${noticeItem.status === NoticeStatus.SCHEDULED ? 'bg-blue-100 text-blue-700' : ''}
                      ${noticeItem.status === NoticeStatus.CLOSED ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      {noticeItem.type === '이벤트' ? `이벤트 ${noticeItem.status}` : noticeItem.status}
                    </span>
                    {noticeItem.type === '이벤트' && noticeItem.startDate && noticeItem.endDate && (
                      <span>
                        기간: {formatDate(noticeItem.startDate)} ~ {formatDate(noticeItem.endDate)}
                      </span>
                    )}
                    {noticeItem.type === '공지사항' && (
                      <span className="ml-2">
                        {/* 공지사항일 경우 추가 정보가 필요하다면 여기에 표시 */}
                      </span>
                    )}
                  </div>
                  {/* 등록일 (오른쪽 정렬) */}
                  <span className="text-gray-500">
                    등록일: {formatDate(noticeItem.createdAt)}
                  </span>
                </div>

                {/* Row 3: 이미지 + 본문 내용 */}
                {noticeItem.imageUrls && noticeItem.imageUrls.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {noticeItem.imageUrls.map((url, index) => (
                      <img 
                        key={index} 
                        src={url} 
                        alt={`Notice image ${index + 1}`} 
                        className="rounded-md border max-w-full lg:max-w-2xl mx-auto" 
                      />
                    ))}
                  </div>
                )}
                {noticeItem.content && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {noticeItem.content}
                  </div>
                )}
              </>

              {/* 버튼 영역 */}
              <div className="flex justify-between items-center mt-6">
                {/* 왼쪽: 빈 공간 (목록으로 버튼이 위로 이동했으므로) */}
                <div></div>

                {/* 오른쪽: 수정/삭제 버튼 (관리자일 때만) */}
                {isAdmin && (
                  <div className="flex space-x-3">
                    {noticeItem.status !== NoticeStatus.CLOSED && ( // "종료" 상태가 아닐 때만 수정 버튼 표시
                      <Button onClick={handleEditButton} variant="outline" size="sm">
                        수정
                      </Button>
                    )}
                    <Button onClick={handleDeleteButton} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                      삭제
                    </Button>
                   </div>
                )}
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}
