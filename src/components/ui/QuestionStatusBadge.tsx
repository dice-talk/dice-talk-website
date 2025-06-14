import { cn } from "../../lib/Utils";

interface QuestionStatusBadgeProps {
  status: string;
  className?: string;
}

export function QuestionStatusBadge({
  status,
  className,
}: QuestionStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "비회원 문의":
        return {
          label: "비회원 문의",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        };
      case "비회원 답변 완료":
        return {
          label: "비회원 답변 완료",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        };
      case "접수됨":
        return {
          label: "접수됨",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        };
      case "답변 완료":
        return {
          label: "답변 완료",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        };
      case "삭제됨":
        return {
          label: "삭제됨",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
        };
      case "비활성화":
        return {
          label: "비활성화",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
        };
      default:
        return {
          label: "-",
          bgColor: "bg-gray-100",
          textColor: "text-gray-500",
        };
    }
  };

  const { label, bgColor, textColor } = getStatusConfig(status);

  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-medium rounded-full",
        bgColor,
        textColor,
        className
      )}
    >
      {label}
    </span>
  );
}
