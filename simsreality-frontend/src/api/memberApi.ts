import client from './client';
import type { ApiResponse, MemberMeResponse } from '../types/member';

/**
 * Swagger: GET /api/members/me — 로그인 사용자의 id/name/email/role/ssoType 조회
 */
export async function fetchMyProfile(): Promise<MemberMeResponse> {
  const response = await client.get<ApiResponse<MemberMeResponse>>(
    '/api/members/me',
  );
  return response.data.data;
}

export const myProfileQueryKey = ['members', 'me'] as const;
