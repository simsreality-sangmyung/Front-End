import { isAxiosError } from 'axios';

const AUTH_ERROR_MESSAGE =
  '인증이 필요합니다. 브라우저 콘솔에서 accessToken을 설정했는지 확인해주세요.';
const FORBIDDEN_ERROR_MESSAGE =
  'SUPER/ADMIN 권한이 필요합니다. 접근 권한을 확인해주세요.';

interface ApiErrorMessageOverrides {
  /** 401 응답일 때 사용할 메시지 (기본: 관리자 API용 인증 안내) */
  unauthorizedMessage?: string;
  /** 403 응답일 때 사용할 메시지 (기본: SUPER/ADMIN 권한 안내) */
  forbiddenMessage?: string;
}

/**
 * 서버 응답의 message 필드를 우선 사용하고, 없으면 fallback 문구를 반환합니다.
 * 401/403 은 고정 메시지로 처리합니다 (엔드포인트별로 다른 문구가 필요하면 overrides로 지정).
 */
export function getApiErrorMessage(
  error: unknown,
  fallback: string,
  overrides?: ApiErrorMessageOverrides,
): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) {
      return overrides?.unauthorizedMessage ?? AUTH_ERROR_MESSAGE;
    }
    if (status === 403) {
      return overrides?.forbiddenMessage ?? FORBIDDEN_ERROR_MESSAGE;
    }

    const data = error.response?.data as { message?: unknown } | undefined;
    if (data && typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
  }
  return fallback;
}
