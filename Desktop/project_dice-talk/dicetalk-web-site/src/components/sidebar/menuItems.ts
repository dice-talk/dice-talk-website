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
    path: '/',
  },
  {
    name: '회원 관리',
    subItems: [
      { name: '회원 목록', path: '/membership' },
      { name: '정지 회원 목록', path: '/membership/deleted' },
    ],
  },
  {
    name: '채팅방 관리',
    subItems: [
      { name: '전체 채팅방 조회', path: '/admin/notices' },
      { name: '이벤트 조회', path: '/admin/events' },
      { name: '테마 관리', path: '/admin/events' },
      { name: '이벤트 관리', path: '/admin/events' },
    ],
  },
  {
    name: '결제 관리',
    subItems: [
      { name: '결제 내역', path: '/admin/notices' },
      { name: '아이템 관리', path: '/admin/events' },
      { name: '상품 관리', path: '/admin/events' }
    ],
  },
   {
    name: '신고 관리',
    subItems: [
      { name: '신고 내역 확인', path: '/admin/notices' },
      { name: '신고 처리', path: '/admin/events' }
    ],
  },
  {
    name: '공지사항 관리',
    subItems: [
      { name: '공지사항&이벤트 등록', path: '/admin/notices' },
      { name: '공지사항&이벤트 조회', path: '/notices' },
    ],
  },
  {
    name: 'QnA 관리',
    path: '/qnalist',
  }
];