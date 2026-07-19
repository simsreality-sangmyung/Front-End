import client from './client';
import type { ApiResponse, PageResponseAccountResponse } from '../types/account';

export interface ManagerOption {
  id: number;
  name: string;
  email: string;
}

/**
 * 담당자 선택 목록 — 디지털트윈 등록/수정 폼의 managerId 선택용.
 * 별도의 담당자 전용 API가 없어, 기존 GET /api/admin/accounts를 재사용합니다.
 * role로 임의 필터링하지 않고 조회되는 계정을 모두 옵션으로 제공합니다.
 */
export async function fetchManagerOptions(): Promise<ManagerOption[]> {
  const response = await client.get<ApiResponse<PageResponseAccountResponse>>(
    '/api/admin/accounts',
    { params: { page: 0, size: 1000, sort: ['name,asc'] } },
  );
  return response.data.data.content.map((account) => ({
    id: account.id,
    name: account.name,
    email: account.email,
  }));
}

export const managerOptionsQueryKey = ['managerOptions'] as const;
