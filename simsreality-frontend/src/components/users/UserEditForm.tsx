import { Save } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { User } from '../../types/user';

interface UserEditFormProps {
  user: User;
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (input: { id: number; name: string }) => void;
  onCancel: () => void;
}

function UserEditForm({
  user,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: UserEditFormProps) {
  const [name, setName] = useState(user.name);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('이름을 입력해주세요.');
      return;
    }

    onSubmit({ id: user.id, name: trimmedName });
  };

  return (
    <div className="font-['Rajdhani',sans-serif] text-white">
      <div
        className="px-6 py-4"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}
      >
        <h2 className="font-bold text-base text-white">사용자 수정</h2>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5">
        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs text-white/40 mb-1 font-['JetBrains_Mono',monospace]">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="이름을 입력하세요"
              disabled={isSubmitting}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00d4ff]/50 transition-colors disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1 font-['JetBrains_Mono',monospace]">
              이메일
            </label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white/50 font-['JetBrains_Mono',monospace] focus:outline-none disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            />
            <p className="mt-1 text-xs text-white/25">
              권한 변경은 목록의 &apos;권한&apos; 버튼에서 할 수 있습니다.
            </p>
          </div>
        </div>

        {error && <p className="text-[#ff4466] text-sm mb-4">{error}</p>}
        {submitError && (
          <p className="text-[#ff4466] text-sm mb-4">{submitError}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors disabled:opacity-50"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-[#020b18] transition-all hover:brightness-110 disabled:opacity-60"
            style={{ background: '#00d4ff' }}
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? '수정 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserEditForm;
