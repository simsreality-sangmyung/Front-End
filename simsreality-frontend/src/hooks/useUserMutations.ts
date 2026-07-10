import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  deleteUser,
  toggleUserSuspend,
  updateUser,
  usersQueryKey,
} from '../api/userApi';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserSearchParams,
} from '../types/user';

interface CommonOptions {
  searchParams: UserSearchParams;
  onSuccess?: () => void;
}

export function useCreateUser({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey(searchParams) });
      onSuccess?.();
    },
  });
}

export function useUpdateUser({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey(searchParams) });
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
    mutationFn: (id: number) => toggleUserSuspend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey(searchParams) });
      onSuccess?.();
    },
  });
}

export function useDeleteUser({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey(searchParams) });
      onSuccess?.();
    },
  });
}
