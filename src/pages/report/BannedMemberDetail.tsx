import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import { getBannedMemberDetail } from "../../api/memberApi";
import type { BannedMemberDetailResponse } from "../../types/memberTypes";
// import type { ReportResponse } from "../../types/reportTypes";

export default function BannedMemberDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<BannedMemberDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        if (!memberId) return;
        const response = await getBannedMemberDetail(Number(memberId));
        setMember(response);
        console.log(response);
      } catch (error) {
        console.error("회원 상세 정보를 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetail();
  }, [memberId]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">회원 정보를 찾을 수 없습니다.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              정지 회원 상세 정보
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-100 text-blue-900 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              목록으로 돌아가기
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 기본 정보 섹션 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                기본 정보
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">회원 ID</p>
                  <p className="font-medium">{member.memberId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">이름</p>
                  <p className="font-medium">{member.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">이메일</p>
                  <p className="font-medium">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">생년월일</p>
                  <p className="font-medium">{member.birth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">성별</p>
                  <p className="font-medium">
                    {member.gender === "MALE" ? "남성" : "여성"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">지역</p>
                  <p className="font-medium">{member.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">연령대</p>
                  <p className="font-medium">{member.ageGroup}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">정지 시작일</p>
                  <p className="font-medium">
                    {new Date(member.bannedAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Seoul",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* 신고 내역 섹션 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                신고 내역
              </h4>
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {member.reports && member.reports.length > 0 ? (
                  member.reports.map((report) => (
                    <div
                      key={report.reportId}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            신고 ID: {report.reportId}
                          </p>
                          <p className="text-sm text-gray-500">
                            사유: {report.reportReason}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "Asia/Seoul",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    신고 내역이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
