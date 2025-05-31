import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { logout } from '../../api/auth';
import { useUserStore } from '../../stores/useUserStore';
import profileImg from '../../assets/images/profile.png';
import homeIcon from '../../assets/images/home_icon.png';
import logoutIcon from '../../assets/images/logout_icon.png';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { menuItems } from './menuItems';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { token, reset } = useUserStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout(token);
    } catch (e) {
      console.warn('서버 로그아웃 실패:', e);
    } finally {
      reset();
      navigate('/login');
    }
  };

  useEffect(() => {
    // 현재 경로에 해당하는 대메뉴 자동 오픈
    const found = menuItems.find(item =>
      item.subItems?.some(sub => location.pathname.startsWith(sub.path))
    );
    if (found) setOpenMenu(prev => (prev === found.name ? prev : found.name));
  }, [location.pathname]);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(prev => (prev === menuName ? null : menuName));
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-300 to-purple-300 text-white shadow-xl z-20 flex flex-col items-center pt-8">
      <div className='py-4 flex flex-col items-center mt-2'>
        <img
          src={profileImg}
          alt='Admin Profile'
          className='w-24 h-24 rounded-full border-4 border-white shadow'
        />
        <h2 className="text-lg font-bold mt-4">DICE TALK</h2>
      </div>

      <div className="flex space-x-6 mt-2 mb-6">
        <img src={homeIcon} alt="Home Icon" className="w-5 h-5 invert cursor-pointer" onClick={() => navigate('/')} />
        <img src={logoutIcon} alt="Logout Icon" className="w-5 h-5 invert cursor-pointer" onClick={handleLogout} />
      </div>

      <nav className="w-full flex flex-col space-y-2 mt-2">
        {menuItems.map((item) => {
          const isOpen = openMenu === item.name;
          const isParentActive = item.subItems?.some(sub => location.pathname === sub.path);

          return item.subItems ? (
            <div key={item.name}>
              <button
                onClick={() => toggleMenu(item.name)}
                className={`w-full px-6 py-3 flex justify-between items-center rounded-sm transition-all
                ${isParentActive ? 'bg-white text-blue-500 font-bold' : 'bg-transparent text-white hover:bg-white hover:text-blue-500'}
                ${isParentActive ? 'mb-1' : ''}
              `}
            >
                {item.name}
               {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <AnimatePresence initial={false} mode='wait'>
                {isOpen && (
                  <motion.div
                    initial={false}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
                    className="ml-4 space-y-1 overflow-hidden mt-1"
                  >
                    {item.subItems.map((sub) => (
                      <NavLink
                        end
                        key={item.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block px-5 py-2 text-sm rounded-md hover:bg-white hover:text-blue-500 ${
                            isActive ? 'bg-white text-blue-600 font-bold' : 'text-white'
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink
              end
              key={item.path}
              to={item.path!}
              className={({ isActive }) =>
                `px-6 py-3 hover:bg-white hover:text-blue-500 font-medium ${
                  isActive ? 'bg-white text-blue-600 font-bold' : 'text-white font-semibold'
                }`
              }
            >
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
