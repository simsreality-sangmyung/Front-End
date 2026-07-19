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
 * 목록 응답에는 상태 필드가 없습니다.
 * 실제 데이터가 아니라, id 기반으로 결정적인(새로고침해도 값이 바뀌지 않는)
 * mock 값을 채워 트윈 수정 모달의 "상태" select(Figma UI)가 비어 보이지 않도록 합니다.
 * → 서버에 해당 필드가 추가되면 이 함수를 실제 값으로 교체해야 합니다.
 */
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

export function mapAdminDigitalTwinToAdminItem(
  item: AdminDigitalTwinListResponse,
): AdminItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    location: item.place || '-',
    category: mapApiValueToTwinCategory(item.category),
    managerId: item.managerId ?? null,
    managerName: item.managerName || '-',
    managerRole: item.managerRole ?? null,
    status: getDummyStatus(item.id),
    imageFileName: item.imageFileName || '-',
    registeredAt: formatDate(item.createdAt),
    viewCount: item.viewCount ?? 0,
    executableFileName: item.executableFileName || '-',
  };
}
