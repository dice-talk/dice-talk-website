import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth'; // 서버에 요청하는 logout 함수
import { useUserStore } from '../stores/useUserStore';
import profileImg from '../assets/images/profile.png';
import homeIcon from '../assets/images/home_icon.png';
import logoutIcon from '../assets/images/logout_icon.png'

export default function Sidebar() {
    const { token, reset } = useUserStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(token);  // 서버에 로그아웃 요청
        } catch (e) {
            console.warn('서버 로그아웃 실패:', e);
        } finally {
            reset(); // 상태 초기화
            navigate('/login'); // 로그인 페이지로 이동
        }
    };

    const menuItems = [
    { name: '대시보드', path: '/' },
    { name: '회원 관리', path: '/members' },
    { name: '채팅방 관리', path: '/chatrooms' },
    { name: '신고 관리', path: '/reports' },
    { name: '공지사항 관리', path: '/notices' },
    { name: '이벤트 관리', path: '/events' },
    { name: '통계 및 리포트', path: '/stats' },
    ];



  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-300 to-purple-300 text-white shadow-xl z-20 flex flex-col items-center pt-8">
            {/* 프로필 영역 */}
        <div className='py-4 flex flex-col items-center mt-2'>
            <img
                src = {profileImg}
                alt='Admin Profile'
                className='w-24 h-24 rounded-full border-4 border-white shadow'
            />
            {/* DICE TALK 텍스트 */}
            <h2 className="text-lg font-bold mt-4">DICE TALK</h2>
        </div>

        {/* 하단 아이콘 */}
        <div className="flex space-x-6 mt-2 mb-6">
            <img src={homeIcon} alt="Home Icon" className="w-5 h-5 invert cursor-pointer" onClick={() => navigate('/')} />
            <img src={logoutIcon} alt="Logout Icon" className="w-5 h-5 invert cursor-pointer" onClick={handleLogout} />
        </div>

        {/* 메뉴 항목 */}
        <nav className="w-full flex flex-col space-y-2 mt-2">
         {menuItems.map(({ name, path }) => (
            <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                `px-6 py-3 hover:bg-white hover:text-blue-500 font-medium ${
                    isActive ? 'bg-white text-blue-600 front-bold' : 'text-white font-semibold'
                }`
                }
            >
            {name}
          </NavLink>
         ))}
        </nav>
    </aside>
  );
}