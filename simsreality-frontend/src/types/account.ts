/** Swagger: AccountResponse — 계정 관리 목록/검색 응답 항목 */
export type AccountRole = 'SUPER' | 'ADMIN' | 'USER' | 'PENDING';

export type AccountStatus = 'ACTIVE' | 'DELETED';

export type AccountSsoType = 'NAVER' | 'KAKAO' | 'GOOGLE';

export interface AccountResponse {
  id: number;
  name: string;
  email: string;
  joinedAt: string | null;
  /** 로그인한 적 없는 계정은 null (Swagger 스키마상 required 아님) */
  lastLoginAt: string | null;
  ssoType: AccountSsoType;
  role: AccountRole;
  loginId: string;
  status: AccountStatus;
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

/** Swagger: AccountUpdateRequest */
export interface AccountUpdateRequest {
  name?: string;
  status?: AccountStatus;
}

/** Swagger: AccountRoleUpdateRequest */
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
