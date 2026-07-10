export interface DashboardStats {
  totalTwins: number;
  totalTwinsDelta: string;
  activeSensors: number;
  activeSensorsLabel: string;
  alertCount: number;
  alertCountLabel: string;
  avgSyncRate: number;
  avgSyncRateLabel: string;
}

export interface ActivityPoint {
  day: string;
  activeTwins: number;
  alerts: number;
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
