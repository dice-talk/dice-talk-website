export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SingleResponse<T> {
  data: T;
}

export interface MultiResponse<T> {
  data: T[];
  pageInfo: PageInfo;
}

// SingleResponseDto에 대한 타입도 필요하다면 추가
// export interface SingleResponse<T> {
//   data: T;
// }

// Spring Page 객체와 유사한 타입 정의
export interface SpringPage<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // 현재 페이지 (0-indexed)
  first: boolean;
  empty: boolean;
}

