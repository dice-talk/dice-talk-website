// // src/pages/notice/NoticeNewPage.tsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Sidebar from '../../components/sidebar/Sidebar';
// import Header from '../../components/Header';
// import Button from '../../components/ui/Button';
// import { NoticeForm, type NoticeFormData } from '../../components/notice/NoticeForm';
// import { NoticeStatus } from '../../components/notice/noticeUtils';

// import NoticeDetailPage from './NoticeDetail';
// import axiosInstance from '../../api/axiosInstance';
// import { isAxiosError } from 'axios'; // axios에서 직접 isAxiosError 임포트

// // NoticeItem 인터페이스는 공유 타입으로 분리하는 것이 좋습니다.
// interface NoticeItem {
//   // This interface is used for the mock data and initial form data.
//   // The actual data structure for API responses might differ.
//   id: number;
//   type: '공지사항' | '이벤트';
//   title: string;
//   content: string;
//   createdAt: string;
//   isImportant: boolean;
//   status: NoticeStatus;
//   imageUrls?: string[];
//   startDate?: string;
//   endDate?: string;
// }

// // Helper function to map frontend NoticeStatus to backend string values
// const mapFrontendStatusToBackend = (status: NoticeStatus): string => {
//   switch (status) {
//     case NoticeStatus.SCHEDULED:
//       return "SCHEDULED"; // As per DTO example "PUBLISHED"
//     case NoticeStatus.ONGOING:
//       return "ONGOING";
//     case NoticeStatus.CLOSED:
//       return "CLOSED";
//     default:
//       // Fallback or throw an error for unhandled status
//       console.warn(`Unhandled notice status: ${status}, defaulting to SCHEDULED`);
//       return "SCHEDULED";
//   }
// };

// // Helper function to map frontend notice type to backend string values
// const mapFrontendTypeToBackend = (type: '공지사항' | '이벤트'): 'NOTICE' | 'EVENT' => {
//   return type === '공지사항' ? 'NOTICE' : 'EVENT';
// };

// // Helper function to format date string (YYYY-MM-DD) to LocalDateTime string (YYYY-MM-DDTHH:mm:ss)
// const formatDateToLocalDateTimeString = (dateString?: string): string | undefined => {
//   if (!dateString) return undefined;
//   return `${dateString}T00:00:00`; // Assuming time is 00:00:00 for date-only inputs
// };

// export default function NoticeNewPage() {
//   const navigate = useNavigate();
//   const { noticeId } = useParams<{ noticeId?: string }>(); // 수정 모드를 위해 noticeId 받기
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [mode, setMode] = useState<'create' | 'edit'>('create');
//   const [initialFormData, setInitialFormData] = useState<Partial<NoticeItem>>({
//     type: '공지사항',
//     status: NoticeStatus.SCHEDULED,
//     isImportant: false,
//     content: '',
//   });
//   const [pageTitle, setPageTitle] = useState('새 공지/이벤트 등록');
//   const [submitButtonText, setSubmitButtonText] = useState('등록');

//   useEffect(() => {
//     if (noticeId) {
//       const itemId = parseInt(noticeId, 10);
//       // In a real app, fetch the item by ID from the API instead of mockNotices
//       const foundItem = NoticeDetailPage.find(n => n.id === itemId);
//       if (foundItem) {
//         setMode('edit');
//         setPageTitle('공지/이벤트 수정');
//         setSubmitButtonText('수정');
//         setInitialFormData({
//           ...foundItem,
//           content: foundItem.content || '', // content가 undefined일 경우 빈 문자열로
//           // Dates might need re-formatting if API returns LocalDateTime strings
//           startDate: foundItem.startDate ? foundItem.startDate.split('T')[0] : undefined,
//           endDate: foundItem.endDate ? foundItem.endDate.split('T')[0] : undefined,
//         });
//       } else {
//         console.error("수정할 공지/이벤트 항목을 찾을 수 없습니다.");
//         navigate('/notices'); // 목록으로 리디렉션 또는 404
//       }
//     } else {
//       setMode('create');
//       setPageTitle('새 공지/이벤트 등록');
//       setSubmitButtonText('등록');
//       setInitialFormData({ type: '공지사항', status: NoticeStatus.SCHEDULED, isImportant: false, content: '' });
//     }
//   }, [noticeId, navigate]);

