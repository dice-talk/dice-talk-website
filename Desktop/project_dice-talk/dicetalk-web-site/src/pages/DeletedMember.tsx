import { useState, useMemo } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/Header';
import { DeletedMemberFilterSection } from '../components/member/DeletedMemberFilterSection';
import { ReusableTable } from '../components/common/ReusableTable';
import type { ColumnDefinition, TableItem } from '../components/common/reusableTableTypes';
 
interface DeletedMember {
  memberId: number;
  name: string;
  email: string;
  birth: string; // YYYY-MM-DD
  region: string;
  reason: string; // 탈퇴 사유
  deletedAt: string; // YYYY-MM-DD HH:MM
  gender?: '남성' | '여성'; // 필터링을 위해 추가
  // status는 '탈퇴 회원'으로 고정될 것이므로 인터페이스에서 제외하거나, 항상 '탈퇴 회원'으로 설정
}

// ReusableTable을 위한 DeletedMember 확장
interface DeletedMemberTableItem extends DeletedMember, TableItem {
  id: number; // ReusableTable은 id를 필수로 요구
}

const deletedMemberSortOptions = [
  { value: 'ID 순 (최신)', label: '등록 순 (최신)' },
  { value: 'ID 순 (오래된)', label: '등록 순 (오래된)' },
  { value: '탈퇴일 순 (최신)', label: '탈퇴일 순 (최신)' },
  { value: '탈퇴일 순 (오래된)', label: '탈퇴일 순 (오래된)' },
];

const mockDeletedMembers: DeletedMember[] = [
  { memberId: 1, name: '라바', email: 'ravah002@gmail.com', birth: '2000-05-01', region: '서울특별시 강동구', reason: '원하는 기능이 부족해서', deletedAt: '2025-05-30 12:03', gender: '남성' },
  { memberId: 2, name: '강민지', email: 'kmg94611@gmail.com', birth: '1994-06-11', region: '경기도 안산시', reason: '더 나은 서비스를 찾아서', deletedAt: '2025-05-01 11:13', gender: '여성' },
  { memberId: 3, name: '태코', email: 'taekho98@gmail.com', birth: '1998-12-25', region: '인천광역시 연수구', reason: '이용 중 불편한 경험이 있어서', deletedAt: '2025-05-01 09:53', gender: '남성' },
  { memberId: 6, name: '박지성', email: 'jisung@example.com', birth: '1981-02-25', region: '전라북도 고창군', reason: '기타', deletedAt: '2025-04-15 10:00', gender: '남성' },
  { memberId: 7, name: '김연아', email: 'yunakim@example.com', birth: '1990-09-05', region: '경기도 군포시', reason: '원하는 기능이 부족해서', deletedAt: '2025-03-20 18:30', gender: '여성' },
];

export default function DeletedMemberManagement() {
  const deletedMembers: DeletedMember[] = mockDeletedMembers;
  const [statusFilter, setStatusFilter] = useState('탈퇴 회원'); // 기본값 '탈퇴 회원'
  const [genderFilter, setGenderFilter] = useState('전체');
  const [ageGroupFilter, setAgeGroupFilter] = useState('전체');
  const [reasonFilter, setReasonFilter] = useState('전체');
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [sortValue, setSortValue] = useState('탈퇴일 순 (최신)');

  const handleResetFilters = () => {
    setStatusFilter('탈퇴 회원'); // 초기화 시에도 '탈퇴 회원' 유지 또는 '전체'로 변경 가능
    setGenderFilter('전체');
    setAgeGroupFilter('전체');
    setReasonFilter('전체');
    setNameSearch('');
    setEmailSearch('');
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
    let filtered = [...deletedMembers];

    // Status 필터는 '탈퇴 회원'만 해당되므로, 실제 필터링 로직은 필요 없을 수 있음
    // 만약 statusFilter가 '전체'를 포함한다면 아래 로직 필요
    // if (statusFilter !== '전체') {
    //   filtered = filtered.filter(member => member.status === statusFilter); // Member 인터페이스에 status가 있다면
    // }

    if (genderFilter !== '전체') {
      filtered = filtered.filter(member => member.gender === genderFilter);
    }
    if (ageGroupFilter !== '전체') {
      filtered = filtered.filter(member => getAgeGroup(member.birth) === ageGroupFilter);
    }
    if (reasonFilter !== '전체') {
      filtered = filtered.filter(member => member.reason === reasonFilter);
    }
    if (nameSearch) {
      filtered = filtered.filter(member => member.name.toLowerCase().includes(nameSearch.toLowerCase()));
    }
    if (emailSearch) {
      filtered = filtered.filter(member => member.email.toLowerCase().includes(emailSearch.toLowerCase()));
    }

    if (sortValue === 'ID 순 (최신)') {
      filtered.sort((a, b) => b.memberId - a.memberId);
    } else if (sortValue === 'ID 순 (오래된)') {
      filtered.sort((a, b) => a.memberId - b.memberId);
    } else if (sortValue === '탈퇴일 순 (최신)') {
      filtered.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
    } else if (sortValue === '탈퇴일 순 (오래된)') {
      filtered.sort((a, b) => new Date(a.deletedAt).getTime() - new Date(b.deletedAt).getTime());
    }

    return filtered.map(member => ({ ...member, id: member.memberId }));
  }, [deletedMembers, genderFilter, ageGroupFilter, reasonFilter, nameSearch, emailSearch, sortValue]);

  const columns: ColumnDefinition<DeletedMemberTableItem>[] = [
    { key: 'no', header: 'No', cellRenderer: (_item, index) => index + 1, headerClassName: 'w-[5%]' },
    { key: 'name', header: '이름', accessor: 'name', headerClassName: 'w-[12%]' },
    { key: 'email', header: '이메일', accessor: 'email', headerClassName: 'w-[18%]' },
    { key: 'birth', header: '생년월일', accessor: 'birth', headerClassName: 'w-[15%]' },
    { key: 'region', header: '지역', accessor: 'region', headerClassName: 'w-[15%]' },
    {
      key: 'reason',
      header: '탈퇴 사유',
      accessor: 'reason',
      headerClassName: 'w-[25%] text-left',
      cellClassName: 'text-left',
      cellRenderer: (item) => <div className="w-full truncate" title={item.reason}>{item.reason}</div>,
    },
    { key: 'deletedAt', header: '탈퇴 일자', accessor: 'deletedAt', headerClassName: 'w-[15%]' },
  ];
  
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">탈퇴 회원 관리</h2>

          <DeletedMemberFilterSection
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            genderFilter={genderFilter}
            onGenderFilterChange={setGenderFilter}
            ageGroupFilter={ageGroupFilter}
            onAgeGroupFilterChange={setAgeGroupFilter}
            reasonFilter={reasonFilter}
            onReasonFilterChange={setReasonFilter}
            nameSearch={nameSearch}
            onNameSearchChange={setNameSearch}
            emailSearch={emailSearch}
            onEmailSearchChange={setEmailSearch}
            onResetFilters={handleResetFilters}
          />

          <ReusableTable
            columns={columns}
            data={filteredAndSortedMembers}
            totalCount={filteredAndSortedMembers.length}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={deletedMemberSortOptions}
            emptyStateMessage="탈퇴한 회원이 없습니다."
          />
        </main>
      </div>
    </div>
  );
}
