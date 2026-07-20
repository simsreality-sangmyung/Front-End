import axios from 'axios';
import { getAccessToken, clearAccessToken } from './auth/tokenStore';
import { refreshAccessToken } from './auth/refresh';
import { USER_DASHBOARD_URL } from '../navigation/externalLinks';

// 백엔드 오리진(BASE). 엔드포인트 상수들이 '/api/...' 전체 경로를 포함한다.
const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8283',
  timeout: 30000,
  // refresh_token(HttpOnly 쿠키)을 reissue/logout 호출에 함께 보내기 위함.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // 배열 파라미터를 sort[]=a 가 아니라 sort=a&sort=b 로 직렬화한다.
  // Spring 의 Pageable(sort=필드,방향)이 대괄호 형식을 인식하지 못해 정렬이 무시되던 문제 방지.
  paramsSerializer: { indexes: null },
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // accessToken 만료(401)면 reissue 후 1회 재시도. (_retry 로 무한루프 방지)
    if (status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return client(original);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    // 403(권한 부족) = 로그인은 됐으나 관리자 권한이 없음.
    // 관리자 앱이므로 유저 대시보드로 돌려보낸다. (권한 판단은 BE 가 단독으로 담당)
    if (status === 403) {
      window.location.assign(USER_DASHBOARD_URL);
      return new Promise(() => {}); // 페이지 이동 중 — 이후 처리를 멈춘다
    }

    return Promise.reject(error);
  },
);

export default client;
