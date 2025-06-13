// import React, { useState, useEffect, useCallback } from 'react';
// import { ChatRoomFilterSection } from '../../components/chat/ChatRoomFilterSection';
// import { getChatRooms } from '../../api/chatRoomApi'; // API 함수 임포트
// import type { ChatRoomMultiResponseDto, Page } from '../../types/chatroom/chatRoomTypes'; // ChatRoomMultiResponseDto로 수정
// import Button from '../../components/ui/Button'; // Button 임포트 (페이지네이션 등)
// import { NewBadge } from '../../components/ui/NewBadge'; // NewBadge 컴포넌트 임포트

// const ChatRoomManagementPage: React.FC = () => {
//   const [chatRooms, setChatRooms] = useState<ChatRoomMultiResponseDto[]>([]); // ChatRoomMultiResponseDto로 수정
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<Omit<Page<any>, 'content'>>({
//     totalPages: 0,
//     totalElements: 0,
//     // pageNumber: 0, // Spring Data JPA는 0-indexed, UI는 1-indexed 가정
//     // size: 10,
//   });
//   const [currentPage, setCurrentPage] = useState(1); // 1-indexed page
//   const [pageSize, setPageSize] = useState(10);

//   // 필터 상태
//   const [conceptFilter, setConceptFilter] = useState('ALL');
//   const [statusFilter, setStatusFilter] = useState('ALL');
//   const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
//   const [roomIdSearch, setRoomIdSearch] = useState('');

//   const fetchChatRooms = useCallback(async (page: number) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // API 호출 시 필터 값 전달 (ALL인 경우 undefined 또는 백엔드에서 ALL로 처리)
//       const filters = {
//         concept: conceptFilter === 'ALL' ? undefined : conceptFilter,
//         status: statusFilter === 'ALL' ? undefined : statusFilter,
//         roomType: roomTypeFilter === 'ALL' ? undefined : roomTypeFilter,
//         roomId: roomIdSearch.trim() === '' ? undefined : roomIdSearch.trim(),
//       };
//       // API는 0-indexed page를 기대할 수 있으므로 page - 1 (getChatRooms API 시그니처에 filters 인자 추가 필요 가정)
//       const data = await getChatRooms(page - 1, pageSize, filters);
//       setChatRooms(data.content);
//       setPagination({
//         totalPages: data.totalPages,
//         totalElements: data.totalElements,
//         // pageNumber: data.pageable?.pageNumber,
//         // size: data.pageable?.pageSize,
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : '채팅방 목록을 불러오는 데 실패했습니다.');
//       setChatRooms([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [conceptFilter, statusFilter, roomTypeFilter, roomIdSearch, pageSize]);

//   useEffect(() => {
//     fetchChatRooms(currentPage);
//   }, [fetchChatRooms, currentPage]);

//   const handleResetFilters = () => {
//     setConceptFilter('ALL');
//     setStatusFilter('ALL');
//     setRoomTypeFilter('ALL');
//     setRoomIdSearch('');
//     setCurrentPage(1); // 필터 초기화 시 첫 페이지로
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   // 간단한 테이블 렌더링 예시
//   const renderChatRoomsTable = () => (
//     <table className="min-w-full divide-y divide-gray-200">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//           {/* themeId를 사용한 컨셉 표시는 ChatRoomUtils의 getChatRoomConceptLabel 사용 */}
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">컨셉/테마명</th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
//           {/* themeName이 ChatRoomMultiResponseDto에 있다면 표시, 없다면 이 컬럼은 컨셉과 병합 또는 제거 */}
//           {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">테마명</th> */}
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
//         </tr>
//       </thead>
//       <tbody className="bg-white divide-y divide-gray-200">
//         {chatRooms.map((room) => (
//           <tr key={room.chatRoomId}>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.chatRoomId}</td>
//             {/* ChatRoomUtils.getChatRoomConceptLabel(room.themeId) 또는 room.themeName 사용 */}
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.themeName || 'N/A'}</td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.roomStatus}</td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.roomType}</td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//               <NewBadge createdAt={room.createdAt} />
//               {new Date(room.createdAt).toLocaleDateString()} {/* 간단한 날짜 표시 */}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">채팅방 관리</h1>
//       <ChatRoomFilterSection
//         conceptFilter={conceptFilter}
//         onConceptFilterChange={setConceptFilter}
//         statusFilter={statusFilter}
//         onStatusFilterChange={setStatusFilter}
//         roomTypeFilter={roomTypeFilter}
//         onRoomTypeFilterChange={setRoomTypeFilter}
//         roomIdSearch={roomIdSearch}
//         onRoomIdSearchChange={setRoomIdSearch}
//         onResetFilters={handleResetFilters}
//       />

//       {isLoading && <p>로딩 중...</p>}
//       {error && <p className="text-red-500">오류: {error}</p>}
//       {!isLoading && !error && chatRooms.length === 0 && <p>표시할 채팅방이 없습니다.</p>}
//       {!isLoading && !error && chatRooms.length > 0 && renderChatRoomsTable()}

//       {/* 간단한 페이지네이션 */}
//       <div className="mt-4 flex justify-center space-x-2">
//         {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNumber => (
//           <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} variant={currentPage === pageNumber ? 'default' : 'outline'}>
//             {pageNumber}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatRoomManagementPage;