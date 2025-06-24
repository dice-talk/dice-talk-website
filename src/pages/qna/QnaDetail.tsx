import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { ImageUpload } from '../../components/ui/ImageUpload';

// QnaList.tsx와 동일한 QnaItem 타입 및 mockQnas 데이터를 사용한다고 가정합니다.
// 실제 애플리케이션에서는 이들을 공유 모듈에서 가져오는 것이 좋습니다.
export type QuestionStatusType = 'QUESTION_ANSWERED' | 'QUESTION_REGISTERED' | 'QUESTION_UPDATED'; // UPDATE -> QUESTION_UPDATED

export interface QnaItem {
  questionId: number;
  title: string;
  content: string;
  authorEmail: string;
  questionStatus: QuestionStatusType;
  createdAt: string;
  imageUrl?: string; // 이미지 URL 필드 (선택적)
  answerContent?: string; // 답변 내용
  answeredBy?: string; // 답변자 (예: '관리자')
  answeredAt?: string; // 답변 등록일
  answerImageUrls?: string[]; // 답변 이미지 URL 배열
}

// QnaList.tsx의 mockQnas 데이터 (실제로는 import 해야 함)
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
export const mockQnas: QnaItem[] = [
  { questionId: 105, title: "프로필 사진 변경 문의", content: "프로필 사진을 변경하고 싶은데 방법을 모르겠습니다. 알려주세요.", authorEmail: "user5@example.com", questionStatus: "QUESTION_REGISTERED", createdAt: yesterday.toISOString() },
  { questionId: 104, title: "친구 추가 기능이 궁금합니다. 자세히 알려주세요.", content: "친구의 아이디를 알고 있는데, 어떻게 추가해야 하나요? 친구 추가 버튼을 못 찾겠습니다.", authorEmail: "user4@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2025-05-31T19:00:00Z", answerContent: "친구 추가는 메인 화면 우측 상단의 친구 아이콘을 클릭 후, ID로 검색하여 추가할 수 있습니다.", answeredBy: "관리자", answeredAt: "2025-05-31T18:00:00Z", answerImageUrls: [] },
  {
    questionId: 103,
    title: "다이스톡 서비스 이용 문의",
    content: "유료 아이템 구매 시 환불 규정이 궁금합니다. 자세한 내용을 알려주세요.",
    authorEmail: "user3@example.com",
    questionStatus: "QUESTION_UPDATED",
    createdAt: "2025-05-30T14:15:00Z"
  },
  {
    questionId: 102, // 답변 추가
    title: "앱 사용 중 오류가 발생합니다.",
    content: "채팅방에 입장하려고 할 때마다 앱이 강제 종료됩니다. 확인 부탁드립니다. 사용 기기는 갤럭시 S23입니다.",
    authorEmail: "user2@example.com",
    questionStatus: "QUESTION_ANSWERED",
    createdAt: "2025-05-29T11:30:00Z",
    answerContent: "안녕하세요. 해당 오류는 최신 버전(v1.2.1)에서 수정되었습니다. 앱 업데이트 후 다시 시도해 주시기 바랍니다. 불편을 드려 죄송합니다.",
    answeredBy: "기술지원팀",
    answeredAt: "2025-05-29T17:00:00Z",
    answerImageUrls: ["https://via.placeholder.com/300x150.png?text=ErrorFixGuide"]
  },
  {
    questionId: 101, // 답변 추가
    title: "비밀번호 변경은 어떻게 하나요? 비밀번호 변경 메뉴를 찾을 수 없습니다. 상세한 안내 부탁드립니다.",
    content: "로그인 후 마이페이지에서 비밀번호를 변경하려고 하는데, 메뉴를 찾을 수가 없습니다. 어디서 변경할 수 있나요?\n\n추가적으로, 비밀번호 찾기 기능도 잘 안되는 것 같아요.",
    authorEmail: "user1@example.com",
    questionStatus: "QUESTION_ANSWERED",
    createdAt: "2025-05-29T11:30:00Z",
    imageUrl: "https://via.placeholder.com/400x200.png?text=Question+Image+103", // 예시 이미지
    answerContent: "안녕하세요, 다이스톡 관리자입니다. 비밀번호 변경은 '마이페이지 > 개인정보 수정' 메뉴에서 가능합니다. 비밀번호 찾기 기능 오류는 현재 수정 작업 진행 중입니다. 이용에 불편을 드려 죄송합니다.",
    answeredBy: "관리자",
    answeredAt: "2025-05-29T14:30:00Z",
    answerImageUrls: ["https://via.placeholder.com/400x200.png?text=Answer+Image+103-1", "https://via.placeholder.com/400x200.png?text=Answer+Image+103-2"], // 예시 답변 이미지 배열
  },
];

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export default function QnaDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [qnaItem, setQnaItem] = useState<QnaItem | null>(null);
  const [answerImageFiles, setAnswerImageFiles] = useState<File[]>([]); // 여러 File 객체
  const [removedAnswerImageUrls, setRemovedAnswerImageUrls] = useState<string[]>([]);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false); // 답변 수정 모드 상태
  
  // 실제 애플리케이션에서는 useUserStore 등에서 관리자 여부를 가져와야 합니다.
  const isAdmin = true; // 관리자라고 가정

  useEffect(() => {
    if (questionId) {
      const itemId = parseInt(questionId, 10);
      const foundItem = mockQnas.find(q => q.questionId === itemId);
      if (foundItem) {
        setQnaItem(foundItem);
        if (foundItem.answerContent) { // 기존 답변이 있으면 textarea에 설정
          setAnswer(foundItem.answerContent);
          setIsEditingAnswer(false); // 상세 페이지 진입 시 수정 모드 해제
          // 기존 답변 이미지는 ImageUpload 컴포넌트의 existingImageUrl prop으로 전달
        }
      } else {
        // 항목을 찾지 못한 경우, 예를 들어 404 페이지로 리디렉션하거나 메시지 표시
        console.error("QnA 항목을 찾을 수 없습니다.");
        // navigate('/404'); // 예시
      }
    }
  }, [questionId, navigate]);

  const handleSave = () => {
    // TODO: 답변 저장 API 연결
    if (qnaItem && answer.trim() !== '') {
      const uploadedImageUrls = answerImageFiles.length > 0
        ? answerImageFiles.map((_file, index) => `https://via.placeholder.com/400x200.png?text=New+Answer+Image+${index + 1}`)
        : []; 
      
      const finalImageUrls = [...(qnaItem.answerImageUrls || []).filter(url => !removedAnswerImageUrls.includes(url)), ...uploadedImageUrls];

      const updatedQnaItem = {
        ...qnaItem,
        answerContent: answer,
        answeredBy: '관리자', // 실제로는 로그인된 관리자 정보 사용
        answeredAt: new Date().toISOString(),
        questionStatus: 'QUESTION_ANSWERED' as QuestionStatusType,
        answerImageUrls: finalImageUrls,
      };
      setQnaItem(updatedQnaItem);
      // mockQnas 배열 자체도 업데이트 필요 (목록 새로고침 시 반영되도록)
      alert('답변이 저장되었습니다.');
      // 답변 저장 후 이미지 파일 상태 초기화
      setAnswerImageFiles([]); 
      setRemovedAnswerImageUrls([]);
      setIsEditingAnswer(false); // 수정 모드 해제
    }
  };

  const handleListButton = () => {
    // setAnswer(''); // 답변만 초기화하거나
    navigate(-1); // 이전 페이지(목록)로 이동
  };

  const handleEditAnswer = () => {
    setIsEditingAnswer(true);
    // 수정 시작 시, 현재 qnaItem의 답변 내용과 이미지로 상태 초기화
    if (qnaItem) {
      setAnswer(qnaItem.answerContent || '');
      // ImageUpload 컴포넌트가 existingImageUrls를 통해 기존 이미지를 표시하므로
      // answerImageFiles와 removedAnswerImageUrls는 초기화
      setAnswerImageFiles([]);
      setRemovedAnswerImageUrls([]);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAnswer(false);
    // 수정 취소 시, 원래 답변 내용으로 복원 (qnaItem이 변경되지 않았다는 가정)
    if (qnaItem) {
      setAnswer(qnaItem.answerContent || '');
    }
  }

  const handleDeleteAnswer = () => {
    if (window.confirm('답변을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // TODO: 답변 삭제 API 연결
      if (qnaItem) {
        setQnaItem({ ...qnaItem, answerContent: undefined, answeredBy: undefined, answeredAt: undefined, answerImageUrls: [], questionStatus: 'QUESTION_REGISTERED' });
        setAnswer(''); // 답변 폼 초기화
        setIsEditingAnswer(false); // 수정 모드였다면 해제
        alert('답변이 삭제되었습니다.');
      }
    }
  }

  const handleAnswerImageChange = (files: File[], removedUrls: string[]) => {
    setAnswerImageFiles(files);
    setRemovedAnswerImageUrls(removedUrls);
  }

  if (!qnaItem) {
    return <div className="min-h-screen flex justify-center items-center bg-slate-50"><p>QnA 항목을 불러오는 중이거나 찾을 수 없습니다...</p></div>;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
        <Sidebar />
         <div className="flex-1 flex flex-col">
          <Header />
           <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-8">
            {/* 질문 섹션 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center"> {/* 제목과 등록일. 하단 마진은 아래 작성자 div에서 처리 */}
                <h2 className="text-2xl font-bold text-gray-800">{qnaItem.title}</h2>
                <span className="text-sm text-gray-500">등록일: {formatDate(qnaItem.createdAt)}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1 mb-4"> {/* 작성자 정보. mt-1로 위와의 간격, mb-4로 아래 내용과의 간격 */}
                <span>작성자: {qnaItem.authorEmail}</span>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                {qnaItem.content}
              </div>
              {qnaItem.imageUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">첨부 이미지</h3>
                  <img src={qnaItem.imageUrl} alt="Question attachment" className="rounded-md border max-w-md max-h-80 object-contain" />
                </div>
              )}
            </div>

            {/* 답변 섹션 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              {qnaItem.answerContent && !isEditingAnswer && isAdmin ? ( // 관리자이고, 답변이 있고, 수정 모드가 아닐 때 (답변 조회)
                 <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">답변 내용</h3>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEditAnswer}>수정</Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={handleDeleteAnswer}>삭제</Button>
                      </div>
                    </div>
                    {qnaItem.answeredBy && qnaItem.answeredAt && (
                      <div className="text-xs text-gray-500 mb-3">
                        <span>답변자: {qnaItem.answeredBy}</span> | <span>답변일: {formatDate(qnaItem.answeredAt)}</span>
                      </div>
                    )}
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-gray-700 whitespace-pre-wrap">
                      {qnaItem.answerContent}
                    </div>
                    {qnaItem.answerImageUrls && qnaItem.answerImageUrls.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">첨부된 답변 이미지</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {qnaItem.answerImageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Answer attachment ${index + 1}`} className="rounded-md border aspect-square object-cover w-full h-full" />
                          ))}
                        </div>
                      </div>
                    )} {/* 이 닫는 괄호가 중복되어 보입니다. 아래의 "목록으로" 버튼을 포함하도록 수정합니다. */}
                    <div className="flex justify-end mt-6">
                        <Button variant="outline" onClick={handleListButton}>목록으로</Button>
                    </div>
                  </div>
              ) : qnaItem.answerContent && !isAdmin ? ( // 일반 사용자이고, 답변이 있을 때 (답변 조회 - 수정/삭제 버튼 없음)
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">답변 내용</h3>
                  {qnaItem.answeredBy && qnaItem.answeredAt && (
                    <div className="text-xs text-gray-500 mb-3">
                      <span>답변자: {qnaItem.answeredBy}</span> | <span>답변일: {formatDate(qnaItem.answeredAt)}</span>
                    </div>
                  )}
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-gray-700 whitespace-pre-wrap">
                    {qnaItem.answerContent}
                  </div>
                  {qnaItem.answerImageUrls && qnaItem.answerImageUrls.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">첨부된 답변 이미지</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {qnaItem.answerImageUrls.map((url, index) => (
                          <img key={index} src={url} alt={`Answer attachment ${index + 1}`} className="rounded-md border aspect-square object-cover w-full h-full" />
                        ))}
                      </div>
                    </div>
                    )}
                    <div className="flex justify-end mt-6">
                        <Button variant="outline" onClick={handleListButton}>목록으로</Button>
                    </div>
                </div>
              ) : isAdmin && (!qnaItem.answerContent || isEditingAnswer) ? ( // 관리자이고, 답변이 없거나, 수정 모드일 때 (답변 작성/수정 폼)
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{isEditingAnswer ? '답변 수정' : '답변 작성'}</h3>
                  {isEditingAnswer && qnaItem.answeredBy && qnaItem.answeredAt && ( // 수정 모드일 때만 기존 답변자/날짜 표시
                     <div className="text-xs text-gray-500 mb-3">
                        기존 답변자: {qnaItem.answeredBy} | 기존 답변일: {formatDate(qnaItem.answeredAt)}
                      </div>
                  )}
                  <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full min-h-[150px] border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="답변을 입력하세요..."
                  />
                  <div className="mt-4">
                    <ImageUpload 
                      onImagesChange={handleAnswerImageChange} 
                      existingImageUrls={
                        isEditingAnswer 
                          ? (qnaItem.answerImageUrls || []).map((url, index) => ({ url, isThumbnail: index === 0 })) 
                          : []
                      }
                      maxFiles={5}
                      label="답변 이미지 첨부 (선택 사항)" />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={handleListButton}>목록으로</Button>
                      {isEditingAnswer && <Button variant="outline" onClick={handleCancelEdit}>취소</Button>}
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
                        {isEditingAnswer ? '답변 수정 완료' : '답변 저장'}
                      </Button>
                  </div>
                </div>
              ) : ( // 답변이 없고, 관리자가 아닐 때
                <p className="text-gray-600">아직 답변이 등록되지 않았습니다. 관리자가 확인 후 답변을 드릴 예정입니다.</p>
              )}
            </div>
        </main>
      </div>
    </div>
  );
}
