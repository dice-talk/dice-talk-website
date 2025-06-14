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
  answerPostDtoString: string;
  images?: File[]; // 이미지 파일(선택)
}

export interface AnswerPatchRequest {
  answerPatchDtoString: string;
  images?: File[]; // 이미지 파일(선택)
  keepImageIds?: number[];
}
