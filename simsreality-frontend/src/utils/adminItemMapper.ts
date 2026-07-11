import {
  TWIN_STATUS_OPTIONS,
  mapApiValueToTwinCategory,
  type AdminItem,
  type TwinStatus,
} from '../types/adminItem';
import type { AdminDigitalTwinListResponse } from '../types/adminDigitalTwin';

function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return '-';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Swagger 목록 응답(AdminDigitalTwinListResponse)에는 담당자/동기화율/센서 수/상태 필드가
 * 없습니다. 실제 데이터가 아니라, id 기반으로 결정적인(새로고침해도 값이 바뀌지 않는)
 * 더미 값을 채워 기존 디자인의 통계 카드/테이블 컬럼이 비어 보이지 않도록 합니다.
 * → 서버에 해당 필드가 추가되면 이 함수들을 실제 값으로 교체해야 합니다.
 */
const DUMMY_MANAGERS = [
  '김민준',
  '이서연',
  '박도윤',
  '최지우',
  '정하은',
  '강서준',
  '조은우',
  '윤지호',
];

function getDummyManager(id: number): string {
  return DUMMY_MANAGERS[id % DUMMY_MANAGERS.length];
}

/** 정상 70% / 경고 20% / 오프라인 10% 비율로 결정적으로 배정합니다. */
function getDummyStatus(id: number): TwinStatus {
  const bucket = id % 10;
  if (bucket === 9) {
    return TWIN_STATUS_OPTIONS[2]; // 오프라인
  }
  if (bucket >= 7) {
    return TWIN_STATUS_OPTIONS[1]; // 경고
  }
  return TWIN_STATUS_OPTIONS[0]; // 정상
}

function getDummySyncRate(id: number, status: TwinStatus): number {
  if (status === '오프라인') {
    return 0;
  }
  if (status === '경고') {
    return 70 + (id % 20); // 70.0 ~ 89.0
  }
  return 95 + ((id * 7) % 5) + (((id * 3) % 10) / 10); // 95.0 ~ 99.9
}

function getDummySensorCount(id: number): number {
  return 80 + ((id * 53) % 450); // 80 ~ 529
}

export function mapAdminDigitalTwinToAdminItem(
  item: AdminDigitalTwinListResponse,
): AdminItem {
  const status = getDummyStatus(item.id);

  return {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    location: item.place || '-',
    category: mapApiValueToTwinCategory(item.category),
    manager: getDummyManager(item.id),
    syncRate: getDummySyncRate(item.id, status),
    sensorCount: getDummySensorCount(item.id),
    status,
    imageFileName: item.imageFileName || '-',
    registeredAt: formatDate(item.createdAt),
    viewCount: item.viewCount ?? 0,
    executableFileName: item.executableFileName || '-',
  };
}
