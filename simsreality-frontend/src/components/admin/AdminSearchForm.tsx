import { Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type {
  AdminItemSearchField,
  AdminItemSearchParams,
} from '../../types/adminItem';

interface AdminSearchFormProps {
  initialParams: AdminItemSearchParams;
  onSearch: (params: AdminItemSearchParams) => void;
}

const SEARCH_FIELD_OPTIONS: {
  value: AdminItemSearchField;
  label: string;
  placeholder: string;
}[] = [
  { value: 'title', label: '제목', placeholder: '트윈 제목으로 검색...' },
  { value: 'id', label: '트윈 ID', placeholder: '트윈 ID로 검색...' },
  { value: 'managerName', label: '담당자명', placeholder: '담당자명으로 검색...' },
];

function AdminSearchForm({ initialParams, onSearch }: AdminSearchFormProps) {
  const [keyword, setKeyword] = useState(initialParams.keyword ?? '');
  const [searchField, setSearchField] = useState<AdminItemSearchField>(
    initialParams.searchField ?? 'title',
  );
  const category = initialParams.category ?? 'all';

  const activeOption =
    SEARCH_FIELD_OPTIONS.find((option) => option.value === searchField) ??
    SEARCH_FIELD_OPTIONS[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({
      keyword: keyword.trim() || undefined,
      searchField,
      category,
    });
  };

  const handleSearchFieldChange = (value: AdminItemSearchField) => {
    setSearchField(value);
    onSearch({
      keyword: keyword.trim() || undefined,
      searchField: value,
      category,
    });
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
              placeholder={activeOption.placeholder}
            />
          </div>
        </div>
        <div className="twin-search__row twin-search__row--tabs">
          <div className="twin-pill-group">
            {SEARCH_FIELD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`twin-pill${
                  searchField === option.value ? ' twin-pill--active' : ''
                }`}
                onClick={() => handleSearchFieldChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}

export default AdminSearchForm;
