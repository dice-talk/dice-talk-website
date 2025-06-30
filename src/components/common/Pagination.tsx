interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages < 1) {
    return null;
  }

  const pageNumbers = [];
  const maxPageButtons = 5; // 한 번에 보여줄 최대 페이지 버튼 수
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 mb-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1 border rounded-md bg-white text-xs sm:text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &laquo; {/* 첫 페이지로 이동 */}
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1 border rounded-md bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        이전
      </button>
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm bg-white text-gray-700 hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm
            ${
              currentPage === number
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          {number}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-2 sm:px-3 py-1 border rounded-md text-xs sm:text-sm bg-white text-gray-700 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1 border rounded-md bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        다음
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1 border rounded-md bg-white text-xs sm:text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &raquo; {/* 마지막 페이지로 이동 */}
      </button>
    </div>
  );
};