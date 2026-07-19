import { useQuery } from '@tanstack/react-query';
import { fetchMyProfile, myProfileQueryKey } from '../api/memberApi';

export function useMyProfile() {
  return useQuery({
    queryKey: myProfileQueryKey,
    queryFn: fetchMyProfile,
    retry: false,
  });
}
