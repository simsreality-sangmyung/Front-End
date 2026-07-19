import { AlertTriangle, Clock } from 'lucide-react';
import type { AlertSeverity, RecentAlert } from '../../types/dashboard';

interface RecentAlertsProps {
  alerts: RecentAlert[];
}

const SEVERITY_CLASS: Record<AlertSeverity, string> = {
  warning: 'dashboard-alert--warning',
  critical: 'dashboard-alert--critical',
  info: 'dashboard-alert--info',
};

function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <section className="twin-card dashboard-panel dashboard-alerts-panel">
      <div className="dashboard-panel__header">
        <h2>최근 알림</h2>
      </div>

      <ul className="dashboard-alert-list">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`dashboard-alert ${SEVERITY_CLASS[alert.severity]}`}
          >
            <AlertTriangle size={14} className="dashboard-alert__icon" />
            <div className="dashboard-alert__body">
              <p className="dashboard-alert__message">{alert.message}</p>
              <p className="dashboard-alert__time">
                <Clock size={10} />
                {alert.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecentAlerts;
