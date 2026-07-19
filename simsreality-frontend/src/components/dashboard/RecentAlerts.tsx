import { motion } from 'motion/react';
import { AlertTriangle, Clock } from 'lucide-react';
import type { AlertSeverity, RecentAlert } from '../../types/dashboard';

interface RecentAlertsProps {
  alerts: RecentAlert[];
}

const SEVERITY_STYLE: Record<AlertSeverity, { color: string; bg: string }> = {
  warning: { color: '#ff8c00', bg: 'rgba(255,140,0,0.08)' },
  critical: { color: '#ff3b6b', bg: 'rgba(255,59,107,0.08)' },
  info: { color: '#00d4ff', bg: 'rgba(0,212,255,0.06)' },
};

function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-xl p-5 font-['Rajdhani',sans-serif]"
      style={{ background: '#071222', border: '1px solid rgba(0,212,255,0.08)' }}
    >
      <div className="mb-4 text-sm font-semibold" style={{ color: '#e8f4ff' }}>
        최근 알림
      </div>
      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const style = SEVERITY_STYLE[alert.severity];
          return (
            <div
              key={alert.id}
              className="flex gap-3 rounded-lg p-2.5"
              style={{ background: style.bg }}
            >
              <AlertTriangle
                className="mt-0.5 h-3.5 w-3.5 flex-none"
                style={{ color: style.color }}
              />
              <div>
                <p className="mb-1 text-xs leading-relaxed" style={{ color: '#e8f4ff' }}>
                  {alert.message}
                </p>
                <span
                  className="flex items-center gap-1 text-xs font-['JetBrains_Mono',monospace]"
                  style={{ color: '#6b8fa8' }}
                >
                  <Clock className="h-3 w-3" />
                  {alert.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default RecentAlerts;
