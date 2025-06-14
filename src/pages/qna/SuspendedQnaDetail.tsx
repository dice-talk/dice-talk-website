// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Button from '../../components/ui/Button';
// import Sidebar from '../../components/sidebar/Sidebar'; // 관리자용 페이지로 가정
// import Header from '../../components/Header';
// import { ImageUpload } from '../../components/ui/ImageUpload';
// // QnaDetail에서 export된 타입과 데이터를 사용
// import { type QnaItem, type QuestionStatusType, formatDate } from '../qna/QnaDetail';

// export default function SuspendedQnaDetailPage() {
//   const { questionId } = useParams<{ questionId: string }>();
//   const navigate = useNavigate();
//   const [answer, setAnswer] = useState('');
//   const [qnaItem, setQnaItem] = useState<QnaItem | null>(null);
//   const [answerImageFiles, setAnswerImageFiles] = useState<File[]>([]);
//   const [removedAnswerImageUrls, setRemovedAnswerImageUrls] = useState<string[]>([]);
//   const [isEditingAnswer, setIsEditingAnswer] = useState(false);

//   // 정지된 회원 QnA 상세는 관리자가 주로 볼 것이므로 isAdmin은 true로 가정
//   const isAdmin = true;

//   useEffect(() => {
//     if (questionId) {
//       const itemId = parseInt(questionId, 10);
//       // mockQnas에서 해당 ID의 QnA를 찾음 (실제로는 API 호출)
//       const foundItem = mockQnas.find(q => q.questionId === itemId);
//       if (foundItem) {
//         setQnaItem(foundItem);
//         if (foundItem.answerContent) {
//           setAnswer(foundItem.answerContent);
//           setIsEditingAnswer(false);
//         } else {
//           setAnswer('');
//         }
//       } else {
//         console.error("정지된 회원 QnA 항목을 찾을 수 없습니다.");
//         // navigate('/suspended-qna'); // 목록으로 리디렉션 또는 404
//       }
//     }
//   }, [questionId, navigate]);

//   const handleSave = () => {
//     if (qnaItem && (answer.trim() !== '' || answerImageFiles.length > 0 || removedAnswerImageUrls.length > 0)) {
//       const uploadedImageUrls = answerImageFiles.length > 0
//         ? answerImageFiles.map((_file, index) => `https://via.placeholder.com/400x200.png?text=New+Suspended+Answer+Image+${index + 1}`)
//         : [];

//       const finalImageUrls = [...(qnaItem.answerImageUrls || []).filter(url => !removedAnswerImageUrls.includes(url)), ...uploadedImageUrls];

//       const updatedQnaItem = {
//         ...qnaItem,
//         answerContent: answer.trim() === '' ? undefined : answer,
//         answeredBy: '관리자',
//         answeredAt: new Date().toISOString(),
//         questionStatus: 'QUESTION_ANSWERED' as QuestionStatusType,
//         answerImageUrls: finalImageUrls,
//       };
//       setQnaItem(updatedQnaItem);

//       // TODO: API를 통해 mockQnas 업데이트 또는 실제 DB 업데이트
//       alert('답변이 저장되었습니다. 작성자 이메일로 알림이 발송됩니다 (구현 예정).');
//       setAnswerImageFiles([]);
//       setRemovedAnswerImageUrls([]);
//       setIsEditingAnswer(false);
//     } else if (qnaItem && answer.trim() === '' && answerImageFiles.length === 0 && (qnaItem.answerImageUrls || []).filter(url => !removedAnswerImageUrls.includes(url)).length === 0) {
//       alert('저장할 답변 내용이나 이미지가 없습니다.');
//     }
//   };

//   const handleListButton = () => {
//     navigate('/suspended-qna'); // 정지된 회원 QnA 목록으로 이동
//   };

//   const handleEditAnswer = () => {
//     setIsEditingAnswer(true);
//     if (qnaItem) {
//       setAnswer(qnaItem.answerContent || '');
//       setAnswerImageFiles([]);
//       setRemovedAnswerImageUrls([]);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditingAnswer(false);
//     if (qnaItem) {
//       setAnswer(qnaItem.answerContent || '');
//     }
//   }

//   const handleDeleteAnswer = () => {
//     if (window.confirm('답변을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
//       if (qnaItem) {
//         const updatedQnaItem = {
//             ...qnaItem,
//             answerContent: undefined,
//             answeredBy: undefined,
//             answeredAt: undefined,
//             answerImageUrls: [],
//             questionStatus: 'QUESTION_REGISTERED' as QuestionStatusType
//         };
//         setQnaItem(updatedQnaItem);
//         setAnswer('');
//         setIsEditingAnswer(false);
//         alert('답변이 삭제되었습니다.');
//       }
//     }
//   }

