import axios from 'axios';

// 백엔드 서버 URL — 디지털트윈 등록 API(POST /api/admin/digital-twins) 등에 사용됩니다.
const DEFAULT_API_BASE_URL = 'http://101.79.21.134:8283';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
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