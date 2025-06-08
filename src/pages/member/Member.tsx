import { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header';
import { MemberFilterSection } from '../../components/member/MemberFilterSection';
import { ReusableTable } from '../../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../../components/common/reusableTableTypes';
import { MemberDetailModal, type MemberDetailData } from '../../components/member/MemberDetailModal';
 
interface Member extends MemberDetailData { // MemberDetailData 확장
  memberId: number; // id를 memberId로 변경하여 명확성 증진
  name: string;
  email: string;
  birth: string; // YYYY-MM-DD
  region: string;
  status: '활동 중' | '휴면 회원' | '정지 회원' | '탈퇴 회원'; // 프론트엔드 표시용 상태
  lastLogin: string; // YYYY-MM-DD HH:MM
  // gender와 ageGroup은 필터링을 위해 필요할 수 있으나, 테이블 표시는 선택적
  // gender?: '남성' | '여성'; // MemberDetailData 에서 MALE/FEMALE로 관리
  // ageGroup?: string; // birth로 계산 가능

  // 백엔드 응답 필드 추가 (MemberDetailData에 이미 포함된 것은 제외)
  // phone?: string;
  // totalDice?: number;
  // memberStatus?: string; // 백엔드 원본 상태값 (예: MEMBER_ACTIVE)
  // notification?: boolean;
}

// ReusableTable을 위한 Member 확장
interface MemberTableItem extends Member, TableItem {
  id: number; // ReusableTable은 id를 필수로 요구
}

const memberSortOptions = [
  { value: '접속순 (최신)', label: '접속순 (최신)' },
  { value: '접속순 (오래된)', label: '접속순 (오래된)' },
];

const mockMembers: Member[] = [
  { memberId: 1, name: '라바', email: 'ravah002@gmail.com', phone: '010-1111-1111', birth: '2000-05-01', gender: 'MALE', region: '서울특별시 강동구', totalDice: 100, memberStatus: 'MEMBER_ACTIVE', status: '활동 중', notification: true, lastLogin: '2025-05-01 12:03' },
  { memberId: 2, name: '강민지', email: 'kmg94611@gmail.com', phone: '010-2222-2222', birth: '1994-06-11', gender: 'FEMALE', region: '경기도 안산시', totalDice: 50, memberStatus: 'MEMBER_WITHDRAWN', status: '탈퇴 회원', notification: false, lastLogin: '2025-05-01 11:13' },
  { memberId: 3, name: '태코', email: 'taekho98@gmail.com', phone: '010-3333-3333', birth: '1998-12-25', gender: 'MALE', region: '인천광역시 연수구', totalDice: 200, memberStatus: 'MEMBER_ACTIVE', status: '활동 중', notification: true, lastLogin: '2025-05-01 09:53' },
  { memberId: 4, name: '김철수', email: 'chulsoo@example.com', phone: '010-4444-4444', birth: '1985-02-10', gender: 'MALE', region: '부산광역시 해운대구', totalDice: 0, memberStatus: 'MEMBER_DORMANT', status: '휴면 회원', notification: true, lastLogin: '2024-10-20 08:30' },
  { memberId: 5, name: '이영희', email: 'younghee@example.com', phone: '010-5555-5555', birth: '1999-11-05', gender: 'FEMALE', region: '대구광역시 수성구', totalDice: 10, memberStatus: 'MEMBER_SUSPENDED', status: '정지 회원', notification: false, lastLogin: '2025-03-15 17:45' },
];

const StatusBadge = ({ status }: { status: string }) => {
  let badgeColor = 'bg-gray-100 text-gray-700';
  if (status === '활동 중') {
    badgeColor = 'bg-green-100 text-green-700';
  } else if (status === '휴면 회원') {
    badgeColor = 'bg-gray-100 text-gray-700'; 
  } else if (status === '정지 회원') {
    badgeColor = 'bg-red-100 text-red-700';
  } else if (status === '탈퇴 회원') {
    badgeColor = 'bg-yellow-100 text-yellow-700'; // 노란색
  }
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}>{status}</span>;
};

