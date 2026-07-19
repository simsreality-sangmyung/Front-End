/** Swagger: MemberMeResponse — GET /api/members/me 응답 (로그인 사용자 정보) */
export type MemberRole = 'SUPER' | 'ADMIN' | 'USER' | 'PENDING';

export type MemberSsoType = 'NAVER' | 'KAKAO' | 'GOOGLE';

export interface MemberMeResponse {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  ssoType: MemberSsoType;
}

/** API 공통 응답 포맷 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
