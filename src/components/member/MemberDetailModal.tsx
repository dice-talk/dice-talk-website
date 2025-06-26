import React from "react";
import Modal from "../ui/Modal";
import productImg from "../../assets/product.png";
import {
  AlertTriangle,
  MessageSquareWarning,
  CalendarClock,
  FileText,
} from "lucide-react";

// 백엔드 응답 스키마를 기반으로 타입 정의
export interface MemberDetailData {
  memberId: number; // memberId 추가
  email: string;
  phone?: string | null; // 백엔드 응답에 따라 optional 또는 null 가능성
  name: string;
  birth: string;
  gender?: "MALE" | "FEMALE" | string; // 백엔드 값 그대로 또는 변환된 값
  region?: string | null;
  totalDice?: number | null;
  memberStatus?: string; // 예: MEMBER_ACTIVE, MEMBER_DORMANT 등
  notification?: boolean | string | null; // 백엔드 응답에 따라
  // DeletedMember.tsx 에서만 사용될 수 있는 필드
  reason?: string;
  deletedAt?: string;
  // Member.tsx 에서만 사용될 수 있는 필드
  lastLogin?: string;
  // SuspendedMember.tsx 에서 사용될 필드
  suspensionReason?: string;
  suspensionStartDate?: string;
  warnings?: WarningDetail[];
}

export interface WarningDetail {
  // 경고 상세 정보 타입
  warningId: string;
  reason: string;
  reportedAt: string;
  chatTime?: string;
}

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberDetailData | null;
  isDeletedMember?: boolean; // 탈퇴 회원 모달인지 구분
}

// 값 변환 함수들
const formatGender = (gender?: "MALE" | "FEMALE" | string): string => {
  if (gender === "FEMALE") return "여성";
  if (gender === "MALE") return "남성";
  return gender || "정보 없음";
};

const formatMemberStatus = (status?: string): string => {
  if (!status) return "정보 없음";
  // 실제 백엔드에서 오는 status 값에 따라 case 추가
  switch (status.toUpperCase()) {
    case "MEMBER_ACTIVE":
      return "활동 중";
    case "MEMBER_SLEEP":
      return "휴면 회원";
    case "MEMBER_BANNED":
      return "정지 회원";
    case "MEMBER_DELETED":
      return "탈퇴 회원";
    default:
      return status;
  }
};

const formatNotification = (notification?: boolean | string | null): string => {
  if (notification === true || notification === "true") return "예";
  if (notification === false || notification === "false") return "아니오";
  return "정보 없음";
};

interface RowItemProps {
  leftLabel: string;
  leftValue: React.ReactNode;
  rightLabel?: string;
  rightValue?: React.ReactNode;
}

