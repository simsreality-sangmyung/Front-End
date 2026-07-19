/**
 * 계정 관리 API (재배포 이후 명세).
 * GET /api/admin/accounts, /api/admin/accounts/search 응답에서
 * lastLoginAt / ssoType / loginId / status 필드가 제거되었습니다.
 */
export type AccountRole = 'SUPER' | 'ADMIN' | 'USER' | 'PENDING';

export interface AccountResponse {
  id: number;
  name: string;
  email: string;
  joinedAt: string | null;
  role: AccountRole;
}

/** Swagger: PageResponseAccountResponse */
export interface PageResponseAccountResponse {
  content: AccountResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/**
 * PUT /api/admin/accounts/{id} 요청 본문.
 * status 필드가 제거되어 name만 전송합니다.
 */
export interface AccountUpdateRequest {
  name: string;
}

/** PATCH /api/admin/accounts/{accountId}/role — 새 명세에 언급 없어 기존 그대로 유지 */
export interface AccountRoleUpdateRequest {
  role: AccountRole;
}

/** API 공통 응답 포맷 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
