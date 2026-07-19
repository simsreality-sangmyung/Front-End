import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AdminModal from '../components/admin/AdminModal';
import AdminPagination from '../components/admin/AdminPagination';
import UserEditForm from '../components/users/UserEditForm';
import UserInviteForm from '../components/users/UserInviteForm';
import UserSearchForm from '../components/users/UserSearchForm';
import UserTable from '../components/users/UserTable';
import { useCreateUser, useDeleteUser, useUpdateUser } from '../hooks/useUserMutations';
import { useUsers } from '../hooks/useUsers';
import type { User, UserSearchParams, UserSortOption } from '../types/user';
import { getApiErrorMessage } from '../utils/apiError';
import '../styles/twinDesignSystem.css';
import './UserManagementPage.css';

const PAGE_SIZE = 5;

function UserManagementPage() {
  const [searchParams, setSearchParams] = useState<UserSearchParams>({});
  const [sort, setSort] = useState<UserSortOption>('joined-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [mutatingId, setMutatingId] = useState<number | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState<string | null>(null);

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

  const createMutation = useCreateUser({
    searchParams: listParams,
    onSuccess: () => {
      setShowInviteForm(false);
      setInviteSuccessMessage('초대를 완료했습니다.');
    },
  });

  const updateMutation = useUpdateUser({
    searchParams: listParams,
    onSuccess: () => setEditingUser(null),
  });

  const deleteMutation = useDeleteUser({
    searchParams: listParams,
    onSuccess: () => setMutatingId(null),
  });

  const isMutating = deleteMutation.isPending;

  const updateErrorMessage = updateMutation.isError
    ? getApiErrorMessage(updateMutation.error, '사용자 수정에 실패했습니다.')
    : null;

  const deleteErrorMessage = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error, '사용자 삭제에 실패했습니다.')
    : null;

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  useEffect(() => {
    if (!inviteSuccessMessage) {
      return;
    }
    const timer = window.setTimeout(() => setInviteSuccessMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [inviteSuccessMessage]);

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
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">// USER MANAGEMENT</p>
          <h1>사용자 관리</h1>
        </div>
        <button
          type="button"
          className="twin-btn twin-btn--primary admin-page__register-btn"
          onClick={() => setShowInviteForm(true)}
        >
          <Plus size={14} strokeWidth={2.5} />
          사용자 초대
        </button>
      </header>

      <UserSearchForm initialParams={searchParams} onSearch={handleSearch} />

      {showInviteForm && (
        <AdminModal
          onClose={() => {
            if (!createMutation.isPending) {
              setShowInviteForm(false);
            }
          }}
          isCloseDisabled={createMutation.isPending}
        >
          <UserInviteForm
            isSubmitting={createMutation.isPending}
            submitError={null}
            onSubmit={(input) => createMutation.mutate(input)}
            onCancel={() => setShowInviteForm(false)}
          />
        </AdminModal>
      )}

      {inviteSuccessMessage && (
        <p className="admin-page__success twin-card">{inviteSuccessMessage}</p>
      )}

      {editingUser && (
        <AdminModal
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

      {deleteErrorMessage && (
        <p className="admin-page__error twin-card">{deleteErrorMessage}</p>
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

export default UserManagementPage;
