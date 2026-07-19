/**
 * 로그인 후 복귀 주소(redirect) 저장소.
 * 유저 대시보드 등 외부 앱에서 /?redirect=... 로 넘어온 경우,
 * OAuth 왕복(카카오/네이버/구글) 동안 복귀 주소가 유실되지 않도록
 * sessionStorage에 보관했다가 로그인 성공 시 꺼내 쓴다.
 * 오픈 리다이렉트 방지를 위해 허용된 origin만 저장한다.
 */
const POST_LOGIN_REDIRECT_KEY = 'post-login-redirect';

const ALLOWED_ORIGINS = [
  'https://digital-twin.p-e.kr',
  'https://admin.digital-twin.p-e.kr',
  // 대시보드 팀 GitHub Pages 테스트 사이트
  'https://syouj3010-spec.github.io',
  // FE 로컬 개발용 (대시보드 팀 dev 서버 포함)
  'http://localhost:5173',
  'http://localhost:3000',
];

function isAllowedRedirect(url) {
  try {
    const parsed = new URL(url);
    return ALLOWED_ORIGINS.includes(parsed.origin) || parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

export const savePostLoginRedirect = (url) => {
  if (url && isAllowedRedirect(url)) {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, url);
  }
};

/** 저장된 복귀 주소를 반환하고 제거한다. 없거나 허용되지 않은 주소면 null. */
export const consumePostLoginRedirect = () => {
  const url = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  return url && isAllowedRedirect(url) ? url : null;
};
