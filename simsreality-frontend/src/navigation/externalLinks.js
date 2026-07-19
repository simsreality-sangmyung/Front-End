/**
 * 다른 팀이 기본 도메인에서 운영하는 유저 대시보드 메인 주소.
 * (이 앱은 admin 도메인에 배포되므로 전체 페이지 이동으로 넘어간다)
 * - 로그인 없이 둘러보기 / 권한 없음(403) 시 이 주소로 이동한다.
 */
export const USER_DASHBOARD_URL =
  import.meta.env.VITE_USER_DASHBOARD_URL ?? 'https://digital-twin.p-e.kr/main.html';
