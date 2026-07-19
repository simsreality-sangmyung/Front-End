import axios from 'axios';
import { AUTH_ENDPOINTS } from '../endpoints';
import { setAccessToken, clearAccessToken } from './tokenStore';

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
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

let inflight = null;

export function refreshAccessToken() {
  if (inflight) return inflight;

  inflight = axios
    .post(`${BASE_URL}${AUTH_ENDPOINTS.REISSUE}`, null, { withCredentials: true })
    .then((response) => {
      const token = response.data?.data?.accessToken;
      if (!token) {
        throw new Error('reissue 응답에 accessToken 이 없습니다.');
      }
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
