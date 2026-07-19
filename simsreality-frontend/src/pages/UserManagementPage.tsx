import { useCallback, useState } from 'react';
import AdminModal from '../components/admin/AdminModal';
import AdminPagination from '../components/admin/AdminPagination';
import UserEditForm from '../components/users/UserEditForm';
import UserRoleForm from '../components/users/UserRoleForm';
import UserSearchForm from '../components/users/UserSearchForm';
import UserTable from '../components/users/UserTable';
import {
  useChangeUserRole,
  useDeleteUser,
  useUpdateUser,
} from '../hooks/useUserMutations';
import { useUsers } from '../hooks/useUsers';
import type { User, UserSearchParams, UserSortOption } from '../types/user';
import { getApiErrorMessage } from '../utils/apiError';
import '../styles/twinDesignSystem.css';

const PAGE_SIZE = 5;

function UserManagementPage() {
  const [searchParams, setSearchParams] = useState<UserSearchParams>({});
  const [sort, setSort] = useState<UserSortOption>('joined-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleTargetUser, setRoleTargetUser] = useState<User | null>(null);
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  const listParams: UserSearchParams = {
    ...searchParams,
    page: currentPage - 1,
    size: PAGE_SIZE,
    sort,
  };

  const {
    data: pageData,
    isLoading,
    isError,
    error: listError,
  } = useUsers(listParams);

  const users = pageData?.users ?? [];
  const totalPages = Math.max(1, pageData?.totalPages ?? 1);
  const totalCount = pageData?.totalElements ?? 0;
  const listErrorMessage = isError
    ? getApiErrorMessage(listError, '사용자 목록을 불러오지 못했습니다.')
    : null;

  const handleSearch = useCallback((params: UserSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((nextSort: UserSortOption) => {
    setSort(nextSort);
    setCurrentPage(1);
  }, []);

  const updateMutation = useUpdateUser({
    searchParams: listParams,
    onSuccess: () => setEditingUser(null),
  });

  const roleMutation = useChangeUserRole({
    searchParams: listParams,
    onSuccess: () => setRoleTargetUser(null),
  });

  const deleteMutation = useDeleteUser({
    searchParams: listParams,
    onSuccess: () => setMutatingId(null),
  });

  const isMutating = deleteMutation.isPending;

  const updateErrorMessage = updateMutation.isError
    ? getApiErrorMessage(updateMutation.error, '사용자 수정에 실패했습니다.')
    : null;

  const roleErrorMessage = roleMutation.isError
    ? getApiErrorMessage(roleMutation.error, '권한 변경에 실패했습니다.')
    : null;

  const deleteErrorMessage = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error, '사용자 삭제에 실패했습니다.')
    : null;

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleChangeRole = (user: User) => {
    setRoleTargetUser(user);
  };

  const handleDelete = (user: User) => {
    const confirmed = window.confirm(`"${user.name}" 사용자를 삭제하시겠습니까?`);
    if (!confirmed) {
      return;
    }

    setMutatingId(user.id);
    deleteMutation.mutate(user.id, {
      onSuccess: () => {
        if (editingUser?.id === user.id) {
          setEditingUser(null);
        }
      },
      onError: () => setMutatingId(null),
    });
  };

  return (
    <main className="min-h-screen overflow-auto p-8 bg-[#020b18] text-white font-['Rajdhani',sans-serif]">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#00d4ff] text-[10px] tracking-[0.2em] font-['JetBrains_Mono',monospace] mb-1">
          // USER MANAGEMENT
        </p>
        <h1 className="text-3xl font-bold tracking-wide">사용자 관리</h1>
      </div>

      <UserSearchForm initialParams={searchParams} onSearch={handleSearch} />

      {deleteErrorMessage && (
        <p
          className="mb-4 px-4 py-3 rounded-xl text-sm text-[#ff4466]"
          style={{
            background: 'rgba(255,68,102,0.08)',
            border: '1px solid rgba(255,68,102,0.25)',
          }}
        >
          {deleteErrorMessage}
        </p>
      )}

      <UserTable
        users={users}
        totalCount={totalCount}
        isLoading={isLoading}
        isError={isError}
        errorMessage={listErrorMessage}
        isMutating={isMutating}
        mutatingId={mutatingId}
        sort={sort}
        onSortChange={handleSortChange}
        onChangeRole={handleChangeRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {editingUser && (
        <AdminModal
          size="md"
          onClose={() => {
            if (!updateMutation.isPending) {
              setEditingUser(null);
            }
          }}
          isCloseDisabled={updateMutation.isPending}
        >
          <UserEditForm
            key={editingUser.id}
            user={editingUser}
            isSubmitting={updateMutation.isPending}
            submitError={updateErrorMessage}
            onSubmit={(input) => updateMutation.mutate(input)}
            onCancel={() => setEditingUser(null)}
          />
        </AdminModal>
      )}

      {roleTargetUser && (
        <AdminModal
          size="md"
          onClose={() => {
            if (!roleMutation.isPending) {
              setRoleTargetUser(null);
            }
          }}
          isCloseDisabled={roleMutation.isPending}
        >
          <UserRoleForm
            key={roleTargetUser.id}
            user={roleTargetUser}
            isSubmitting={roleMutation.isPending}
            submitError={roleErrorMessage}
            onSubmit={(input) => roleMutation.mutate(input)}
            onCancel={() => setRoleTargetUser(null)}
          />
        </AdminModal>
      )}
    </main>
  );
}

export default UserManagementPage;
