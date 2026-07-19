import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteUser,
  updateUser,
  usersQueryKey,
  usersStatsQueryKey,
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

function invalidateUserQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  searchParams: UserSearchParams,
) {
  queryClient.invalidateQueries({ queryKey: usersStatsQueryKey });
  queryClient.invalidateQueries({ queryKey: usersQueryKey(searchParams) });
}

/**
 * 사용자 초대 API가 아직 명세에 없어, 실제 서버 요청 없이 프론트 데모용으로
 * 성공 처리합니다(모달 닫힘/완료 안내는 화면에서 Figma와 동일하게 보여줍니다).
 */
export function useCreateUser({ searchParams, onSuccess }: CommonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_input: CreateUserInput) => Promise.resolve(),
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
