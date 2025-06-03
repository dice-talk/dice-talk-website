import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import MemberManagement from './pages/member/Member';
import DeletedMember from './pages/member/DeletedMember';
import QnaManagment from './pages/qna/QnaList'
import QnaDetailPage from './pages/qna/QnaDetail';
import NoticeListPage from './pages/notice/NoticeList';
import NoticeDetailPage from './pages/notice/NoticeDetail';
import NoticeNewPage from './pages/notice/NoticeNewPage'; // NoticeNewPage 임포트
import ReportListPage from './pages/report/ReportList';
import ReportDetailPage from './pages/report/ReportDetail';
import SuspendedMemberManagement from './pages/report/SuspendedMember';
import ProductListPage from './pages/product/ProductList';
import ItemListPage from './pages/item/ItemList';
import PaymentHistoryPage from './pages/payment/PaymentHistort';
import ChatRoomManagementPage from './pages/chat/ChatRoomManagementPage';
import ThemeManagementPage from './pages/chat/ThemeManagement';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/membership" element={<MemberManagement />} />
      <Route path="/membership/deleted" element={<DeletedMember />} />
      <Route path='/qnalist' element={<QnaManagment />} />
      <Route path="/qna/:questionId" element={<QnaDetailPage />} />
      <Route path="/notices" element={<NoticeListPage/>} /> 
      <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
      <Route path="/notices/new" element={<NoticeNewPage />} />
      <Route path="/notices/:noticeId/edit" element={<NoticeNewPage />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/reports" element={<ReportListPage />} />
      <Route path="/reports/:reportId" element={<ReportDetailPage />} />
      <Route path='/reports/suspended' element={<SuspendedMemberManagement />} />
      <Route path='/products' element={<ProductListPage />} />
      <Route path='/items' element={<ItemListPage />} />
      <Route path='/payments' element={<PaymentHistoryPage />} />
      <Route path='/chatrooms' element={<ChatRoomManagementPage />} />
      <Route path='/themes' element={<ThemeManagementPage />} /> 
    </Routes>
  );
}