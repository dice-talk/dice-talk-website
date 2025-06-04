import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignup } from '../../api/auth';
import axios, { AxiosError } from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = async () => {
    try {
      await adminSignup({
        email,
        name, 
        password, 
        phone, 
        birth: '2000-01-01',
        gender: null,
        region: '서울시 강남구' 
    });

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            const axiosErr = err as AxiosError<{ message: string }>;
            alert(`회원가입 실패: ${axiosErr.response?.data?.message || axiosErr.response?.statusText}`);
        } else {
            alert('회원가입 실패: 알 수 없는 오류');
        }
    }
};

   return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">관리자 회원가입</h1>
      <input
        className="border p-2 w-64"
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-64"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 w-64"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="border p-2 w-64"
        placeholder="전화번호 (예: 010-1234-5678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        onClick={handleSignup}
      >
        관리자 회원가입
      </button>
    </div>
  );
}