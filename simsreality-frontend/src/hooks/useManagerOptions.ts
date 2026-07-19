import { useQuery } from '@tanstack/react-query';
import { fetchManagerOptions, managerOptionsQueryKey } from '../api/managerApi';

export function useManagerOptions() {
  return useQuery({
    queryKey: managerOptionsQueryKey,
    queryFn: fetchManagerOptions,
    staleTime: 5 * 60 * 1000,
  });
}
