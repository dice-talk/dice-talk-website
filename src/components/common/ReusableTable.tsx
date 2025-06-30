import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/Select";
import { cn } from "../../lib/Utils"; 
import type {
  TableItem,
  ColumnDefinition,
  ReusableTableProps,
} from "./reusableTableTypes";

export function ReusableTable<T extends TableItem>({
  data,
  columns,
  totalCount,
  sortValue,
  onSortChange,
  sortOptions,
  emptyStateMessage = "표시할 데이터가 없습니다.",
  onRowClick, // 행 클릭 핸들러 prop 추가
  isLoading = false,
}: ReusableTableProps<T>) {
  const renderCellContent = (
    item: T,
    column: ColumnDefinition<T>,
    index: number
  ) => {
    if (column.cellRenderer) {
      return column.cellRenderer(item, index);
    }
    if (column.accessor) {
      if (typeof column.accessor === "function") {
        return column.accessor(item);
      }
      return item[column.accessor as keyof T];
    }
    return null; 
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-600">
          총 <strong className="text-gray-800">{totalCount}</strong>건
        </span>
        {sortOptions.length > 0 && (
          <div className="w-48">
            <Select value={sortValue} onValueChange={onSortChange}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="정렬 기준 선택" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "py-3 px-4 text-center text-xs text-slate-600 uppercase tracking-wider font-semibold",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-gray-500"
                >
                  데이터를 불러오는 중...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-gray-500"
                >
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-slate-50 transition-colors duration-150",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td
                      key={`${item.id}-${col.key}`}
                      className={cn(
                        "py-3 px-4 text-center text-gray-700",
                        col.cellClassName
                      )}
                    >
                      {renderCellContent(item, col, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
