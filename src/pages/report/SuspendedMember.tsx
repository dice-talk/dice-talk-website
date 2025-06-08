// src/pages/member/SuspendedMember.tsx
import { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { SuspendedMemberFilterSection } from '../../components/report/SuspendedMemberFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { MemberDetailModal, type MemberDetailData, type WarningDetail } from '../../components/member/MemberDetailModal';

interface SuspendedMember extends MemberDetailData { // MemberDetailData 확장
  // MemberDetailData에 이미 있는 필드: memberId, name, email, birth, region, gender, phone, memberStatus 등
  suspensionReason: string; // 정지 사유
  suspensionStartDate: string; // YYYY-MM-DD HH:MM
  warnings?: WarningDetail[]; // 경고 내역
}

interface SuspendedMemberTableItem extends SuspendedMember, TableItem {
  id: number;
}
 
const suspendedMemberSortOptions = [
  { value: 'suspensionStartDate_desc', label: '정지 시작일 (최신)' },
  { value: 'suspensionStartDate_asc', label: '정지 시작일 (오래된)' },
  { value: 'memberId_desc', label: '회원 ID (최신)' },
  { value: 'memberId_asc', label: '회원 ID (오래된)' },
];

const mockSuspendedMembers: SuspendedMember[] = [
  { 
    memberId: 5, name: '이영희', email: 'younghee@example.com', birth: '1999-11-05', gender: 'FEMALE', region: '대구광역시 수성구', 
    suspensionReason: '부적절한 언행 반복', suspensionStartDate: '2025-03-15 17:45', memberStatus: 'MEMBER_SUSPENDED',
    warnings: [
      { warningId: 'warn_001', reason: '욕설 사용', reportedAt: '2025-03-01', chatTime: '2025-03-01 10:00' },
      { warningId: 'warn_002', reason: '비방적인 발언', reportedAt: '2025-03-10', chatTime: '2025-03-10 14:30' },
    ]
  },
  { 
    memberId: 8, name: '홍길동', email: 'gildong@example.com', birth: '1992-08-15', gender: 'MALE', region: '부산광역시 중구', 
    suspensionReason: '스팸/광고 메시지 다수 발송', suspensionStartDate: '2025-05-20 10:00', memberStatus: 'MEMBER_SUSPENDED',
    warnings: [
      { warningId: 'warn_003', reason: '광고성 메시지 발송', reportedAt: '2025-05-10', chatTime: '2025-05-10 09:00' },
      { warningId: 'warn_004', reason: '동일 광고 반복 게시', reportedAt: '2025-05-15', chatTime: '2025-05-15 11:20' },
      { warningId: 'warn_005', reason: '경고 후에도 광고 지속', reportedAt: '2025-05-19', chatTime: '2025-05-19 16:00' },
    ]
  },
  { 
    memberId: 9, name: '김민준', email: 'minjun@example.com', birth: '2001-01-20', gender: 'MALE', region: '광주광역시 서구', 
    suspensionReason: '운영규칙 위반 (타인 사칭)', suspensionStartDate: '2025-06-01 00:00', memberStatus: 'MEMBER_SUSPENDED',
    warnings: [ // 경고 3개 추가
      { warningId: 'warn_007', reason: '타 사용자 프로필 사진 도용', reportedAt: '2025-05-20', chatTime: '2025-05-20 18:00' },
      { warningId: 'warn_008', reason: '타 사용자 닉네임 사칭', reportedAt: '2025-05-23', chatTime: '2025-05-23 14:50' },
      { warningId: 'warn_006', reason: '타 사용자 프로필 도용 시도', reportedAt: '2025-05-25', chatTime: '2025-05-25 20:15' },
    ]
  },
  { 
    memberId: 10, name: '박서연', email: 'seoyeon@example.com', birth: '1995-07-07', gender: 'FEMALE', region: '대전광역시 유성구', 
    suspensionReason: '기타 운영 정책 위반', suspensionStartDate: '2025-04-01 12:00', memberStatus: 'MEMBER_SUSPENDED',
    warnings: [] // 경고 내역이 없을 수도 있음
  },
];

export default function SuspendedMemberManagement() {
  // useState를 사용하여 mock 데이터 관리 (실제 API 연동 시 useEffect로 데이터 가져옴)
  const [suspendedMembers] = useState<SuspendedMember[]>(mockSuspendedMembers);
  // UI 입력을 위한 필터 상태
  const [genderFilter, setGenderFilter] = useState('전체');
  const [ageGroupFilter, setAgeGroupFilter] = useState('전체');
  const [suspensionReasonFilter, setSuspensionReasonFilter] = useState('전체');
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [sortValue, setSortValue] = useState('suspensionStartDate_desc');

  // 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    gender: '전체',
    ageGroup: '전체',
    suspensionReason: '전체',
    name: '',
    email: '',
  });


  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberDetailData | null>(null);

  const handleOpenDetailModal = (member: SuspendedMember) => {
    // SuspendedMember 타입이 MemberDetailData를 확장하므로 직접 전달 가능
    // memberStatus는 SuspendedMember에 이미 포함되어 있으므로, MemberDetailModal에서 활용
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMember(null);
  };

  const handleResetFilters = () => {
    // UI 필터 상태 초기화
    setGenderFilter('전체');
    setAgeGroupFilter('전체');
    setSuspensionReasonFilter('전체');
    setNameSearch('');
    setEmailSearch('');
    setSortValue('suspensionStartDate_desc');
    // 적용된 필터 상태도 초기화
    setAppliedFilters({
      gender: '전체',
      ageGroup: '전체',
      suspensionReason: '전체',
      name: '',
      email: '',
    });
    // setCurrentPage(1); // 페이지가 있다면 첫 페이지로 이동 (현재 페이지 상태 없음)
  };

  const handleSearch = () => { // handleApplyFilters -> handleSearch
    setAppliedFilters({
      gender: genderFilter,
      ageGroup: ageGroupFilter,
      suspensionReason: suspensionReasonFilter,
      name: nameSearch,
      email: emailSearch,
    });
    // setCurrentPage(1); // 페이지가 있다면 첫 페이지로 이동
  };

  const getAgeGroup = (birthDate: string): string => {
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    if (age < 20) return '10대';
    if (age < 30) return '20대';
    if (age < 40) return '30대';
    if (age < 50) return '40대';
    return '50대 이상';
  };

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = [...suspendedMembers];

    if (appliedFilters.gender !== '전체') {
      const backendGender = appliedFilters.gender === '남성' ? 'MALE' : 'FEMALE';
      filtered = filtered.filter(member => member.gender === backendGender);
    }
    if (appliedFilters.ageGroup !== '전체') {
      filtered = filtered.filter(member => getAgeGroup(member.birth) === appliedFilters.ageGroup);
    }
    if (appliedFilters.suspensionReason !== '전체') {
      filtered = filtered.filter(member => member.suspensionReason === appliedFilters.suspensionReason);
    }
    if (appliedFilters.name) {
      filtered = filtered.filter(member => member.name.toLowerCase().includes(appliedFilters.name.toLowerCase()));
    }
    if (appliedFilters.email) {
      filtered = filtered.filter(member => member.email.toLowerCase().includes(appliedFilters.email.toLowerCase()));
    }

    // 정렬 로직
    if (sortValue === 'suspensionStartDate_desc') filtered.sort((a, b) => new Date(b.suspensionStartDate).getTime() - new Date(a.suspensionStartDate).getTime());
    else if (sortValue === 'suspensionStartDate_asc') filtered.sort((a, b) => new Date(a.suspensionStartDate).getTime() - new Date(b.suspensionStartDate).getTime());
    else if (sortValue === 'memberId_desc') filtered.sort((a, b) => b.memberId - a.memberId);
    else if (sortValue === 'memberId_asc') filtered.sort((a, b) => a.memberId - b.memberId);

    return filtered.map(member => ({ ...member, id: member.memberId }));
  }, [suspendedMembers, appliedFilters, sortValue]);

  const columns: ColumnDefinition<SuspendedMemberTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index + 1, headerClassName: 'w-[5%]' },
    { key: 'name', header: '이름', accessor: 'name', headerClassName: 'w-[10%]' },
    { key: 'email', header: '이메일', accessor: 'email', headerClassName: 'w-[15%]' },
    { key: 'birth', header: '생년월일', accessor: 'birth', headerClassName: 'w-[10%]' },
    { key: 'region', header: '지역', accessor: 'region', headerClassName: 'w-[10%]' },
    { key: 'suspensionReason', header: '정지 사유', accessor: 'suspensionReason', headerClassName: 'w-[15%] text-left', cellClassName: 'text-left truncate', cellRenderer: (item) => <div title={item.suspensionReason}>{item.suspensionReason}</div> },
    { key: 'suspensionStartDate', header: '정지 시작일', accessor: 'suspensionStartDate', headerClassName: 'w-[15%]' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">정지 회원 관리</h2>
          <SuspendedMemberFilterSection
            genderFilter={genderFilter} onGenderFilterChange={setGenderFilter}
            ageGroupFilter={ageGroupFilter} onAgeGroupFilterChange={setAgeGroupFilter}
            suspensionReasonFilter={suspensionReasonFilter} onSuspensionReasonFilterChange={setSuspensionReasonFilter}
            nameSearch={nameSearch} onNameSearchChange={setNameSearch}
            emailSearch={emailSearch} onEmailSearchChange={setEmailSearch}
            onResetFilters={handleResetFilters}
            onSearch={handleSearch} // onApplyFilters -> onSearch로 변경 및 핸들러 연결
          />
          <ReusableTable
            columns={columns}
            data={filteredAndSortedMembers}
            totalCount={filteredAndSortedMembers.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={suspendedMemberSortOptions}
            emptyStateMessage="정지된 회원이 없습니다."
            onRowClick={handleOpenDetailModal} // 행 클릭 시 모달 열기
          />
          <MemberDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            member={selectedMember}
            isDeletedMember={false} // 정지 회원은 탈퇴 회원이 아님
          />
        </main>
      </div>
    </div>
  );
}