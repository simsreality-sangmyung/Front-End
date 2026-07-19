import axios from 'axios';
import { AUTH_ENDPOINTS } from '../endpoints';
import { setAccessToken, clearAccessToken } from './tokenStore';
import { getDevAccessTokenOverride } from './devToken';

/**
 * refresh_token(HttpOnly 쿠키)으로 accessToken 을 재발급한다.
 *
 * 인터셉터가 달린 공용 client 가 아니라 별도 axios 호출을 쓴다.
 * → reissue 응답이 401 인터셉터를 다시 타서 무한 재귀하는 것을 막기 위함.
 *
 * single-flight: 동시에 여러 호출(콜백 마운트 + 401 인터셉터 + StrictMode 이중 마운트)이
 * 들어와도 진행 중인 요청 하나의 Promise 를 공유한다.
 * → refresh 토큰 rotation 때문에 두 번째 요청이 무효 토큰으로 실패하는 문제를 방지.
 */
const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8283';

let inflight = null;

export function refreshAccessToken() {
  if (inflight) return inflight;

  inflight = axios
    .post(`${BASE_URL}${AUTH_ENDPOINTS.REISSUE}`, null, { withCredentials: true })
    .then((response) => {
      const reissued = response.data?.data?.accessToken;
      if (!reissued) {
        throw new Error('reissue 응답에 accessToken 이 없습니다.');
      }
      // 개발 모드에서는 권한 없는 실제 토큰 대신 SUPER 더미 토큰을 저장한다.
      // 콜백 페이지가 아니라 여기서 덮어써야 401 인터셉터의 재발급 경로에서도
      // 더미 토큰이 유지된다(콜백에서만 덮으면 재발급 시 실제 토큰으로 롤백됨).
      const token = getDevAccessTokenOverride() ?? reissued;
      setAccessToken(token);
      return token;
    })
    .catch((error) => {
      clearAccessToken();
      throw error;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
