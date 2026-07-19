/**
 * GET /api/admin/dashboard — DailyVisitorResponse (Swagger 확인).
 * 일자별 페이지 방문자 수.
 */
export interface DailyVisitorResponse {
  /** 날짜 (YYYY-MM-DD) */
  date: string;
  /** 전체 방문 수 (유니크 IP 방문 기준) */
  totalCount: number;
  /** 로그인 사용자 방문 수 */
  loggedInCount: number;
}

/**
 * GET /api/admin/dashboard — DashboardResponse (Swagger 확인).
 * - totalTwinCount / thisMonthNewTwinCount: 통계 카드용
 * - dailyVisitors: 최근 14일 일자별 방문자 수 (오늘 포함 오름차순 14개, 방문 없는 날은 0)
 */
export interface DashboardResponse {
  totalTwinCount: number;
  thisMonthNewTwinCount: number;
  dailyVisitors: DailyVisitorResponse[];
}

/** 통계 카드에 사용하는 필드 (실 API) */
export interface DashboardStats {
  totalTwinCount: number;
  thisMonthNewTwinCount: number;
}

/**
 * ActivityChart 표시용 포인트.
 * API의 DailyVisitorResponse를 매핑한 UI 모델입니다.
 */
export interface ActivityPoint {
  day: string;
  totalVisitors: number;
  loggedInUsers: number;
}

export type AlertSeverity = 'warning' | 'critical' | 'info';

export interface RecentAlert {
  id: number;
  severity: AlertSeverity;
  message: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activity: ActivityPoint[];
  recentAlerts: RecentAlert[];
}

/** API 공통 응답 포맷 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
