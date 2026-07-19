import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { oauthAuthorizeUrl } from '../api/domains/authApi';
import { Link } from 'react-router-dom';
import { savePostLoginRedirect } from '../navigation/postLoginRedirect';

const PROVIDERS = [
  {
    id: 'kakao',
    label: '카카오톡으로 로그인',
    style: { background: '#FEE500', color: '#3C1E1E' },
    icon: <span className="w-5 text-base font-bold">K</span>,
  },
  {
    id: 'naver',
    label: '네이버로 로그인',
    style: { background: '#03C75A', color: '#fff' },
    icon: <span className="w-5 text-base font-bold">N</span>,
  },
  {
    id: 'google',
    label: 'Google로 로그인',
    style: { background: '#fff', color: '#1f1f1f', border: '1px solid #cbd5e1' },
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
];

const ERROR_MESSAGES = {
  login_failed: '소셜 로그인에 실패했습니다. 다시 시도해 주세요.',
  login_required: '로그인이 필요합니다. 다시 로그인해 주세요.',
};

function SsoPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect');

  // 외부 앱(유저 대시보드)에서 넘어온 경우 로그인 후 복귀 주소를 보관.
  // OAuth 왕복 동안 쿼리 파라미터가 유실되므로 sessionStorage에 저장한다.
  useEffect(() => {
    savePostLoginRedirect(redirect);
  }, [redirect]);

  const handleLogin = (provider) => {
    window.location.assign(oauthAuthorizeUrl(provider));
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: '#020617',
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px),
          radial-gradient(circle at 50% 40%, rgba(56,189,248,0.18), transparent 55%)
        `,
        backgroundSize: '44px 44px, 44px 44px, 100% 100%',
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#0f172a', border: '1px solid #334155' }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}
          >
            <Lock className="h-5 w-5" />
          </div>
          <Link
            to="/"
            className="rounded-lg px-2 py-1 text-sm text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            홈
          </Link>
        </div>

        <h1 className="mb-1 text-lg font-semibold text-slate-50">소셜 계정으로 로그인</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          간편 로그인 후 디지털트윈 플랫폼의 모든 기능을 이용하세요.
        </p>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {ERROR_MESSAGES[error] ?? '로그인 중 오류가 발생했습니다.'}
          </p>
        )}

        <div className="space-y-3">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleLogin(provider.id)}
              className="flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all hover:brightness-110"
              style={provider.style}
            >
              {provider.icon}
              {provider.label}
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          로그인 시 <span className="cursor-pointer text-[#38bdf8]">이용약관</span> 및{' '}
          <span className="cursor-pointer text-[#38bdf8]">개인정보처리방침</span>에 동의합니다.
        </p>
      </div>
    </div>
  );
}

export default SsoPage;
