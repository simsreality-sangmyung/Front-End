import { mockDashboardData } from '../mocks/dashboard';
import type { DashboardData } from '../types/dashboard';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(400);
  return mockDashboardData;
}

export const dashboardQueryKey = ['dashboard'] as const;
