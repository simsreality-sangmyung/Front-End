import type { AccountResponse, AccountRole } from '../types/account';
import type { User, UserRole } from '../types/user';

function formatAccountDate(iso: string | null | undefined): string {
  if (!iso) {
    return '-';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** API AccountResponse → 사용자 관리 UI User (lastLoginAt/ssoType/loginId/status는 API에서 제거됨) */
export function mapAccountToUser(account: AccountResponse): User {
  const role: UserRole =
    account.role === 'ADMIN' || account.role === 'SUPER' ? '관리자' : '사용자';

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role,
    joinedAt: formatAccountDate(account.joinedAt),
    apiRole: account.role,
  };
}

export function mapUiRoleToApiRole(role: UserRole): AccountRole {
  return role === '관리자' ? 'ADMIN' : 'USER';
}
