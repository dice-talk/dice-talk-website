import { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import { MemberFilterSection } from "../../components/member/MemberFilterSection";
import { ReusableTable } from "../../components/common/ReusableTable";
import type {
  ColumnDefinition,
  TableItem,
} from "../../components/common/reusableTableTypes";
import { MemberDetailModal } from "../../components/member/MemberDetailModal";
import { getMembers } from "../../api/memberApi";
import type {
  MemberMyInfoResponse,
  MemberStatus,
  Gender,
} from "../../types/memberTypes";

interface MemberTableItem extends MemberMyInfoResponse, TableItem {
  id: number;
}

const memberSortOptions = [
  { value: "가입 순 (최신)", label: "가입 순 (최신)" },
  { value: "가입 순 (오래된)", label: "가입 순 (오래된)" },
];

const formatMemberStatus = (status: MemberStatus): string => {
  switch (status) {
    case "MEMBER_ACTIVE":
      return "활동 중";
    case "MEMBER_BANNED":
      return "정지 회원";
    case "MEMBER_DELETED":
      return "탈퇴 회원";
    default:
      return "정보 없음";
  }
};

const convertStatusFilterToEnum = (
  status: string
): MemberStatus | undefined => {
  switch (status) {
    case "활동 중":
      return "MEMBER_ACTIVE";
    case "정지 회원":
      return "MEMBER_BANNED";
    case "탈퇴 회원":
      return "MEMBER_DELETED";
    default:
      return undefined;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  let badgeColor = "bg-gray-100 text-gray-700";
  if (status === "활동 중") {
    badgeColor = "bg-green-100 text-green-700";
  } else if (status === "휴면 회원") {
    badgeColor = "bg-gray-100 text-gray-700";
  } else if (status === "정지 회원") {
    badgeColor = "bg-red-100 text-red-700";
  } else if (status === "탈퇴 회원") {
    badgeColor = "bg-yellow-100 text-yellow-700";
  }
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}
    >
      {status}
    </span>
  );
};

export default function MemberManagement() {
  const [members, setMembers] = useState<MemberMyInfoResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [genderFilter, setGenderFilter] = useState("전체");
  const [ageGroupFilter, setAgeGroupFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("가입 순 (최신)");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<MemberMyInfoResponse | null>(null);

  const fetchMembers = async (isReset: boolean = false) => {
    try {
      const params = {
        page: 1,
        size: 10,
        search: isReset ? undefined : search.trim() || undefined,
        sort:
          sortValue === "가입 순 (최신)"
            ? "memberId/desc"
            : sortValue === "가입 순 (오래된)"
            ? "memberId/asc"
            : undefined,
        memberStatus: isReset
          ? undefined
          : statusFilter !== "전체"
          ? convertStatusFilterToEnum(statusFilter)
          : undefined,
        gender: isReset
          ? undefined
          : genderFilter !== "전체"
          ? ((genderFilter === "남성" ? "MALE" : "FEMALE") as Gender)
          : undefined,
        ageGroup: isReset
          ? undefined
          : ageGroupFilter !== "전체"
          ? ageGroupFilter
          : undefined,
      };

      console.log("API 요청 파라미터:", params);

      const response = await getMembers(params);
      setMembers(response.data.data);
    } catch (error) {
      console.error("회원 목록을 불러오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [sortValue]);

  const handleResetFilters = () => {
    setStatusFilter("전체");
    setGenderFilter("전체");
    setAgeGroupFilter("전체");
    setSearch("");
    fetchMembers(true);
  };

  const handleSearch = () => {
    fetchMembers();
  };

  const handleOpenDetailModal = (member: MemberMyInfoResponse) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => setIsDetailModalOpen(false);

  const handleSortChange = (newSortValue: string) => {
    setSortValue(newSortValue);
  };

  const filteredAndSortedMembers = useMemo(() => {
    return members.map((member) => ({ ...member, id: member.memberId }));
  }, [members]);

  const columns: ColumnDefinition<MemberTableItem>[] = [
    {
      key: "no",
      header: "No",
      cellRenderer: (item) => item.memberId,
      headerClassName: "w-[5%]",
    },
    {
      key: "name",
      header: "이름",
      accessor: "name",
      headerClassName: "w-[15%]",
    },
    {
      key: "email",
      header: "이메일",
      accessor: "email",
      headerClassName: "w-[30%]",
    },
    {
      key: "birth",
      header: "생년월일",
      accessor: "birth",
      headerClassName: "w-[15%]",
    },
    {
      key: "region",
      header: "지역",
      accessor: "region",
      headerClassName: "w-[20%]",
    },
    {
      key: "memberStatus",
      header: "상태",
      cellRenderer: (item) => (
        <StatusBadge status={formatMemberStatus(item.memberStatus)} />
      ),
      headerClassName: "w-[15%]",
    },
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
            search={search}
            onSearchChange={setSearch}
            onSearch={handleSearch}
            onResetFilters={handleResetFilters}
          />

          <ReusableTable
            columns={columns}
            data={filteredAndSortedMembers}
            totalCount={filteredAndSortedMembers.length}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            onRowClick={handleOpenDetailModal}
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
