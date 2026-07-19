import apiBuilder from '../apiBuilder';
import { AUTH_ENDPOINTS } from '../endpoints';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8283';

/**
 * 소셜 로그인 시작 URL.
 * axios 호출이 아니라 브라우저 전체 이동(window.location.href)에 쓴다.
 *
 * redirect_uri 로 "로그인 후 돌아올 이 앱의 주소"(관리자 대시보드)를 함께 넘긴다.
 * BE 가 이 값을 쿠키에 담았다가 로그인 성공 후 그 주소로 되돌려보낸다(화이트리스트 검증).
 * → 관리자 앱에서 로그인하면 대시보드(다른 팀)로 튕기지 않고 admin 대시보드로 복귀한다.
 * @param {'naver' | 'kakao' | 'google'} provider
 */
export const oauthAuthorizeUrl = (provider) => {
  const returnUri = `${window.location.origin}/dashboard`;
  return `${BACKEND_URL}/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(returnUri)}`;
};

/** 로그아웃: 쿠키 refresh_token 으로 서버측 토큰 삭제 + 쿠키 만료. */
export const postLogoutApi = () => apiBuilder(AUTH_ENDPOINTS.LOGOUT, 'POST');