//   const handleAnswerImageChange = (files: File[], removedUrls: string[]) => {
//     setAnswerImageFiles(files);
//     setRemovedAnswerImageUrls(removedUrls);
//   }

//   if (!qnaItem) {
//     return <div className="min-h-screen flex justify-center items-center bg-slate-50"><p>QnA 항목을 불러오는 중이거나 찾을 수 없습니다...</p></div>;
//   }

//   return (
//     <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
//         <Sidebar />
//          <div className="flex-1 flex flex-col">
//           <Header />
//            <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-8">
//             {/* 질문 섹션 */}
//             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold text-gray-800">{qnaItem.title}</h2>
//                 <span className="text-sm text-gray-500">등록일: {formatDate(qnaItem.createdAt)}</span>
//               </div>
//               <div className="text-sm text-gray-500 mt-1 mb-4">
//                 <span>작성자 이메일: {qnaItem.authorEmail}</span> {/* 정지된 회원의 이메일 표시 */}
//               </div>
//               <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
//                 {qnaItem.content}
//               </div>
//               {qnaItem.imageUrl && (
//                 <div className="mt-4">
//                   <h3 className="text-sm font-semibold text-gray-600 mb-2">첨부 이미지</h3>
//                   <img src={qnaItem.imageUrl} alt="Question attachment" className="rounded-md border max-w-md max-h-80 object-contain" />
//                 </div>
//               )}
//             </div>

//             {/* 답변 섹션 */}
//             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//               {qnaItem.answerContent && !isEditingAnswer && isAdmin ? (
//                  <div>
//                     <div className="flex justify-between items-center mb-3">
//                       <h3 className="text-xl font-semibold text-gray-800">답변 내용</h3>
//                       <div className="space-x-2">
//                         <Button variant="outline" size="sm" onClick={handleEditAnswer}>수정</Button>
//                         <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={handleDeleteAnswer}>삭제</Button>
//                       </div>
//                     </div>
//                     {qnaItem.answeredBy && qnaItem.answeredAt && (
//                       <div className="text-xs text-gray-500 mb-3">
//                         <span>답변자: {qnaItem.answeredBy}</span> | <span>답변일: {formatDate(qnaItem.answeredAt)}</span>
//                       </div>
//                     )}
//                     <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-gray-700 whitespace-pre-wrap">
//                       {qnaItem.answerContent}
//                     </div>
//                     {qnaItem.answerImageUrls && qnaItem.answerImageUrls.length > 0 && (
//                       <div className="mt-4">
//                         <h4 className="text-sm font-semibold text-gray-600 mb-2">첨부된 답변 이미지</h4>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//                           {qnaItem.answerImageUrls.map((url, index) => (
//                             <img key={index} src={url} alt={`Answer attachment ${index + 1}`} className="rounded-md border aspect-square object-cover w-full h-full" />
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <div className="flex justify-end mt-6">
//                         <Button variant="outline" onClick={handleListButton}>목록으로</Button>
//                     </div>
//                   </div>
//               ) : isAdmin && (!qnaItem.answerContent || isEditingAnswer) ? (
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4">{isEditingAnswer ? '답변 수정' : '답변 작성'}</h3>
//                   {isEditingAnswer && qnaItem.answeredBy && qnaItem.answeredAt && (
//                      <div className="text-xs text-gray-500 mb-3">
//                         기존 답변자: {qnaItem.answeredBy} | 기존 답변일: {formatDate(qnaItem.answeredAt)}
//                       </div>
//                   )}
//                   <textarea
//                       value={answer}
//                       onChange={(e) => setAnswer(e.target.value)}
//                       className="w-full min-h-[150px] border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                       placeholder="답변을 입력하세요..."
//                   />
//                   <div className="mt-4">
//                     <ImageUpload
//                       onImagesChange={handleAnswerImageChange}
//                       existingImageUrls={isEditingAnswer ? (qnaItem.answerImageUrls || []) : []}
//                       maxFiles={5}
//                       label="답변 이미지 첨부 (선택 사항)" />
//                   </div>
//                   <div className="flex justify-end gap-3 mt-4">
//                       <Button variant="outline" onClick={handleListButton}>목록으로</Button>
//                       {isEditingAnswer && <Button variant="outline" onClick={handleCancelEdit}>취소</Button>}
//                       <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
//                         {isEditingAnswer ? '답변 수정 완료' : '답변 저장'}
//                       </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                     <p className="text-gray-600">아직 답변이 등록되지 않았습니다. 관리자가 확인 후 답변을 드릴 예정입니다.</p>
//                     <div className="flex justify-end mt-6">
//                         <Button variant="outline" onClick={handleListButton}>목록으로</Button>
//                     </div>
//                 </div>
//               )}
//             </div>
//         </main>
//       </div>
//     </div>
//   );
// }
