import { useRef, useState, type MouseEvent } from 'react';
import type { ActivityPoint } from '../../types/dashboard';

interface ActivityChartProps {
  data: ActivityPoint[];
}

const WIDTH = 700;
const HEIGHT = 260;
const PADDING = { top: 10, right: 12, bottom: 26, left: 34 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;
const Y_MAX = 340;
const Y_TICKS = [0, 85, 170, 255, 340];

function xForIndex(index: number, total: number): number {
  if (total <= 1) {
    return PADDING.left;
  }
  return PADDING.left + (index / (total - 1)) * PLOT_WIDTH;
}

function yForValue(value: number): number {
  return PADDING.top + PLOT_HEIGHT - (Math.min(value, Y_MAX) / Y_MAX) * PLOT_HEIGHT;
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

function ActivityChart({ data }: ActivityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const twinPoints = data.map((point, index) => ({
    x: xForIndex(index, data.length),
    y: yForValue(point.activeTwins),
  }));
  const alertPoints = data.map((point, index) => ({
    x: xForIndex(index, data.length),
    y: yForValue(point.alerts),
  }));

  const handlePointerMove = (event: MouseEvent<SVGRectElement>) => {
    const svg = svgRef.current;
    if (!svg || data.length === 0) {
      return;
    }
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) {
      return;
    }
    const fractionX = (event.clientX - rect.left) / rect.width;
    const viewBoxX = fractionX * WIDTH;
    const ratio = (viewBoxX - PADDING.left) / PLOT_WIDTH;
    const index = Math.round(ratio * (data.length - 1));
    const clamped = Math.min(Math.max(index, 0), data.length - 1);
    setHoveredIndex(clamped);
  };

  const handlePointerLeave = () => {
    setHoveredIndex(null);
  };

  const hoveredPoint = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredTwinPoint = hoveredIndex !== null ? twinPoints[hoveredIndex] : null;
  const hoveredAlertPoint = hoveredIndex !== null ? alertPoints[hoveredIndex] : null;

  const tooltipLeftPercent = hoveredTwinPoint ? (hoveredTwinPoint.x / WIDTH) * 100 : 0;
  const tooltipTopPercent = hoveredTwinPoint
    ? (Math.min(hoveredTwinPoint.y, hoveredAlertPoint?.y ?? hoveredTwinPoint.y) / HEIGHT) * 100
    : 0;
  const tooltipAlign = tooltipLeftPercent > 75 ? 'right' : tooltipLeftPercent < 15 ? 'left' : 'center';

  return (
    <section className="twin-card dashboard-panel dashboard-chart-panel">
      <div className="dashboard-panel__header">
        <div>
          <h2>트윈 활동 현황</h2>
          <p className="dashboard-panel__subtitle">최근 14일</p>
        </div>
        <div className="dashboard-chart__legend">
          <span className="dashboard-chart__legend-item">
            <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--accent" />
            활성 트윈
          </span>
          <span className="dashboard-chart__legend-item">
            <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--amber" />
            알림
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
          aria-label="트윈 활동 현황 차트"
        >
          {Y_TICKS.map((tick) => {
            const y = yForValue(tick);
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

          {data.map((point, index) => {
            const x = xForIndex(index, data.length);
            return (
              <text
                key={point.day}
                x={x}
                y={HEIGHT - 6}
                textAnchor="middle"
                className="dashboard-chart__axis-label"
              >
                {point.day}
              </text>
            );
          })}

          <path
            d={buildSmoothPath(alertPoints)}
            fill="none"
            stroke="var(--twin-amber)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <path
            d={buildSmoothPath(twinPoints)}
            fill="none"
            stroke="var(--twin-accent)"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {hoveredTwinPoint && hoveredAlertPoint ? (
            <g className="dashboard-chart__crosshair">
              <line
                x1={hoveredTwinPoint.x}
                x2={hoveredTwinPoint.x}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle cx={hoveredTwinPoint.x} cy={hoveredTwinPoint.y} r={4} fill="var(--twin-accent)" />
              <circle cx={hoveredAlertPoint.x} cy={hoveredAlertPoint.y} r={4} fill="var(--twin-amber)" />
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

        {hoveredPoint ? (
          <div
            className={`dashboard-chart__tooltip dashboard-chart__tooltip--${tooltipAlign}`}
            style={{ left: `${tooltipLeftPercent}%`, top: `${tooltipTopPercent}%` }}
          >
            <p className="dashboard-chart__tooltip-title">{hoveredPoint.day}</p>
            <p className="dashboard-chart__tooltip-row">
              <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--accent" />
              twins : {hoveredPoint.activeTwins.toLocaleString()}
            </p>
            <p className="dashboard-chart__tooltip-row">
              <span className="dashboard-chart__legend-dot dashboard-chart__legend-dot--amber" />
              alerts : {hoveredPoint.alerts.toLocaleString()}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ActivityChart;
