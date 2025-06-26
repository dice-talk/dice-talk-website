import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login"; // Login 컴포넌트 경로 수정
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
// import PaymentHistoryPage from "./pages/payment/PaymentHistory";
import ChatRoomManagementPage from "./pages/chat/ChatRoomManagementPage";
import ThemeManagementPage from "./pages/chat/ThemeManagement";
import EventManagementPage from "./pages/chat/EventManagement";
import ChatRoomDetailPage from "./pages/chat/ChatRoomDetailPage";

// 로그인 상태를 가져오는 로직 (예시, 실제 사용하는 상태 관리 라이브러리에 맞게 수정)
import { useAuthStore } from "./stores/useUserStore";
import GuestQnaList from "./pages/qna/GuestQnaList";
import GuestQnaDetailPage from "./pages/qna/GuestQnaDetail";

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* 기본 경로: 로그인 안 했으면 로그인 페이지, 했으면 홈으로 리다이렉트 */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />}
      />
      {/* <Route path="/admin/signup" element={<Signup />} /> */}
      {/* 보호된 경로 예시: 로그인해야 접근 가능 */}
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
      />

      <Route path="/membership" element={<MemberManagement />} />
      <Route path="/membership/deleted" element={<DeletedMember />} />
      <Route path="/qnalist" element={<QnaManagment />} />
      <Route path="/qna/:questionId" element={<QnaDetailPage />} />
      <Route path="/notices" element={<NoticeListPage />} />
      <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
      <Route path="/notices/new" element={<NoticeNewPage />} />
      <Route path="/notices/:noticeId/edit" element={<NoticeNewPage />} />
      {/* 일치하는 경로가 없을 때 기본 경로로 리다이렉트 */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
      />
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
      {/* <Route path="/payments" element={<PaymentHistoryPage />} /> */}
      <Route path="/chatrooms" element={<ChatRoomManagementPage />} />
      <Route path="/themes" element={<ThemeManagementPage />} />
      <Route path="/events" element={<EventManagementPage />} />
      <Route path="/guestqnalist" element={<GuestQnaList />} />
      <Route path="/guestqna/:questionId" element={<GuestQnaDetailPage />} />
      <Route path="/chatrooms/:chatRoomId" element={<ChatRoomDetailPage />} />
    </Routes>
  );
}
