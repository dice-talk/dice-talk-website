// src/pages/Login.tsx
import { useState } from 'react';
import { login } from '../api/auth';
import { useAuthStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: setLogin } = useAuthStore();
  const navigate = useNavigate(); //페이지 이동 

  const handleLogin = async () => {
    try {
      await login({ username, password });
      setLogin(); //로그인 상태 true 변경
      alert('로그인 성공!');
      navigate('/home'); //로그인 성공 시 /home 으로 이동
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        className="w-full p-2 mb-3 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full p-2 mb-3 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        로그인
      </button>
    </div>
  );
};

export default Login;