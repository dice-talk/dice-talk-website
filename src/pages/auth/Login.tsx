// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, adminSignup } from '../../api/auth';
import { useAuthStore, useUserStore } from '../../stores/useUserStore';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axios, { AxiosError } from 'axios';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 회원가입 입력 상태
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);


  const authLoginAction = useAuthStore((state) => state.login);
  const userSetUserAction = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await login({ username: loginId, password: loginPassword });
      if (token) {
        localStorage.setItem("accessToken", token);
        userSetUserAction(loginId, token);
        authLoginAction();
        alert('로그인 성공!');
        navigate('/home');
      } else {
        alert('로그인 실패: 서버로부터 토큰을 받지 못했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
  };
const handleSignup = async () => {
  if (signupPassword !== signupPasswordConfirm || !passwordMatch) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    await adminSignup({
      email: signupEmail,
      name: signupName,
      password: signupPassword,
      birth: '2000-01-01',
      gender: null,
      region: '서울시 강남구',
    });

    alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    setActiveTab('login');
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const axiosErr = err as AxiosError<{ message: string }>;
      alert(`회원가입 실패: ${axiosErr.response?.data?.message || axiosErr.response?.statusText}`);
    } else {
      alert('회원가입 실패: 알 수 없는 오류');
    }
  }
};

  useEffect(() => {
    if (signupPasswordConfirm === '') {
      setPasswordMatch(null);
    } else {
      setPasswordMatch(signupPassword === signupPasswordConfirm);
    }
  }, [signupPassword, signupPasswordConfirm]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-purple-300 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('login')}
          >
            로그인
          </button>
          <button
            className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('signup')}
          >
            회원가입
          </button>
        </div>

        {/* 로그인 폼 */}
        {activeTab === 'login' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">로그인</h2>
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 mb-1">아이디 또는 이메일</label>
              <Input type="text" id="loginId" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="아이디 또는 이메일 입력" />
            </div>
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <Input type="password" id="loginPassword" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="비밀번호 입력" />
            </div>
            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">로그인</Button>
          </div>
        ) : (
          // 회원가입 폼
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">회원가입</h2>
            <div>
              <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <Input type="email" id="signupEmail" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="이메일 입력" />
            </div>
            <div>
              <label htmlFor="signupName" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <Input id="signupName" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="이름 입력" />
            </div>
            <div>
              <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <Input type="password" id="signupPassword" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="비밀번호 입력" />
            </div>
            <div>
              <label htmlFor="signupPasswordConfirm" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <Input type="password" id="signupPasswordConfirm" value={signupPasswordConfirm} onChange={(e) => setSignupPasswordConfirm(e.target.value)} placeholder="비밀번호 다시 입력" />
              {passwordMatch === true && signupPasswordConfirm !== '' && (
                <p className="mt-1 text-xs text-green-600">비밀번호가 일치합니다.</p>
              )}
              {passwordMatch === false && signupPasswordConfirm !== '' && (
                <p className="mt-1 text-xs text-red-600">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
            <Button 
              onClick={handleSignup} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              disabled={passwordMatch === false && signupPasswordConfirm !== ''} // 비밀번호 불일치 시 버튼 비활성화
            >
              회원가입
            </Button>          
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;