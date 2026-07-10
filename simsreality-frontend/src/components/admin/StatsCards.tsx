import { Activity, AlertTriangle, Box, WifiOff } from 'lucide-react';
import type { AdminItem } from '../../types/adminItem';

interface StatsCardsProps {
  items: AdminItem[];
}

function StatsCards({ items }: StatsCardsProps) {
  const total = items.length;
  const normal = items.filter((item) => item.status === '정상').length;
  const warning = items.filter((item) => item.status === '경고').length;
  const offline = items.filter((item) => item.status === '오프라인').length;

  const cards = [
    {
      key: 'total',
      label: '전체 트윈',
      value: total,
      icon: Box,
      tone: 'accent' as const,
    },
    {
      key: 'normal',
      label: '정상 운영',
      value: normal,
      icon: Activity,
      tone: 'green' as const,
    },
    {
      key: 'warning',
      label: '경고',
      value: warning,
      icon: AlertTriangle,
      tone: 'amber' as const,
    },
    {
      key: 'offline',
      label: '오프라인',
      value: offline,
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