const RowItem: React.FC<RowItemProps> = ({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}) => (
  // sm 이상 화면에서는 baseline 정렬, x축 간격 6. 모바일에서는 y축 간격 3.
  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-y-3 sm:gap-y-0 sm:gap-x-6">
    {/* 왼쪽 아이템: flex-1로 영역을 차지하고, 내용이 넘칠 경우를 대비해 min-w-0 설정 */}
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-0.5">{leftLabel}</p>
      {/* 값을 div로 감싸 복잡한 JSX(예: 아이콘 포함)도 잘 처리하도록 함 */}
      <div className="text-sm font-medium text-gray-800 break-words">
        {leftValue}
      </div>
    </div>
    {/* 오른쪽 아이템: rightLabel이 있을 경우에만 렌더링 */}
    {rightLabel && (
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{rightLabel}</p>
        <div className="text-sm font-medium text-gray-800 break-words">
          {rightValue}
        </div>
      </div>
    )}
  </div>
);

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  isOpen,
  onClose,
  member,
  isDeletedMember = false,
}) => {
  if (!isOpen || !member) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isDeletedMember ? "탈퇴 회원 상세 정보" : "회원 상세 정보"}
      size="lg"
    >
      {/* 전체 모달 콘텐츠의 수직 간격 및 좌우 대칭 패딩 설정 */}
      <div className="space-y-8 px-2 sm:px-4">
        {/* ✅ 이름 + 상태 + 이메일 그룹 */}
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow border border-gray-200">
          {" "}
          {/* 카드 스타일 적용 */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-y-1 sm:gap-x-3">
            <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                member.memberStatus === "MEMBER_WITHDRAWN"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {formatMemberStatus(member.memberStatus)}
            </span>
          </div>
          {/* 이메일 - 이름/상태 바로 아래에 위치하도록 mt-1.5 적용 */}
          <p className="text-sm text-gray-500 mt-1.5">{member.email}</p>
        </div>

        {/* ✅ 일반 정보 영역 (왼쪽 정렬된 항목들) */}
        <div className="space-y-5 pl-2 sm:pl-10">
          {" "}
          {/* RowItem 간의 간격 및 왼쪽 패딩 */}
          {/* 성별 | 생년월일 */}
          <RowItem
            leftLabel="성별"
            leftValue={formatGender(member.gender)}
            rightLabel="생년월일"
            rightValue={member.birth}
          />
          {/* 전화번호 | 지역 */}
          <RowItem
            leftLabel="전화번호"
            leftValue={member.phone || "정보 없음"}
            rightLabel="지역"
            rightValue={member.region || "정보 없음"}
          />
          {/* 보유 다이스 | 알림 수신 (일반 회원이고, 정지/탈퇴 회원이 아닐 때) */}
          {!isDeletedMember && member.memberStatus !== "MEMBER_SUSPENDED" && (
            <RowItem
              leftLabel="보유 다이스"
              leftValue={
                member.totalDice !== null && member.totalDice !== undefined ? (
                  <div className="flex items-center gap-1">
                    <img src={productImg} alt="다이스" className="w-4 h-4" />
                    <span>{member.totalDice}개</span>
                  </div>
                ) : (
                  "정보 없음"
                )
              }
              rightLabel="알림 수신"
              rightValue={formatNotification(member.notification)}
            />
          )}
          {/* 마지막 접속 (일반 회원이고, 정지/탈퇴 회원이 아닐 때) */}
          {!isDeletedMember && member.memberStatus !== "MEMBER_SUSPENDED" && (
            <RowItem
              leftLabel="마지막 접속"
              leftValue={member.lastLogin || "기록 없음"}
            />
          )}
          {/* 탈퇴 회원 정보 */}
          {isDeletedMember && (
            <>
              <RowItem
                leftLabel="탈퇴 사유"
                leftValue={member.reason || "정보 없음"}
              />
              <RowItem
                leftLabel="탈퇴 일자"
                leftValue={member.deletedAt || "정보 없음"}
              />
            </>
          )}
          {/* 정지 사유 및 시작일 (정지 회원일 때, 왼쪽 정렬 유지) */}
          {member.memberStatus === "MEMBER_SUSPENDED" && (
            <>
              <RowItem
                leftLabel="정지 사유"
                leftValue={member.suspensionReason || "정보 없음"}
                rightLabel="정지 시작일"
                rightValue={member.suspensionStartDate || "정보 없음"}
              />
              {member.warnings &&
                member.warnings.length > 0 &&
                // 이 div는 RowItem과 같은 레벨에 있지 않으므로, space-y-5의 영향을 받지 않음.
                // 대신 아래의 경고 내역 섹션이 별도로 중앙 정렬됨.
                // 이 부분은 실제로는 아래의 중앙 정렬된 경고 내역 섹션으로 이동함.
                null}
            </>
          )}
        </div>

        {/* ✅ 정지 회원 경고 내역 (모달 중앙 정렬) */}
        {member.memberStatus === "MEMBER_SUSPENDED" &&
          member.warnings &&
          member.warnings.length > 0 && (
            <div className="pt-4 border-t border-gray-200 mx-auto max-w-md">
              {" "}
              {/* mt-6 제거 (space-y-8이 처리), 중앙 정렬 및 최대 너비 설정 */}
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <AlertTriangle size={18} className="mr-2 text-red-500" />
                경고 내역 ({member.warnings.length}회)
                {member.warnings.length >= 3 && (
                  <span className="ml-2 text-xs font-bold text-red-600">
                    (영구 정지 대상)
                  </span>
                )}
              </h4>
              <div className="space-y-4">
                {member.warnings.map((warning, index) => (
                  <div
                    key={warning.warningId}
                    className="p-3 bg-red-50 border border-red-200 rounded-md text-xs"
                  >
                    <p className="font-semibold text-red-700 mb-1">
                      경고 {index + 1}
                    </p>
                    <div className="space-y-1 text-gray-700">
                      <p className="flex items-center">
                        <FileText size={14} className="mr-1.5 text-gray-500" />
                        사유: {warning.reason}
                      </p>
                      <p className="flex items-center">
                        <CalendarClock
                          size={14}
                          className="mr-1.5 text-gray-500"
                        />
                        신고일: {warning.reportedAt}
                      </p>
                      {warning.chatTime && (
                        <p className="flex items-center">
                          <MessageSquareWarning
                            size={14}
                            className="mr-1.5 text-gray-500"
                          />
                          채팅 시간: {warning.chatTime}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </Modal>
  );
};

// interface DetailItemProps {
//   label: string;
//   value: React.ReactNode;
// }

// const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
// <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
//     <dt className="text-xs font-medium text-gray-500">{label}</dt>
//     <dd className="mt-1 text-sm font-semibold text-gray-800 break-words">{value}</dd>
// </div>
// );
