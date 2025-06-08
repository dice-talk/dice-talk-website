// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
// import { useAuthStore, useUserStore } from '../../stores/useUserStore'; // useUserStore 임포트 추가
import { useAuthStore } from '../../stores/useUserStore'; // useUserStore 임포트 추가
import Button from '../../components/ui/Button'; // Button 컴포넌트 임포트
import { Input } from '../../components/ui/Input'; // Input 컴포넌트 임포트
import SignupForm from '../../components/auth/SignupForm'; // SignupForm 컴포넌트 임포트 (새로 생성될 파일)

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login'); // 'login' 또는 'signup'
  const [loginId, setLoginId] = useState(''); // 아이디 또는 이메일
  const [loginPassword, setLoginPassword] = useState(''); // 비밀번호
  const authLoginAction = useAuthStore((state) => state.login); // useAuthStore의 login (isLoggedIn 설정용)
  // const userSetUserAction = useUserStore((state) => state.setUser); // useUserStore의 setUser (사용자 정보 및 토큰 저장용)
  const navigate = useNavigate(); //페이지 이동 

  const handleLogin = async () => {
    try {
      // login API 함수가 서버 응답을 반환한다고 가정합니다.
      // 서버 응답에는 accessToken 또는 Authorization 헤더에 토큰이 포함되어야 합니다.
      await login({ username: loginId, password: loginPassword });

      // 서버 응답 구조에 따라 토큰을 추출합니다.
      // 예시1: 응답 바디에 { accessToken: "..." } 형태로 토큰이 오는 경우
      // const tokenFromBody = response.data?.accessToken;
      // 예시2: 응답 헤더에 'Authorization: Bearer ...' 형태로 토큰이 오는 경우
      // const tokenFromHeader = response.headers?.authorization?.replace('Bearer ', '') || response.headers?.Authorization?.replace('Bearer ', '');
      // const token = tokenFromBody || tokenFromHeader;
      // const token = tokenFromHeader;
      const isToken = localStorage.getItem("accessToken")?.length !== 0;
      if (isToken) {
        authLoginAction(); // useAuthStore의 login 액션을 호출하여 isLoggedIn 상태를 true로 변경
        alert('로그인 성공!');
        navigate('/home');
      } else {
        // 실제로는 이 부분에 도달하기 전에 login API 함수 내부나 catch 블록에서 오류 처리될 가능성이 높습니다.
        alert('로그인 실패: 서버로부터 토큰을 받지 못했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
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