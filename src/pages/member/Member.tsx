import { useState, useMemo, useEffect, useCallback } from "react";
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
import type { MemberMyInfoResponse, Gender } from "../../types/memberTypes";
import StatusBadge from "../../components/ui/StatusBadge";
import { mapFrontendStatusToBackend } from "../../lib/memberUtils"; // 유틸리티 함수 임포트
import { Pagination } from "../../components/common/Pagination";

interface MemberTableItem extends MemberMyInfoResponse, TableItem {
  id: number;
}

const memberSortOptions = [
  { value: "가입 순 (최신)", label: "가입일 (최신순)" },
  { value: "가입 순 (오래된)", label: "가입일 (오래된순)" },
];

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchMembers = useCallback(
    async (page = 1, isReset = false) => {
      try {
        const params = {
          page,
          size: itemsPerPage,
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
            ? mapFrontendStatusToBackend(statusFilter)
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
        setCurrentPage(response.data.pageInfo.page);
        setTotalPages(response.data.pageInfo.totalPages);
        setTotalCount(response.data.pageInfo.totalElements);
      } catch (error) {
        console.error("회원 목록을 불러오는데 실패했습니다:", error);
      }
    },
    [search, sortValue, statusFilter, genderFilter, ageGroupFilter]
  );

  useEffect(() => {
    fetchMembers(1);
  }, []);

  const handleResetFilters = () => {
    setStatusFilter("전체");
    setGenderFilter("전체");
    setAgeGroupFilter("전체");
    setSearch("");
    fetchMembers(1, true);
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
    fetchMembers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMembers(page);
  };

  const filteredAndSortedMembers = useMemo(() => {
    return members.map((member) => ({ ...member, id: member.memberId }));
  }, [members]);

  const columns: ColumnDefinition<MemberTableItem>[] = [
    {
      key: "no",
      header: "No",
      cellRenderer: (item) => item.memberId,
      headerClassName: "w-[8%]",
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
      headerClassName: "w-[20%]",
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
      // item.memberStatus는 'MEMBER_ACTIVE'와 같은 백엔드 상태 값
      cellRenderer: (item: MemberTableItem) => (
        <StatusBadge status={item.memberStatus} type="member" />
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
            totalCount={totalCount}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            onRowClick={handleOpenDetailModal}
            sortOptions={memberSortOptions}
            emptyStateMessage="검색 결과에 해당하는 회원이 없습니다."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
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