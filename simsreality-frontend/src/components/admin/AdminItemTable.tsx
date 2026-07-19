import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import type { AccountRole } from '../../types/account';
import {
  formatTwinId,
  type AdminItem,
  type AdminItemSortOption,
} from '../../types/adminItem';

const MANAGER_ROLE_LABEL: Record<AccountRole, string> = {
  SUPER: '관리자',
  ADMIN: '관리자',
  USER: '사용자',
  PENDING: '가입 대기',
};

interface AdminItemTableProps {
  items: AdminItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  isDeleting: boolean;
  deletingId: number | null;
  sort: AdminItemSortOption;
  onSortChange: (sort: AdminItemSortOption) => void;
  onEdit: (item: AdminItem) => void;
  onDelete: (item: AdminItem) => void;
}

const CATEGORY_CLASS: Record<AdminItem['category'], string> = {
  물류센터: 'twin-badge--logistics',
  제조센터: 'twin-badge--manufacture',
};

function SortHeader({
  label,
  ascValue,
  descValue,
  sort,
  onSortChange,
}: {
  label: string;
  ascValue: AdminItemSortOption;
  descValue: AdminItemSortOption;
  sort: AdminItemSortOption;
  onSortChange: (sort: AdminItemSortOption) => void;
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

function AdminItemTable({
  items,
  isLoading,
  isError,
  errorMessage,
  isDeleting,
  deletingId,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: AdminItemTableProps) {
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

  if (items.length === 0) {
    return (
      <section className="twin-card twin-table-card">
        <p className="twin-table-status">검색 조건에 맞는 항목이 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="twin-card twin-table-card">
      <div className="twin-table-wrapper">
        <table className="twin-table">
          <thead>
            <tr>
              <th className="twin-table__col-info">트윈 이름</th>
              <th className="twin-table__col-category">유형</th>
              <th className="twin-table__col-manager">담당자</th>
              <th className="twin-table__col-date">
                <SortHeader
                  label="등록일자"
                  ascValue="oldest"
                  descValue="newest"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="twin-table__col-actions" aria-label="관리" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="twin-table__col-info">
                  <p className="twin-table__title">{item.title}</p>
                  <p className="twin-table__subtitle">
                    {formatTwinId(item.id)} · {item.location}
                  </p>
                </td>
                <td className="twin-table__col-category">
                  <span
                    className={`twin-badge ${CATEGORY_CLASS[item.category]}`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="twin-table__col-manager">
                  {item.managerName}
                  {item.managerRole && (
                    <p className="twin-table__subtitle">
                      {MANAGER_ROLE_LABEL[item.managerRole]}
                    </p>
                  )}
                </td>
                <td className="twin-table__col-date">{item.registeredAt}</td>
                <td className="twin-table__col-actions">
                  <div className="twin-table__actions">
                    <button
                      type="button"
                      className="twin-icon-btn"
                      onClick={() => onEdit(item)}
                      disabled={isDeleting}
                      aria-label="수정"
                      title="수정"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="twin-icon-btn twin-icon-btn--danger"
                      onClick={() => onDelete(item)}
                      disabled={isDeleting && deletingId === item.id}
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
    </section>
  );
}

export default AdminItemTable;
