import { Ban, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { getUserInitials, type User, type UserSortOption } from '../../types/user';

interface UserTableProps {
  users: User[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  isMutating: boolean;
  mutatingId: number | null;
  sort: UserSortOption;
  onSortChange: (sort: UserSortOption) => void;
  onToggleSuspend: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const PLAN_CLASS: Record<User['plan'], string> = {
  스탠다드: 'user-badge--standard',
  프로: 'user-badge--pro',
  엔터프라이즈: 'user-badge--enterprise',
};

const STATUS_CLASS: Record<User['status'], string> = {
  활성: 'user-status--active',
  정지: 'user-status--suspended',
  대기: 'user-status--pending',
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
  isMutating,
  mutatingId,
  sort,
  onSortChange,
  onToggleSuspend,
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
          목록을 불러오지 못했습니다.
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
              <th className="user-table__col-user">사용자</th>
              <th className="user-table__col-role">역할 / 플랜</th>
              <th className="user-table__col-twins">
                <SortHeader
                  label="트윈 수"
                  ascValue="twin-asc"
                  descValue="twin-desc"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="user-table__col-status">상태</th>
              <th className="user-table__col-joined">
                <SortHeader
                  label="가입일"
                  ascValue="joined-asc"
                  descValue="joined-desc"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="user-table__col-login">최근 로그인</th>
              <th className="user-table__col-actions" aria-label="관리" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-table__col-user">
                  <div className="user-table__identity">
                    <span className="user-avatar">{getUserInitials(user.email)}</span>
                    <div className="user-table__identity-text">
                      <p className="twin-table__title">{user.name}</p>
                      <p className="twin-table__subtitle">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="user-table__col-role">
                  <p
                    className={`user-table__role${
                      user.role === '관리자' ? ' user-table__role--admin' : ''
                    }`}
                  >
                    {user.role}
                  </p>
                  <span className={`user-badge ${PLAN_CLASS[user.plan]}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="user-table__col-twins user-table__twin-count">
                  {user.twinCount.toLocaleString()}
                </td>
                <td className="user-table__col-status">
                  <span className={`twin-status ${STATUS_CLASS[user.status]}`}>
                    <span className="twin-status__dot" />
                    {user.status}
                  </span>
                </td>
                <td className="user-table__col-joined">{user.joinedAt}</td>
                <td className="user-table__col-login">{user.lastLoginAt}</td>
                <td className="user-table__col-actions">
                  <div className="twin-table__actions">
                    <button
                      type="button"
                      className="twin-icon-btn"
                      onClick={() => onToggleSuspend(user)}
                      disabled={isMutating}
                      aria-label={user.status === '정지' ? '정지 해제' : '정지'}
                      title={user.status === '정지' ? '정지 해제' : '정지'}
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
        총 {users.length}명 표시 중 / 전체 {totalCount}명
      </p>
    </section>
  );
}

export default UserTable;
