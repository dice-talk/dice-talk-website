// src/components/payment/PaymentHistoryFilterSection.tsx
import React from 'react';
import Button from '../ui/Button';
import { DropdownFilter } from '../ui/DropdownFilter';
import { SearchInputFilter } from '../ui/SearchInputFilter';
import { Input } from '../ui/Input'; // 날짜 입력을 위해 Input 사용
// import { PaymentStatus, PaymentMethod } from '../../types/paymentTypes';

interface PaymentHistoryFilterSectionProps {
  // 날짜 필터
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  // 상태 필터
  statusFilter: string; // '전체' 또는 PaymentStatus
  onStatusFilterChange: (status: string) => void;
  // 결제수단 필터
  methodFilter: string; // '전체' 또는 PaymentMethod
  onMethodFilterChange: (method: string) => void;
  // 검색 필터
  userSearchTerm: string; // 사용자 ID 또는 이메일
  onUserSearchTermChange: (term: string) => void;
  productSearchTerm: string; // 상품명 또는 상품 ID
  onProductSearchTermChange: (term: string) => void;
  // 액션 버튼
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const paymentStatusOptions: { value: string, label: string }[] = [
  { value: '전체', label: '전체 상태' },
  { value: '결제 완료', label: '결제 완료' },
  { value: '결제 실패', label: '결제 실패' },
  { value: '환불 완료', label: '환불 완료' },
  { value: '취소됨', label: '취소됨' },
  { value: '결제 대기중', label: '결제 대기중' },
];

const paymentMethodOptions: { value: string, label: string }[] = [
  { value: '전체', label: '전체 결제수단' },
  { value: '신용카드', label: '신용카드' },
  { value: '카카오페이', label: '카카오페이' },
  { value: '네이버페이', label: '네이버페이' },
  { value: '계좌이체', label: '계좌이체' },
  { value: '휴대폰결제', label: '휴대폰결제' },
  { value: '기타', label: '기타' },
];

export const PaymentHistoryFilterSection: React.FC<PaymentHistoryFilterSectionProps> = ({
  startDate, onStartDateChange, endDate, onEndDateChange,
  statusFilter, onStatusFilterChange,
  methodFilter, onMethodFilterChange,
  userSearchTerm, onUserSearchTermChange,
  productSearchTerm, onProductSearchTermChange,
  onResetFilters,
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
        <DropdownFilter
          label="결제 수단"
          id="methodFilter"
          value={methodFilter}
          onValueChange={onMethodFilterChange}
          options={paymentMethodOptions}
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
          {/* <Button
            variant="default"
            onClick={onApplyFilters}
            className="w-full sm:w-auto"
          >
            조회
          </Button> */}
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="w-full sm:w-auto"
          >
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
};