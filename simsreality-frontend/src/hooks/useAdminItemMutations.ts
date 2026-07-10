import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminItemsQueryKey,
  deleteAdminItem,
  updateAdminItem,
} from '../api/adminApi';
import type {
  AdminItemSearchParams,
  CreateUploadProgress,
  UpdateAdminItemInput,
} from '../types/adminItem';

interface UseUpdateAdminItemOptions {
  searchParams: AdminItemSearchParams;
  onProgress: (progress: CreateUploadProgress | null) => void;
  onSuccess?: () => void;
}

export function useUpdateAdminItem({
  searchParams,
  onProgress,
  onSuccess,
}: UseUpdateAdminItemOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAdminItemInput) =>
      updateAdminItem(input, (progress) => onProgress(progress)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminItemsQueryKey(searchParams),
      });
      onProgress(null);
      onSuccess?.();
    },
    onError: () => {
      onProgress(null);
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
      onSuccess?.();
    },
  });
}
