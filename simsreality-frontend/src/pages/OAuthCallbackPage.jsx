import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from '../api/auth/refresh';
import { clearAccessToken } from '../api/auth/tokenStore';

/**
 * 소셜 로그인 성공 후 백엔드가 redirect 시키는 콜백 페이지.
 * refresh_token(쿠키)으로 accessToken 을 받아 저장하고 홈으로 이동한다.
 * 실패(쿠키 없음/만료 등 2xx 외 모든 응답)하면 로그인 페이지로 돌려보낸다.
 */
function OAuthCallbackPage() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    // StrictMode 이중 마운트 가드. (refreshAccessToken 자체도 single-flight 지만 이중 navigate 방지)
    if (ran.current) return;
    ran.current = true;

    refreshAccessToken()
      .then(() => navigate('/', { replace: true }))
      .catch(() => {
        clearAccessToken();
        navigate('/sso?error=login_required', { replace: true });
      });
  }, [navigate]);

  return (
    <main>
      <p>로그인 처리 중…</p>
    </main>
  );
}

export default OAuthCallbackPage;
