import type { AnswerResponse } from "./answerTypes";

export interface QuestionImageResponse {
  questionImageId: number;
  questionId: number;
  imageUrl: string;
}

export interface QuestionResponse {
  questionId: number;
  title: string;
  content: string;
  questionStatus: string; // enum이 아닌 string
  memberId?: number;
  email?: string;
  answer?: AnswerResponse;
  questionImages: QuestionImageResponse[];
  createdAt: string;
  modifiedAt: string;
}

export interface QuestionPostRequest {
  title: string;
  content: string;
  memberId?: number; // 회원 문의
  email?: string; // 비회원 문의
}

export interface QuestionListParams {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  searchType?: "TITLE" | "AUTHOR" | "TITLE_AUTHOR" | "CONTENT";
  sort?: string;
}
