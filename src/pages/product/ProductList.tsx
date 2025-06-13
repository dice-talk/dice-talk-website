// src/pages/product/ProductListPage.tsx
import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition } from '../../components/common/reusableTableTypes';
import { type ProductResponseDto, type ProductItem } from '../../types/productTypes';
import type { MultiResponse, PageInfo } from '../../types/common';
import Button from '../../components/ui/Button';
import { ProductModal } from '../../components/product/ProductModal';
import { formatDate } from '../../lib/ReportUtils'; // 경로 확인 필요
import { Pagination } from '../../components/common/Pagination'; // Pagination 컴포넌트 임포트
import { getProducts, deleteProduct } from '../../api/productApi';

interface ProductTableItem extends ProductItem {
    id: number; // ReusableTable 호환용
}

const productSortOptions = [
  { value: 'productId_desc', label: '등록일 (최신순)' },
  { value: 'productId_asc', label: '등록일 (오래된순)' },
  { value: 'price_desc', label: '가격 (높은순)' },
  { value: 'price_asc', label: '가격 (낮은순)' },
  { value: 'productName_asc', label: '상품명 (가나다순)' },
  { value: 'productName_desc', label: '상품명 (가나다역순)' },
];

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductTableItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [sortValue, setSortValue] = useState('productId_desc'); // 정렬 상태 추가
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10; // 페이지 당 아이템 수, 필요시 설정 가능하게 변경

   const fetchProducts = async (page: number, size: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // API가 1-indexed 페이지를 기대할 가능성을 고려하여 수정 (page: page)
      const response: MultiResponse<ProductResponseDto> = await getProducts({ page: page, size });
      setProducts(response.data.map(p => ({ ...p, id: p.productId }))); // ReusableTable 호환을 위해 id 추가
      setPageInfo(response.pageInfo);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("상품 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      setProducts([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 목록 업데이트를 위해 useEffect 사용 (mockProducts가 외부에서 변경될 경우 대비)
  useEffect(() => {
    fetchProducts(currentPage, PAGE_SIZE);
  }, [currentPage]); // currentPage가 변경될 때마다 상품 목록 다시 로드


  const handleOpenModalForCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (product: ProductItem) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleProductSubmitted = () => {
    // 상품 생성/수정 성공 시 목록 새로고침
    // 특정 상품 정보(submittedProduct)가 있다면, 목록에서 해당 상품만 업데이트하여 UX 개선 가능
    // 여기서는 간단히 현재 페이지를 다시 로드
    fetchProducts(currentPage, PAGE_SIZE);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {

      try {
        await deleteProduct(productId);
        alert("상품이 삭제되었습니다.");
        fetchProducts(currentPage, PAGE_SIZE); // 삭제 후 목록 새로고침
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert(`상품 삭제 중 오류 발생: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };

  const sortedTableData = useMemo((): ProductTableItem[] => {
    const sorted = [...products];
    if (sortValue === 'productId_desc') {
      sorted.sort((a, b) => b.productId - a.productId);
    } else if (sortValue === 'productId_asc') {
      sorted.sort((a, b) => a.productId - b.productId);
    } else if (sortValue === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'productName_asc') {
      sorted.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
    } else if (sortValue === 'productName_desc') {
      sorted.sort((a, b) => (b.productName || "").localeCompare(a.productName || ""));
    }
    return sorted; // ProductItem은 이미 id 필드를 포함 (fetchProducts에서 매핑됨)
  
  }, [products, sortValue]);

  const columns: ColumnDefinition<ProductTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index +1, headerClassName: 'w-[5%]' },
    {
      key: 'productImage', header: '이미지', headerClassName: 'w-[10%]',
      cellRenderer: (item) => item.productImage ? <img src={item.productImage} alt={item.productName} className="h-22 w-26 object-cover rounded" /> : 'N/A'
    },
    { key: 'productName', header: '상품명', accessor: 'productName', headerClassName: 'w-[15%]' },
    {
      key: 'price', header: '가격', headerClassName: 'w-[10%]',
      accessor: (item) => `₩${item.price.toLocaleString('ko-KR')}`
    },
    { key: 'quantity', header: '수량', accessor: 'quantity', headerClassName: 'w-[10%]' },
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-[15%]' },
    { key: 'modifiedAt', header: '수정일', accessor: (item) => formatDate(item.modifiedAt), headerClassName: 'w-[15%]' },
    {
      key: 'actions', header: '관리', headerClassName: 'w-[15%]',
      cellRenderer: (item) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenModalForEdit(item)}>수정</Button>
          <Button variant="outline" size="sm" 
            className="border-red-500 text-red-500 hover:bg-red-50" 
            onClick={() => handleDeleteProduct(item.productId)}>삭제</Button>
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
            <h2 className="text-3xl font-bold text-gray-800">상품 관리</h2>
            <Button variant="default" onClick={handleOpenModalForCreate}>
              새 상품 등록
            </Button>
          </div>

          {isLoading && products.length === 0 && <div className="text-center py-4">상품 목록을 불러오는 중...</div>}
          {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}

          <ReusableTable
            columns={columns}
            data={sortedTableData}
            totalCount={pageInfo?.totalElements || 0}
            emptyStateMessage={isLoading ? "로딩 중..." : (error ? "오류 발생" : "등록된 상품이 없습니다.")}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={productSortOptions}
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

          <ProductModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onProductSubmitted={handleProductSubmitted}
            productToEdit={productToEdit}
          />
        </main>
      </div>
    </div>
  );
}