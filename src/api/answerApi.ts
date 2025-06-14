import axiosInstance from "./axiosInstance";
import type { AnswerPostRequest } from "../types/answerTypes";

// 답변 등록 (이미지 포함)
export const postAnswer = (
  questionId: number,
  data: AnswerPostRequest,
  images?: File[]
) => {
  const formData = new FormData();
  formData.append("answerPostDto", JSON.stringify({ content: data.content }));
  if (images) {
    images.forEach((file) => formData.append("images", file));
  }
  return axiosInstance.post(`/questions/${questionId}/answers`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
