export interface SubItem {
  name: string;
  path: string;
}

export interface MenuItem {
  name: string;
  path?: string;
  subItems?: SubItem[];
}

export const menuItems: MenuItem[] = [
  {
    name: '대시보드',
    path: '/home',
  },
  {
    name: "회원 관리",
    subItems: [
      { name: "회원 목록", path: "/membership" },
      { name: "탈퇴 회원 목록", path: "/membership/deleted" },
    ],
  },
  {
    name: "채팅방 관리",
    subItems: [
      { name: "전체 채팅방 조회", path: "/chatrooms" },
      { name: "이벤트 관리", path: "/events" },
      { name: "테마 관리", path: "/themes" },
    ],
  },
  {
    name: "결제 관리",
    subItems: [
      { name: "결제 내역", path: "/payments" },
      { name: "아이템 관리", path: "/items" },
      { name: "상품 관리", path: "/products" },
    ],
  },
  {
    name: "신고 관리",
    subItems: [
      { name: "신고 내역 확인", path: "/reports" },
      { name: "정지 회원 목록", path: "/reports/suspended" },
    ],
  },
  {
    name: "공지사항 관리",
    subItems: [
      { name: "공지사항&이벤트 등록", path: "/notices/new" },
      { name: "공지사항&이벤트 조회", path: "/notices" },
    ],
  },
  {
    name: "QnA 관리",
    subItems: [
      { name: "QnA 조회", path: "/qnalist" },
      { name: "비회원 QnA 조회", path: "/guestqnalist" },
    ],
  },
];
