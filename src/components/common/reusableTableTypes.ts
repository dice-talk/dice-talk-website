export interface TableItem {
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // 제네릭 테이블의 유연성을 위해 다양한 추가 속성을 허용
}

// 각 컬럼의 정의를 위한 인터페이스
export interface ColumnDefinition<T extends TableItem> {
  key: string; 
  header: string; // 테이블 헤더에 표시될 텍스트
  cellRenderer?: (item: T, index: number) => React.ReactNode; // 셀 내용을 커스텀 렌더링하는 함수
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accessor?: keyof T | ((item: T) => any); // 셀 데이터에 접근하는 방법
  headerClassName?: string; // 헤더 th에 적용될 추가 클래스
  cellClassName?: string; // 각 셀 td에 적용될 추가 클래스
}

export interface TableItem { // TableItem 정의
  id: number | string; 
}

// ReusableTable 컴포넌트의 props 인터페이스
export interface ReusableTableProps<T extends TableItem> {
  data: T[];
  columns: ColumnDefinition<T>[];
  totalCount: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
  emptyStateMessage?: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}
