import { Box, Globe, LayoutGrid, LogOut, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: '대시보드', icon: LayoutGrid },
  { to: '/users', label: '사용자 관리', icon: Users },
  { to: '/', label: '트윈 관리', icon: Box, end: true },
  { to: '/settings', label: '설정', icon: Settings },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo-icon">
          <Globe size={14} strokeWidth={2} />
        </span>
        <span className="sidebar__logo-text">
          <span className="sidebar__logo-text--accent">TWIN</span>
          <span className="sidebar__logo-text--muted">OS</span>
        </span>
      </div>

      <div className="sidebar__panel-label">// ADMIN PANEL</div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
            }
          >
            <Icon size={15} strokeWidth={2} className="sidebar__nav-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <LogOut size={12} strokeWidth={2} className="sidebar__footer-icon" />
        <span>사용자 화면으로</span>
      </div>
    </aside>
  );
}

export default Sidebar;
