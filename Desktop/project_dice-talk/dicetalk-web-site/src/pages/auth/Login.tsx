// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuthStore } from '../../stores/useUserStore';
import Button from '../../components/ui/Button'; // Button 컴포넌트 임포트
import { Input } from '../../components/ui/Input'; // Input 컴포넌트 임포트
import SignupForm from '../../components/auth/SignupForm'; // SignupForm 컴포넌트 임포트 (새로 생성될 파일)


const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login'); // 'login' 또는 'signup'
  const [loginId, setLoginId] = useState(''); // 아이디 또는 이메일
  const [loginPassword, setLoginPassword] = useState(''); // 비밀번호
  const { login: setLoginStatus } = useAuthStore(); // 스토어에서 로그인 상태 변경 함수 가져오기
  const navigate = useNavigate(); //페이지 이동 

  const handleLogin = async () => {
    try {
      await login({ username: loginId, password: loginPassword }); // loginId와 loginPassword 사용
      setLoginStatus(); //로그인 상태 true 변경
      // setLoginStatus(); // 로그인 상태 true 변경
      alert('로그인 성공!');
      navigate('/home'); //로그인 성공 시 /home 으로 이동
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
    // TODO: 실제 로그인 로직 구현
    // console.log('로그인 시도:', { loginId, loginPassword });
    // 로그인 성공 시 메인 페이지 등으로 이동
    // navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-purple-300 p-4"> {/* 배경 및 중앙 정렬 */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200 mb-6"> {/* 하단 경계선 추가 */}
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

        {/* 탭 내용 */}
        {activeTab === 'login' ? (
          <div className="space-y-6"> {/* 폼 요소 간 간격 */}
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

            {/* 추가 링크/버튼 */}
            <div className="flex justify-center gap-4 text-sm mt-4"> {/* 중앙 정렬 및 간격 조정 */}
              <button onClick={() => console.log('ID 찾기')} className="text-blue-600 hover:underline">ID 찾기</button> {/* ID 찾기 추가 */}
              <button onClick={() => console.log('비밀번호 찾기')} className="text-blue-600 hover:underline">비밀번호 찾기</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6"> {/* 폼 요소 간 간격 */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">회원가입</h2>
            {/* SignupForm 컴포넌트 사용 */}
            <SignupForm onSignupSuccess={() => setActiveTab('login')} /> {/* 회원가입 성공 시 로그인 탭으로 전환 */}
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;