import { useQuery } from '@tanstack/react-query';
import { dashboardQueryKey, fetchDashboardData } from '../api/dashboardApi';

export function useDashboard() {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: () => fetchDashboardData(),
  });
}
