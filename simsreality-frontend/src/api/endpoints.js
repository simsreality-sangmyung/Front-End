// 실제 백엔드(digital-twin-be) 엔드포인트와 일치.
// 소셜 로그인 시작(/oauth2/authorization/{provider})은 /api 밖이라 authApi 의 헬퍼로 처리한다.
export const AUTH_ENDPOINTS = {
  REISSUE: '/auth/reissue',
  LOGOUT: '/auth/logout',
};
