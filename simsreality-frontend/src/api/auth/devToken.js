/**
 * 개발 전용 더미 accessToken.
 *
 * 소셜 로그인으로 새로 만든 계정에는 권한이 없어 이후 API 가 전부 실패한다.
 * 개발 모드(import.meta.env.DEV)에서는 reissue 로 받은 실제 토큰 대신
 * 백엔드가 미리 만들어 둔 SUPER 권한 더미 토큰을 저장해 이 문제를 우회한다.
 *
 * 프로덕션 빌드에서는 항상 null 을 반환하며, 조건이 빌드 타임 상수라
 * 번들에서 데드 코드로 제거된다.
 *
 * 주의: 아래 토큰은 exp 1786167849 (2026-08-04경) 에 만료된다.
 * 만료 후에는 백엔드 개발용 토큰 발급 응답의 SUPER.accessToken 으로 교체할 것.
 */
const DEV_SUPER_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJyb2xlIjoiU1VQRVIiLCJpYXQiOjE3ODM1NzU4NDksImV4cCI6MTc4NjE2Nzg0OX0.NRXqUTLVu5jFPbCfS-9-Y_Zkr6QIWVCJuqj6cmyGUPU';

export function getDevAccessTokenOverride() {
  return import.meta.env.DEV ? DEV_SUPER_ACCESS_TOKEN : null;
}
