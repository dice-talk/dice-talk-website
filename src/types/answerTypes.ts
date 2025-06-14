export interface AnswerImageResponse {
  answerImageId: number;
  answerId: number;
  imageUrl: string;
}

export interface AnswerResponse {
  answerId: number;
  content: string;
  answerImages: AnswerImageResponse[];
  questionId: number;
  memberId: number;
  createdAt: string;
  modifiedAt: string;
}

export interface AnswerPostRequest {
  content: string;
  image?: File; // 이미지 파일(선택)
}
