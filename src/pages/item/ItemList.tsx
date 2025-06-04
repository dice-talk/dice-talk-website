import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { type Item } from '../../types/itemTypes';
import Button from '../../components/ui/Button';
import { ItemModal } from '../../components/item/ItemModal';
import { formatDate } from '../../lib/ReportUtils'; // formatDate 유틸리티 경로 확인
import defaultItemImage from '../../assets/product.png'; // 상품 이미지 재활용 또는 새 아이템 기본 이미지

interface ItemTableItem extends Item, TableItem {
  id: number; // ReusableTable 호환용
}

// Mock 데이터 (실제로는 API 호출)
let mockItems: Item[] = [
  { itemId: 1, itemName: "채팅방 나가기", itemDescription: "현재 참여중인 채팅방에서 즉시 퇴장합니다.", itemImage: defaultItemImage, diceCost: 700, createdAt: "2025-06-03T10:00:00Z", modifiedAt: "2025-06-03T10:00:00Z" },
  { itemId: 2, itemName: "큐피트의 짝대기", itemDescription: "채팅방 내 특정 사용자에게 호감을 표현합니다.", itemImage: defaultItemImage, diceCost: 400, createdAt: "2025-06-03T11:00:00Z", modifiedAt: "2025-06-03T11:00:00Z" },
];

let nextItemId = mockItems.length + 1;

const itemSortOptions = [
  { value: 'itemId_desc', label: '등록일 (최신순)' },
  { value: 'itemId_asc', label: '등록일 (오래된순)' },
  { value: 'diceCost_desc', label: '다이스 소모량 (높은순)' },
  { value: 'diceCost_asc', label: '다이스 소모량 (낮은순)' },
  { value: 'itemName_asc', label: '아이템명 (가나다순)' },
];

export default function ItemListPage() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [sortValue, setSortValue] = useState('itemId_desc');

  useEffect(() => {
    setItems([...mockItems]);
  }, []);

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
    setItemToEdit(null);
  };

  const handleSubmitItem = (data: Omit<Item, 'itemId' | 'createdAt' | 'modifiedAt'> | Item) => {
    const now = new Date().toISOString();
    if ('itemId' in data) { // 수정
      mockItems = mockItems.map(i => i.itemId === data.itemId ? { ...data, modifiedAt: now } : i);
    } else { // 생성
      const newItem: Item = {
        ...data,
        itemImage: data.itemImage || defaultItemImage, // 기본 이미지 설정
        itemId: nextItemId++,
        createdAt: now,
        modifiedAt: now,
      };
      mockItems = [...mockItems, newItem];
    }
    setItems([...mockItems]);
    handleCloseModal(); // 성공 시 모달 닫기
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm("정말로 이 아이템을 삭제하시겠습니까?")) {
      mockItems = mockItems.filter(i => i.itemId !== itemId);
      setItems([...mockItems]);
    }
  };

  const sortedTableData = useMemo((): ItemTableItem[] => {
    const sorted = [...items];
    if (sortValue === 'itemId_desc') sorted.sort((a, b) => new Date(b.itemId).getTime() - new Date(a.createdAt).getTime());
    else if (sortValue === 'itemId_asc') sorted.sort((a, b) => new Date(a.itemId).getTime() - new Date(b.createdAt).getTime());
    else if (sortValue === 'diceCost_desc') sorted.sort((a, b) => b.diceCost - a.diceCost);
    else if (sortValue === 'diceCost_asc') sorted.sort((a, b) => a.diceCost - b.diceCost);
    else if (sortValue === 'itemName_asc') sorted.sort((a, b) => a.itemName.localeCompare(b.itemName));
    return sorted.map(i => ({ ...i, id: i.itemId }));
  }, [items, sortValue]);

  const columns: ColumnDefinition<ItemTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index + 1, headerClassName: 'w-[5%]' },
    {
      key: 'itemImage', header: '이미지', headerClassName: 'w-[10%]',
      cellRenderer: (item) => <img src={item.itemImage || defaultItemImage} alt={item.itemName} className="h-12 w-12 object-cover rounded" />
    },
    { key: 'itemName', header: '아이템명', accessor: 'itemName', headerClassName: 'w-[20%]' },
    { key: 'itemDescription', header: '설명', accessor: 'itemDescription', headerClassName: 'w-[30%]', cellRenderer: (item) => <span className="truncate" title={item.itemDescription}>{item.itemDescription}</span> },
    { key: 'diceCost', header: '다이스 소모량', accessor: (item) => `${item.diceCost.toLocaleString()}개`, headerClassName: 'w-[10%]' },
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-[10%]' },
    {
      key: 'actions', header: '관리', headerClassName: 'w-[15%]',
      cellRenderer: (item) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenModalForEdit(item)}>수정</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.itemId)}>삭제</Button>
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

          <ReusableTable
            columns={columns}
            data={sortedTableData}
            totalCount={sortedTableData.length}
            emptyStateMessage="등록된 아이템이 없습니다."
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={itemSortOptions}
          />

          <ItemModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitItem}
            itemToEdit={itemToEdit}
          />
        </main>
      </div>
    </div>
  );
}