import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { logout } from "../../api/auth";
import { useUserStore } from "../../stores/useUserStore";
import profileImg from "../../assets/images/profile.png";
import homeIcon from "../../assets/images/home_icon.png";
import logoutIcon from "../../assets/images/logout_icon.png";
import { ChevronDown, ChevronUp } from "lucide-react";
import { menuItems } from "./menuItems";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const { reset } = useUserStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  // 애니메이션 적용 여부를 제어하는 상태
  const [shouldAnimateTransition, setShouldAnimateTransition] = useState(true); // true: 애니메이션 적용, false: 즉시 변경
  const navigate = useNavigate();
  const location = useLocation();
  const mouseLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MENU_ANIMATION_DURATION_SECONDS = 0.3; // 애니메이션 지속 시간 (초) - 이전 값으로 되돌리거나 적절히 조절

  // Helper function to determine if a sub-item is active
  const isSubItemActive = (
    subItemPath: string,
    currentPath: string
  ): boolean => {
    // 1. Exact match
    if (currentPath === subItemPath) {
      return true;
    }

    // 2. Specific handling for /notices and /qnalist
    // For "공지사항&이벤트 조회" (path: '/notices')
    if (subItemPath === "/notices") {
      return (
        currentPath.startsWith("/notices/") &&
        !currentPath.endsWith("/new") &&
        !currentPath.endsWith("/edit")
      );
    }
    // For "QnA 조회" (path: '/qnalist')
    if (subItemPath === "/qnalist") {
      // Check if detail page is under /qna/ OR /qnalist/
      return (
        currentPath.startsWith("/qna/") || currentPath.startsWith("/qnalist/")
      );
    }
    // For "전체 채팅방 조회" (path: '/chatrooms')
    if (subItemPath === "/chatrooms") {
      // Check if detail page is under /chatrooms/ (but not /chatrooms itself)
      return (
        currentPath.startsWith("/chatrooms/") && currentPath !== "/chatrooms"
      );
    }

    // No general prefix match for now to avoid unintended activations.
    // If other parent-child relationships need this, they should be added specifically.
    return false;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("서버 로그아웃 실패:", e);
    } finally {
      reset();
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

    // 경로 변경 시: 애니메이션 없이, 호버 상태 초기화, openMenu는 현재 경로 기준으로 설정
    setShouldAnimateTransition(false);
    setHoveredMenu(null);
    setOpenMenu(activeParentMenu); // This handles rules #4 and #5

    // 경로 변경 시 혹시 남아있을 수 있는 leave 타이머 정리
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
      mouseLeaveTimerRef.current = null;
    }
  }, [location.pathname]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
      }
    };
  }, []);

  const toggleMenu = (menuName: string) => {
    setShouldAnimateTransition(true); // 부모 메뉴 직접 클릭 시에는 항상 애니메이션 적용
    if (openMenu === menuName) {
      // 현재 "pinned" 열린 메뉴를 다시 클릭: 메뉴 닫기 (unpin)
      setOpenMenu(null);
      // 클릭으로 닫을 때 호버 상태도 해제하여 즉시 닫힘을 보장
      setHoveredMenu(null);
    } else {
      // 다른 메뉴를 클릭했거나 아무 메뉴도 열려있지 않을 때: 해당 메뉴 열기 (pin)
      setOpenMenu(menuName);
      // 클릭으로 열 때 호버 상태도 설정하여 즉시 열리고, 마우스가 벗어나도 openMenu로 유지
      setHoveredMenu(menuName);
      if (mouseLeaveTimerRef.current) {
        // 이 메뉴에 대한 mouseLeave 타이머가 있었다면 취소
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
                    // initial={false}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transitionConfig}
                    className="ml-4 space-y-1 overflow-hidden mt-1"
                  >
                    {item.subItems.map((sub) => (
                      <NavLink
                        end
                        // key={item.name}
                        key={sub.name} // Use sub.name or sub.path for key
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
