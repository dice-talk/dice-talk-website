import { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { type ItemResponseDto, type Item } from '../../types/itemTypes';
import type { MultiResponse, PageInfo } from '../../types/common';
import Button from '../../components/ui/Button';
import { ItemModal } from '../../components/item/ItemModal';
import { formatDate } from '../../lib/ReportUtils'; // formatDate 유틸리티 경로 확인
import { Pagination } from '../../components/common/Pagination'; // Pagination 컴포넌트 임포트
import { getItemsAdmin, deleteItem }from '../../api/itemApi';

interface ItemTableItem extends Item, TableItem {
  id: number; // ReusableTable 호환용
}

const itemSortOptions = [
  { value: 'itemId_desc', label: '등록일 (최신순)' },
  { value: 'itemId_asc', label: '등록일 (오래된순)' },
  { value: 'diceCost_desc', label: '다이스 소모량 (높은순)' },
  { value: 'diceCost_asc', label: '다이스 소모량 (낮은순)' },
  { value: 'itemName_asc', label: '아이템명 (가나다순)' },
];

// 백엔드 정렬 파라미터 매핑
const mapSortValueToBackend = (sortValue: string): string => {
  switch (sortValue) {
    case 'itemId_desc': return 'itemId,desc';
    case 'itemId_asc': return 'itemId,asc';
    case 'diceCost_desc': return 'dicePrice,desc'; // diceCost -> dicePrice
    case 'diceCost_asc': return 'dicePrice,asc';   // diceCost -> dicePrice
    case 'itemName_asc': return 'itemName,asc';
    default: return 'itemId,desc'; // 기본값
  }
};

export default function ItemListPage() {
  const [items, setItems] = useState<ItemTableItem[]>([]); // ItemTableItem[]으로 변경
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemResponseDto | null>(null); // ItemResponseDto로 변경
  const [sortValue, setSortValue] = useState('itemId_desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10; // 페이지 당 아이템 수

    // 아이템 목록 불러오기 함수
  const fetchItems = useCallback(async (page: number, size: number, sort: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // API는 page를 1-indexed로 받으므로 currentPage 그대로 사용
      const response: MultiResponse<ItemResponseDto> = await getItemsAdmin({
        page: page,
        size: size,
        sort: mapSortValueToBackend(sort), // 백엔드 정렬 파라미터 사용
      });
      // ItemResponseDto 배열을 ItemTableItem 배열로 변환 (id 추가)
      setItems(response.data.map(item => ({ ...item, id: item.itemId })));
      setPageInfo(response.pageInfo);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setError("아이템 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      setItems([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // 의존성 배열 비워 useCallback 메모이제이션

  // 컴포넌트 마운트 및 페이지/정렬 변경 시 데이터 로드
  useEffect(() => {
    fetchItems(currentPage, PAGE_SIZE, sortValue);
  }, [currentPage, PAGE_SIZE, sortValue, fetchItems]); // fetchItems를 의존성 배열에 추가

  const handleOpenModalForCreate = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (item: Item) => {
    setItemToEdit(item); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemToEdit(null); //modal 닫을 때 상태 초기화
  };

    // ItemModal에서 아이템 생성/수정 성공 시 호출될 콜백
  const onItemSubmitted = () => {
    // 현재 페이지의 아이템 목록을 다시 불러와서 변경 사항 반영
    fetchItems(currentPage, PAGE_SIZE, sortValue);
  };


  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm("정말로 이 아이템을 삭제하시겠습니까?")) {
      try {
        await deleteItem(itemId);
        alert("아이템이 삭제되었습니다.");
        fetchItems(currentPage, PAGE_SIZE, sortValue); // 삭제 후 목록 새로고침
      } catch (err) {
        console.error("Failed to delete item:", err);
        alert(`아이템 삭제 중 오류 발생: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };


  const sortedTableData = useMemo((): ItemTableItem[] => {
    const sorted = [...items];
    if (sortValue === 'itemId_desc') sorted.sort((a, b) => new Date(b.itemId).getTime() - new Date(a.createdAt).getTime());
    else if (sortValue === 'itemId_asc') sorted.sort((a, b) => new Date(a.itemId).getTime() - new Date(b.createdAt).getTime());
    else if (sortValue === 'diceCost_desc') sorted.sort((a, b) => b.dicePrice - a.dicePrice); // diceCost -> dicePrice
    else if (sortValue === 'diceCost_asc') sorted.sort((a, b) => a.dicePrice - b.dicePrice); // diceCost -> dicePrice
    else if (sortValue === 'itemName_asc') sorted.sort((a, b) => a.itemName.localeCompare(b.itemName));
    return sorted; 
  }, [items, sortValue]);

  const columns: ColumnDefinition<ItemTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index + 1, headerClassName: 'w-[5%]' },
    {
      key: 'itemImage', header: '이미지', headerClassName: 'w-[10%]',
      cellRenderer: (item) => item.itemImage ? <img src={item.itemImage} alt={item.itemName} className="h-12 w-12 object-cover rounded" /> : 'N/A'
    },
    { key: 'itemName', header: '아이템명', accessor: 'itemName', headerClassName: 'w-[20%]' },
    { key: 'description', header: '설명', accessor: 'description', headerClassName: 'w-[30%]', cellRenderer: (item) => <span className="truncate" title={item.description}>{item.description}</span> }, // itemDescription -> description
    { key: 'dicePrice', header: '다이스 소모량', accessor: (item) => `${item.dicePrice.toLocaleString()}개`, headerClassName: 'w-[10%]' }, // diceCost -> dicePrice
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-[10%]' },
    {
      key: 'actions', header: '관리', headerClassName: 'w-[15%]',
      cellRenderer: (item) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenModalForEdit(item)}>수정</Button>
          <Button variant="outline" size="sm" 
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => handleDeleteItem(item.itemId)}>삭제</Button>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">아이템 관리</h2>
            <Button variant="default" onClick={handleOpenModalForCreate}>
              새 아이템 등록
            </Button>
          </div>

          {isLoading && items.length === 0 && <div className="text-center py-4">아이템 목록을 불러오는 중...</div>}
          {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}

          <ReusableTable
            columns={columns}
            data={sortedTableData}
            totalCount={pageInfo?.totalElements || 0} // 전체 아이템 수 사용
            emptyStateMessage={isLoading ? "로딩 중..." : (error ? "오류 발생" : "등록된 아이템이 없습니다.")}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={itemSortOptions}
          />

          {/* 페이지네이션 컴포넌트 추가 */}
          {(pageInfo?.totalPages ?? 0) > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={pageInfo?.totalPages || 0}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          <ItemModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onItemSubmitted={onItemSubmitted} // API 호출 성공 시 콜백 전달
            itemToEdit={itemToEdit}
          />
        </main>
      </div>
    </div>
  );
}