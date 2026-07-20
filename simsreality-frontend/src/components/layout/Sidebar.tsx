import { Cpu, Globe, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { USER_DASHBOARD_URL } from '../../navigation/externalLinks';

const NAV_ITEMS = [
  { to: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { to: '/users', label: '사용자 관리', icon: Users },
  { to: '/admin', label: '트윈 관리', icon: Cpu, end: true },
  { to: '/settings', label: '설정', icon: Settings },
];

function Sidebar() {
  return (
    <aside className="sticky top-0 flex min-h-screen w-56 shrink-0 flex-col border-r border-white/8 bg-white/2">
      <div className="border-b border-white/8 p-5">
        <div className="flex items-center gap-2.5">
          <Link
            to="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00d4ff]/30 bg-[#00d4ff]/10 transition-colors hover:bg-[#00d4ff]/20"
            aria-label="대시보드로 이동"
            title="대시보드"
          >
            <Globe className="h-4 w-4 text-[#00d4ff]" />
          </Link>
          <span className="font-['Rajdhani',sans-serif] text-base font-bold tracking-widest text-[#00d4ff]">
            TWIN<span className="text-white">OS</span>
          </span>
        </div>
        <div className="mt-3 rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/10 px-2 py-1.5">
          <p className="font-['JetBrains_Mono',monospace] text-[10px] tracking-wider text-[#00d4ff]">
            // ADMIN PANEL
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 font-['Rajdhani',sans-serif] text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? 'border border-[#00d4ff]/25 bg-[#00d4ff]/15 text-[#00d4ff]'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/8 p-4">
        <a
          href={USER_DASHBOARD_URL}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-['Rajdhani',sans-serif] text-sm text-white/40 transition-all hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          사용자 화면으로
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
