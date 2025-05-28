// components/Header.tsx
import { useUserStore } from '../stores/useUserStore';

export default function Header() {
  const { username } = useUserStore();

  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-blue-300 to-purple-300 px-6 py-4 shadow-xl">
      <h1 className="text-2xl font-bold text-white">DICE TALK 관리자</h1>
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">{ username }님 반갑습니다!</span>
      </div>
    </header>
  );
}