import { Filter, Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type {
  AdminItemSearchParams,
  TwinCategory,
  TwinStatus,
} from '../../types/adminItem';

interface AdminSearchFormProps {
  initialParams: AdminItemSearchParams;
  onSearch: (params: AdminItemSearchParams) => void;
}

const STATUS_FILTERS: { value: TwinStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: '정상', label: '정상' },
  { value: '경고', label: '경고' },
  { value: '오프라인', label: '오프라인' },
];

const CATEGORY_FILTERS: { value: TwinCategory | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: '물류센터', label: '물류센터' },
  { value: '제조센터', label: '제조센터' },
];

function AdminSearchForm({ initialParams, onSearch }: AdminSearchFormProps) {
  const [keyword, setKeyword] = useState(initialParams.keyword ?? '');
  const [registeredAt, setRegisteredAt] = useState(
    initialParams.registeredAt ?? '',
  );
  const [status, setStatus] = useState<TwinStatus | 'all'>(
    initialParams.status ?? 'all',
  );
  const [category, setCategory] = useState<TwinCategory | 'all'>(
    initialParams.category ?? 'all',
  );
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const emit = (overrides: Partial<AdminItemSearchParams> = {}) => {
    onSearch({
      keyword: keyword.trim() || undefined,
      registeredAt: registeredAt || undefined,
      status,
      category,
      ...overrides,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    emit();
  };

  const handleStatusClick = (value: TwinStatus | 'all') => {
    setStatus(value);
    emit({ status: value });
  };

  const handleCategoryClick = (value: TwinCategory | 'all') => {
    setCategory(value);
    emit({ category: value });
  };

  const handleDateChange = (value: string) => {
    setRegisteredAt(value);
    emit({ registeredAt: value || undefined });
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
              placeholder="트윈 이름, ID, 담당자 검색..."
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

        <div className="twin-search__row twin-search__row--tabs">
          <div className="twin-tab-group" role="group" aria-label="유형 필터">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`twin-tab${
                  category === filter.value ? ' twin-tab--active' : ''
                }`}
                onClick={() => handleCategoryClick(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {isAdvancedOpen && (
          <div className="twin-search__advanced">
            <label className="twin-search__advanced-field">
              <span>등록일</span>
              <input
                className="twin-control"
                type="date"
                value={registeredAt}
                onChange={(event) => handleDateChange(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="twin-btn twin-btn--ghost twin-btn--sm"
              onClick={() => handleDateChange('')}
            >
              날짜 초기화
            </button>
          </div>
        )}
      </form>
    </section>
  );
}

export default AdminSearchForm;
