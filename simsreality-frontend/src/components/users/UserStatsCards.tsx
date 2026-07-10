import { Shield, UserCheck, UserX, Users } from 'lucide-react';
import type { User } from '../../types/user';

interface UserStatsCardsProps {
  users: User[];
}

function UserStatsCards({ users }: UserStatsCardsProps) {
  const total = users.length;
  const active = users.filter((user) => user.status === '활성').length;
  const suspended = users.filter((user) => user.status === '정지').length;
  const pending = users.filter((user) => user.status === '대기').length;

  const cards = [
    {
      key: 'total',
      label: '전체 사용자',
      value: total,
      icon: Users,
      tone: 'accent' as const,
    },
    {
      key: 'active',
      label: '활성',
      value: active,
      icon: UserCheck,
      tone: 'green' as const,
    },
    {
      key: 'suspended',
      label: '정지',
      value: suspended,
      icon: UserX,
      tone: 'rose' as const,
    },
    {
      key: 'pending',
      label: '승인 대기',
      value: pending,
      icon: Shield,
      tone: 'amber' as const,
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

export default UserStatsCards;
