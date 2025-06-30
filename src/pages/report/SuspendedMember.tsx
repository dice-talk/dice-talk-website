import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import { SuspendedMemberFilterSection } from "../../components/report/SuspendedMemberFilterSection";
import { ReusableTable } from "../../components/common/ReusableTable";
import type {
  ColumnDefinition,
  TableItem,
} from "../../components/common/reusableTableTypes";
import { getBannedMembers } from "../../api/memberApi";
import type { Gender, BannedMemberListResponse } from "../../types/memberTypes";

interface SuspendedMember extends BannedMemberListResponse {
  id: number;
}

interface SuspendedMemberTableItem extends SuspendedMember, TableItem {
  id: number;
}

const suspendedMemberSortOptions = [
  { value: "suspensionStartDate_desc", label: "정지 시작일 (최신순)" },
  { value: "suspensionStartDate_asc", label: "정지 시작일 (오래된순)" },
  { value: "memberId_desc", label: "회원 ID (최신순)" },
  { value: "memberId_asc", label: "회원 ID (오래된순)" },
];

export default function SuspendedMemberManagement() {
  const navigate = useNavigate();
  const [suspendedMembers, setSuspendedMembers] = useState<SuspendedMember[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // UI 입력을 위한 필터 상태
  const [genderFilter, setGenderFilter] = useState("전체");
  const [ageGroupFilter, setAgeGroupFilter] = useState("전체");
  const [suspensionReasonFilter, setSuspensionReasonFilter] = useState("전체");
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [sortValue, setSortValue] = useState("suspensionStartDate_desc");

  // 실제 필터링에 사용될 필터 상태
  const [appliedFilters, setAppliedFilters] = useState({
    gender: "전체",
    ageGroup: "전체",
    suspensionReason: "전체",
    name: "",
    email: "",
  });

  const fetchSuspendedMembers = async () => {
    try {
      setLoading(true);
      const response = await getBannedMembers({
        page: currentPage,
        size: itemsPerPage,
        search: nameSearch || emailSearch,
        gender:
          genderFilter !== "전체"
            ? ((genderFilter === "남성" ? "MALE" : "FEMALE") as Gender)
            : undefined,
        ageGroup: ageGroupFilter !== "전체" ? ageGroupFilter : undefined,
        sort: sortValue,
      });

      // BannedMemberListResponse를 SuspendedMember로 변환
      const convertedMembers: SuspendedMember[] = response.data.data.map(
        (member) => ({
          ...member,
          id: member.memberId,
        })
      );

      setSuspendedMembers(convertedMembers);
      setTotalCount(response.data.pageInfo.totalElements);
    } catch (error) {
      console.error("정지 회원 목록을 불러오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuspendedMembers();
  }, [currentPage, itemsPerPage, appliedFilters, sortValue]);

  const handleOpenDetailModal = (member: SuspendedMember) => {
    navigate(`/reports/suspended/${member.memberId}`);
  };

  const handleResetFilters = () => {
    setGenderFilter("전체");
    setAgeGroupFilter("전체");
    setSuspensionReasonFilter("전체");
    setNameSearch("");
    setEmailSearch("");
    setSortValue("suspensionStartDate_desc");
    setAppliedFilters({
      gender: "전체",
      ageGroup: "전체",
      suspensionReason: "전체",
      name: "",
      email: "",
    });
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setAppliedFilters({
      gender: genderFilter,
      ageGroup: ageGroupFilter,
      suspensionReason: suspensionReasonFilter,
      name: nameSearch,
      email: emailSearch,
    });
    setCurrentPage(1);
  };

  const filteredAndSortedMembers = useMemo(() => {
    return suspendedMembers.map((member) => ({
      ...member,
      id: member.memberId,
    }));
  }, [suspendedMembers]);

  const columns: ColumnDefinition<SuspendedMemberTableItem>[] = [
    {
      key: "no",
      header: "No",
      cellRenderer: (_item, index) => index + 1,
      headerClassName: "w-[5%]",
    },
    {
      key: "name",
      header: "이름",
      accessor: "name",
      headerClassName: "w-[10%]",
    },
    {
      key: "email",
      header: "이메일",
      accessor: "email",
      headerClassName: "w-[15%]",
    },
    {
      key: "birth",
      header: "생년월일",
      accessor: "birth",
      headerClassName: "w-[10%]",
    },
    {
      key: "region",
      header: "지역",
      accessor: "region",
      headerClassName: "w-[10%]",
    },
    {
      key: "suspensionStartDate",
      header: "정지 시작일",
      accessor: "suspensionStartDate",
      headerClassName: "w-[15%]",
      cellRenderer: (item) => {
        const date = new Date(item.suspensionStartDate);
        return date.toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Seoul",
        });
      },
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            정지 회원 관리
          </h2>
          <SuspendedMemberFilterSection
            genderFilter={genderFilter}
            onGenderFilterChange={setGenderFilter}
            ageGroupFilter={ageGroupFilter}
            onAgeGroupFilterChange={setAgeGroupFilter}
            suspensionReasonFilter={suspensionReasonFilter}
            onSuspensionReasonFilterChange={setSuspensionReasonFilter}
            nameSearch={nameSearch}
            onNameSearchChange={setNameSearch}
            emailSearch={emailSearch}
            onEmailSearchChange={setEmailSearch}
            onResetFilters={handleResetFilters}
            onSearch={handleSearch}
          />
          <ReusableTable
            columns={columns}
            data={filteredAndSortedMembers}
            totalCount={totalCount}
            sortValue={sortValue}
            onSortChange={setSortValue}
            sortOptions={suspendedMemberSortOptions}
            emptyStateMessage="정지된 회원이 없습니다."
            onRowClick={handleOpenDetailModal}
            isLoading={loading}
          />
        </main>
      </div>
    </div>
  );
}
