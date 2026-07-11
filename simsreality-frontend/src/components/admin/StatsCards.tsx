import { AlertTriangle, Box, WifiOff, Activity } from 'lucide-react';
import type { AdminItem } from '../../types/adminItem';

interface StatsCardsProps {
  /** 서버가 반환하는 정확한 전체 개수 (totalElements) */
  totalElements: number;
  /**
   * 통계 집계용으로 조회된 항목 목록 (최대 1000건).
   * status는 서버 데이터가 아니라 더미 값(src/utils/adminItemMapper.ts)이므로,
   * 정상/경고/오프라인 카드 수치도 실제 운영 상태가 아닌 더미 집계입니다.
   */
  items: AdminItem[];
}

function StatsCards({ totalElements, items }: StatsCardsProps) {
  const normalCount = items.filter((item) => item.status === '정상').length;
  const warningCount = items.filter((item) => item.status === '경고').length;
  const offlineCount = items.filter((item) => item.status === '오프라인').length;

  const cards = [
    {
      key: 'total',
      label: '전체 트윈',
      value: totalElements,
      icon: Box,
      tone: 'accent' as const,
    },
    {
      key: 'normal',
      label: '정상 운영',
      value: normalCount,
      icon: Activity,
      tone: 'green' as const,
    },
    {
      key: 'warning',
      label: '경고',
      value: warningCount,
      icon: AlertTriangle,
      tone: 'amber' as const,
    },
    {
      key: 'offline',
      label: '오프라인',
      value: offlineCount,
      icon: WifiOff,
      tone: 'rose' as const,
    },
  ];

  return (
    <div className="stats-cards">
      {cards.map(({ key, label, value, icon: Icon, tone }) => (
        <div className="stats-card" key={key}>
          <div className="stats-card__top">
            <span className={`stats-card__icon stats-card__icon--${tone}`}>
              <Icon size={14} strokeWidth={2} />
            </span>
            <span className={`stats-card__value stats-card__value--${tone}`}>
              {value.toLocaleString()}
            </span>
          </div>
          <p className="stats-card__label">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
