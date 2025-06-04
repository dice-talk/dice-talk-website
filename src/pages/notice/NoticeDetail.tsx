// src/pages/NoticeDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { NoticeStatus, formatDate } from '../../components/notice/noticeUtils'
// NoticeList.tsx와 동일한 NoticeItem 타입 및 mockNotices 데이터를 사용한다고 가정합니다.
// 실제 애플리케이션에서는 이들을 공유 모듈에서 가져오는 것이 좋습니다.

interface NoticeItem {
  id: number;
  type: '공지사항' | '이벤트';
  title: string;
  content: string; // NoticeForm 호환을 위해 content를 string으로 변경
  createdAt: string;
  isImportant: boolean;
  status: NoticeStatus;
  imageUrls?: string[];
  startDate?: string;
  endDate?: string;
}

// 임시: NoticeList.tsx의 mockNotices를 가져와 사용 (실제로는 API 호출 또는 공유 상태 사용)
// 이 부분은 NoticeList.tsx의 mockNotices와 동일하게 유지하거나,
// 별도의 데이터 소스에서 가져오도록 수정해야 합니다.
export const mockNotices: NoticeItem[] = [ // NoticeNewPage에서도 사용하므로 export
  { id: 1, type: '공지사항', title: '시스템 점검 안내 (06/15 02:00 ~ 04:00)', content: '보다 안정적인 서비스 제공을 위해 시스템 점검을 실시합니다.\n점검 시간: 2024년 6월 15일 02:00 ~ 04:00 (2시간)\n점검 중에는 서비스 이용이 일시적으로 중단될 수 있습니다. 양해 부탁드립니다.', createdAt: '2024-06-10T10:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED, imageUrls: ["https://via.placeholder.com/600x200.png?text=System+Maintenance"] },
  { id: 2, type: '이벤트', title: '여름맞이 주사위 증정 이벤트!', content: '무더운 여름, 다이스톡이 시원하게 주사위를 쏩니다!\n이벤트 기간 동안 접속만 해도 매일 주사위 10개 증정!\n\n추가 미션 달성 시 더 많은 보상이 기다리고 있어요!', createdAt: '2024-06-08T14:00:00Z', isImportant: false, status: NoticeStatus.ONGOING, startDate: '2024-06-10', endDate: '2024-06-30', imageUrls: ["https://via.placeholder.com/600x300.png?text=Summer+Event+Banner"] },
  { id: 3, type: '공지사항', title: '개인정보처리방침 개정 안내', content: '개인정보처리방침이 일부 개정되어 안내드립니다. 변경된 내용은 다음과 같습니다...\n(상세 내용 생략)', createdAt: '2024-06-05T09:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 4, type: '공지사항', title: '서비스 이용약관 변경 사전 안내', content: '서비스 이용약관이 변경될 예정입니다. 주요 변경 사항은 다음과 같습니다...\n(상세 내용 생략)', createdAt: '2024-06-01T11:00:00Z', isImportant: false, status: NoticeStatus.CLOSED },
  { id: 5, type: '이벤트', title: '친구 초대하고 보상 받자! 시즌2', content: '친구를 다이스톡에 초대하고 푸짐한 보상을 받아가세요! 시즌2에서는 더욱 강력해진 보상이 준비되어 있습니다.', createdAt: '2024-05-28T16:00:00Z', isImportant: true, status: NoticeStatus.CLOSED, startDate: '2024-05-20', endDate: '2024-06-20' },
  { id: 6, type: '공지사항', title: '다이스톡 v1.2 업데이트 안내', content: '다이스톡 v1.2 업데이트가 완료되었습니다. 새로운 기능과 개선 사항을 확인해보세요!\n- 채팅 UI 개선\n- 새로운 이모티콘 추가\n- 버그 수정 및 안정성 향상', createdAt: '2024-05-25T13:00:00Z', isImportant: false, status: NoticeStatus.ONGOING, imageUrls: ["https://via.placeholder.com/600x250.png?text=Update+v1.2+Details"] },
  { id: 7, type: '이벤트', title: '새로운 기능 사전 공개 이벤트', content: '곧 출시될 새로운 기능을 미리 체험하고 피드백을 남겨주세요! 참여자분들께는 특별한 혜택을 드립니다.', createdAt: '2024-07-01T00:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED, startDate: '2024-07-05', endDate: '2024-07-15' },
  { id: 8, type: '공지사항', title: '서버 안정화 작업 완료 안내', content: '서버 안정화 작업이 성공적으로 완료되었습니다. 더욱 쾌적한 환경에서 다이스톡을 이용하실 수 있습니다.', createdAt: '2024-06-15T05:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 9, type: '이벤트', title: '주말 특별 접속 보상 이벤트', content: '주말에는 다이스톡 접속하고 특별 보상 받아가세요!', createdAt: '2024-06-20T00:00:00Z', isImportant: false, status: NoticeStatus.ONGOING, startDate: '2024-06-22', endDate: '2024-06-23' },
  { id: 10, type: '공지사항', title: '고객센터 운영시간 변경 안내', content: '고객센터 운영시간이 2024년 7월 1일부터 변경됩니다. (기존) 09:00 ~ 18:00 -> (변경) 10:00 ~ 17:00', createdAt: '2024-06-18T09:00:00Z', isImportant: false, status: NoticeStatus.ONGOING },
  { id: 11, type: '이벤트', title: '신규 테마 출시 기념 할인', content: '새로운 채팅 테마 3종 출시! 지금 구매하시면 30% 할인 혜택을 드립니다.', createdAt: '2024-06-22T10:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED, startDate: '2024-06-22', endDate: '2024-07-05' },
  { id: 12, type: '공지사항', title: '앱 보안 강화 업데이트 안내', content: '사용자 정보 보호를 위해 앱 보안 기능이 강화되었습니다. 최신 버전으로 업데이트해주세요.', createdAt: '2024-06-25T11:00:00Z', isImportant: true, status: NoticeStatus.SCHEDULED },
  { id: 13, type: '이벤트', title: '여름 방학 맞이 출석체크 이벤트', content: '여름 방학 동안 매일 출석하고 다양한 아이템을 받아가세요!', createdAt: '2024-07-05T00:00:00Z', isImportant: false, status: NoticeStatus.SCHEDULED, startDate: '2024-07-08', endDate: '2024-08-18' },
  { id: 14, type: '공지사항', title: '서비스 점검 연장 안내', content: '금일 진행 예정이었던 시스템 점검이 부득이하게 연장되었습니다. (변경) 02:00 ~ 06:00. 이용에 불편을 드려 죄송합니다.', createdAt: '2024-06-15T03:30:00Z', isImportant: true, status: NoticeStatus.ONGOING },
  { id: 15, type: '이벤트', title: '깜짝 퀴즈 이벤트! 정답 맞추고 선물받자', content: '매일 오후 3시, 깜짝 퀴즈가 출제됩니다! 정답을 맞추신 분들께는 추첨을 통해 다이스를 드려요.', createdAt: '2024-06-19T15:00:00Z', isImportant: false, status: NoticeStatus.CLOSED, startDate: '2024-06-19', endDate: '2024-06-21' },
];


export default function NoticeDetailPage() {
  const { noticeId } = useParams<{ noticeId: string }>();
  const navigate = useNavigate();
  const [noticeItem, setNoticeItem] = useState<NoticeItem | null>(null);
  // isEditing 상태와 isSubmitting 상태는 NoticeNewPage (수정 모드)에서 관리됩니다.
  // const [isSubmitting, setIsSubmitting] = useState(false); // 이 컴포넌트에서는 더 이상 필요하지 않음

  useEffect(() => {
    if (noticeId) {
      const itemId = parseInt(noticeId, 10);
      const foundItem = mockNotices.find(n => n.id === itemId);
      if (foundItem) {
        // content가 undefined일 경우 빈 문자열로 설정
        setNoticeItem({
          ...foundItem,
          content: foundItem.content || '',
        });
      } else {
        console.error("공지/이벤트 항목을 찾을 수 없습니다.");
        // navigate('/404'); // 또는 목록 페이지로 리디렉션
      }
    }
  }, [noticeId]);

  const handleListButton = () => {
    navigate('/notices'); // 공지사항 목록 페이지 경로
  };

  const handleEditButton = () => {
    if (noticeItem) {
      navigate(`/notices/${noticeItem.id}/edit`);
    }
  };

  const handleDeleteButton = () => {
    if (noticeItem && window.confirm(`'${noticeItem.title}' 공지/이벤트를 정말 삭제하시겠습니까?`)) {
      // TODO: 실제 API 호출로 데이터 삭제
      const itemIndex = mockNotices.findIndex(n => n.id === noticeItem.id);
      if (itemIndex > -1) {
        mockNotices.splice(itemIndex, 1); // mockNotices에서 해당 아이템 제거
      }
      alert('공지/이벤트가 삭제되었습니다.');
      navigate('/notices'); // 목록으로 이동
    }
  };

  // 관리자 여부 (실제로는 useAuthStore 등에서 가져옴)
  const isAdmin = true; 

  if (!noticeItem) {
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
