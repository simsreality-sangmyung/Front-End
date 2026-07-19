import { ChevronRight } from 'lucide-react';
import type { TwinOverviewItem, TwinOverviewStatus } from '../../types/dashboard';

interface TwinOverviewTableProps {
  twins: TwinOverviewItem[];
  totalCount: number;
}

const STATUS_CLASS: Record<TwinOverviewStatus, string> = {
  정상: 'twin-status--normal',
  경고: 'twin-status--warning',
  오프라인: 'twin-status--offline',
};

const SYNC_BAR_CLASS: Record<TwinOverviewStatus, string> = {
  정상: 'twin-sync-bar__fill--normal',
  경고: 'twin-sync-bar__fill--warning',
  오프라인: 'twin-sync-bar__fill--offline',
};

function TwinOverviewTable({ twins, totalCount }: TwinOverviewTableProps) {
  return (
    <section className="twin-card twin-table-card dashboard-twins-panel">
      <div className="dashboard-panel__header dashboard-twins-panel__header">
        <h2>디지털트윈 목록</h2>
        <span className="dashboard-twins-panel__count">
          {twins.length} / {totalCount}
        </span>
      </div>

      <div className="twin-table-wrapper">
        <table className="twin-table dashboard-twins-table">
          <thead>
            <tr>
              <th className="dashboard-twins-table__col-id">ID</th>
              <th className="dashboard-twins-table__col-name">이름</th>
              <th className="dashboard-twins-table__col-category">유형</th>
              <th className="dashboard-twins-table__col-status">상태</th>
              <th className="dashboard-twins-table__col-sync">동기화율</th>
              <th className="dashboard-twins-table__col-sensor">센서 수</th>
              <th className="dashboard-twins-table__col-updated">마지막 업데이트</th>
              <th className="dashboard-twins-table__col-detail" aria-label="상세" />
            </tr>
          </thead>
          <tbody>
            {twins.map((twin) => (
              <tr key={twin.id}>
                <td className="dashboard-twins-table__col-id twin-table__subtitle">
                  {twin.id}
                </td>
                <td className="dashboard-twins-table__col-name twin-table__title">
                  {twin.name}
                </td>
                <td className="dashboard-twins-table__col-category">
                  {twin.category}
                </td>
                <td className="dashboard-twins-table__col-status">
                  <span className={`twin-status ${STATUS_CLASS[twin.status]}`}>
                    <span className="twin-status__dot" />
                    {twin.status}
                  </span>
                </td>
                <td className="dashboard-twins-table__col-sync">
                  {twin.syncRate === null ? (
                    <span className="dashboard-twins-table__no-sync">–</span>
                  ) : (
                    <div className="twin-sync">
                      <div className="twin-sync-bar">
                        <div
                          className={`twin-sync-bar__fill ${SYNC_BAR_CLASS[twin.status]}`}
                          style={{ width: `${Math.max(0, Math.min(100, twin.syncRate))}%` }}
                        />
                      </div>
                      <span className="twin-sync__value">
                        {twin.syncRate.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </td>
                <td className="dashboard-twins-table__col-sensor twin-table__sensor-count">
                  {twin.sensorCount.toLocaleString()}
                </td>
                <td className="dashboard-twins-table__col-updated">
                  {twin.lastUpdate}
                </td>
                <td className="dashboard-twins-table__col-detail">
                  <span className="dashboard-twins-table__detail-link">
                    상세 <ChevronRight size={12} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TwinOverviewTable;
