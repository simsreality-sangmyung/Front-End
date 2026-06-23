import apiBuilder from '../apiBuilder';
import { AUTH_ENDPOINTS } from '../endpoints';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8283';

/**
 * 소셜 로그인 시작 URL.
 * axios 호출이 아니라 브라우저 전체 이동(window.location.href)에 쓴다.
 * @param {'naver' | 'kakao' | 'google'} provider
 */
export const oauthAuthorizeUrl = (provider) =>
  `${BACKEND_URL}/oauth2/authorization/${provider}`;

/** 로그아웃: 쿠키 refresh_token 으로 서버측 토큰 삭제 + 쿠키 만료. */
export const postLogoutApi = () => apiBuilder(AUTH_ENDPOINTS.LOGOUT, 'POST');