export default function MemberManagement() {
  // UI 입력을 위한 필터 상태
  const [statusFilter, setStatusFilter] = useState('전체');
  const [genderFilter, setGenderFilter] = useState('전체');
  const [ageGroupFilter, setAgeGroupFilter] = useState('전체');
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');

  // API 요청 또는 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    status: '전체',
    gender: '전체',
    ageGroup: '전체',
    name: '',
    email: '',
  });

  const [sortValue, setSortValue] = useState('접속순 (최신)');
  const members : Member[] = (mockMembers); // 실제 앱에서는 API로부터 데이터를 받아오는 로직 필요
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberDetailData | null>(null);

  const handleResetFilters = () => {
    setStatusFilter('전체');
    setGenderFilter('전체');
    setAgeGroupFilter('전체');
    setNameSearch('');
    setEmailSearch('');
    // 초기화 시, appliedFilters도 초기화하여 바로 반영합니다.
    // 이렇게 하면 초기화 버튼 클릭 시 필터가 즉시 해제됩니다.
    setAppliedFilters({
      status: '전체',
      gender: '전체',
      ageGroup: '전체',
      name: '',
      email: '',
    });
  };

  const handleOpenDetailModal = (member: Member) => {
    // Member 타입을 MemberDetailData 타입으로 매핑 (필요시)
    // 현재 Member 인터페이스가 MemberDetailData를 확장하므로 직접 전달 가능
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => setIsDetailModalOpen(false);

  const handleSearch = () => {
    setAppliedFilters({
      status: statusFilter,
      gender: genderFilter,
      ageGroup: ageGroupFilter,
      name: nameSearch,
      email: emailSearch,
    });
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
    let filtered = [...members];

    if (appliedFilters.status !== '전체') {
      filtered = filtered.filter(member => member.status === appliedFilters.status);
    }
    if (appliedFilters.gender !== '전체') {
      // genderFilter는 '남성'/'여성', member.gender는 'MALE'/'FEMALE'
      const backendGender = appliedFilters.gender === '남성' ? 'MALE' : 'FEMALE';
      filtered = filtered.filter(member => member.gender === backendGender);
    }
    if (appliedFilters.ageGroup !== '전체') {
      filtered = filtered.filter(member => getAgeGroup(member.birth) === appliedFilters.ageGroup);
    }
    if (appliedFilters.name) {
      filtered = filtered.filter(member => member.name.toLowerCase().includes(appliedFilters.name.toLowerCase()));
    }
    if (appliedFilters.email) {
      filtered = filtered.filter(member => member.email.toLowerCase().includes(appliedFilters.email.toLowerCase()));
    }

    // 정렬 로직 (ReusableTable에서 처리하므로 여기서는 id 매핑만)
    // 실제 정렬은 ReusableTable에 sortOptions와 onSortChange를 전달하여 처리
    // 예시: lastLogin을 기준으로 정렬 (Date 객체로 변환하여 비교 필요)
    if (sortValue === '접속순 (최신)') {
        filtered.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
    } else if (sortValue === '접속순 (오래된)') {
        filtered.sort((a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime());
    }

    return filtered.map(member => ({ ...member, id: member.memberId }));
  }, [members, appliedFilters, sortValue]);

  const columns: ColumnDefinition<MemberTableItem>[] = [
    {
      key: 'no',
      header: 'No',
      cellRenderer: (_item, index) => index + 1,
      headerClassName: 'w-[5%]', // 또는 w-1/12 유지 시 다른 컬럼 조정
    },
    { key: 'name', header: '이름', accessor: 'name', headerClassName: 'w-[12%]' }, 
    { key: 'email', header: '이메일', accessor: 'email', headerClassName: 'w-[23%]' }, 
    { key: 'birth', header: '생년월일', accessor: 'birth', headerClassName: 'w-[13%]' }, 
    { key: 'region', header: '지역', accessor: 'region', headerClassName: 'w-[15%]' }, 
    {
      key: 'status',
      header: '상태',
      cellRenderer: (item) => <StatusBadge status={item.status} />,
      headerClassName: 'w-[12%]', // 예: w-1/12
    },
    { key: 'lastLogin', header: '마지막 접속', accessor: 'lastLogin', headerClassName: 'w-[20%]' }, 
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">회원 관리</h2>

          <MemberFilterSection
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            genderFilter={genderFilter}
            onGenderFilterChange={setGenderFilter}
            ageGroupFilter={ageGroupFilter}
            onAgeGroupFilterChange={setAgeGroupFilter}
            nameSearch={nameSearch}
            onNameSearchChange={setNameSearch}
            emailSearch={emailSearch}
            onEmailSearchChange={setEmailSearch}
            onSearch={handleSearch} // 조회 핸들러 연결
            onResetFilters={handleResetFilters}
          />

          <ReusableTable
            columns={columns}
            data={filteredAndSortedMembers}
            totalCount={filteredAndSortedMembers.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            onRowClick={handleOpenDetailModal} // 행 클릭 시 모달 열기
            sortOptions={memberSortOptions}
            emptyStateMessage="검색 결과에 해당하는 회원이 없습니다."
          />
          <MemberDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            member={selectedMember}
            isDeletedMember={false}
          />
        </main>
      </div>
    </div>
  );
}
