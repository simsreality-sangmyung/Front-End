import { isAxiosError } from 'axios';

/**
 * 서버 응답의 message 필드를 우선 사용하고, 없으면 fallback 문구를 반환합니다.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;
    if (data && typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
  }
  return fallback;
}
