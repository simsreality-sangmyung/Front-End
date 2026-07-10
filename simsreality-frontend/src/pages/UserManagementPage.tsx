import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import AdminModal from '../components/admin/AdminModal';
import AdminPagination from '../components/admin/AdminPagination';
import UserEditForm from '../components/users/UserEditForm';
import UserInviteForm from '../components/users/UserInviteForm';
import UserSearchForm from '../components/users/UserSearchForm';
import UserStatsCards from '../components/users/UserStatsCards';
import UserTable from '../components/users/UserTable';
import {
  useCreateUser,
  useDeleteUser,
  useToggleUserSuspend,
  useUpdateUser,
} from '../hooks/useUserMutations';
import { useUsers } from '../hooks/useUsers';
import type { User, UserSearchParams, UserSortOption } from '../types/user';
import { sortUsers } from '../utils/sortUsers';
import '../styles/twinDesignSystem.css';
import './UserManagementPage.css';

const PAGE_SIZE = 5;

function UserManagementPage() {
  const [searchParams, setSearchParams] = useState<UserSearchParams>({});
  const [sort, setSort] = useState<UserSortOption>('joined-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  const { data: allUsers = [] } = useUsers({});
  const { data = [], isLoading, isError } = useUsers(searchParams);

  const sortedUsers = sortUsers(data, sort);
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedUsers = sortedUsers.slice(start, start + PAGE_SIZE);

  const handleSearch = useCallback((params: UserSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((nextSort: UserSortOption) => {
    setSort(nextSort);
    setCurrentPage(1);
  }, []);

  const createMutation = useCreateUser({
    searchParams,
    onSuccess: () => setShowInviteForm(false),
  });

  const updateMutation = useUpdateUser({
    searchParams,
    onSuccess: () => setEditingUser(null),
  });

  const suspendMutation = useToggleUserSuspend({
    searchParams,
    onSuccess: () => setMutatingId(null),
  });

  const deleteMutation = useDeleteUser({
    searchParams,
    onSuccess: () => setMutatingId(null),
  });

  const isMutating =
    suspendMutation.isPending || deleteMutation.isPending;

  const handleInviteClick = () => {
    setEditingUser(null);
    setShowInviteForm((prev) => !prev);
  };

  const handleToggleSuspend = (user: User) => {
    setMutatingId(user.id);
    suspendMutation.mutate(user.id, {
      onError: () => setMutatingId(null),
    });
  };

  const handleEdit = (user: User) => {
    setShowInviteForm(false);
    setEditingUser(user);
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
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">// USER MANAGEMENT</p>
          <h1>사용자 관리</h1>
        </div>
        <button
          type="button"
          className="twin-btn twin-btn--primary admin-page__register-btn"
          onClick={handleInviteClick}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Plus size={14} strokeWidth={2.5} />
          {showInviteForm ? '초대 닫기' : '사용자 초대'}
        </button>
      </header>

      <UserStatsCards users={allUsers} />

      <UserSearchForm initialParams={searchParams} onSearch={handleSearch} />

      {showInviteForm && (
        <UserInviteForm
          isSubmitting={createMutation.isPending}
          onSubmit={(input) => createMutation.mutate(input)}
          onCancel={() => {
            if (!createMutation.isPending) {
              setShowInviteForm(false);
            }
          }}
        />
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
            onSubmit={(input) => updateMutation.mutate(input)}
            onCancel={() => setEditingUser(null)}
          />
        </AdminModal>
      )}

      {createMutation.isError && (
        <p className="admin-page__error twin-card">
          초대에 실패했습니다. 다시 시도해주세요.
        </p>
      )}

      {updateMutation.isError && (
        <p className="admin-page__error twin-card">
          수정에 실패했습니다. 다시 시도해주세요.
        </p>
      )}

      {deleteMutation.isError && (
        <p className="admin-page__error twin-card">
          삭제에 실패했습니다. 다시 시도해주세요.
        </p>
      )}

      <UserTable
        users={paginatedUsers}
        totalCount={sortedUsers.length}
        isLoading={isLoading}
        isError={isError}
        isMutating={isMutating}
        mutatingId={mutatingId}
        sort={sort}
        onSortChange={handleSortChange}
        onToggleSuspend={handleToggleSuspend}
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
