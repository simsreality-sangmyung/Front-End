import { useQuery } from '@tanstack/react-query';
import { fetchAdminTwinDetail } from '../api/adminApi';

/** 수정 모달용 트윈 상세(설명·현재 파일명) 조회. */
export function useTwinDetail(id: number) {
  return useQuery({
    queryKey: ['twinDetail', id],
    queryFn: () => fetchAdminTwinDetail(id),
  });
}
