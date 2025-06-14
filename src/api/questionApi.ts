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
export const getQuestion = (questionId: number) =>
  axiosInstance.get<QuestionResponse>(`/questions/${questionId}`);

// 질문 목록 조회 (관리자/회원/비회원)
export const getQuestions = (params: QuestionListParams) =>
  axiosInstance.get<{ data: QuestionResponse[]; pageInfo: PageInfo }>(
    "/questions",
    {
      params,
    }
  );
