import { Bell, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ActivityChart from '../components/dashboard/ActivityChart';
import DashboardStatsCards from '../components/dashboard/DashboardStatsCards';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import TwinOverviewTable from '../components/dashboard/TwinOverviewTable';
import { useDashboard } from '../hooks/useDashboard';
import '../styles/twinDesignSystem.css';
import './DashboardPage.css';

function DashboardPage() {
  const [keyword, setKeyword] = useState('');
  const { data, isLoading, isError } = useDashboard();

  const filteredTwins = useMemo(() => {
    if (!data) {
      return [];
    }
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) {
      return data.twins;
    }
    return data.twins.filter((twin) =>
      [twin.id, twin.name, twin.category]
        .join(' ')
        .toLowerCase()
        .includes(trimmed),
    );
  }, [data, keyword]);

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>대시보드</h1>
        </div>
        <div className="dashboard-header__actions">
          <div className="dashboard-header__search">
            <Search size={14} className="dashboard-header__search-icon" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="트윈 검색.."
            />
          </div>
          <button
            type="button"
            className="dashboard-header__bell"
            aria-label="알림"
          >
            <Bell size={16} />
            <span className="dashboard-header__bell-dot" />
          </button>
        </div>
      </header>

      {isLoading && <p className="twin-table-status">불러오는 중...</p>}
      {isError && (
        <p className="twin-table-status twin-table-status--error">
          대시보드 데이터를 불러오지 못했습니다.
        </p>
      )}

      {data && (
        <>
          <DashboardStatsCards stats={data.stats} />

          <div className="dashboard-grid">
            <ActivityChart data={data.activity} />
            <RecentAlerts alerts={data.recentAlerts} />
          </div>

          <TwinOverviewTable
            twins={filteredTwins}
            totalCount={data.twins.length}
          />
        </>
      )}
    </main>
  );
}

export default DashboardPage;
