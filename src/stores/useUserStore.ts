import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  username: string;
  token: string | null;
  setUser: (username: string, token: string) => void;
  reset: () => void;
}

interface AuthState {
  isLoggedIn: boolean;
  isAuthenticated: boolean; 
  login: () => void; 
  logout: () => void; 
}

//회원가입, 로그인 후 상태 저장 및 페이지 새로고침에도 유지
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: '',
      token: null, //초기값 설정 
      setUser: (username, token) => set({ username, token }),
      reset: () => set({ username: '', token: null }),
    }),
    {
      name: 'user-storage', // localStorage 키 이름
    }
  )
);

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthenticated: false, // 초기값은 false 또는 토큰 유무에 따라 설정
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));


