export interface WarningDetail {
  warningId: string; // 각 경고를 식별할 수 있는 ID
  reason: string;    // 신고 사유
  reportedAt: string; // 신고 접수 일자
  chatTime?: string;   // 신고된 채팅 발생 시간 (선택적)
  // reportId?: number; // 원본 신고 ID (필요시)
}
