// src/pages/chat/ChatRoomDetailPage.tsx
import { useState, useEffect, useCallback, useRef, createRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { Pagination } from '../../components/common/Pagination'; // Pagination 컴포넌트 임포트
import { Input } from '../../components/ui/Input';
import type { ChatResponseDto } from '../../types/chatroom/chatTypes'; // ChatRoomSingleResponseDto 추가 (실제 경로에 맞게 수정 필요)
import type { ChatRoomSingleResponseDto } from '../../types/chatroom/chatRoomTypes'; // 실제 API 응답 타입
import ChatLogEntry from '../../components/chat/ChatLogEntry'; // 새로 만든 컴포넌트 임포트
import { getChatRoom }  from '../../api/chatRoomApi'; // Assuming ChatRoomSingleResponseDto is defined elsewhere or implicitly by getChatRoom
import { formatDateTime } from '../../lib/DataUtils';

import type { PageInfo } from '../../types/common'; // PageInfo 타입 임포트

export default function ChatRoomDetailPage() {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [rawChatMessages, setRawChatMessages] = useState<ChatResponseDto[]>([]); // 원본 메시지 목록
  const [sortedChatMessages, setSortedChatMessages] = useState<ChatResponseDto[]>([]); // 정렬된 메시지 목록
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // 'desc' for 최신순, 'asc' for 오래된순
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null); // 페이지 정보 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 한 페이지에 보여줄 채팅 메시지 수

  const [searchChatId, setSearchChatId] = useState('');
  const [foundMessage, setFoundMessage] = useState<ChatResponseDto | null | undefined>(undefined); // undefined: not searched, null: not found

  const [isSearchingGlobally, setIsSearchingGlobally] = useState(false); // 페이지 간 검색 중 상태
  const chatLogEntryRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  const fetchChatRoomDetails = useCallback(async (pageToFetch: number) => {
    if (!chatRoomId) return;
    setIsLoading(true);
    setError(null);
    // 검색 결과는 페이지 변경 시 초기화하지 않음 (전체 로드된 메시지에서 검색 유지)
    // setFoundMessage(undefined); 
    try {
      // getChatRoom은 ChatRoomSingleResponseDto를 반환하며,
      // 콘솔 로그에 따르면 getChatRoom은 { data: ChatRoomSingleResponseDto_payload } 형태의 객체를 반환합니다.
      // getChatRoom의 선언된 반환 타입은 Promise<ChatRoomSingleResponseDto>이므로, rawApiResult는 ChatRoomSingleResponseDto로 타입 추론됩니다.
      const rawApiResult = await getChatRoom(Number(chatRoomId), pageToFetch, itemsPerPage);
      
      // apiCallResult의 'data' 속성 내부에 ChatRoomSingleResponseDto 페이로드가 있다고 가정합니다.
      // 실제 반환되는 구조 { data: ChatRoomSingleResponseDto } 에 맞게 타입 단언합니다.
      const responseWrapper = rawApiResult as unknown as { data: ChatRoomSingleResponseDto };
      const actualData: ChatRoomSingleResponseDto = responseWrapper.data;

      // 서버 응답의 Page<ChatDto.Response> 구조에 맞게 수정
      // response.chats는 Page 객체이므로, content로 메시지 배열에 접근하고,
      // pageInfo는 Page 객체의 속성들을 사용하여 구성합니다.
      const newMessages = actualData?.chats?.content || []; // actualData에서 chats 접근
      const newPageInfo = actualData?.chats ? { // actualData에서 chats 접근
        page: actualData.chats.number + 1, // Spring Page는 0-indexed, 프론트는 1-indexed 사용 가정
        size: actualData.chats.size,
        totalElements: actualData.chats.totalElements,
        totalPages: actualData.chats.totalPages,
      } : null;

      // 페이지네이션에서는 현재 페이지의 데이터만 설정
      setRawChatMessages([...newMessages]);
      setPageInfo(newPageInfo); // 페이지 정보 업데이트

      if (newPageInfo) {
        // setHasMore(newPageInfo.page < newPageInfo.totalPages); // hasMore는 더 이상 사용 안 함
      } else {
        // setHasMore(false);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '채팅방 상세 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [chatRoomId, itemsPerPage]); // currentPage는 useEffect에서 관리

  // rawChatMessages 또는 sortOrder가 변경될 때 sortedChatMessages 업데이트
  useEffect(() => {
    const messagesToSort = [...rawChatMessages];
    if (sortOrder === 'asc') { // 오래된순
      messagesToSort.sort((a, b) => a.chatId - b.chatId);
    } else { // 최신순 (desc)
      messagesToSort.sort((a, b) => b.chatId - a.chatId);
    }
    setSortedChatMessages(messagesToSort);
    // 메시지가 업데이트될 때 ref 배열도 업데이트 (길이에 맞게)
    chatLogEntryRefs.current = messagesToSort.map(
      (_, i) => chatLogEntryRefs.current[i] || createRef<HTMLDivElement>()
    );

  }, [rawChatMessages, sortOrder]);

  useEffect(() => {
    fetchChatRoomDetails(currentPage);
  }, [chatRoomId, currentPage, fetchChatRoomDetails]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFoundMessage(undefined); // 페이지 변경 시 검색 결과 초기화
  };

  // 특정 chatId를 포함하는 페이지를 찾는 함수
  const findPageOfChatId = async (chatIdToFind: number): Promise<{ page: number; message: ChatResponseDto | null }> => {
    if (!pageInfo || pageInfo.totalPages === 0) return { page: -1, message: null };

    for (let i = 1; i <= pageInfo.totalPages; i++) {
      try {
        const rawApiResponse = await getChatRoom(Number(chatRoomId), i, itemsPerPage);
        const responseWrapper = rawApiResponse as unknown as { data: ChatRoomSingleResponseDto };
        const actualData = responseWrapper.data;
        const message = actualData?.chats?.content?.find(chat => chat.chatId === chatIdToFind);
        if (message) {
          return { page: i, message };
        }
      } catch (error) {
        console.error(`Error fetching page ${i} while searching for chatId ${chatIdToFind}:`, error);
        // 에러 발생 시 해당 페이지는 건너뛰거나, 검색 중단 처리 가능
      }
    }
    return { page: -1, message: null }; // 모든 페이지에서 못 찾음
  };

  const handleSearchChatById = async () => {
    if (!searchChatId) {
      setFoundMessage(undefined);
      return;
    }
    const idToSearch = parseInt(searchChatId, 10);
    setIsSearchingGlobally(true);
    setFoundMessage(undefined); // 이전 검색 결과 초기화

    // 1. 현재 페이지에서 먼저 검색
    const messageOnCurrentPage = sortedChatMessages.find(msg => msg.chatId === idToSearch);
    if (messageOnCurrentPage) {
      setFoundMessage(messageOnCurrentPage);
      setIsSearchingGlobally(false);
      // 스크롤은 useEffect에서 처리
      return;
    }

    // 2. 다른 페이지에서 검색 (pageInfo가 있을 경우)
    if (pageInfo && pageInfo.totalPages > 0) {
      const result = await findPageOfChatId(idToSearch);
      if (result.page !== -1 && result.message) {
        setCurrentPage(result.page); // 해당 페이지로 이동 (데이터는 useEffect로 다시 불러옴)
        // foundMessage는 해당 페이지 데이터 로드 후 설정되도록 하거나, 여기서 임시 설정 후 useEffect에서 재확인
        setFoundMessage(result.message); // 검색된 메시지 객체 설정
      } else {
        setFoundMessage(null); // 모든 페이지에서 못 찾음
      }
    } else {
      setFoundMessage(null); // 페이지 정보가 없으면 현재 페이지만 검색한 것으로 간주
    }
    setIsSearchingGlobally(false);
  };

  // 검색된 메시지로 스크롤하는 useEffect
  useEffect(() => {
    if (foundMessage) {
      const index = sortedChatMessages.findIndex(chat => chat.chatId === foundMessage.chatId);
      if (index !== -1 && chatLogEntryRefs.current[index]?.current) {
        chatLogEntryRefs.current[index].current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // 'start', 'center', 'end', or 'nearest'
        });
      }
    }
  }, [foundMessage, sortedChatMessages, currentPage]); // currentPage도 의존성에 추가 (페이지 이동 후 스크롤 위함)
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">채팅방 상세 조회 (ID: {chatRoomId})</h2>
            <Button variant="outline" onClick={() => navigate('/chatrooms')} className="border border-gray-300 hover:border-gray-400">
              목록으로
            </Button>
          </div>
          {isSearchingGlobally && <p className="text-center py-2 text-blue-500">다른 페이지에서 채팅 ID를 검색 중입니다...</p>}

          <div className="mb-6 p-4 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">채팅 ID로 검색</h3>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="채팅 ID 입력"
                value={searchChatId}
                onChange={(e) => setSearchChatId(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={handleSearchChatById}>검색</Button>
            </div>
            {foundMessage === undefined ? null : foundMessage ? (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="font-semibold text-green-700">검색된 메시지:</p>
                <p><strong>ID:</strong> {foundMessage.chatId}, <strong>발신자:</strong> {foundMessage.nickname} (ID: {foundMessage.memberId})</p>
                <p><strong>내용:</strong> {foundMessage.message}</p>
                <p><strong>시간:</strong> {formatDateTime(foundMessage.createdAt)}</p>
              </div>
            ) : (
              <p className="mt-3 text-red-500">해당 ID의 메시지를 현재 페이지에서 찾을 수 없습니다.</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">채팅 로그</h3>
            <div className="space-x-2">
              <Button 
                variant={sortOrder === 'desc' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSortOrder('desc')}
              >
                최신순
              </Button>
              <Button 
                variant={sortOrder === 'asc' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSortOrder('asc')}
              >
                오래된순
              </Button>
            </div>
          </div>
          {isLoading && <p className="text-center py-4">채팅 로그를 불러오는 중...</p>}
          {error && <p className="text-center py-4 text-red-500">오류: {error}</p>}
          {!isLoading && !error && sortedChatMessages.length === 0 && ( // sortedChatMessages로 변경
            <p className="text-center py-4">표시할 채팅 메시지가 없습니다.</p>
          )}

          {!isLoading && !error && sortedChatMessages.length > 0 && ( // sortedChatMessages로 변경
            <div className="space-y-3 bg-white p-4 shadow rounded-lg">
              {sortedChatMessages.map((chat, index) => ( // sortedChatMessages로 변경
                <div key={chat.chatId} ref={chatLogEntryRefs.current[index]}>
                  <ChatLogEntry 
                    chat={chat} 
                    isHighlighted={chat.chatId === foundMessage?.chatId} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 UI */}
          {pageInfo && pageInfo.totalPages > 1 && !isLoading && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={pageInfo.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
