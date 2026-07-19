import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import ActivityChart from '../components/dashboard/ActivityChart';
import DashboardStatsCards from '../components/dashboard/DashboardStatsCards';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import { useDashboard } from '../hooks/useDashboard';

function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();
  const [searchVal, setSearchVal] = useState('');

  return (
    <main className="flex min-h-[100svh] flex-col bg-[#020b18] text-white font-['Rajdhani',sans-serif]">
      {/* Top bar */}
      <header
        className="flex h-14 flex-none items-center justify-between px-6"
        style={{ borderBottom: '1px solid rgba(0,212,255,0.08)', background: '#060f1e' }}
      >
        <h1 className="text-base font-semibold" style={{ color: '#e8f4ff' }}>
          대시보드
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: '#6b8fa8' }}
            />
            <input
              value={searchVal}
              onChange={(event) => setSearchVal(event.target.value)}
              placeholder="트윈 검색..."
              className="w-[180px] rounded-lg py-2 pl-8 pr-4 text-xs outline-none font-['JetBrains_Mono',monospace]"
              style={{
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.12)',
                color: '#e8f4ff',
              }}
            />
          </div>
          <button
            type="button"
            aria-label="알림"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.12)' }}
          >
            <Bell className="h-4 w-4" style={{ color: '#6b8fa8' }} />
            <span
              className="absolute right-1 top-1 h-2 w-2 rounded-full"
              style={{ background: '#ff3b6b' }}
            />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading && (
          <p className="text-sm font-['JetBrains_Mono',monospace]" style={{ color: '#6b8fa8' }}>
            불러오는 중...
          </p>
        )}
        {isError && (
          <p className="text-sm font-['JetBrains_Mono',monospace]" style={{ color: '#ff3b6b' }}>
            대시보드 데이터를 불러오지 못했습니다.
          </p>
        )}

        {data && (
          <>
            <DashboardStatsCards stats={data.stats} alertCount={data.recentAlerts.length} />

            <div className="grid gap-4 lg:grid-cols-3">
              <ActivityChart data={data.activity} />
              <RecentAlerts alerts={data.recentAlerts} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default DashboardPage;
