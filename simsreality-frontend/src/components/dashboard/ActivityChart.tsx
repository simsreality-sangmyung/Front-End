import { motion } from 'motion/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ActivityPoint } from '../../types/dashboard';

interface ActivityChartProps {
  /** GET /api/admin/dashboard 의 dailyVisitors를 매핑한 데이터 */
  data: ActivityPoint[];
}

function ActivityChart({ data }: ActivityChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl p-5 lg:col-span-2 font-['Rajdhani',sans-serif]"
      style={{ background: '#071222', border: '1px solid rgba(0,212,255,0.08)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="mb-0.5 text-sm font-semibold" style={{ color: '#e8f4ff' }}>
            페이지 방문자 수
          </div>
          <div className="text-xs font-['JetBrains_Mono',monospace]" style={{ color: '#6b8fa8' }}>
            최근 14일
          </div>
        </div>
        <div
          className="flex items-center gap-4 text-xs font-['JetBrains_Mono',monospace]"
          style={{ color: '#6b8fa8' }}
        >
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#00d4ff' }} />
            전체 방문
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#00ff88' }} />
            로그인 사용자
          </span>
        </div>
      </div>

      {safeData.length === 0 ? (
        <p
          className="flex h-[180px] items-center justify-center text-xs font-['JetBrains_Mono',monospace]"
          style={{ color: '#6b8fa8' }}
        >
          표시할 방문자 데이터가 없습니다.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={safeData}>
            <defs>
              <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradLoggedIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.05)" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#6b8fa8', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b8fa8', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#071222',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 8,
                color: '#e8f4ff',
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />
            <Area
              type="monotone"
              dataKey="totalVisitors"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="url(#gradVisitors)"
              dot={false}
              name="전체 방문"
            />
            <Area
              type="monotone"
              dataKey="loggedInUsers"
              stroke="#00ff88"
              strokeWidth={2}
              fill="url(#gradLoggedIn)"
              dot={false}
              name="로그인 사용자"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

export default ActivityChart;
