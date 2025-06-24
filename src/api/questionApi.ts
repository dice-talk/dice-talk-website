import axiosInstance from "./axiosInstance";
import type {
  QuestionResponse,
  QuestionPostRequest,
  QuestionListParams,
} from "../types/questionTypes";
import type { PageInfo } from "../types/common";

// 질문 등록 (회원/비회원)
export const postQuestion = (data: QuestionPostRequest, images?: File[]) => {
  const formData = new FormData();
  formData.append("questionPostDto", JSON.stringify(data));
  if (images) {
    images.forEach((file) => formData.append("images", file));
  }
  return axiosInstance.post("/questions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 질문 단건 조회
export const getQuestion = (questionId: number) => {
  return axiosInstance.get<{ data: QuestionResponse }>(
    `/questions/${questionId}`
  );
};

// 질문 목록 조회 (관리자/회원/비회원)
export const getQuestions = (
  params: QuestionListParams & { sort?: "desc" | "asc" }
) =>
  axiosInstance.get<{ data: QuestionResponse[]; pageInfo: PageInfo }>(
    "/questions/admin",
    {
      params,
    }
  );

// 비회원 질문 목록 조회
export const getGuestQuestions = (params: {
  page?: number;
  size?: number;
  status?: "QUESTION_GUEST" | "QUESTION_GUEST_ANSWERED";
  search?: string;
  searchType?: "TITLE" | "CONTENT" | "AUTHOR" | "TITLE_AUTHOR";
  sort?: "desc" | "asc";
}) => {
  return axiosInstance.get<{
    data: QuestionResponse[];
    pageInfo: PageInfo;
  }>("/questions/guest", { params });
};
