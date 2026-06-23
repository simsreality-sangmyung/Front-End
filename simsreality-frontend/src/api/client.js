import axios from 'axios';
import { getAccessToken, clearAccessToken } from './auth/tokenStore';
import { refreshAccessToken } from './auth/refresh';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 30000,
  // refresh_token(HttpOnly 쿠키)을 reissue/logout 호출에 함께 보내기 위함.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
    // 403(권한 부족)은 인증 문제가 아니므로 reissue 하지 않는다.
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

    return Promise.reject(error);
  },
);

export default client;
