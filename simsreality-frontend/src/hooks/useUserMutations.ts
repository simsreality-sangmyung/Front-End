import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  deleteUser,
  toggleUserSuspend,
  updateUser,
  usersQueryKey,
  usersStatsQueryKey,
} from '../api/userApi';
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
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

export function useCreateUser({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_input: CreateUserInput) => createUser(),
    onSuccess: () => {
      invalidateUserQueries(queryClient, searchParams);
      onSuccess?.();
    },
  });
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

export function useToggleUserSuspend({
  searchParams,
  onSuccess,
}: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => toggleUserSuspend(user),
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
