import client from './client';
import type {
  AccountRoleUpdateRequest,
  AccountUpdateRequest,
  ApiResponse,
  PageResponseAccountResponse,
} from '../types/account';
import type {
  UpdateUserInput,
  User,
  UserSearchParams,
  UsersPageResult,
  UserSortOption,
} from '../types/user';
import {
  mapAccountToUser,
  mapUiRoleToApiRole,
  mapUiStatusToApiStatus,
} from '../utils/accountMapper';
import { sortUsers } from '../utils/sortUsers';

function mapSortToApi(sort: UserSortOption): string[] {
  switch (sort) {
    case 'joined-asc':
      return ['joinedAt,asc'];
    case 'joined-desc':
      return ['joinedAt,desc'];
    default:
      return ['joinedAt,desc'];
  }
}

function filterUsersClient(users: User[], params: UserSearchParams): User[] {
  const role = params.role;
  const status = params.status;

  return users.filter((user) => {
    if (role && role !== 'all' && user.role !== role) {
      return false;
    }
    if (status && status !== 'all' && user.status !== status) {
      return false;
    }
    return true;
  });
}

async function fetchAccountPage(
  params: UserSearchParams,
): Promise<PageResponseAccountResponse> {
  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const sort = mapSortToApi(params.sort ?? 'joined-desc');
  const keyword = params.keyword?.trim();

  const endpoint = keyword
    ? '/api/admin/accounts/search'
    : '/api/admin/accounts';

  const queryParams: Record<string, string | number | string[]> = {
    page,
    size,
    sort,
  };

  if (keyword) {
    queryParams.keyword = keyword;
  }

  const response = await client.get<ApiResponse<PageResponseAccountResponse>>(
    endpoint,
    { params: queryParams },
  );

  return response.data.data;
}

/**
 * Swagger: GET /api/admin/accounts 또는 GET /api/admin/accounts/search
 */
export async function fetchUsers(
  params: UserSearchParams = {},
): Promise<UsersPageResult> {
  const pageData = await fetchAccountPage(params);

  let users = pageData.content.map(mapAccountToUser);
  users = filterUsersClient(users, params);

  if (params.sort?.startsWith('twin-')) {
    users = sortUsers(users, params.sort);
  }

  return {
    users,
    page: pageData.page,
    size: pageData.size,
    totalElements: pageData.totalElements,
    totalPages: pageData.totalPages,
  };
}

/**
 * Swagger: PATCH /api/admin/accounts/{accountId}
 */
export async function updateAccount(
  accountId: number,
  body: AccountUpdateRequest,
): Promise<void> {
  await client.patch(`/api/admin/accounts/${accountId}`, body);
}

/**
 * Swagger: PATCH /api/admin/accounts/{accountId}/role
 */
export async function changeAccountRole(
  accountId: number,
  body: AccountRoleUpdateRequest,
): Promise<void> {
  await client.patch(`/api/admin/accounts/${accountId}/role`, body);
}

/**
 * 계정 수정 — 이름/상태(PATCH)와 권한(PATCH /role)을 Swagger 스키마에 맞게 분리 호출합니다.
 */
export async function updateUser(input: UpdateUserInput): Promise<void> {
  const nextApiRole = mapUiRoleToApiRole(input.role);
  const nextApiStatus = mapUiStatusToApiStatus(input.status);

  if (input.status === '대기') {
    await changeAccountRole(input.id, { role: 'PENDING' });
    await updateAccount(input.id, { status: 'ACTIVE' });
    return;
  }

  if (nextApiStatus) {
    await updateAccount(input.id, { status: nextApiStatus });
  }

  await changeAccountRole(input.id, { role: nextApiRole });
}

/**
 * 정지/해제 — AccountUpdateRequest.status (ACTIVE / DELETED) 로 처리합니다.
 */
export async function toggleUserSuspend(user: User): Promise<void> {
  const nextStatus = user.status === '정지' ? 'ACTIVE' : 'DELETED';
  await updateAccount(user.id, { status: nextStatus });
}

/**
 * Swagger: DELETE /api/admin/accounts/{accountId}
 */
export async function deleteUser(id: number): Promise<void> {
  await client.delete(`/api/admin/accounts/${id}`);
}

/**
 * 사용자 초대 API는 Swagger에 없습니다.
 */
export async function createUser(): Promise<never> {
  throw new Error('사용자 초대 API는 Swagger에 정의되어 있지 않습니다.');
}

export const usersQueryKey = (params: UserSearchParams) =>
  ['users', params] as const;

export const usersStatsQueryKey = ['users', 'stats'] as const;

/** 통계 카드용 — 필터 없이 넓은 범위로 조회 (Swagger stats API 없음) */
export async function fetchUsersForStats(): Promise<User[]> {
  const pageData = await fetchAccountPage({
    page: 0,
    size: 1000,
    sort: 'joined-desc',
  });
  return pageData.content.map(mapAccountToUser);
}
