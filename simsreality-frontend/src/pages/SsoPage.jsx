import { Link, useSearchParams } from 'react-router-dom';
import { oauthAuthorizeUrl } from '../api/domains/authApi';

const PROVIDERS = [
  { id: 'kakao', label: '카카오로 로그인' },
  { id: 'naver', label: '네이버로 로그인' },
  { id: 'google', label: '구글로 로그인' },
];

const ERROR_MESSAGES = {
  login_failed: '소셜 로그인에 실패했습니다. 다시 시도해 주세요.',
  login_required: '로그인이 필요합니다. 다시 로그인해 주세요.',
};

function SsoPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  // 소셜 로그인은 백엔드로 전체 페이지 이동 → 성공 시 /auth/callback 으로 돌아온다.
  const handleLogin = (provider) => {
    window.location.assign(oauthAuthorizeUrl(provider));
  };

  return (
    <main>
      <Link to="/">홈</Link>
      <h1>로그인</h1>

      {error && (
        <p role="alert">{ERROR_MESSAGES[error] ?? '로그인 중 오류가 발생했습니다.'}</p>
      )}

      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => handleLogin(provider.id)}
        >
          {provider.label}
        </button>
      ))}
    </main>
  );
}

export default SsoPage;
