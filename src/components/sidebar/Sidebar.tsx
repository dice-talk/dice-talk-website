import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logout as apiLogout } from "../../api/auth"; 
import { useUserStore, useAuthStore } from "../../stores/useUserStore"; 
import profileImg from "../../assets/images/profile.png";
import homeIcon from "../../assets/images/home_icon.png";
import logoutIcon from "../../assets/images/logout_icon.png";
import { ChevronDown, ChevronUp } from "lucide-react";
import { menuItems } from "./menuItems";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const { reset: userReset } = useUserStore(); 
  const authLogout = useAuthStore((state) => state.logout); 
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  // 애니메이션 적용 여부를 제어하는 상태
  const [shouldAnimateTransition, setShouldAnimateTransition] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();
  const mouseLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MENU_ANIMATION_DURATION_SECONDS = 0.3; 

  const isSubItemActive = (
    subItemPath: string,
    currentPath: string
  ): boolean => {
    // 1. Exact match
    if (currentPath === subItemPath) {
      return true;
    }

    if (subItemPath === "/notices") {
      return (
        currentPath.startsWith("/notices/") &&
        !currentPath.endsWith("/new") &&
        !currentPath.endsWith("/edit")
      );
    }
   
    if (subItemPath === "/qnalist") {
     
      return (
        currentPath.startsWith("/qna/") || currentPath.startsWith("/qnalist/")
      );
    }
    if (subItemPath === "/chatrooms") {
      return (
        currentPath.startsWith("/chatrooms/") && currentPath !== "/chatrooms"
      );
    }
 
    return false;
  };

  const handleLogout = async () => {
    try {
      await apiLogout(); 
    } catch (e) {
      console.warn("서버 로그아웃 실패:", e);
    } finally {
      alert('로그아웃 되었습니다.'); 
      authLogout(); 
      userReset(); 
      navigate("/login"); 
    }
  };

  useEffect(() => {
    let activeParentMenu: string | null = null;
    for (const item of menuItems) {
      if (
        item.subItems?.some((sub) =>
          isSubItemActive(sub.path, location.pathname)
        )
      ) {
        activeParentMenu = item.name;
        break;
      }
    }

    setShouldAnimateTransition(false);
    setHoveredMenu(null);
    setOpenMenu(activeParentMenu);

    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
      mouseLeaveTimerRef.current = null;
    }
  }, [location.pathname]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 타이머 
    return () => {
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
      }
    };
  }, []);

  const toggleMenu = (menuName: string) => {
    setShouldAnimateTransition(true); 
    if (openMenu === menuName) {
    
      setOpenMenu(null);
      setHoveredMenu(null);
    } else {
      setOpenMenu(menuName);
      setHoveredMenu(menuName);
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
        mouseLeaveTimerRef.current = null;
      }
    }
  };

  const handleMouseEnter = (menuName: string) => {
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
      mouseLeaveTimerRef.current = null;
    }
    setShouldAnimateTransition(true);
    setHoveredMenu(menuName);
  };

  const handleMouseLeave = () => {
    setShouldAnimateTransition(true);
    mouseLeaveTimerRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 100); // 100ms 지연으로 플리커링 방지
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-300 to-purple-300 text-white shadow-xl z-20 flex flex-col items-center pt-8">
      <div className="py-4 flex flex-col items-center mt-2">
        <img
          src={profileImg}
          alt="Admin Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow"
        />
        <h2 className="text-lg font-bold mt-4">DICE TALK</h2>
      </div>

      <div className="flex space-x-6 mt-2 mb-6">
        <img src={homeIcon} alt="Home Icon" className="w-5 h-5 invert cursor-pointer" onClick={() => navigate('/home')} />
        <img src={logoutIcon} alt="Logout Icon" className="w-5 h-5 invert cursor-pointer" onClick={handleLogout} />
      </div>

      <nav className="w-full flex flex-col space-y-2 mt-2">
        {menuItems.map((item) => {
          // 메뉴가 실제로 열려 보여야 하는 조건:
          // 1. 현재 메뉴에 마우스가 올라가 있거나 (`hoveredMenu === item.name`)
          // 2. 마우스가 다른 곳에 있고(hoveredMenu === null), 이 메뉴가 경로상 활성 메뉴이거나 클릭으로 "pinned" 열린 상태일 때 (`openMenu === item.name`)
          const isEffectivelyOpen =
            hoveredMenu === item.name ||
            (hoveredMenu === null && openMenu === item.name);
          const isParentActive = item.subItems?.some((sub) =>
            isSubItemActive(sub.path, location.pathname)
          );

          const transitionConfig = shouldAnimateTransition
            ? {
                duration: MENU_ANIMATION_DURATION_SECONDS,
                ease: [0.25, 0.8, 0.25, 1],
              }
            : { duration: 0 }; // 애니메이션 비활성화 시 duration 0

          return item.subItems ? (
            <div
              key={item.name}
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleMenu(item.name)}
                className={`w-full px-6 py-3 flex justify-between items-center rounded-sm transition-all
                ${
                  isParentActive
                    ? "bg-white text-blue-500 font-bold"
                    : "bg-transparent text-white hover:bg-white hover:text-blue-500"
                }
                ${isParentActive ? "mb-1" : ""}
              `}
              >
                {item.name}
                {isEffectivelyOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isEffectivelyOpen && (
                  <motion.div
                    key={item.name + "-submenu"} // AnimatePresence가 변경을 감지하도록 key 추가
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transitionConfig}
                    className="ml-4 space-y-1 overflow-hidden mt-1"
                  >
                    {item.subItems.map((sub) => (
                      <NavLink
                        end
                        key={sub.name} 
                        to={sub.path}
                        className={
                          ({ isActive }) =>
                            isActive
                              ? "block px-5 py-2 text-sm rounded-md bg-white text-blue-600 font-bold" // Active style
                              : "block px-5 py-2 text-sm rounded-md text-white hover:bg-white hover:text-blue-500" // Default style
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
              key={item.name}
              to={item.path!}
              className={({ isActive }) =>
                `px-6 py-3 hover:bg-white hover:text-blue-500 font-medium ${
                  isActive
                    ? "bg-white text-blue-600 font-bold"
                    : "text-white font-semibold"
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
