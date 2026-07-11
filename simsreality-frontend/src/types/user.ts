export type UserRole = '사용자' | '관리자';

export type UserPlan = '스탠다드' | '프로' | '엔터프라이즈';

export type UserStatus = '활성' | '정지' | '대기';

export const USER_ROLE_OPTIONS: UserRole[] = ['사용자', '관리자'];

export const USER_PLAN_OPTIONS: UserPlan[] = ['스탠다드', '프로', '엔터프라이즈'];

export const USER_STATUS_OPTIONS: UserStatus[] = ['활성', '정지', '대기'];

import type { AccountRole, AccountStatus } from './account';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  twinCount: number;
  status: UserStatus;
  joinedAt: string;
  lastLoginAt: string;
  /** 원본 API role — 수정/권한 변경 시 사용 */
  apiRole?: AccountRole;
  /** 원본 API status — 수정 시 사용 */
  apiStatus?: AccountStatus;
}

export interface UserSearchParams {
  keyword?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
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

export type UserSortOption =
  | 'joined-desc'
  | 'joined-asc'
  | 'twin-desc'
  | 'twin-asc';

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
}

export interface UpdateUserInput {
  id: number;
  role: UserRole;
  plan: UserPlan;
  status: UserStatus;
}

export function getUserInitials(email: string): string {
  const [localPart] = email.split('@');
  const [first, second] = (localPart ?? '').split('.');
  if (first && second) {
    return (second[0] + first[0]).toUpperCase();
  }
  return (first ?? '').slice(0, 2).toUpperCase();
}
