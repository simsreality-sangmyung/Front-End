import type { AdminItem, AdminItemSortOption } from '../types/adminItem';

/**
 * 서버가 등록일 기준 정렬만 지원하므로(newest/oldest), 클라이언트에서도 동일 기준으로만
 * 재정렬합니다.
 */
export function sortAdminItems(
  items: AdminItem[],
  sort: AdminItemSortOption,
): AdminItem[] {
  const sorted = [...items];

  switch (sort) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          b.registeredAt.localeCompare(a.registeredAt) || b.id - a.id,
      );
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          a.registeredAt.localeCompare(b.registeredAt) || a.id - b.id,
      );
    default:
      return sorted;
  }
}
