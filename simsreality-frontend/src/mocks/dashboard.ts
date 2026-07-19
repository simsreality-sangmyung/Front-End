import type { RecentAlert, TwinOverviewItem } from '../types/dashboard';

/**
 * GET /api/admin/dashboard에 아직 없는 영역만 mock으로 유지합니다.
 * - recentAlerts(최근 알림)
 * - twins(디지털트윈 목록 개요)
 * 방문자 그래프(dailyVisitors)는 실 API로 연결되었으므로 여기서 제공하지 않습니다.
 */
export const mockDashboardExtras: {
  recentAlerts: RecentAlert[];
  twins: TwinOverviewItem[];
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
  twins: [
    {
      id: 'TW-0041',
      name: '강남구청 빌딩',
      category: '스마트 빌딩',
      status: '정상',
      syncRate: 99.8,
      sensorCount: 142,
      lastUpdate: '방금 전',
    },
    {
      id: 'TW-0038',
      name: '인천 물류센터 A동',
      category: '물류센터',
      status: '정상',
      syncRate: 98.2,
      sensorCount: 318,
      lastUpdate: '1분 전',
    },
    {
      id: 'TW-0035',
      name: '울산 자동차 공장 2라인',
      category: '스마트 팩토리',
      status: '경고',
      syncRate: 91.4,
      sensorCount: 527,
      lastUpdate: '3분 전',
    },
    {
      id: 'TW-0031',
      name: '한강 교량 모니터링',
      category: '도시 인프라',
      status: '정상',
      syncRate: 99.1,
      sensorCount: 88,
      lastUpdate: '2분 전',
    },
    {
      id: 'TW-0029',
      name: '서울 에너지 그리드 북부',
      category: '에너지',
      status: '정상',
      syncRate: 97.6,
      sensorCount: 204,
      lastUpdate: '방금 전',
    },
    {
      id: 'TW-0026',
      name: '부산항 크레인 시스템',
      category: '물류센터',
      status: '오프라인',
      syncRate: null,
      sensorCount: 96,
      lastUpdate: '47분 전',
    },
    {
      id: 'TW-0022',
      name: '세종시 스마트시티 구역1',
      category: '도시 인프라',
      status: '정상',
      syncRate: 96.3,
      sensorCount: 412,
      lastUpdate: '4시간 전',
    },
  ],
};
