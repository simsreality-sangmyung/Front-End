import client from './client';
import { mockDashboardExtras } from '../mocks/dashboard';
import type { ApiResponse, DashboardData, DashboardStats } from '../types/dashboard';

/**
 * GET /api/admin/dashboard — 통계 카드 4개(전체 트윈 수/이번 달 신규 수/전체 방문자 수/
 * 로그인 방문자 수)를 실제 API로 조회합니다(curl로 확인된 필드명).
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await client.get<ApiResponse<DashboardStats>>(
    '/api/admin/dashboard',
  );
  return response.data.data;
}

/**
 * 대시보드 화면 데이터.
 * - stats: 실제 API(GET /api/admin/dashboard)
 * - activity(방문자 그래프)/recentAlerts(최근 알림)/twins(트윈 목록): 대응하는 응답
 *   필드가 없어 기존 더미 데이터를 그대로 유지합니다.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const stats = await fetchDashboardStats();
  return {
    stats,
    ...mockDashboardExtras,
  };
}

export const dashboardQueryKey = ['dashboard'] as const;
