import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { hasAccessToken } from '../api/auth/tokenStore';
import { refreshAccessToken } from '../api/auth/refresh';
import { markAppEntered } from '../navigation/sessionEntry';

/**
 * 관리자 영역 접근 가드 (세션 확인만 담당).
 * - accessToken 이 있으면 통과.
 * - 없으면 refresh 쿠키로 reissue 를 한 번 시도한다(새로고침/외부앱 진입 대응).
 *   성공하면 통과, 실패(비로그인)면 로그인 페이지(/)로 보낸다.
 *
 * 역할(권한) 판단은 프론트가 하지 않는다 — 관리자 API 호출이 403 이면
 * client 인터셉터가 유저 대시보드로 돌려보낸다(권한은 BE 가 단독 담당).
 */
function RequireAuth() {
  // 'checking' | 'authed' | 'guest'
  const [status, setStatus] = useState(() =>
    hasAccessToken() ? 'authed' : 'checking',
  );

  useEffect(() => {
    if (status !== 'checking') {
      return;
    }
    let active = true;
    refreshAccessToken()
      .then(() => {
        if (active) {
          markAppEntered();
          setStatus('authed');
        }
      })
      .catch(() => {
        if (active) {
          setStatus('guest');
        }
      });
    return () => {
      active = false;
    };
  }, [status]);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020b18] text-white/50 font-['JetBrains_Mono',monospace] text-sm">
        인증 확인 중...
      </div>
    );
  }

  if (status === 'guest') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
