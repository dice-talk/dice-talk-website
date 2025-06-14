import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import Button from "../../components/ui/Button";
import type { ReportResponse, ReportStatus } from "../../types/reportTypes";
import {
  formatDateTime,
  getReportStatusLabel,
  getReportStatusBadgeStyleSwitch,
} from "../../lib/ReportUtils";
import { getReport, completeReport, rejectReport } from "../../api/reportApi";

export default function ReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [reportItem, setReportItem] = useState<ReportResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!reportId) return;

      try {
        setLoading(true);
        const response = await getReport(parseInt(reportId, 10));
        setReportItem(response.data.data);
      } catch (error) {
        console.error("신고 상세 정보를 불러오는데 실패했습니다:", error);
        navigate("/reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [reportId, navigate]);

  const handleUpdateStatus = async (newStatus: ReportStatus) => {
    if (!reportItem) return;
    setIsSubmitting(true);

    try {
      if (newStatus === "REPORT_COMPLETED") {
        await completeReport(reportItem.reportId);
      } else if (newStatus === "REPORT_REJECTED") {
        await rejectReport(reportItem.reportId);
      }

      // 상태 업데이트 후 데이터 다시 불러오기
      const response = await getReport(reportItem.reportId);
      setReportItem(response.data.data);

      alert(
        `신고 상태가 '${getReportStatusLabel(newStatus)}'(으)로 변경되었습니다.`
      );
    } catch (error) {
      console.error("신고 상태 업데이트에 실패했습니다:", error);
      alert("신고 상태 업데이트에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <p>신고 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!reportItem) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <p>신고 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const availableActions: {
    label: string;
    status: ReportStatus;
    variant: "default" | "outline" | "ghost";
    className?: string;
  }[] = [
    {
      label: "처리 완료",
      status: "REPORT_COMPLETED",
      variant: "default",
      className: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      label: "신고 반려",
      status: "REPORT_REJECTED",
      variant: "ghost",
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              신고 상세 정보 (ID: {reportItem.reportId})
            </h2>
            <Button variant="outline" onClick={() => navigate("/reports")}>
              목록으로
            </Button>
          </div>

          {/* 신고 기본 정보 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">신고 상태</h3>
                <p
                  className={`mt-1 text-lg font-semibold px-3 py-1.5 rounded-full inline-block ${getReportStatusBadgeStyleSwitch(
                    reportItem.reportStatus
                  )}`}
                >
                  {getReportStatusLabel(reportItem.reportStatus)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">신고 사유</h3>
                <p className="mt-1 text-gray-900 text-lg">
                  {reportItem.reportReason}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  신고자 정보
                </h3>
                <p className="mt-1 text-gray-700">
                  이메일: {reportItem.reporterEmail}
                </p>
                <p className="mt-1 text-gray-700">
                  회원 ID: {reportItem.reporterId}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  피신고자 정보
                </h3>
                <p className="mt-1 text-gray-700">
                  이메일: {reportItem.reportedEmail}
                </p>
                <p className="mt-1 text-gray-700">
                  회원 ID: {reportItem.reportedMemberId}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  신고 접수일
                </h3>
                <p className="mt-1 text-gray-700">
                  {formatDateTime(reportItem.createdAt)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  최근 수정일
                </h3>
                <p className="mt-1 text-gray-700">
                  {formatDateTime(reportItem.modifiedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* 신고된 채팅 내용 */}
          {reportItem.reportedChats && reportItem.reportedChats.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                신고된 채팅 내용
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {reportItem.reportedChats.map((chat) => (
                  <div
                    key={chat.chatId}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-indigo-600">
                        {chat.nickname} (ID: {chat.memberId})
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(chat.createdAt)}
                      </p>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {chat.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      채팅방 ID: {chat.chatRoomId} / 메시지 ID: {chat.chatId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 관리자 조치 버튼 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              관리자 조치
            </h3>
            <div className="flex flex-wrap gap-3">
              {availableActions.map((action) => (
                <Button
                  key={action.status}
                  onClick={() => handleUpdateStatus(action.status)}
                  disabled={
                    isSubmitting || reportItem.reportStatus === action.status
                  }
                  variant={action.variant}
                  className={action.className}
                >
                  {action.label}
                  {reportItem.reportStatus === action.status && " (현재 상태)"}
                </Button>
              ))}
            </div>
            {isSubmitting && (
              <p className="text-sm text-gray-500 mt-2">처리 중...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