//   const handleSaveNotice = async (formData: NoticeFormData) => {
//     setIsSubmitting(true);

//     if (mode === 'create') {
//       const apiPayload = { 
//         title: formData.title,
//         content: formData.content,
//         startDate: formatDateToLocalDateTimeString(formData.startDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
//         endDate: formatDateToLocalDateTimeString(formData.endDate),     // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
//         noticeType: mapFrontendTypeToBackend(formData.type),
//         noticeStatus: mapFrontendStatusToBackend(formData.status),
//         noticeImportance: formData.isImportant ? 1 : 0,
//         // imageUrls 필드는 DTO에 없으므로 제거하거나, 백엔드 DTO에 맞게 조정합니다.
//         // 백엔드 Post DTO에는 imageUrls가 없으므로 이 라인은 제거합니다.
//       };

//       const requestFormData = new FormData();
//       requestFormData.append('noticePostDto', JSON.stringify(apiPayload));

//       if (formData.imageFiles && formData.imageFiles.length > 0) {
//         formData.imageFiles.forEach((file) => {
//           requestFormData.append('images', file);
//         });
//       }
      
//       // thumbnailFlagsStr는 현재 프론트엔드 폼에 없으므로, 필요하다면 추가 구현 필요
//       // 예시: const thumbnailFlags = [true, false, ...]; // 이미지 순서에 맞게
//       // requestFormData.append('thumbnailFlags', JSON.stringify(thumbnailFlags));

//       try {
//         // fetch 대신 axiosInstance 사용
//         console.log("📝 보낸 데이터 (noticePostDto):", apiPayload); // DTO 부분만 로깅
//         // FormData의 내용을 확인하려면 반복문을 사용해야 합니다.
//         // for (const pair of requestFormData.entries()) {
//         //   console.log(pair[0]+ ', ' + pair[1]); 
//         // }
//         const response = await axiosInstance.post<void>('/notices', requestFormData, { // 응답 타입을 void로 명시
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             // Authorization 헤더는 axiosInstance 인터셉터에서 처리됩니다.
//           },
//         });
//         // console.log(response.data); // 응답 본문은 비어있을 것입니다 (ResponseEntity<Void>)
//         console.log("Response headers:", response.headers);

//         // axios는 자동으로 응답 상태를 확인하고 2xx 범위가 아니면 에러를 발생시킵니다.
//         // ID는 Location 헤더에서 추출합니다.
//         const locationHeader = response.headers.location;
//         if (locationHeader) {
//           const newNoticeId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);
//           alert('새 공지/이벤트가 등록되었습니다.');
//           navigate(`/notices/${newNoticeId}`); // 추출한 ID로 네비게이션
//         } else {
//           console.error("Location header is missing in the response.");
//           alert('공지/이벤트 등록은 성공했으나, 상세 페이지로 이동할 수 없습니다. (Location 헤더 누락)');
//           navigate('/notices'); // 목록 페이지로 이동 또는 다른 오류 처리
//         }

//       } catch (error) {
//         console.error("Error creating notice:", error);
//         let errorMessage = '알 수 없는 오류가 발생했습니다.';
//         if (isAxiosError(error)) { // axios에서 직접 가져온 isAxiosError 사용
//           // AxiosError 타입으로 단언되었으므로 error.response 등에 안전하게 접근 가능
//           errorMessage = error.response?.data?.message || error.message || '서버 요청 중 오류가 발생했습니다.';
//         } else if (error instanceof Error) { // 일반 Error 객체인지 확인
//           errorMessage = error.message;
//         }
//         alert(`공지/이벤트 등록에 실패했습니다. ${errorMessage}`);
//       } finally {
//         setIsSubmitting(false);
//       }

