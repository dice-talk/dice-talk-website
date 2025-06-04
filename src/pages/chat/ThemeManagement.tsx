// src/pages/theme/ThemeManagementPage.tsx
import { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import Button from '../../components/ui/Button';
import { ThemeEditModal } from '../../components/chat/ThemeEditModal';
import { type ThemeItem, ThemeId } from '../../types/themeTypes';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
// import { Switch } from '../../components/ui/Switch'; // 테이블에서는 뱃지로 대체

// 초기 테마 데이터 (실제로는 API에서 가져옴)
const initialThemes: ThemeItem[] = [
  { id: ThemeId.DICE_FRIENDS, name: '다이스 프렌즈', description: '친구찾기 서비스', isActive: true, rules: '6명 랜덤 매칭' },
  { id: ThemeId.HEART_SIGNAL, name: '하트시그널', description: '사랑찾기 서비스', isActive: true, rules: '남3, 여3 필수' },
];

// TableItem likely has an 'id' property (e.g., string | number).
// ThemeItem has 'id: ThemeId'.
// To resolve the conflict, Omit 'id' from ThemeItem and explicitly define it.
interface ThemeTableItem extends Omit<ThemeItem, 'id'>, TableItem {
  id: ThemeId; // Ensures the id from ThemeItem (ThemeId) is used and is compatible with TableItem's id if it's string.
}

export default function ThemeManagementPage() {
  const [themes, setThemes] = useState<ThemeItem[]>(initialThemes);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeItem | null>(null);
  const [sortValue, setSortValue] = useState('name_asc'); // 정렬 상태 추가

  const handleOpenEditModal = (theme: ThemeItem) => {
    setSelectedTheme(theme);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedTheme(null);
    setIsEditModalOpen(false);
  };

  const handleSaveTheme = (updatedTheme: ThemeItem) => {
    setThemes(prevThemes =>
      prevThemes.map(t => (t.id === updatedTheme.id ? updatedTheme : t))
    );
    handleCloseEditModal();
    // TODO: API 호출하여 서버에 저장
    alert(`'${updatedTheme.name}' 테마 정보가 수정되었습니다.`);
  };
  
  // 테마 정렬 옵션
  const themeSortOptions = [
    { value: 'name_asc', label: '테마명 (오름차순)' },
    { value: 'name_desc', label: '테마명 (내림차순)' },
    { value: 'isActive_desc', label: '활성 상태 (활성 먼저)' },
    { value: 'isActive_asc', label: '활성 상태 (비활성 먼저)' },
  ];

  const tableData = useMemo((): ThemeTableItem[] => {
    const sortedThemes = [...themes].sort((a, b) => {
      if (sortValue === 'name_asc') return a.name.localeCompare(b.name);
      if (sortValue === 'name_desc') return b.name.localeCompare(a.name);
      if (sortValue === 'isActive_desc') return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0);
      if (sortValue === 'isActive_asc') return (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0);
      return 0;
    });
    return sortedThemes.map(theme => ({
        ...theme,
    }));
  }, [themes, sortValue]);

  const handleSortChange = (value: string) => setSortValue(value);

  const columns: ColumnDefinition<ThemeTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => index + 1,
      headerClassName: 'w-[5%]',
    },
    {
      key: 'name',
      header: '테마명',
      accessor: 'name',
      headerClassName: 'w-[20%]',
    },
    {
      key: 'description',
      header: '설명',
      accessor: 'description',
      headerClassName: 'w-[30%]',
      cellRenderer: (item) => <span className="truncate" title={item.description}>{item.description}</span>
    },
    {
      key: 'rules',
      header: '채팅방 규칙',
      accessor: 'rules',
      headerClassName: 'w-[15%]',
      cellRenderer: (item) => item.rules || '-',
    },
    {
      key: 'isActive',
      header: '활성 상태',
      headerClassName: 'w-[15%] text-center',
      cellClassName: 'text-center',
      cellRenderer: (item) => ( // 뱃지 형태로 변경
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full
            ${item.isActive ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
        >
          {item.isActive ? '활성화' : '비활성화'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '관리',
      headerClassName: 'w-[15%] text-center',
      cellClassName: 'text-center',
      cellRenderer: (item) => (
        <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(item)}>
          수정
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">테마 관리</h2>
            {/* <Button onClick={() => alert('새 테마 추가 기능은 준비 중입니다.')}>새 테마 추가</Button> */}
          </div>
          
          <ReusableTable
            columns={columns}
            data={tableData}
            totalCount={tableData.length}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            sortOptions={themeSortOptions}
            emptyStateMessage="관리할 테마가 없습니다."
          />
        </main>
        <ThemeEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          theme={selectedTheme}
          onSave={handleSaveTheme}
        />
      </div>
    </div>
  );
}
