import { Filter, Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { UserRole, UserSearchParams, UserStatus } from '../../types/user';

interface UserSearchFormProps {
  initialParams: UserSearchParams;
  onSearch: (params: UserSearchParams) => void;
}

const ROLE_FILTERS: { value: UserRole | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: '관리자', label: '관리자' },
  { value: '사용자', label: '사용자' },
];

const STATUS_FILTERS: { value: UserStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: '활성', label: '활성' },
  { value: '정지', label: '정지' },
  { value: '대기', label: '대기' },
];

function UserSearchForm({ initialParams, onSearch }: UserSearchFormProps) {
  const [keyword, setKeyword] = useState(initialParams.keyword ?? '');
  const [role, setRole] = useState<UserRole | 'all'>(initialParams.role ?? 'all');
  const [status, setStatus] = useState<UserStatus | 'all'>(
    initialParams.status ?? 'all',
  );
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const emit = (overrides: Partial<UserSearchParams> = {}) => {
    onSearch({
      keyword: keyword.trim() || undefined,
      role,
      status,
      ...overrides,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    emit();
  };

  const handleRoleClick = (value: UserRole | 'all') => {
    setRole(value);
    emit({ role: value });
  };

  const handleStatusClick = (value: UserStatus | 'all') => {
    setStatus(value);
    emit({ status: value });
  };

  return (
    <section className="twin-search">
      <form onSubmit={handleSubmit}>
        <div className="twin-search__row">
          <div className="twin-search__input-wrap">
            <Search size={14} className="twin-search__input-icon" />
            <input
              className="twin-search__input"
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="이름, 이메일, ID 검색..."
            />
          </div>

          <button
            type="button"
            className={`twin-search__filter-toggle${
              isAdvancedOpen ? ' twin-search__filter-toggle--active' : ''
            }`}
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
            aria-expanded={isAdvancedOpen}
            aria-label="고급 필터"
          >
            <Filter size={13} />
          </button>

          <div className="twin-pill-group" role="group" aria-label="역할 필터">
            {ROLE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`twin-pill${
                  role === filter.value ? ' twin-pill--active' : ''
                }`}
                onClick={() => handleRoleClick(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="twin-pill-group" role="group" aria-label="상태 필터">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`twin-pill${
                  status === filter.value ? ' twin-pill--active' : ''
                }`}
                onClick={() => handleStatusClick(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}

export default UserSearchForm;
