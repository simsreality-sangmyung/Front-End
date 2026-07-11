import { useQuery } from '@tanstack/react-query';
import {
  fetchUsers,
  fetchUsersForStats,
  usersQueryKey,
  usersStatsQueryKey,
} from '../api/userApi';
import type { UserSearchParams } from '../types/user';

export function useUsers(params: UserSearchParams) {
  return useQuery({
    queryKey: usersQueryKey(params),
    queryFn: () => fetchUsers(params),
  });
}

export function useUsersStats() {
  return useQuery({
    queryKey: usersStatsQueryKey,
    queryFn: fetchUsersForStats,
  });
}
