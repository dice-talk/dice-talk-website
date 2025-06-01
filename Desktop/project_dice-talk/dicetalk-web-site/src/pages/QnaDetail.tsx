import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/Header';
import { ImageUpload } from '../components/ui/ImageUpload'; // ImageUpload 컴포넌트 임포트

// QnaList.tsx와 동일한 QnaItem 타입 및 mockQnas 데이터를 사용한다고 가정합니다.
// 실제 애플리케이션에서는 이들을 공유 모듈에서 가져오는 것이 좋습니다.
type QuestionStatusType = 'QUESTION_ANSWERED' | 'QUESTION_REGISTERED' | 'UPDATE';

interface QnaItem {
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
const mockQnas: QnaItem[] = [
  {
    questionId: 103,
    title: "비밀번호 변경은 어떻게 하나요? 비밀번호 변경 메뉴를 찾을 수 없습니다. 상세한 안내 부탁드립니다.",
    content: "로그인 후 마이페이지에서 비밀번호를 변경하려고 하는데, 메뉴를 찾을 수가 없습니다. 어디서 변경할 수 있나요?\n\n추가적으로, 비밀번호 찾기 기능도 잘 안되는 것 같아요.",
    authorEmail: "user1@example.com",
    questionStatus: "QUESTION_ANSWERED",
    createdAt: "2025-05-28T10:00:00Z",
    imageUrl: "https://via.placeholder.com/400x200.png?text=Question+Image+103", // 예시 이미지
    answerContent: "안녕하세요, 다이스톡 관리자입니다. 비밀번호 변경은 '마이페이지 > 개인정보 수정' 메뉴에서 가능합니다. 비밀번호 찾기 기능 오류는 현재 수정 작업 진행 중입니다. 이용에 불편을 드려 죄송합니다.",
    answeredBy: "관리자",
    answeredAt: "2025-05-29T14:30:00Z",
    answerImageUrls: ["https://via.placeholder.com/400x200.png?text=Answer+Image+103-1", "https://via.placeholder.com/400x200.png?text=Answer+Image+103-2"], // 예시 답변 이미지 배열
  },
  {
    questionId: 102,
    title: "앱 사용 중 오류가 발생합니다.",
    content: "채팅방에 입장하려고 할 때마다 앱이 강제 종료됩니다. 확인 부탁드립니다. 사용 기기는 갤럭시 S23입니다.",
    authorEmail: "user2@example.com",
    questionStatus: "QUESTION_REGISTERED",
    createdAt: "2025-05-29T11:30:00Z",
    // imageUrl: "https://via.placeholder.com/400x200.png?text=Error+Screenshot" // 사용자가 이미지를 올렸다면
  },
  { questionId: 101, title: "다이스톡 서비스 이용 문의", content: "유료 아이템 구매 시 환불 규정이 궁금합니다. 자세한 내용을 알려주세요.", authorEmail: "user3@example.com", questionStatus: "UPDATE", createdAt: "2025-05-30T14:15:00Z" },
  { questionId: 104, title: "친구 추가 기능이 궁금합니다. 자세히 알려주세요.", content: "친구의 아이디를 알고 있는데, 어떻게 추가해야 하나요? 친구 추가 버튼을 못 찾겠습니다.", authorEmail: "user4@example.com", questionStatus: "QUESTION_ANSWERED", createdAt: "2025-05-27T09:00:00Z", answerContent: "친구 추가는 메인 화면 우측 상단의 친구 아이콘을 클릭 후, ID로 검색하여 추가할 수 있습니다.", answeredBy: "관리자", answeredAt: "2025-05-27T18:00:00Z", answerImageUrls: [] },
  { questionId: 105, title: "프로필 사진 변경 문의", content: "프로필 사진을 변경하고 싶은데 방법을 모르겠습니다. 알려주세요.", authorEmail: "user5@example.com", questionStatus: "QUESTION_REGISTERED", createdAt: yesterday.toISOString() },
];

const formatDate = (dateString: string) => {
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
      // 실제로는 answerImageFiles 배열의 각 파일을 서버에 업로드하고 URL 배열을 받아와야 합니다.
      // 여기서는 임시로 File 객체가 있다면 placeholder URL 배열을 생성합니다.
      const newAnswerImageUrls = answerImageFiles.length > 0
        ? answerImageFiles.map((file, index) => `https://via.placeholder.com/400x200.png?text=New+Answer+Image+${index + 1}`)
        : qnaItem.answerImageUrls || []; // 기존 이미지 유지 또는 빈 배열
        // 사용자가 기존 이미지를 모두 제거했다면 answerImageFiles는 비어있고, 
        // ImageUpload 컴포넌트에서 existingImageUrls를 참조하여 previews를 관리하므로,
        // 이 부분은 서버와 통신하여 실제 URL 목록을 업데이트하는 로직이 필요합니다.

      const updatedQnaItem = {
        ...qnaItem,
        answerContent: answer,
        answeredBy: '관리자', // 실제로는 로그인된 관리자 정보 사용
        answeredAt: new Date().toISOString(),
        questionStatus: 'QUESTION_ANSWERED' as QuestionStatusType,
        answerImageUrls: newAnswerImageUrls,
      };
      setQnaItem(updatedQnaItem);
      // mockQnas 배열 자체도 업데이트 필요 (목록 새로고침 시 반영되도록)
      alert('답변이 저장되었습니다.');
      // 답변 저장 후 이미지 파일 상태 초기화
      setAnswerImageFiles([]); 
    }
  };

  const handleCancel = () => {
    // setAnswer(''); // 답변만 초기화하거나
    navigate(-1); // 이전 페이지(목록)로 이동
  };

  const handleAnswerImageChange = (files: File[]) => {
    setAnswerImageFiles(files);
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
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{qnaItem.title}</h2>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>작성자: {qnaItem.authorEmail}</span>
                  <span>등록일: {formatDate(qnaItem.createdAt)}</span>
                </div>
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
              {qnaItem.answerContent && !isAdmin ? ( // 답변이 있고, 관리자가 아닐 때 (일반 사용자)
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
                  </div>
              ) : isAdmin ? ( // 관리자일 때 (답변이 있든 없든 입력/수정 폼)
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{qnaItem.answerContent ? '답변 수정' : '답변 작성'}</h3>
                  {qnaItem.answerContent && qnaItem.answeredBy && qnaItem.answeredAt && (
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
                      existingImageUrls={qnaItem.answerImageUrls || []}
                      maxFiles={5}
                      label="답변 이미지 첨부 (선택 사항)" />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={handleCancel}>목록으로</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>{qnaItem.answerContent ? '답변 수정' : '답변 저장'}</Button>
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
