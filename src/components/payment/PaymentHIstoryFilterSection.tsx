import React from 'react';
import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';
import { Input } from '../ui/Input'; // 날짜 입력을 위해 Input 사용
import { PaymentStatus } from '../../types/payment/paymentTypes';
import { getPaymentStatusLabel } from '../../lib/PaymentUtils';

interface PaymentHistoryFilterSectionProps {
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  statusFilter: string; // '전체' 또는 PaymentStatus
  onStatusFilterChange: (status: string) => void;
  userSearchTerm: string; // 사용자 ID 또는 이메일
  onUserSearchTermChange: (term: string) => void;
  productSearchTerm: string; // 상품명 또는 상품 ID
  onProductSearchTermChange: (term: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}  
 
const paymentStatusOptions = [
  { value: '전체', label: '전체 상태' },
  ...Object.values(PaymentStatus).map((status) => ({
    value: status,
    label: getPaymentStatusLabel(status),
  })),
];


export const PaymentHistoryFilterSection: React.FC<PaymentHistoryFilterSectionProps> = ({
  startDate, onStartDateChange, endDate, onEndDateChange,
  statusFilter, onStatusFilterChange,
  // methodFilter, onMethodFilterChange, // 제거됨
  userSearchTerm, onUserSearchTermChange,
  productSearchTerm, onProductSearchTermChange,
  onApplyFilters, 
  onResetFilters
}) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200/75 space-y-4">
      {/* 1행: 날짜 필터 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">조회 시작일</label>
          <Input type="date" id="startDate" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">조회 종료일</label>
          <Input type="date" id="endDate" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
        </div>
        <DropdownFilter
          label="결제 상태"
          id="statusFilter"
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          options={paymentStatusOptions}
        />
      </div>

      {/* 2행: 검색 필터 및 버튼 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <SearchInputFilter
          label="구매자 검색"
          id="userSearch"
          placeholder="이메일 또는 회원ID"
          value={userSearchTerm}
          onChange={onUserSearchTermChange}
        />
        <SearchInputFilter
          label="상품 검색"
          id="productSearch"
          placeholder="상품명 또는 상품ID"
          value={productSearchTerm}
          onChange={onProductSearchTermChange}
        />
        <div className="md:col-span-2 flex justify-end items-end space-x-2 pt-4 sm:pt-0">
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="w-full sm:w-auto"
          >
            초기화
          </Button>
          {onApplyFilters && ( 
            <Button
              variant="default"
              onClick={onApplyFilters}
              className="w-full sm:w-auto"
            >
              조회
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};