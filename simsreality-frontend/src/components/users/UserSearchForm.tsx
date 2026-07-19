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
    <form onSubmit={handleSubmit} className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
      <input
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="이메일 또는 ID 검색..."
        className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50 transition-colors font-['JetBrains_Mono',monospace]"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
    </form>
  );
}

export default UserSearchForm;
