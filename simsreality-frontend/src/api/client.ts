import axios from 'axios';

// 백엔드 오리진 — 이 클라이언트의 엔드포인트들은 '/api/...' 전체 경로를 포함하므로
// '/api' 접미사가 없는 VITE_BACKEND_URL 을 사용한다. (VITE_API_BASE_URL 은 '/api' 포함 — client.js 참고)
const DEFAULT_BACKEND_URL = 'http://localhost:8283';

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL,
  timeout: 5000,
});

// localStorage에 accessToken이 있으면 모든 요청에 Authorization Bearer 헤더를 붙입니다.
// 토큰 발급/저장 로직은 별도이며, 개발 중에는 브라우저 콘솔에서
// localStorage.setItem("accessToken", "...") 로 직접 넣어 테스트합니다.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;