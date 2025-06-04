// src/pages/product/ProductListPage.tsx
import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { type Product } from '../../types/productTypes';
import Button from '../../components/ui/Button';
import { ProductModal } from '../../components/product/ProductModal';
import { formatDate } from '../../lib/ReportUtils'; // 경로 확인 필요
import productImg from '../../assets/product.png';

interface ProductTableItem extends Product, TableItem {
  id: number; // ReusableTable 호환용
}

// Mock 데이터 (실제로는 API 호출)
let mockProducts: Product[] = [
  { productId: 1, productName: "다이스 10개", productImage: productImg, price: 1300, quantity: 10, createdAt: "2025-06-02T11:35:57Z", modifiedAt: "2025-06-02T11:35:57Z" },
  { productId: 2, productName: "다이스 100개", productImage: productImg, price: 10000, quantity: 100, createdAt: "2025-06-01T10:00:00Z", modifiedAt: "2025-06-01T14:30:00Z" },
  { productId: 3, productName: "다이스 200개", productImage: productImg, price: 19000, quantity: 200, createdAt: "2025-05-30T09:20:00Z", modifiedAt: "2025-05-30T09:20:00Z" },
  { productId: 4, productName: "다이스 300개", productImage: productImg, price: 27000, quantity: 300, createdAt: "2025-05-29T15:00:00Z", modifiedAt: "2025-05-29T18:10:00Z" },
  { productId: 5, productName: "다이스 500개", productImage: productImg, price: 40000, quantity: 500, createdAt: "2025-05-28T12:00:00Z", modifiedAt: "2025-05-28T12:00:00Z" },
];

let nextProductId = mockProducts.length + 1;

const productSortOptions = [
  { value: 'productId_desc', label: '등록일 (최신순)' },
  { value: 'productId_asc', label: '등록일 (오래된순)' },
  { value: 'price_desc', label: '가격 (높은순)' },
  { value: 'price_asc', label: '가격 (낮은순)' },
  { value: 'productName_asc', label: '상품명 (가나다순)' },
  { value: 'productName_desc', label: '상품명 (가나다역순)' },
];

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [sortValue, setSortValue] = useState('productId_desc'); // 정렬 상태 추가

  // 목록 업데이트를 위해 useEffect 사용 (mockProducts가 외부에서 변경될 경우 대비)
  useEffect(() => {
    setProducts([...mockProducts]);
  }, []);

  const handleOpenModalForCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSubmitProduct = (data: Omit<Product, 'productId' | 'createdAt' | 'modifiedAt'> | Product) => {
    const now = new Date().toISOString();
    if ('productId' in data) { // 수정
      mockProducts = mockProducts.map(p => p.productId === data.productId ? { ...data, modifiedAt: now } : p);
    } else { // 생성
      const newProduct: Product = {
        ...data,
        productId: nextProductId++,
        createdAt: now,
        modifiedAt: now,
      };
      mockProducts = [...mockProducts, newProduct];
    }
    setProducts([...mockProducts]); // 상태 업데이트로 리렌더링
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      mockProducts = mockProducts.filter(p => p.productId !== productId);
      setProducts([...mockProducts]);
    }
  };

  const sortedTableData = useMemo((): ProductTableItem[] => {
    const sorted = [...products];
    if (sortValue === 'productId_desc') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.productId).getTime());
    } else if (sortValue === 'productId_asc') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.productId).getTime());
    } else if (sortValue === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'productName_asc') {
      sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (sortValue === 'productName_desc') {
      sorted.sort((a, b) => b.productName.localeCompare(a.productName));
    }
    return sorted.map(p => ({ ...p, id: p.productId }));
  }, [products, sortValue]);

  const columns: ColumnDefinition<ProductTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index +1, headerClassName: 'w-[5%]' },
    {
      key: 'productImage', header: '이미지', headerClassName: 'w-[10%]',
      cellRenderer: (item) => item.productImage ? <img src={item.productImage} alt={item.productName} className="h-12 w-12 object-cover rounded" /> : 'N/A'
    },
    { key: 'productName', header: '상품명', accessor: 'productName', headerClassName: 'w-[25%]' },
    {
      key: 'price', header: '가격', headerClassName: 'w-[10%]',
      accessor: (item) => `₩${item.price.toLocaleString('ko-KR')}`
    },
    { key: 'quantity', header: '수량', accessor: 'quantity', headerClassName: 'w-[10%]' },
    { key: 'createdAt', header: '등록일', accessor: (item) => formatDate(item.createdAt), headerClassName: 'w-[15%]' },
    { key: 'modifiedAt', header: '수정일', accessor: (item) => formatDate(item.modifiedAt), headerClassName: 'w-[15%]' },
    {
      key: 'actions', header: '관리', headerClassName: 'w-[10%]',
      cellRenderer: (item) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenModalForEdit(item)}>수정</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(item.productId)}>삭제</Button>
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

          <ReusableTable
            columns={columns}
            data={sortedTableData}
            totalCount={sortedTableData.length}
            emptyStateMessage="등록된 상품이 없습니다."
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={productSortOptions}
          />

          <ProductModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitProduct}
            productToEdit={productToEdit}
          />
        </main>
      </div>
    </div>
  );
}