import client from './client';
import type {
  AccountRoleUpdateRequest,
  AccountUpdateRequest,
  ApiResponse,
  PageResponseAccountResponse,
} from '../types/account';
import type {
  ChangeUserRoleInput,
  UpdateUserInput,
  User,
  UserSearchParams,
  UsersPageResult,
  UserSortOption,
} from '../types/user';
import { mapAccountToUser, mapUiRoleToApiRole } from '../utils/accountMapper';

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

/**
 * GET /api/admin/accounts/search 검색 조건은 email 또는 id입니다 (loginId 제거됨).
 * 검색어가 숫자로만 구성되면 id 파라미터로, 그 외에는 email 파라미터로 보냅니다.
 */
function buildAccountSearchParam(
  keyword: string,
): { id: number } | { email: string } {
  if (/^\d+$/.test(keyword)) {
    return { id: Number(keyword) };
  }
  return { email: keyword };
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
    Object.assign(queryParams, buildAccountSearchParam(keyword));
  }

  const response = await client.get<ApiResponse<PageResponseAccountResponse>>(
    endpoint,
    { params: queryParams },
  );

  return response.data.data;
}

/**
 * GET /api/admin/accounts 또는 GET /api/admin/accounts/search
 */
export async function fetchUsers(
  params: UserSearchParams = {},
): Promise<UsersPageResult> {
  const pageData = await fetchAccountPage(params);
  const users = pageData.content.map(mapAccountToUser);

  return {
    users,
    page: pageData.page,
    size: pageData.size,
    totalElements: pageData.totalElements,
    totalPages: pageData.totalPages,
  };
}

/**
 * PATCH /api/admin/accounts/{accountId} — status 제거, name만 수정 가능합니다.
 */
export async function updateAccount(
  accountId: number,
  body: AccountUpdateRequest,
): Promise<void> {
  await client.patch(`/api/admin/accounts/${accountId}`, body);
}

/**
 * PATCH /api/admin/accounts/{accountId}/role — 새 명세에 변경 언급이 없어 기존 그대로 유지합니다.
 */
export async function changeAccountRole(
  accountId: number,
  body: AccountRoleUpdateRequest,
): Promise<void> {
  await client.patch(`/api/admin/accounts/${accountId}/role`, body);
}

/**
 * 사용자 수정 — 이름만 변경 (PATCH /api/admin/accounts/{id}).
 * 권한 변경은 changeUserRole 로 분리되어 있습니다 (별도 API 재사용, BE 수정 불필요).
 */
export async function updateUser(input: UpdateUserInput): Promise<void> {
  await updateAccount(input.id, { name: input.name });
}

/**
 * 사용자 권한 변경 — role만 변경 (PATCH /api/admin/accounts/{id}/role).
 */
export async function changeUserRole(input: ChangeUserRoleInput): Promise<void> {
  await changeAccountRole(input.id, { role: mapUiRoleToApiRole(input.role) });
}

/**
 * DELETE /api/admin/accounts/{accountId}
 */
export async function deleteUser(id: number): Promise<void> {
  await client.delete(`/api/admin/accounts/${id}`);
}

/**
 * 사용자 초대 API는 아직 명세에 없습니다. 백엔드 지원 전까지는 호출하지 않고,
 * useUserMutations.ts의 useCreateUser가 프론트 데모용으로 성공을 흉내 냅니다.
 */
export async function createUser(): Promise<never> {
  throw new Error('사용자 초대 API는 현재 명세에 정의되어 있지 않습니다.');
}

export const usersQueryKey = (params: UserSearchParams) =>
  ['users', params] as const;

export const usersStatsQueryKey = ['users', 'stats'] as const;

/** 통계 카드용 — 필터 없이 넓은 범위로 조회 (전용 stats API 없음, 현재 미사용) */
export async function fetchUsersForStats(): Promise<User[]> {
  const pageData = await fetchAccountPage({
    page: 0,
    size: 1000,
    sort: 'joined-desc',
  });
  return pageData.content.map(mapAccountToUser);
}
