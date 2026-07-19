/**
 * accessToken 저장소.
 * 현재는 localStorage 사용(새로고침에도 유지 → reissue 호출 최소화).
 * 보안을 더 챙기려면 이 모듈만 메모리 변수 기반으로 교체하면 된다.
 */
const ACCESS_TOKEN_KEY = 'accessToken';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

function notifyAuthChange() {
  window.dispatchEvent(new Event('auth-change'));
}

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyAuthChange();
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  notifyAuthChange();
};

export const hasAccessToken = () => Boolean(getAccessToken());
