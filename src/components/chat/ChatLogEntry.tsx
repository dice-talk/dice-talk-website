import type { ChatResponseDto } from '../../types/chatroom/chatTypes';
import { formatDateTime } from '../../lib/DataUtils';

interface ChatLogEntryProps {
  chat: ChatResponseDto;
  isHighlighted?: boolean;
}

export default function ChatLogEntry({ chat, isHighlighted }: ChatLogEntryProps) {
  return (
    <div 
      className={`p-3 rounded-md border ${isHighlighted ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50 border-gray-200'}`}
    >
      <div className="mb-1 text-xs text-gray-600">
        <span>채팅ID: {chat.chatId}</span>
        <span className="ml-2">발신자: {chat.nickname} (회원ID: {chat.memberId})</span>
      </div>
      <div className="flex justify-between items-start">
        <p className="text-gray-800 whitespace-pre-wrap break-words mr-4 flex-grow">
          {chat.message}
        </p>
        <p className="text-xs text-gray-500 whitespace-nowrap mt-1">
          {formatDateTime(chat.createdAt)}
        </p>
      </div>
    </div>
  );
}
