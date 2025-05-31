import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/Select';
import { cn } from '../../lib/Utils'; // cn 유틸리티 함수 경로 확인 필요
import type { TableItem, ColumnDefinition, ReusableTableProps } from './reusableTableTypes';

export function ReusableTable<T extends TableItem>({
  data,
  columns,
  totalCount,
  sortValue,
  onSortChange,
  sortOptions,
  emptyStateMessage = "표시할 데이터가 없습니다.",
}: ReusableTableProps<T>) {

  const renderCellContent = (item: T, column: ColumnDefinition<T>, index: number) => {
    if (column.cellRenderer) {
      return column.cellRenderer(item, index);
    }
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(item);
      }
      return item[column.accessor as keyof T];
    }
    return null; // 기본적으로 아무것도 렌더링하지 않거나, item[column.key] 등을 시도할 수 있습니다.
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-600">총 <strong className="text-gray-800">{totalCount}</strong>건</span>
        {sortOptions.length > 0 && (
          <div className="w-48">
            <Select value={sortValue} onValueChange={onSortChange}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="정렬 기준 선택" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cn("py-3 px-4 text-center text-xs text-slate-600 uppercase tracking-wider font-semibold", col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="py-10 text-center text-gray-500">{emptyStateMessage}</td></tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                  {columns.map((col) => (<td key={`${item.id}-${col.key}`} className={cn("py-3 px-4 text-center text-gray-700", col.cellClassName)}>{renderCellContent(item, col, index)}</td>))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}