import {
  getReportStatusLabel,
  getReportStatusBadgeStyleSwitch,
} from "../../lib/ReportUtils";
import { getChatRoomStatusBadgeStyle, getChatRoomStatusLabel } from "../../lib/ChatRoomUtils";
import { getThemeLabel, getThemeStyle } from "../../lib/ThemeUtile";
import { getNoticeLabel, getNoticeStyle } from "../../lib/NoticeUtils";
import { getMemberLabel, getMemberStyle } from "../../lib/memberUtils";
import { mapBackendStatusToFrontendLabel as getEventLabel, getEventStatusBadgeStyle as getEventStyle } from "../../lib/EventUtils";
import { getPaymentStatusLabel, getStatusBadgeStyle as getPaymentStyle } from "../../lib/PaymentUtils";

import type { ReportStatus } from "../../types/reportTypes";
import type { MemberStatus } from "../../types/memberTypes";
import type { NoticeStatus } from "../../types/noticeTypes"; // 실제 Notice 상태 타입으로 가정
import type { ThemeStatus } from "../../types/chatroom/themeTypes";
import type { EventStatus } from "../../types/chatroom/eventTypes"; // 실제 Event 상태 타입으로 가정 (eventUtils의 mapBackendStatusToFrontendLabel이 받는 타입)
import type { PaymentStatus } from "../../types/paymentTypes";
import type { RoomStatus } from "../../types/chatroom/chatRoomTypes"; // 실제 ChatRoom 상태 타입으로 가정

type StatusBadgeProps =
  | { type: "member"; status: MemberStatus }
  | { type: "notice"; status: NoticeStatus }
  | { type: "report"; status: ReportStatus }
  | { type: "theme"; status: ThemeStatus }
  | { type: "event"; status: EventStatus }
  | { type: "payment"; status: PaymentStatus }
  | { type: "chatRoom"; status: RoomStatus };

const StatusBadge = (props: StatusBadgeProps) => {
  const { status, type } = props;
  let label: string;
  let badgeClassName: string = "bg-gray-200 text-gray-800"; // 기본값

  switch (type) {
    case "member":
      label = getMemberLabel(status);
      badgeClassName = getMemberStyle(status);
      break;
    case "notice":
      label = getNoticeLabel(status);
      badgeClassName = getNoticeStyle(status);
      break;
    case "chatRoom":
      label = getChatRoomStatusLabel(status);
      badgeClassName = getChatRoomStatusBadgeStyle(status);
      break;
    case "theme":
      label = getThemeLabel(status);
      badgeClassName = getThemeStyle(status);
      break;
    case "event":
      label = getEventLabel(status);
      badgeClassName = getEventStyle(status);
      break;
    case "payment":
      label = getPaymentStatusLabel(status);
      badgeClassName = getPaymentStyle(status);
      break;
    case "report":
      label = getReportStatusLabel(status);
      badgeClassName = getReportStatusBadgeStyleSwitch(status);
      break;
    default:
      console.warn(`Unknown status badge type: ${type}`);
      label = String(status);
      break;
  }

  // 기본 배지 스타일 (요청의 첫 번째 예시 기준)
  const baseStyle = "px-2 py-0.5 text-xs font-medium rounded-full";

  return (
    <span className={`${baseStyle} ${badgeClassName}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
