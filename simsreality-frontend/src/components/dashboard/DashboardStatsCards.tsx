import {
  Activity,
  AlertTriangle,
  Box,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { DashboardStats } from '../../types/dashboard';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const cards = [
    {
      key: 'total',
      label: '전체 트윈',
      value: stats.totalTwins.toLocaleString(),
      icon: Box,
      tone: 'accent' as const,
      trend: stats.totalTwinsDelta,
      trendDirection: 'up' as const,
    },
    {
      key: 'sensors',
      label: '활성 센서',
      value: stats.activeSensors.toLocaleString(),
      icon: Activity,
      tone: 'green' as const,
      trend: stats.activeSensorsLabel,
      trendDirection: 'up' as const,
    },
    {
      key: 'alerts',
      label: '알림',
      value: stats.alertCount.toLocaleString(),
      icon: AlertTriangle,
      tone: 'amber' as const,
      trend: stats.alertCountLabel,
      trendDirection: 'down' as const,
    },
    {
      key: 'sync',
      label: '평균 동기화율',
      value: `${stats.avgSyncRate.toFixed(1)}%`,
      icon: CheckCircle2,
      tone: 'violet' as const,
      trend: stats.avgSyncRateLabel,
      trendDirection: 'up' as const,
    },
  ];

  return (
    <div className="stats-cards">
      {cards.map(({ key, label, value, icon: Icon, tone, trend, trendDirection }) => {
        const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;
        const trendTone = trendDirection === 'up' ? 'green' : 'amber';
        return (
          <div className="stats-card" key={key}>
            <div className="stats-card__top">
              <p className="stats-card__label">{label}</p>
              <span className={`stats-card__icon stats-card__icon--${tone}`}>
                <Icon size={14} strokeWidth={2} />
              </span>
            </div>
            <span className="dashboard-stat__value">{value}</span>
            <p className={`dashboard-stat__trend dashboard-stat__trend--${trendTone}`}>
              <TrendIcon size={11} strokeWidth={2.2} />
              {trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStatsCards;
