import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { type ReportItem, ReportStatus, type ReportedChat } from '../../types/reportTypes';
import { formatDateTime, getReportStatusLabel, getReportStatusBadgeStyle } from '../../lib/ReportUtils';
import { mockReports, updateMockReport } from './ReportList'; // Mock 데이터 및 업데이트 함수 임포트

export default function ReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [reportItem, setReportItem] = useState<ReportItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reportId) {
      const itemId = parseInt(reportId, 10);
      // mockReports 배열에서 직접 찾습니다. 실제 앱에서는 API 호출.
      const foundItem = mockReports.find(r => r.reportId === itemId);
      if (foundItem) {
        setReportItem(foundItem);
      } else {
        console.error("신고 항목을 찾을 수 없습니다.");
        navigate('/reports'); // 목록으로 리디렉션
      }
    }
  }, [reportId, navigate]);

  const handleUpdateStatus = async (newStatus: ReportStatus) => {
    if (!reportItem) return;
    setIsSubmitting(true);
    // TODO: 실제 API 호출로 상태 업데이트
    // await api.updateReportStatus(reportItem.reportId, newStatus);

    // Mock 데이터 업데이트 시뮬레이션
    const updatedReport = { 
      ...reportItem, 
      reportStatus: newStatus, 
      modifiedAt: new Date().toISOString() 
    };
    updateMockReport(updatedReport); // ReportListPage의 mockReports 업데이트
    setReportItem(updatedReport);   // 현재 페이지 상태 업데이트

    alert(`신고 상태가 '${getReportStatusLabel(newStatus)}'(으)로 변경되었습니다.`);
    setIsSubmitting(false);
    // 목록 페이지로 돌아가면 변경된 상태가 반영되도록 처리 필요 (현재는 mockReports 직접 수정)
  };

  if (!reportItem) {
    return <div className="min-h-screen flex justify-center items-center bg-slate-50"><p>신고 정보를 불러오는 중...</p></div>;
  }

  const availableActions: { label: string, status: ReportStatus, variant: "default" | "outline" | "ghost", className?: string }[] = [
    { label: "검토 중으로 변경", status: ReportStatus.UNDER_REVIEW, variant: "outline" },
    { label: "경고 조치 완료", status: ReportStatus.ACTION_TAKEN, variant: "default", className: "bg-green-600 hover:bg-green-700 text-white" },
    { label: "신고 기각", status: ReportStatus.DISMISSED, variant: "ghost", className: "text-red-600 hover:bg-red-50" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">신고 상세 정보 (ID: {reportItem.reportId})</h2>
            <Button variant="outline" onClick={() => navigate('/reports')}>목록으로</Button>
          </div>

          {/* 신고 기본 정보 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">신고 상태</h3>
                <p className={`mt-1 text-lg font-semibold px-3 py-1.5 rounded-full inline-block ${getReportStatusBadgeStyle(reportItem.reportStatus)}`}>
                  {getReportStatusLabel(reportItem.reportStatus)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">신고 사유</h3>
                <p className="mt-1 text-gray-900 text-lg">{reportItem.reason}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">신고자 정보</h3>
                <p className="mt-1 text-gray-700">이메일: {reportItem.reporterEmail}</p>
                <p className="mt-1 text-gray-700">회원 ID: {reportItem.reporterId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">피신고자 정보</h3>
                <p className="mt-1 text-gray-700">이메일: {reportItem.reportedEmail}</p>
                <p className="mt-1 text-gray-700">회원 ID: {reportItem.reportedMemberId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">신고 접수일</h3>
                <p className="mt-1 text-gray-700">{formatDateTime(reportItem.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">최근 수정일</h3>
                <p className="mt-1 text-gray-700">{formatDateTime(reportItem.modifiedAt)}</p>
              </div>
            </div>
          </div>

          {/* 신고된 채팅 내용 */}
          {reportItem.reportedChats && reportItem.reportedChats.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">신고된 채팅 내용</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {reportItem.reportedChats.map((chat: ReportedChat) => (
                  <div key={chat.chatId} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-indigo-600">
                        {chat.nickname} (ID: {chat.memberId})
                      </p>
                      <p className="text-xs text-gray-500">{formatDateTime(chat.createdAt)}</p>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{chat.message}</p>
                    <p className="text-xs text-gray-400 mt-1">채팅방 ID: {chat.chatRoomId} / 메시지 ID: {chat.chatId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 관리자 조치 버튼 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">관리자 조치</h3>
            <div className="flex flex-wrap gap-3">
              {availableActions.map(action => (
                <Button
                  key={action.status}
                  onClick={() => handleUpdateStatus(action.status)}
                  disabled={isSubmitting || reportItem.reportStatus === action.status}
                  variant={action.variant}
                  className={action.className}
                >
                  {action.label}
                  {reportItem.reportStatus === action.status && " (현재 상태)"}
                </Button>
              ))}
            </div>
            {isSubmitting && <p className="text-sm text-gray-500 mt-2">처리 중...</p>}
          </div>

        </main>
      </div>
    </div>
  );
}