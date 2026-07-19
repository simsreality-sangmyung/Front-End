import { motion } from 'motion/react';
import { Cpu, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react';
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
  const cards = [
    {
      label: '전체 트윈',
      value: stats.totalTwinCount.toLocaleString(),
      sub: `+${stats.thisMonthNewTwinCount} 이번 달`,
      icon: Cpu,
      color: '#00d4ff',
      trend: 'up' as const,
    },
    {
      label: '알림',
      value: alertCount.toLocaleString(),
      sub: '미처리 알림',
      icon: TriangleAlert,
      color: '#ff8c00',
      trend: 'down' as const,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.07 }}
          className="rounded-xl p-4"
          style={{ background: '#071222', border: '1px solid rgba(0,212,255,0.08)' }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-['JetBrains_Mono',monospace]" style={{ color: '#6b8fa8' }}>
              {card.label}
            </span>
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${card.color}15` }}
            >
              <card.icon className="h-3.5 w-3.5" style={{ color: card.color }} />
            </div>
          </div>
          <div
            className="mb-1 text-2xl font-bold font-['JetBrains_Mono',monospace]"
            style={{ color: '#e8f4ff' }}
          >
            {card.value}
          </div>
          <div
            className="flex items-center gap-1 text-xs font-['JetBrains_Mono',monospace]"
            style={{ color: card.trend === 'up' ? '#00ff88' : '#ff8c00' }}
          >
            {card.trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {card.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default DashboardStatsCards;
