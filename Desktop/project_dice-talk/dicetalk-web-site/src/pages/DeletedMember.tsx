import { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/Header';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../components/ui/Select'; 
 
const statusOptions = [
  { value: '전체 상태', label: '전체 상태' },
  { value: '활동 중', label: '활동 중' },
  { value: '휴면 회원', label: '휴면 회원' },
  { value: '정지 회원', label: '정지 회원' },
  { value: '탈퇴 회원', label: '탈퇴 회원' },
];
const genderOptions = [
  { value: '전체 성별', label: '전체 성별' },
  { value: '남성', label: '남성' },
  { value: '여성', label: '여성' },
];
const ageGroupOptions = [
  { value: '전체 연령대', label: '전체 연령대' },
  { value: '10대', label: '10대' },
  { value: '20대', label: '20대' },
  { value: '30대', label: '30대' },
  { value: '40대', label: '40대' },
  { value: '50대 이상', label: '50대 이상' },
];
const sortOptions = [
  { value: 'ID 순 (최신)', label: '등록 순 (최신)' },
  { value: 'ID 순 (오래된)', label: '등록 순 (오래된)' },
];
const reasonOptions = [
  { value: '전체 사유', label: '전체 사유' },
  { value: '원하는 기능이 부족해서', label: '원하는 기능이 부족해서' },
  { value: '더 나은 서비스를 찾아서', label: '더 나은 서비스를 찾아서' },
  { value: '이용 중 불편한 경험이 있어서', label: '이용 중 불편한 경험이 있어서' },
  { value: '기타', label: '기타' },
];

const mockMembers = [
  { id: 1, name: '라바', email: 'ravah002@gmail.com', birth: '2000-05-01', region: '서울특별시 강동구', reason: '원하는 기능이 부족해서', deletedAt: '2025-05-30 12:03' },
  { id: 2, name: '강민지', email: 'kmg94611@gmail.com', birth: '1994-06-11', region: '경기도 안산시', reason: '더 나은 서비스를 찾아서', deletedAt: '2025-05-01 11:13' },
  { id: 3, name: '태코', email: 'taekho98@gmail.com', birth: '1998-12-25', region: '인천광역시 연수구', reason: '이용 중 불편한 경험이 있어서', deletedAt: '2025-05-01 09:53' },
];

export default function MemberManagement() {
  const [members] = useState(mockMembers);
  const [status, setStatus] = useState('전체 상태');
  const [gender, setGender] = useState('전체 성별');
  const [ageGroup, setAgeGroup] = useState('전체 연령대');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [region, setRegion] = useState('전체'); // 현재 요청사항에 없음
  const [sort, setSort] = useState('ID 순 (최신)'); // sortOptions의 value와 일치하도록 수정
  const [reason, setReason] = useState('전체 사유');
  
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">탈퇴 회원 관리</h2>

          {/* 필터 섹션 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-4">
              {/* 1행: 드롭다운 선택 */}
              <div className="flex flex-col">
                <label htmlFor="status-select" className="mb-1 text-sm font-medium text-gray-700">회원 상태</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status-select">
                    <SelectValue placeholder="회원 상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="gender-select" className="mb-1 text-sm font-medium text-gray-700">성별</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender-select">
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="age-select" className="mb-1 text-sm font-medium text-gray-700">연령대</label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger id="age-select">
                    <SelectValue placeholder="연령대 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroupOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="reason-select" className="mb-1 text-sm font-medium text-gray-700">사유별</label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="reason-select">
                    <SelectValue placeholder="탈퇴 사유 선택" />
                  </SelectTrigger>
                  <SelectContent>{reasonOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            {/* 2행: 검색 조회 및 버튼 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 items-end">
              <div className="flex flex-col md:col-span-1">
                <label htmlFor="name-input" className="mb-1 text-sm font-medium text-gray-700">이름</label>
                <Input id="name-input" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col md:col-span-1 lg:col-span-1">
                <label htmlFor="email-input" className="mb-1 text-sm font-medium text-gray-700">이메일</label>
                <Input id="email-input" placeholder="이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {/* 버튼들을 2행의 나머지 공간을 차지하도록 하고 우측 정렬 */}
              <div className="flex justify-end gap-3 md:col-span-1 lg:col-span-2">
                <Button variant="outline" className="px-6 w-full sm:w-auto">초기화</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto">조회</Button>
              </div>
            </div>
          </div>

          {/* 총 회원 수 및 정렬 */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">총 <strong className="text-gray-800">{members.length}</strong>명</span>
            <div className="w-48">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="정렬 기준 선택" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 회원 목록 테이블 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-slate-100">
                <tr>
                  {['No', '이름', '이메일', '생년월일', '지역', '탈퇴 사유', '탈퇴 일자'].map(header => (
                     <th
                      key={header}
                      className="py-3 px-4 text-center text-xs text-slate-600 uppercase tracking-wider font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {members.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-center text-gray-700">{idx+1}</td>
                    <td className="py-3 px-4 text-center text-gray-700 font-medium">{m.name}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{m.email}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{m.birth}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{m.region}</td>
                    <td className="py-3 px-4 text-center text-gray-700">
                      <div className="w-40 md:w-64 truncate" title={m.reason}>{m.reason}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{m.deletedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
