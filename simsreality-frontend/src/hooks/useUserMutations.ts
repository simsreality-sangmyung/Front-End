import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  changeUserRole,
  deleteUser,
  updateUser,
  usersQueryKey,
  usersStatsQueryKey,
} from '../api/userApi';
import type {
  ChangeUserRoleInput,
  UpdateUserInput,
  UserSearchParams,
} from '../types/user';

interface CommonOptions {
  searchParams: UserSearchParams;
  onSuccess?: () => void;
}

function invalidateUserQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  searchParams: UserSearchParams,
) {
  queryClient.invalidateQueries({ queryKey: usersStatsQueryKey });
  queryClient.invalidateQueries({ queryKey: usersQueryKey(searchParams) });
}

export function useUpdateUser({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(input),
    onSuccess: () => {
      invalidateUserQueries(queryClient, searchParams);
      onSuccess?.();
    },
  });
}

/** 권한 변경 전용 — PATCH /api/admin/accounts/{id}/role (수정과 별개 API). */
export function useChangeUserRole({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ChangeUserRoleInput) => changeUserRole(input),
    onSuccess: () => {
      invalidateUserQueries(queryClient, searchParams);
      onSuccess?.();
    },
  });
}

export function useDeleteUser({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      invalidateUserQueries(queryClient, searchParams);
      onSuccess?.();
    },
  });
}
