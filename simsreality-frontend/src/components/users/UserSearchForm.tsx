import { Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { UserSearchParams } from '../../types/user';

interface UserSearchFormProps {
  initialParams: UserSearchParams;
  onSearch: (params: UserSearchParams) => void;
}

function UserSearchForm({ initialParams, onSearch }: UserSearchFormProps) {
  const [keyword, setKeyword] = useState(initialParams.keyword ?? '');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({
      keyword: keyword.trim() || undefined,
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
              placeholder="이메일 또는 ID 검색..."
            />
          </div>
        </div>
      </form>
    </section>
  );
}

export default UserSearchForm;
