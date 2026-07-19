import type { RecentAlert } from '../types/dashboard';

/**
 * GET /api/admin/dashboard에 아직 없는 영역만 mock으로 유지합니다.
 * - recentAlerts(최근 알림)
 * 방문자 그래프(dailyVisitors)는 실 API로 연결되었으므로 여기서 제공하지 않습니다.
 */
export const mockDashboardExtras: {
  recentAlerts: RecentAlert[];
} = {
  recentAlerts: [
    {
      id: 1,
      severity: 'warning',
      message: '울산 공장 2라인 – 로봇암 #7 진동 임계값 초과',
      time: '3분 전',
    },
    {
      id: 2,
      severity: 'critical',
      message: '부산항 크레인 시스템 – 연결 끊김 (47분)',
      time: '47분 전',
    },
    {
      id: 3,
      severity: 'info',
      message: '인천 물류센터 – 일일 동기화 리포트 생성 완료',
      time: '1시간 전',
    },
    {
      id: 4,
      severity: 'info',
      message: '강남구청 빌딩 – 에너지 사용량 목표치 달성 (-12%)',
      time: '2시간 전',
    },
  ],
};
