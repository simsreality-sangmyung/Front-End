import { useState } from 'react';
import { USER_ROLE_OPTIONS, type User, type UserRole } from '../../types/user';

interface UserRoleFormProps {
  user: User;
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (input: { id: number; role: UserRole }) => void;
  onCancel: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  관리자: '#00d4ff',
  사용자: '#00ff88',
  뷰어: '#888888',
};

const getRoleColor = (role: string): string => ROLE_COLORS[role] ?? '#888888';

function UserRoleForm({
  user,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: UserRoleFormProps) {
  const [role, setRole] = useState<UserRole>(user.role);

  return (
    <div className="font-['Rajdhani',sans-serif] text-white">
      <div
        className="px-6 py-4"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}
      >
        <h2 className="font-bold text-base text-white">권한 관리</h2>
      </div>

      <div className="px-6 py-5">
        <p className="text-white/60 text-sm mb-4">
          <span className="text-white font-semibold">{user.name}</span>님의 권한을 선택하세요.
        </p>

        <div className="space-y-2 mb-5">
          {USER_ROLE_OPTIONS.map((option) => {
            const active = role === option;
            const color = getRoleColor(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => setRole(option)}
                disabled={isSubmitting}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/5 disabled:opacity-50"
                style={{
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
                  color: active ? color : 'rgba(255,255,255,0.5)',
                  background: active ? `${color}10` : 'transparent',
                }}
              >
                {option}
                {active && <span className="text-xs opacity-60">현재 권한</span>}
              </button>
            );
          })}
        </div>

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
            닫기
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ id: user.id, role })}
            disabled={isSubmitting || role === user.role}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#020b18] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#00d4ff' }}
          >
            {isSubmitting ? '변경 중...' : '권한 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserRoleForm;
