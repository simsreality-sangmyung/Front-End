import { ChevronDown, ChevronUp, Edit2, ShieldCheck, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
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
  onChangeRole: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const ROLE_COLORS: Record<string, string> = {
  관리자: '#00d4ff',
  사용자: '#00ff88',
  뷰어: '#888888',
};

const getRoleColor = (role: string): string => ROLE_COLORS[role] ?? '#888888';

const HEAD_TH =
  "text-left px-5 py-3 text-sm font-medium text-white/35 font-['JetBrains_Mono',monospace]";

function JoinedSortHeader({
  sort,
  onSortChange,
}: {
  sort: UserSortOption;
  onSortChange: (sort: UserSortOption) => void;
}) {
  const isDesc = sort === 'joined-desc';

  return (
    <button
      type="button"
      className="flex items-center gap-1 hover:text-white transition-colors"
      onClick={() => onSortChange(isDesc ? 'joined-asc' : 'joined-desc')}
    >
      가입일
      {isDesc ? (
        <ChevronDown className="w-3 h-3 text-[#00d4ff]" />
      ) : (
        <ChevronUp className="w-3 h-3 text-[#00d4ff]" />
      )}
    </button>
  );
}

function TableShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(0,212,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      {children}
    </div>
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
  onChangeRole,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (isLoading) {
    return (
      <TableShell>
        <p className="text-center py-16 text-white/40 text-sm font-['JetBrains_Mono',monospace]">
          목록을 불러오는 중...
        </p>
      </TableShell>
    );
  }

  if (isError) {
    return (
      <TableShell>
        <p className="text-center py-16 text-[#ff4466] text-sm">
          {errorMessage ?? '목록을 불러오지 못했습니다.'}
        </p>
      </TableShell>
    );
  }

  return (
    <>
      <TableShell>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                style={{
                  background: 'rgba(0,212,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <th className={`${HEAD_TH} w-[30%]`}>이름</th>
                <th className={`${HEAD_TH} w-[30%]`}>이메일</th>
                <th className={`${HEAD_TH} w-[12%]`}>권한</th>
                <th className={`${HEAD_TH} w-[13%]`}>
                  <JoinedSortHeader sort={sort} onSortChange={onSortChange} />
                </th>
                <th className={`${HEAD_TH} w-[15%]`}>관리</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-white/25 text-sm"
                  >
                    검색 조건에 맞는 사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => {
                  const roleColor = getRoleColor(user.role);
                  const deleting = isMutating && mutatingId === user.id;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/[0.03] transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              background: 'rgba(0,212,255,0.12)',
                              border: '1px solid rgba(0,212,255,0.2)',
                              color: '#00d4ff',
                            }}
                          >
                            {getUserInitials(user.email)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-white/30 font-['JetBrains_Mono',monospace]">
                              USR-{String(user.id).padStart(3, '0')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/50 font-['JetBrains_Mono',monospace] truncate">
                        {user.email}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-sm px-2.5 py-1 rounded-lg whitespace-nowrap"
                          style={{
                            color: roleColor,
                            background: `${roleColor}18`,
                            border: `1px solid ${roleColor}30`,
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/40 font-['JetBrains_Mono',monospace] whitespace-nowrap">
                        {user.joinedAt}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onChangeRole(user)}
                            disabled={isMutating}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all text-white/30 hover:bg-[#00ff88]/10 hover:text-[#00ff88] disabled:opacity-40 disabled:pointer-events-none"
                            aria-label="권한 관리"
                            title="권한 관리"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> 권한
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(user)}
                            disabled={isMutating}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all text-white/30 hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] disabled:opacity-40 disabled:pointer-events-none"
                            aria-label="수정"
                            title="수정"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> 수정
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(user)}
                            disabled={deleting}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all text-white/30 hover:bg-[#ff4466]/10 hover:text-[#ff4466] disabled:opacity-40 disabled:pointer-events-none"
                            aria-label="삭제"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> 삭제
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </TableShell>

      <p className="mt-4 text-white/20 text-xs font-['JetBrains_Mono',monospace]">
        {users.length}명 표시 / 전체 {totalCount}명
      </p>
    </>
  );
}

export default UserTable;
