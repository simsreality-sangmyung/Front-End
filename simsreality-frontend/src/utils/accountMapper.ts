import type { AccountResponse, AccountRole, AccountStatus } from '../types/account';
import { USER_PLAN_OPTIONS, type User, type UserPlan, type UserRole, type UserStatus } from '../types/user';

/**
 * Swagger 계정 API에는 플랜/트윈 수 필드가 없습니다.
 * 실제 데이터가 연결되기 전까지, id 기반으로 결정적인(새로고침해도 값이 바뀌지 않는)
 * 더미 값을 채워 화면(뱃지/숫자)이 비어 보이지 않도록 합니다.
 * → 실제 값이 아니므로, 플랜/트윈 수 관련 API가 추가되면 이 함수를 교체해야 합니다.
 */
function getDummyPlan(id: number): UserPlan {
  return USER_PLAN_OPTIONS[id % USER_PLAN_OPTIONS.length];
}

function getDummyTwinCount(id: number): number {
  return (id * 3 + 1) % 12;
}

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

function formatLastLogin(iso: string | null | undefined): string {
  if (!iso) {
    return '-';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 1) {
    return '방금 전';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  return formatAccountDate(iso);
}

/** Swagger AccountResponse → 사용자 관리 UI User */
export function mapAccountToUser(account: AccountResponse): User {
  const role: UserRole =
    account.role === 'ADMIN' || account.role === 'SUPER' ? '관리자' : '사용자';

  let status: UserStatus;
  if (account.status === 'DELETED') {
    status = '정지';
  } else if (account.role === 'PENDING') {
    status = '대기';
  } else {
    status = '활성';
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role,
    // Swagger 계정 API에 플랜/트윈 수 필드가 없어, 실제 값이 아닌 더미 값을 사용합니다.
    plan: getDummyPlan(account.id),
    twinCount: getDummyTwinCount(account.id),
    status,
    joinedAt: formatAccountDate(account.joinedAt),
    lastLoginAt: formatLastLogin(account.lastLoginAt),
    apiRole: account.role,
    apiStatus: account.status,
  };
}

export function mapUiRoleToApiRole(role: UserRole): AccountRole {
  return role === '관리자' ? 'ADMIN' : 'USER';
}

export function mapUiStatusToApiStatus(status: UserStatus): AccountStatus | null {
  if (status === '활성') {
    return 'ACTIVE';
  }
  if (status === '정지') {
    return 'DELETED';
  }
  return null;
}
