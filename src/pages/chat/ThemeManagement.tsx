import { useState, useMemo, useEffect, useCallback } from 'react'; // useEffect, useCallback 추가
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import Button from '../../components/ui/Button';
import { ThemeEditModal } from '../../components/chat/ThemeEditModal';
// Import types from themeTypes.ts
import type { ThemeResponseDto, ThemePatchDto, ThemeStatus } from '../../types/themeTypes';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { getThemesForAdmin, updateTheme } from '../../api/themeApi';
import type { MultiResponse, PageInfo } from '../../types/common';
import { Pagination } from '../../components/common/Pagination';

interface ThemeTableItem extends Omit<ThemeResponseDto, 'rules'>, TableItem { 
  id: number; 
}

export default function ThemeManagementPage() {
  const [themes, setThemes] = useState<ThemeResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeResponseDto | null>(null);
  const [sortValue, setSortValue] = useState('id_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Or pageSize
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [filterStatus] = useState<ThemeStatus | undefined>(undefined);

  const fetchThemes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: MultiResponse<ThemeResponseDto> = await getThemesForAdmin({
        page: currentPage,
        size: itemsPerPage,
        status: filterStatus,
      });
      setThemes(response.data);
      setPageInfo(response.pageInfo);
    } catch (err) {
      console.error("테마 목록을 불러오는데 실패했습니다:", err);
      // alert("테마 목록을 불러오는데 실패했습니다."); 
      setError("테마 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
      setThemes([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, filterStatus]);
  
  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleOpenEditModal = (theme: ThemeResponseDto) => {
    setSelectedTheme(theme);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedTheme(null);
    setIsEditModalOpen(false);
  };

  const handleSaveTheme = async (updatedFields: {
    name?: string | null;
    description?: string | null;
    image?: string | File | null;
    themeStatus?: ThemeStatus;
  }) => {
    if (!selectedTheme) return;

    // ThemePatchDto에 맞게 데이터 구성 (id는 경로로 전달되므로 제외)
    // updatedFields.image는 string | File | null 타입일 수 있으나,
    // ThemePatchDto의 image는 string | null | undefined 타입입니다.
    // API 함수(updateTheme)의 실제 구현이 File 객체를 처리한다고 가정하고 타입 단언을 사용합니다.
    const dataToPassToApi = {
      themeId: selectedTheme.themeId,
      ...updatedFields,
      name: (updatedFields.name === '' || updatedFields.name === null) ? undefined : updatedFields.name,
      description: (updatedFields.description === '' || updatedFields.description === null) ? undefined : updatedFields.description,
    };
 try {
      // ThemePatchDto 타입 정의와 updatedFields의 image 타입(File 가능) 불일치로 인한 타입 오류를
      // API 함수의 실제 구현이 File을 처리한다는 가정 하에 타입 단언으로 해결합니다.
      const savedTheme = await updateTheme(dataToPassToApi as ThemePatchDto);
      setThemes(prevThemes =>
        prevThemes.map(t => (t.themeId === savedTheme.themeId ? savedTheme : t))
      );
      alert(`'${savedTheme.name}' 테마 정보가 수정되었습니다.`);
      fetchThemes(); // Refresh list after save
    } catch (err) {
      console.error("테마 정보 수정에 실패했습니다:", err);
      alert("테마 정보 수정에 실패했습니다.");
    } finally {
      handleCloseEditModal();
    }
  };
  
  // 테마 정렬 옵션
  const themeSortOptions = [
    { value: 'id_desc', label: '최신 등록순' },
    { value: 'id_asc', label: '오래된 등록순' },
    { value: 'name_asc', label: '테마명 (오름차순)' },
    { value: 'name_desc', label: '테마명 (내림차순)' },
    { value: 'status_on_first', label: '상태순 (진행중 우선)' },
    { value: 'status_close_first', label: '상태순 (종료 우선)' },
  ];

  const tableData = useMemo((): ThemeTableItem[] => {
    // THEME_ON: 1 (진행중), THEME_PLANNED: 2 (예정), THEME_CLOSE: 3 (종료)
    const statusOrder: Record<ThemeStatus, number> = {
      "THEME_ON": 1,
      "THEME_PLANNED": 2,
      "THEME_CLOSE": 3,
    };

    const sortedThemes = [...themes].sort((a, b) => {
      if (sortValue === 'id_desc') return b.themeId - a.themeId;
      if (sortValue === 'id_asc') return a.themeId - b.themeId;
      if (sortValue === 'name_asc') return a.name.localeCompare(b.name);
      if (sortValue === 'name_desc') return b.name.localeCompare(a.name);
      if (sortValue === 'status_on_first') {
        return statusOrder[a.themeStatus] - statusOrder[b.themeStatus];
      }
      if (sortValue === 'status_close_first') {
        // 종료 우선 정렬 시에는 THEME_CLOSE가 가장 낮은 숫자를 갖도록 역순으로 적용하거나,
        // statusOrder 자체를 다르게 정의할 수 있습니다. 여기서는 간단히 역으로 정렬합니다.
        return statusOrder[b.themeStatus] - statusOrder[a.themeStatus];
      }
      return 0;
    });
    return sortedThemes.map(theme => ({
        ...theme,
        id: theme.themeId, // Map themeId to id for ReusableTable
    }));
  }, [themes, sortValue]);

  const totalItemsCount = pageInfo ? pageInfo.totalElements : 0;
  const totalPages = pageInfo ? pageInfo.totalPages : 0;

  const handleSortChange = (value: string) => {
    setSortValue(value);
   
  };

  const columns: ColumnDefinition<ThemeTableItem>[] = [
    {
      key: 'themeId', // Use backend field name
      header: 'ID',
      accessor: 'themeId',
      headerClassName: 'w-[5%]',
      cellClassName: 'text-center',
    },
    // 이미지 컬럼 추가
    {
      key: 'image',
      header: '이미지',
      accessor: 'image',
      headerClassName: 'w-[10%] text-center',
      cellClassName: 'text-center',
      cellRenderer: (item) => (
        item.image ? 
          <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded-md mx-auto" /> 
          : <span className="text-gray-400">-</span>
      ),
    },
    {
      key: 'name',
      header: '테마명',
      accessor: 'name',
      headerClassName: 'w-[15%]', // 이미지 컬럼 추가로 너비 조정
    },
    {
      key: 'description',
      header: '설명',
      accessor: 'description',
      headerClassName: 'w-[30%]',
      cellRenderer: (item) => {
        const maxLength = 25;
        const descriptionText = item.description || '-';
        const displayText = descriptionText.length > maxLength
          ? `${descriptionText.substring(0, maxLength)}...`
          : descriptionText;
        return <span className="block truncate" title={descriptionText}>{displayText}</span>;
      }
    },
    {
      key: 'themeStatus', // 'isActive' 대신 'themeStatus' 사용
      header: '상태',
      accessor: 'themeStatus',
      headerClassName: 'w-[12%]', // 너비 조정
      cellClassName: 'text-center',
      cellRenderer: (item) => {
        let statusText = '';
        let statusClass = '';
        switch (item.themeStatus) {
          case 'THEME_ON':
            statusText = '진행중';
            statusClass = 'bg-green-100 text-green-700 border border-green-300';
            break;
          case 'THEME_PLANNED':
            statusText = '예정';
            statusClass = 'bg-blue-100 text-blue-700 border border-blue-300';
            break;
          case 'THEME_CLOSE':
            statusText = '종료';
            statusClass = 'bg-gray-100 text-gray-700 border border-gray-300';
            break;
          default:
            statusText = item.themeStatus;
            statusClass = 'bg-gray-100 text-gray-700 border border-gray-300';
        }
        return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass}`}>{statusText}</span>;
      },
    },
    {
      key: 'actions',
      header: '관리',
      headerClassName: 'w-[13%]', // 너비 조정
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

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-gray-500">테마 목록을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchThemes()} variant="outline">다시 시도</Button>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={tableData} 
                totalCount={totalItemsCount} 
                sortValue={sortValue}
                onSortChange={handleSortChange}
                sortOptions={themeSortOptions}
                emptyStateMessage="관리할 테마가 없습니다."
              />
              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </main>
        {selectedTheme && ( // selectedTheme이 있을 때만 모달 렌더링
          <ThemeEditModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            theme={selectedTheme}
            onSave={handleSaveTheme}
          />
        )}
      </div>
    </div>
  );
}
