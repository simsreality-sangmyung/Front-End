import { useCallback, useSyncExternalStore } from 'react';
import { postLogoutApi } from '../api/domains/authApi';
import { clearAccessToken, hasAccessToken } from '../api/auth/tokenStore';
import { clearAppEntered } from '../navigation/sessionEntry';

const AUTH_CHANGE_EVENT = 'auth-change';

function subscribe(callback) {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot() {
  return hasAccessToken();
}

export function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * accessToken 기반 인증 상태.
 * 이후 권한(역할) 체크는 이 훅을 확장하거나 별도 usePermissions 등으로 분리하면 된다.
 */
export function useAuth() {
  const isLoggedIn = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const logout = useCallback(async () => {
    try {
      await postLogoutApi().execute();
    } catch {
      // ignore
    } finally {
      clearAccessToken();
      clearAppEntered();
      notifyAuthChange();
    }
  }, []);

  return { isLoggedIn, logout };
}
