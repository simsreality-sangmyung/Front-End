import client from './client';
import { mockDashboardExtras } from '../mocks/dashboard';
import type {
  ActivityPoint,
  ApiResponse,
  DailyVisitorResponse,
  DashboardData,
  DashboardResponse,
  DashboardStats,
} from '../types/dashboard';

/**
 * Swagger: dailyVisitors → ActivityChart용 ActivityPoint로 매핑합니다.
 * - day: Figma x축("1일" … "14일")에 맞춰 순번 라벨
 * - totalVisitors ← totalCount
 * - loggedInUsers ← loggedInCount
 * 응답에 필드가 없거나 빈 배열이면 빈 배열을 반환해 차트가 깨지지 않게 합니다.
 */
function mapDailyVisitorsToActivity(
  dailyVisitors: DailyVisitorResponse[] | null | undefined,
): ActivityPoint[] {
  if (!Array.isArray(dailyVisitors) || dailyVisitors.length === 0) {
    return [];
  }

  return dailyVisitors.map((item, index) => ({
    day: `${index + 1}일`,
    totalVisitors: Number(item?.totalCount) || 0,
    loggedInUsers: Number(item?.loggedInCount) || 0,
  }));
}

/**
 * GET /api/admin/dashboard — DashboardResponse (Swagger 확인).
 */
export async function fetchDashboardResponse(): Promise<DashboardResponse> {
  const response = await client.get<ApiResponse<DashboardResponse>>(
    '/api/admin/dashboard',
  );
  return response.data.data;
}

/**
 * 통계 카드용 — totalTwinCount / thisMonthNewTwinCount (실 API, 기존 연동 유지).
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await fetchDashboardResponse();
  return {
    totalTwinCount: data.totalTwinCount ?? 0,
    thisMonthNewTwinCount: data.thisMonthNewTwinCount ?? 0,
  };
}

/**
 * 대시보드 화면 데이터.
 * - stats: 실 API (totalTwinCount / thisMonthNewTwinCount)
 * - activity: 실 API dailyVisitors 매핑
 * - recentAlerts / twins: 대응 API 없어 mock 유지
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const data = await fetchDashboardResponse();

  return {
    stats: {
      totalTwinCount: data.totalTwinCount ?? 0,
      thisMonthNewTwinCount: data.thisMonthNewTwinCount ?? 0,
    },
    activity: mapDailyVisitorsToActivity(data.dailyVisitors),
    ...mockDashboardExtras,
  };
}

export const dashboardQueryKey = ['dashboard'] as const;
