import type { AccountRole } from './account';

export type UserRole = '사용자' | '관리자';

export const USER_ROLE_OPTIONS: UserRole[] = ['사용자', '관리자'];

/**
 * 계정 API 응답에서 status가 제거되어 정지/대기 등 상태를 실제로 구분할 수 없습니다.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  /** 원본 API role — 수정/권한 변경 시 사용 */
  apiRole?: AccountRole;
}

/**
 * 검색은 email 또는 id 파라미터를 사용합니다 (loginId 기반 검색은 제거됨).
 * keyword가 숫자로만 구성되면 id로, 그 외에는 email로 전송합니다.
 */
export interface UserSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: UserSortOption;
}

export interface UsersPageResult {
  users: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type UserSortOption = 'joined-desc' | 'joined-asc';

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

/** 수정(이름): PATCH /api/admin/accounts/{id} — name만. */
export interface UpdateUserInput {
  id: number;
  name: string;
}

/** 권한 변경: PATCH /api/admin/accounts/{id}/role — role만. (수정과 별개 API) */
export interface ChangeUserRoleInput {
  id: number;
  role: UserRole;
}

export function getUserInitials(email: string): string {
  const [localPart] = email.split('@');
  const [first, second] = (localPart ?? '').split('.');
  if (first && second) {
    return (second[0] + first[0]).toUpperCase();
  }
  return (first ?? '').slice(0, 2).toUpperCase();
}
