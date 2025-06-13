export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SingleResponse<T> {
  data: T[];
}

export interface MultiResponse<T> {
  data: T[];
  pageInfo: PageInfo;
}

// SingleResponseDto에 대한 타입도 필요하다면 추가
// export interface SingleResponse<T> {
//   data: T;
// }

