import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminItemsQueryKey, createAdminItem } from '../api/adminApi';
import type { AdminItemSearchParams, CreateAdminItemInput } from '../types/adminItem';

interface UseCreateAdminItemOptions {
  searchParams: AdminItemSearchParams;
  onProgress: (percent: number) => void;
  onSuccess?: () => void;
}

export function useCreateAdminItem({
  searchParams,
  onProgress,
  onSuccess,
}: UseCreateAdminItemOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdminItemInput) =>
      createAdminItem(input, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminItemsQueryKey(searchParams),
      });
      onSuccess?.();
    },
  });
}
