import { Ban, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { getUserInitials, type User, type UserSortOption } from '../../types/user';

interface UserTableProps {
  users: User[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  isMutating: boolean;
  mutatingId: number | null;
  sort: UserSortOption;
  onSortChange: (sort: UserSortOption) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const ROLE_CLASS: Record<User['role'], string> = {
  사용자: 'user-badge--standard',
  관리자: 'user-badge--enterprise',
};

function SortHeader({
  label,
  ascValue,
  descValue,
  sort,
  onSortChange,
}: {
  label: string;
  ascValue: UserSortOption;
  descValue: UserSortOption;
  sort: UserSortOption;
  onSortChange: (sort: UserSortOption) => void;
}) {
  const isActive = sort === ascValue || sort === descValue;
  const isDesc = sort === descValue;

  return (
    <button
      type="button"
      className={`twin-table__sort-btn${isActive ? ' twin-table__sort-btn--active' : ''}`}
      onClick={() => onSortChange(isDesc ? ascValue : descValue)}
    >
      {label}
      {isDesc ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
    </button>
  );
}

function UserTable({
  users,
  totalCount,
  isLoading,
  isError,
  errorMessage,
  isMutating,
  mutatingId,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (isLoading) {
    return (
      <section className="twin-card twin-table-card">
        <p className="twin-table-status">목록을 불러오는 중...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="twin-card twin-table-card">
        <p className="twin-table-status twin-table-status--error">
          {errorMessage ?? '목록을 불러오지 못했습니다.'}
        </p>
      </section>
    );
  }

  if (users.length === 0) {
    return (
      <section className="twin-card twin-table-card">
        <p className="twin-table-status">검색 조건에 맞는 사용자가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="twin-card twin-table-card">
      <div className="twin-table-wrapper">
        <table className="twin-table user-table">
          <thead>
            <tr>
              <th className="user-table__col-name">이름</th>
              <th className="user-table__col-email">이메일</th>
              <th className="user-table__col-role">권한</th>
              <th className="user-table__col-joined">
                <SortHeader
                  label="가입일"
                  ascValue="joined-asc"
                  descValue="joined-desc"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="user-table__col-actions" aria-label="관리" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-table__col-name">
                  <div className="user-table__identity">
                    <span className="user-avatar">{getUserInitials(user.email)}</span>
                    <div className="user-table__identity-text">
                      <p className="twin-table__title">{user.name}</p>
                      <p className="twin-table__subtitle">
                        USR-{String(user.id).padStart(3, '0')}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="user-table__col-email">{user.email}</td>
                <td className="user-table__col-role">
                  <span className={`user-badge ${ROLE_CLASS[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="user-table__col-joined">{user.joinedAt}</td>
                <td className="user-table__col-actions">
                  <div className="twin-table__actions">
                    <button
                      type="button"
                      className="twin-icon-btn"
                      disabled
                      aria-label="정지 (현재 API 미지원)"
                      title="현재 API 미지원"
                    >
                      <Ban size={13} />
                    </button>
                    <button
                      type="button"
                      className="twin-icon-btn"
                      onClick={() => onEdit(user)}
                      disabled={isMutating}
                      aria-label="수정"
                      title="수정"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="twin-icon-btn twin-icon-btn--danger"
                      onClick={() => onDelete(user)}
                      disabled={isMutating && mutatingId === user.id}
                      aria-label="삭제"
                      title="삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="twin-table-card__summary">
        {users.length}명 표시 / 전체 {totalCount}명
      </p>
    </section>
  );
}

export default UserTable;
