import { useQuery } from '@tanstack/react-query';
import {
  adminItemsQueryKey,
  adminItemsStatsQueryKey,
  fetchAdminItems,
  fetchAdminItemsForStats,
} from '../api/adminApi';
import type { AdminItemSearchParams } from '../types/adminItem';

export function useAdminItems(params: AdminItemSearchParams) {
  return useQuery({
    queryKey: adminItemsQueryKey(params),
    queryFn: () => fetchAdminItems(params),
  });
}

export function useAdminItemsStats() {
  return useQuery({
    queryKey: adminItemsStatsQueryKey,
    queryFn: fetchAdminItemsForStats,
  });
}
