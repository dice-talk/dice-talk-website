import { useState } from 'react';
import { adminSignup } from '../../api/auth';
import axios, { AxiosError } from 'axios';
import type { AdminSignupRequest } from '../../types/authTypes'; // AdminSignupRequest 타입 임포트
import { Input } from '../ui/Input'; // Input 컴포넌트 임포트
import Button from '../ui/Button'; // Button 컴포넌트 임포트

interface SignupFormProps {
  onSignupSuccess: () => void; // 회원가입 성공 시 호출될 함수 (예: 탭 전환)
  // 필요한 경우 로딩 상태 등을 부모로부터 받을 수 있습니다.
  // isLoading: boolean;
}

// Signup 컴포넌트 이름을 SignupForm으로 변경하고, 페이지 레이아웃 제거
export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
  // navigate는 부모 컴포넌트(Login.tsx)에서 처리하므로 여기서는 제거
  // const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 필드 추가

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const signupData: AdminSignupRequest = {
        email,
        name, 
        password,
      };
      await adminSignup(signupData);

      alert('회원가입 성공!');
      onSignupSuccess(); // 성공 시 부모 컴포넌트의 콜백 호출
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            const axiosErr = err as AxiosError<{ message: string }>;
            alert(`회원가입 실패: ${axiosErr.response?.data?.message || axiosErr.response?.statusText}`);
        } else {
            alert('회원가입 실패: 알 수 없는 오류');
        }
    }
};

   // TODO: 비밀번호 확인 로직 추가
   const isPasswordMatch = password === confirmPassword || confirmPassword === '';

   return (
    // 페이지 레이아웃 제거, 폼 요소만 남김
    <div className="space-y-4"> {/* 간격 조정을 위해 div 추가 */}
      {/* <h1 className="text-2xl font-bold">관리자 회원가입</h1> {/* 제목은 부모에서 관리 */}
      <div>
        <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
        <Input
          id="signupEmail"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="signupName" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
        <Input
          id="signupName"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
        <Input
          id="signupPassword"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="signupConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
        <Input
          id="signupConfirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!isPasswordMatch && confirmPassword && <p className="mt-1 text-xs text-red-600">비밀번호가 일치하지 않습니다.</p>}
      </div>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handleSignup}
      >
        회원가입
      </Button>
    </div>
  );
}