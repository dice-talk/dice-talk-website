import axiosInstance from "./axiosInstance";
import type {
  AnswerPostRequest,
  AnswerPatchRequest,
} from "../types/answerTypes";

// 답변 등록 (이미지 포함)
export const postAnswer = (
  questionId: number,
  data: AnswerPostRequest,
  images?: File[]
) => {
  const formData = new FormData();
  formData.append("answerPostDto", data.answerPostDtoString);
  if (images) {
    images.forEach((file) => formData.append("images", file));
  }
  return axiosInstance.post(`/questions/${questionId}/answers`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 답변 수정
export const patchAnswer = (
  questionId: number,
  answerId: number,
  data: AnswerPatchRequest,
  images?: File[]
) => {
  const formData = new FormData();
  formData.append("answerPatchDto", data.answerPatchDtoString);
  if (images) {
    images.forEach((file) => formData.append("images", file));
  }
  return axiosInstance.patch<void>(
    `/questions/${questionId}/answers/${answerId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

// 답변 삭제
export const deleteAnswer = (questionId: number, answerId: number) => {
  return axiosInstance.delete<void>(
    `/questions/${questionId}/answers/${answerId}`
  );
};
