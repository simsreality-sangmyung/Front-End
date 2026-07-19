/**
 * GET /api/admin/dashboard 응답 (curl로 실제 확인됨).
 * 통계 카드 4개 전부 실제 API 값입니다.
 */
export interface DashboardStats {
  totalTwinCount: number;
  thisMonthNewTwinCount: number;
  totalVisitorCount: number;
  loggedInVisitorCount: number;
}

/**
 * 일별 방문자 추이 그래프 데이터.
 * 실제 일별 방문자 추이 API가 없어 mocks/dashboard.ts의 mock 데이터를 사용합니다
 * (화면 문구는 Figma 기준 "페이지 방문자 수"에 맞춰 표시됩니다).
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

export type TwinOverviewCategory =
  | '스마트 빌딩'
  | '물류센터'
  | '스마트 팩토리'
  | '도시 인프라'
  | '에너지';

export type TwinOverviewStatus = '정상' | '경고' | '오프라인';

export interface TwinOverviewItem {
  id: string;
  name: string;
  category: TwinOverviewCategory;
  status: TwinOverviewStatus;
  syncRate: number | null;
  sensorCount: number;
  lastUpdate: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activity: ActivityPoint[];
  recentAlerts: RecentAlert[];
  twins: TwinOverviewItem[];
}

/** API 공통 응답 포맷 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
