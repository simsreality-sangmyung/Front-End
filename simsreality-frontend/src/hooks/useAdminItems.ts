import { useQuery } from '@tanstack/react-query';
import { adminItemsQueryKey, fetchAdminItems } from '../api/adminApi';
import type { AdminItemSearchParams } from '../types/adminItem';

export function useAdminItems(params: AdminItemSearchParams) {
  return useQuery({
    queryKey: adminItemsQueryKey(params),
    queryFn: () => fetchAdminItems(params),
  });
}