//     } else if (mode === 'edit' && noticeId) {
//       // TODO: Implement API call for updating an existing notice (e.g., PUT /notices/{noticeId})
//       // Define apiPayload for edit mode as well
//       const apiPayload = {
//         // id: parseInt(noticeId, 10), // PUT 요청 시 ID가 필요할 수 있음 (백엔드 DTO 확인)
//         title: formData.title,
//         content: formData.content,
//         startDate: formatDateToLocalDateTimeString(formData.startDate), // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
//         endDate: formatDateToLocalDateTimeString(formData.endDate),     // NoticeForm에서 이미 유형에 맞게 날짜 설정됨
//         noticeType: mapFrontendTypeToBackend(formData.type), // Assuming type can be updated
//         noticeStatus: mapFrontendStatusToBackend(formData.status),
//         noticeImportance: formData.isImportant ? 1 : 0,
//         // 수정 시 이미지 처리는 더 복잡할 수 있습니다.
//         // - 새로 추가된 이미지 (imageFiles)
//         // - 삭제된 기존 이미지 URL (removedImageUrls)
//         // - 유지되는 기존 이미지 URL
//         // 백엔드 API가 이를 어떻게 처리하는지에 따라 DTO 구성이 달라집니다.
//         // 예: removedImageUrls: formData.removedImageUrls (백엔드가 지원하는 경우)
//       };

//       const requestFormData = new FormData();
//       requestFormData.append('noticePutDto', JSON.stringify(apiPayload)); // DTO 이름은 백엔드에 맞춰야 합니다.
//       if (formData.imageFiles && formData.imageFiles.length > 0) {
//         formData.imageFiles.forEach(file => requestFormData.append('images', file));
//       }
//       // 수정 시에도 thumbnailFlags 등이 필요하면 추가
//       console.log("Updating notice (noticePutDto):", noticeId, apiPayload);
//       const itemId = parseInt(noticeId, 10);
//       const itemIndex = NoticeDetailPage.findIndex(n => n.id === itemId); // Replace with API call logic
//       if (itemIndex > -1) {
//         const existingItem = NoticeDetailPage[itemIndex];
//         // This mock logic for image URLs would also need to align with how the backend handles image updates
//         const newUploadedImageUrls = formData.imageFiles.map((file, index) => `https://via.placeholder.com/400x200.png?text=UpdatedImg${itemId}-${index + 1}-${file.name}`);
//         const finalImageUrls = [
//           ...(existingItem.imageUrls || []).filter(url => !formData.removedImageUrls.includes(url)),
//           ...newUploadedImageUrls
//         ];
//         const updatedItem: NoticeItem = {
//           ...existingItem, // Keep existing fields like createdAt
//           ...apiPayload, // Apply updated fields from apiPayload
//           imageUrls: finalImageUrls,
//           // Ensure dates are formatted correctly if needed for update payload
//         };
//         NoticeDetailPage[itemIndex] = updatedItem;
//         alert('공지/이벤트가 수정되었습니다.');
//         navigate(`/notices/${itemId}`);
//       } else {
//         alert('수정할 공지/이벤트를 찾지 못했습니다.');
//         setIsSubmitting(false);
//         return;
//       }

//     setIsSubmitting(false);
//   };

//   const handleCancel = () => {
//     // No changes needed for cancel logic based on the request
//     if (mode === 'edit' && noticeId) {
//       navigate(`/notices/${noticeId}`); // 수정 중 취소 시 해당 상세 페이지로
//     } else {
//       navigate('/notices'); // 등록 중 취소 시 목록 페이지로
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Header />
//         <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-6">
//           {/* 페이지 제목과 버튼 영역을 main의 최상단으로 이동 */}
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-semibold text-gray-800">{pageTitle}</h1> {/* 제목 스타일 약간 변경 */}
//           </div>

//           <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/75"> {/* 카드 스타일 변경 */}
//             {/* 페이지 제목은 위로 이동했으므로 여기서는 제거 */}
//             <NoticeForm
//               onSave={handleSaveNotice}
//               onCancel={handleCancel}
//               isSubmitting={isSubmitting}
//               mode={mode}
//               initialData={initialFormData}
//             />
//               <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200"> {/* 버튼 영역 스타일 변경 */}
//               <Button type="submit" form={`notice-form-${mode}`} disabled={isSubmitting}>{submitButtonText}</Button>
//               <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>취소</Button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }