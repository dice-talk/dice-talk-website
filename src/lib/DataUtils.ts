export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return "-";

  try {
    let processedDateString = dateString;

    const isISOWithoutZone =
      typeof dateString === "string" &&
      dateString.includes("T") &&
      !dateString.endsWith("Z") &&
      !/[+-]\d{2}(:\d{2})?$/.test(dateString);

    if (isISOWithoutZone) {
      processedDateString += "Z"; // UTC라고 명시적으로 처리
    }

    const date = new Date(processedDateString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "유효하지 않은 날짜";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul", // ✅ 명시적 KST 변환
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "날짜 변환 오류";
  }
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "-";

  try {
    let processedDateString = dateString;

    const isISOWithoutZone =
      typeof dateString === "string" &&
      dateString.includes("T") &&
      !dateString.endsWith("Z") &&
      !/[+-]\d{2}(:\d{2})?$/.test(dateString);

    if (isISOWithoutZone) {
      processedDateString += "Z";
    }

    const date = new Date(processedDateString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "유효하지 않은 날짜";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "날짜 변환 오류";
  }
};