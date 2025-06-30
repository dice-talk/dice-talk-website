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
import type { NoticeStatus } from "../../types/noticeTypes"; 
import type { ThemeStatus } from "../../types/chatroom/themeTypes";
import type { EventStatus } from "../../types/chatroom/eventTypes"; 
import type { PaymentStatus } from "../../types/payment/paymentTypes";
import type { RoomStatus } from "../../types/chatroom/chatRoomTypes"; 

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
  let badgeClassName: string = "bg-gray-200 text-gray-800"; 

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

  const baseStyle = "px-2 py-0.5 text-xs font-medium rounded-full";

  return (
    <span className={`${baseStyle} ${badgeClassName}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
