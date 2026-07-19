import { Box, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react';
import type { DashboardStats } from '../../types/dashboard';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
  /** "알림" 카드 값. 대응 API 필드가 없어 최근 알림 목록 길이를 mock으로 사용합니다. */
  alertCount: number;
}

/**
 * Figma 디자인 기준 2개 카드("전체 트윈", "알림").
 * - 전체 트윈: totalTwinCount(실 API) + thisMonthNewTwinCount(실 API)를 트렌드로 표시
 * - 알림: 대응 API가 없어 최근 알림 목록 길이를 mock 값으로 표시 (화면은 Figma와 동일)
 */
function DashboardStatsCards({ stats, alertCount }: DashboardStatsCardsProps) {
  return (
    <div className="stats-cards stats-cards--dashboard">
      <div className="stats-card">
        <div className="stats-card__top">
          <p className="stats-card__label">전체 트윈</p>
          <span className="stats-card__icon stats-card__icon--accent">
            <Box size={14} strokeWidth={2} />
          </span>
        </div>
        <span className="dashboard-stat__value">{stats.totalTwinCount.toLocaleString()}</span>
        <p className="dashboard-stat__trend dashboard-stat__trend--green">
          <TrendingUp size={12} />
          {`+${stats.thisMonthNewTwinCount} 이번 달`}
        </p>
      </div>

      <div className="stats-card">
        <div className="stats-card__top">
          <p className="stats-card__label">알림</p>
          <span className="stats-card__icon stats-card__icon--amber">
            <TriangleAlert size={14} strokeWidth={2} />
          </span>
        </div>
        <span className="dashboard-stat__value">{alertCount.toLocaleString()}</span>
        <p className="dashboard-stat__trend dashboard-stat__trend--amber">
          <TrendingDown size={12} />
          미처리 알림
        </p>
      </div>
    </div>
  );
}

export default DashboardStatsCards;
