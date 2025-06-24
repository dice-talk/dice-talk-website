// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from '../../components/ui/Button';
// // import Header from '../../components/Header'; // 비회원 페이지이므로 Sidebar는 제외할 수 있음. 필요시 추가.
// import { ImageUpload } from '../../components/ui/ImageUpload';
// import { type QuestionStatusType } from '../qna/QnaDetail'; // QuestionStatusType import

// export default function SuspendedQnaWritePage() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태 (더미)
//   const [verificationCode, setVerificationCode] = useState(''); // 인증 코드 입력 (UI만)
//   const [isVerificationSent, setIsVerificationSent] = useState(false); // 인증 코드 발송 여부 (UI만)

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [imageFiles, setImageFiles] = useState<File[]>([]);

//   const handleSendVerificationCode = () => {
//     // TODO: 실제 이메일 인증 코드 발송 API 호출
//     if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
//       alert('유효한 이메일 주소를 입력해주세요.');
//       return;
//     }
//     setIsVerificationSent(true);
//     alert(`${email}로 인증 코드가 발송되었습니다. (실제 발송은 구현되지 않음)`);
//   };

//   const handleVerifyCode = () => {
//     // TODO: 실제 인증 코드 검증 API 호출
//     if (verificationCode === '123456') { // 더미 인증 코드
//       setIsEmailVerified(true);
//       alert('이메일 인증이 완료되었습니다.');
//     } else {
//       alert('인증 코드가 올바르지 않습니다.');
//     }
//   };

//   const handleSubmitQuestion = () => {
//     if (!title.trim() || !content.trim()) {
//       alert('제목과 내용을 모두 입력해주세요.');
//       return;
//     }
//     // TODO: 문의 등록 API 연결
//     const newQuestion = {
//       questionId: Math.floor(Math.random() * 1000) + 200, // 임시 ID
//       title,
//       content,
//       authorEmail: email,
//       questionStatus: 'QUESTION_REGISTERED' as QuestionStatusType,
//       createdAt: new Date().toISOString(),
//       // imageUrls: imageFiles.map(file => URL.createObjectURL(file)), // 실제로는 업로드 후 URL 받아야 함
//     };
//     console.log('새 문의 등록:', newQuestion, imageFiles);
//     // mockQnas.unshift(newQuestion); // 실제 데이터 저장소에 추가해야 함. (QnaDetail.tsx의 mockQnas를 직접 수정하는 것은 좋지 않음)
//     alert('문의가 성공적으로 등록되었습니다. 관리자 확인 후 이메일로 답변이 발송됩니다.');
//     // 정지된 회원의 경우 문의 후 이동할 페이지를 정의해야 합니다. (예: 메인, 특정 안내 페이지 등)
//     navigate('/login'); // 현재는 로그인 페이지로 유지, 필요시 경로 수정
//   };

//   const handleImagesChange = (files: File[]) => {
//     setImageFiles(files);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-300 to-purple-300">
//       {/* <Header /> */}
//       <div className="flex-grow flex items-center justify-center p-4">
//         <main className="w-full max-w-2xl bg-slate-50 p-6 md:p-8 rounded-xl shadow-2xl">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">정지된 회원 문의하기</h2>

//           {!isEmailVerified ? (
//             <div className="space-y-4">
//               <p className="text-sm text-gray-600">
//                 문의를 작성하시려면 이메일 인증이 필요합니다. 답변은 입력하신 이메일로 발송됩니다.
//               </p>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
//                 <div className="flex gap-2">
//                   <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" disabled={isVerificationSent} />
//                   {!isVerificationSent ? (
//                     <Button onClick={handleSendVerificationCode} className="whitespace-nowrap">인증번호 발송</Button>
//                   ) : (
//                      <Button onClick={() => { setIsVerificationSent(false); setVerificationCode('');}} variant="outline" className="whitespace-nowrap">이메일 변경</Button>
//                   )}
//                 </div>
//               </div>

//               {isVerificationSent && (
//                 <div>
//                   <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">인증 코드</label>
//                   <div className="flex gap-2">
//                     <input type="text" id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="인증 코드 6자리 입력" className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
//                     <Button onClick={handleVerifyCode} className="whitespace-nowrap">인증 확인</Button>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">이메일로 전송된 인증 코드를 입력해주세요. (테스트용: 123456)</p>
//                 </div>
//               )}
//                <div className="pt-4 text-center">
//                 {/* 정지된 회원이 돌아갈 페이지를 정의해야 합니다. */}
//                 <Button variant="outline" onClick={() => navigate('/login')}>이전 페이지로</Button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">인증된 이메일: <span className="font-semibold">{email}</span></p>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-1">문의 내용 작성</h3>
//               </div>
//               <div><label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="문의 제목을 입력하세요." /></div>
//               <div><label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label><textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="문의하실 내용을 자세히 적어주세요." /></div>
//               <div><ImageUpload onImagesChange={handleImagesChange} maxFiles={3} label="이미지 첨부 (선택 사항, 최대 3개)" /></div>
//               <div className="flex justify-end gap-3 pt-2">
//                  {/* 정지된 회원이 취소 후 돌아갈 페이지를 정의해야 합니다. */}
//                 <Button variant="outline" onClick={() => navigate('/login')}>취소</Button>
//                 <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmitQuestion}>문의 등록</Button>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }
