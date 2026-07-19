import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminItemsQueryKey,
  adminItemsStatsQueryKey,
  deleteAdminItem,
  updateAdminItem,
} from '../api/adminApi';
import type {
  AdminItemSearchParams,
  UpdateAdminItemInput,
} from '../types/adminItem';

interface UseUpdateAdminItemOptions {
  searchParams: AdminItemSearchParams;
  onSuccess?: () => void;
}

export function useUpdateAdminItem({
  searchParams,
  onSuccess,
}: UseUpdateAdminItemOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAdminItemInput) => updateAdminItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminItemsQueryKey(searchParams),
      });
      queryClient.invalidateQueries({ queryKey: adminItemsStatsQueryKey });
      onSuccess?.();
    },
  });
}

interface UseDeleteAdminItemOptions {
  searchParams: AdminItemSearchParams;
  onSuccess?: () => void;
}

export function useDeleteAdminItem({
  searchParams,
  onSuccess,
}: UseDeleteAdminItemOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAdminItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminItemsQueryKey(searchParams),
      });
      queryClient.invalidateQueries({ queryKey: adminItemsStatsQueryKey });
      onSuccess?.();
    },
  });
}
