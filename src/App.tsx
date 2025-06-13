import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import MemberManagement from "./pages/member/Member";
import DeletedMember from "./pages/member/DeletedMember";
import QnaManagment from "./pages/qna/QnaList";
import QnaDetailPage from "./pages/qna/QnaDetail";
import NoticeListPage from "./pages/notice/NoticeList";
import NoticeDetailPage from "./pages/notice/NoticeDetail";
import NoticeNewPage from "./pages/notice/NoticeNewPage"; // NoticeNewPage 임포트
import ReportListPage from "./pages/report/ReportList";
import ReportDetailPage from "./pages/report/ReportDetail";
import SuspendedMemberManagement from "./pages/report/SuspendedMember";
import BannedMemberDetail from "./pages/report/BannedMemberDetail";
import ProductListPage from "./pages/product/ProductList";
import ItemListPage from "./pages/item/ItemList";
import PaymentHistoryPage from "./pages/payment/PaymentHistory";
// import ChatRoomManagementPage from "./pages/chat/ChatRoomManagementPage";
import ThemeManagementPage from "./pages/chat/ThemeManagement";
import EventManagementPage from "./pages/chat/EventManagement";
import SuspendedQnaListPage from "./pages/qna/SuspendedQnaList";
import SuspendedQnaDetailPage from "./pages/qna/SuspendedQnaDetail"; // SuspendedQnaDetailPage 임포트

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/membership" element={<MemberManagement />} />
      <Route path="/membership/deleted" element={<DeletedMember />} />
      <Route path="/qnalist" element={<QnaManagment />} />
      <Route path="/qna/:questionId" element={<QnaDetailPage />} />
      <Route path="/notices" element={<NoticeListPage />} />
      <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
      <Route path="/notices/new" element={<NoticeNewPage />} />
      <Route path="/notices/:noticeId/edit" element={<NoticeNewPage />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/reports" element={<ReportListPage />} />
      <Route path="/reports/:reportId" element={<ReportDetailPage />} />
      <Route
        path="/reports/suspended"
        element={<SuspendedMemberManagement />}
      />
      <Route
        path="/reports/suspended/:memberId"
        element={<BannedMemberDetail />}
      />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/items" element={<ItemListPage />} />
      <Route path="/payments" element={<PaymentHistoryPage />} />
      {/* <Route path="/chatrooms" element={<ChatRoomManagementPage />} /> */}
      <Route path="/themes" element={<ThemeManagementPage />} />
      <Route path="/events" element={<EventManagementPage />} />
      <Route path="/suspendedqnalist" element={<SuspendedQnaListPage />} />
      <Route
        path="/suspended-qna/:questionId"
        element={<SuspendedQnaDetailPage />}
      />
    </Routes>
  );
}
