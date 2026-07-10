import type { AdminItem, AdminItemSortOption } from '../types/adminItem';

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
    case 'sync-desc':
      return sorted.sort(
        (a, b) => b.syncRate - a.syncRate || b.id - a.id,
      );
    case 'sync-asc':
      return sorted.sort(
        (a, b) => a.syncRate - b.syncRate || a.id - b.id,
      );
    default:
      return sorted;
  }
}
