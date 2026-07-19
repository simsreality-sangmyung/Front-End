import { useRef, useState, type MouseEvent } from 'react';
import type { ActivityPoint } from '../../types/dashboard';

interface ActivityChartProps {
  /** GET /api/admin/dashboard 의 dailyVisitors를 매핑한 데이터 */
  data: ActivityPoint[];
}

const WIDTH = 700;
const HEIGHT = 260;
const PADDING = { top: 10, right: 12, bottom: 26, left: 34 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

function buildYScale(data: ActivityPoint[]): { yMax: number; yTicks: number[] } {
  const peak = data.reduce(
    (max, point) => Math.max(max, point.totalVisitors, point.loggedInUsers),
    0,
  );

  if (peak <= 0) {
    return { yMax: 100, yTicks: [0, 20, 40, 60, 80] };
  }

  const rough = Math.ceil(peak * 1.15);
  const step = Math.max(1, Math.ceil(rough / 4));
  const yMax = step * 4;
  return {
    yMax,
    yTicks: [0, step, step * 2, step * 3, step * 4].filter((tick) => tick < yMax),
  };
}

function xForIndex(index: number, total: number): number {
  if (total <= 1) {
    return PADDING.left;
  }
  return PADDING.left + (index / (total - 1)) * PLOT_WIDTH;
}

function yForValue(value: number, yMax: number): number {
  return PADDING.top + PLOT_HEIGHT - (Math.min(value, yMax) / yMax) * PLOT_HEIGHT;
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) {
    return '';
  }
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    path += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
  }
  const last = points[points.length - 1];
  path += ` L ${last.x} ${last.y}`;
  return path;
}

function buildSmoothAreaPath(points: { x: number; y: number }[], baseline: number): string {
  if (points.length === 0) {
    return '';
  }
  const linePath = buildSmoothPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

function ActivityChart({ data }: ActivityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const safeData = Array.isArray(data) ? data : [];
  const { yMax, yTicks } = buildYScale(safeData);

  const totalVisitorPoints = safeData.map((point, index) => ({
    x: xForIndex(index, safeData.length),
    y: yForValue(point.totalVisitors, yMax),
  }));
  const loggedInUserPoints = safeData.map((point, index) => ({
    x: xForIndex(index, safeData.length),
    y: yForValue(point.loggedInUsers, yMax),
  }));

  const handlePointerMove = (event: MouseEvent<SVGRectElement>) => {
    const svg = svgRef.current;
    if (!svg || safeData.length === 0) {
      return;
    }
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) {
      return;
    }
    const fractionX = (event.clientX - rect.left) / rect.width;
    const viewBoxX = fractionX * WIDTH;
    const ratio = (viewBoxX - PADDING.left) / PLOT_WIDTH;
    const index = Math.round(ratio * (safeData.length - 1));
    const clamped = Math.min(Math.max(index, 0), safeData.length - 1);
    setHoveredIndex(clamped);
  };

  const handlePointerLeave = () => {
    setHoveredIndex(null);
  };

  const hoveredPoint = hoveredIndex !== null ? safeData[hoveredIndex] : null;
  const hoveredTotalVisitorPoint =
    hoveredIndex !== null ? totalVisitorPoints[hoveredIndex] : null;
  const hoveredLoggedInUserPoint =
    hoveredIndex !== null ? loggedInUserPoints[hoveredIndex] : null;

  const tooltipLeftPercent = hoveredTotalVisitorPoint
    ? (hoveredTotalVisitorPoint.x / WIDTH) * 100
    : 0;
  const tooltipTopPercent = hoveredTotalVisitorPoint
    ? (Math.min(
        hoveredTotalVisitorPoint.y,
        hoveredLoggedInUserPoint?.y ?? hoveredTotalVisitorPoint.y,
      ) /
        HEIGHT) *
      100
    : 0;
  const tooltipAlign =
    tooltipLeftPercent > 75 ? 'right' : tooltipLeftPercent < 15 ? 'left' : 'center';

  return (
    <section className="twin-card dashboard-panel dashboard-chart-panel">
      <div className="dashboard-panel__header">
        <div>
          <h2>페이지 방문자 수</h2>
          <p className="dashboard-panel__subtitle">최근 14일</p>
        </div>
        <div className="dashboard-chart__legend">
          <span className="dashboard-chart__legend-item">
            <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--accent" />
            전체 방문
          </span>
          <span className="dashboard-chart__legend-item">
            <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--amber" />
            로그인 사용자
          </span>
        </div>
      </div>

      <div className="dashboard-chart">
        <svg
          ref={svgRef}
          className="dashboard-chart__svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="페이지 방문자 수 차트"
        >
          <defs>
            <linearGradient id="activityChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--twin-accent)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--twin-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = yForValue(tick, yMax);
            return (
              <g key={tick}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth={1}
                />
                <text
                  x={PADDING.left - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="dashboard-chart__axis-label"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {safeData.map((point, index) => {
            const x = xForIndex(index, safeData.length);
            return (
              <text
                key={`${point.day}-${index}`}
                x={x}
                y={HEIGHT - 6}
                textAnchor="middle"
                className="dashboard-chart__axis-label"
              >
                {point.day}
              </text>
            );
          })}

          {safeData.length > 0 ? (
            <>
              <path
                d={buildSmoothAreaPath(totalVisitorPoints, HEIGHT - PADDING.bottom)}
                fill="url(#activityChartFill)"
                stroke="none"
              />
              <path
                d={buildSmoothPath(loggedInUserPoints)}
                fill="none"
                stroke="var(--twin-amber)"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.85}
              />
              <path
                d={buildSmoothPath(totalVisitorPoints)}
                fill="none"
                stroke="var(--twin-accent)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </>
          ) : null}

          {hoveredTotalVisitorPoint && hoveredLoggedInUserPoint ? (
            <g className="dashboard-chart__crosshair">
              <line
                x1={hoveredTotalVisitorPoint.x}
                x2={hoveredTotalVisitorPoint.x}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredTotalVisitorPoint.x}
                cy={hoveredTotalVisitorPoint.y}
                r={4}
                fill="var(--twin-accent)"
              />
              <circle
                cx={hoveredLoggedInUserPoint.x}
                cy={hoveredLoggedInUserPoint.y}
                r={4}
                fill="var(--twin-amber)"
              />
            </g>
          ) : null}

          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={PLOT_WIDTH}
            height={PLOT_HEIGHT}
            fill="transparent"
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
          />
        </svg>

        {safeData.length === 0 ? (
          <p className="dashboard-chart__empty">표시할 방문자 데이터가 없습니다.</p>
        ) : null}

        {hoveredPoint ? (
          <div
            className={`dashboard-chart__tooltip dashboard-chart__tooltip--${tooltipAlign}`}
            style={{ left: `${tooltipLeftPercent}%`, top: `${tooltipTopPercent}%` }}
          >
            <p className="dashboard-chart__tooltip-title">{hoveredPoint.day}</p>
            <p className="dashboard-chart__tooltip-row">
              <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--accent" />
              전체 방문 : {hoveredPoint.totalVisitors.toLocaleString()}
            </p>
            <p className="dashboard-chart__tooltip-row">
              <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--amber" />
              로그인 사용자 : {hoveredPoint.loggedInUsers.toLocaleString()}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ActivityChart;
