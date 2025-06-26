import { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import { DeletedMemberFilterSection } from "../../components/member/DeletedMemberFilterSection";
import { ReusableTable } from "../../components/common/ReusableTable";
import type {
  ColumnDefinition,
  TableItem,
} from "../../components/common/reusableTableTypes";
import { MemberDetailModal } from "../../components/member/MemberDetailModal";
import { getDeletedMembers } from "../../api/memberApi";
import type { DeletedMemberResponse, Gender } from "../../types/memberTypes";

interface DeletedMemberTableItem extends DeletedMemberResponse, TableItem {
  id: number;
}

const deletedMemberSortOptions = [
  { value: "탈퇴일 순 (최신)", label: "탈퇴일 (최신순)" },
  { value: "탈퇴일 순 (오래된)", label: "탈퇴일 (오래된순)" },
];

export default function DeletedMemberManagement() {
  const [deletedMembers, setDeletedMembers] = useState<DeletedMemberResponse[]>(
    []
  );
  const [genderFilter, setGenderFilter] = useState("전체");
  const [ageGroupFilter, setAgeGroupFilter] = useState("전체");
  const [reasonFilter, setReasonFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("탈퇴일 순 (최신)");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<DeletedMemberResponse | null>(null);

  const fetchDeletedMembers = async (isReset: boolean = false) => {
    try {
      const params = {
        page: 1,
        size: 10,
        search: isReset ? undefined : search.trim() || undefined,
        sort:
          sortValue === "탈퇴일 순 (최신)"
            ? "deletedAt/desc"
            : sortValue === "탈퇴일 순 (오래된)"
            ? "deletedAt/asc"
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
        reason: isReset
          ? undefined
          : reasonFilter !== "전체"
          ? reasonFilter
          : undefined,
      };

      console.log("API 요청 파라미터:", params);

      const response = await getDeletedMembers(params);
      setDeletedMembers(response.data.data);
    } catch (error) {
      console.error("탈퇴 회원 목록을 불러오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    // 초기 로드 시 또는 정렬 값 변경 시에만 데이터 조회
    fetchDeletedMembers();
  }, [sortValue]); 

  const handleResetFilters = () => {
    setGenderFilter("전체");
    setAgeGroupFilter("전체");
    setReasonFilter("전체");
    setSearch("");
    fetchDeletedMembers(true);
  };

  const handleSearch = () => {
    fetchDeletedMembers();
  };

  const handleOpenDetailModal = (member: DeletedMemberResponse) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => setIsDetailModalOpen(false);

  const handleSortChange = (newSortValue: string) => {
    setSortValue(newSortValue);
    // fetchDeletedMembers(); // 정렬 변경 시 데이터 다시 로드 (API가 정렬 파라미터를 지원하고, fetchDeletedMembers가 sortValue를 사용해야 함)
  };

  const filteredAndSortedMembers = useMemo(() => {
    return deletedMembers.map((member) => ({ ...member, id: member.memberId }));
  }, [deletedMembers]);

  const columns: ColumnDefinition<DeletedMemberTableItem>[] = [
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
      headerClassName: "w-[25%]",
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
      headerClassName: "w-[15%]",
    },
    {
      key: "deleteReason",
      header: "탈퇴 사유",
      accessor: "deleteReason",
      headerClassName: "w-[25%]",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            탈퇴 회원 관리
          </h2>

          <DeletedMemberFilterSection
            genderFilter={genderFilter}
            onGenderFilterChange={setGenderFilter}
            ageGroupFilter={ageGroupFilter}
            onAgeGroupFilterChange={setAgeGroupFilter}
            reasonFilter={reasonFilter}
            onReasonFilterChange={setReasonFilter}
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
            sortOptions={deletedMemberSortOptions}
            emptyStateMessage="검색 결과에 해당하는 탈퇴 회원이 없습니다."
          />
          <MemberDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            member={selectedMember}
            isDeletedMember={true}
          />
        </main>
      </div>
    </div>
  );
}
