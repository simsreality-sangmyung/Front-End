import { oauthAuthorizeUrl } from '../api/domains/authApi';

function GoogleIcon() {
  return (
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
  );
}

function SocialLoginButtons({ onBrowse }) {
  const handleLogin = (provider) => {
    window.location.assign(oauthAuthorizeUrl(provider));
  };

  return (
    <div
      className="w-full max-w-md rounded-2xl p-8"
      style={{ background: '#0f172a', border: '1px solid #334155' }}
    >
      <h2 className="mb-1 text-xl font-semibold text-slate-50">플랫폼 로그인</h2>
      <p className="mb-6 text-sm leading-relaxed text-slate-400">
        간편 로그인 후 디지털트윈 플랫폼의 모든 기능을 이용하세요.
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleLogin('kakao')}
          className="flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: '#FEE500', color: '#3C1E1E' }}
        >
          <span className="w-5 text-base font-bold">K</span>
          카카오톡으로 로그인
        </button>
        <button
          type="button"
          onClick={() => handleLogin('naver')}
          className="flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: '#03C75A', color: '#fff' }}
        >
          <span className="w-5 text-base font-bold">N</span>
          네이버로 로그인
        </button>
        <button
          type="button"
          onClick={() => handleLogin('google')}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-300 px-5 py-3.5 text-sm font-semibold transition-all hover:brightness-95"
          style={{ background: '#fff', color: '#1f1f1f' }}
        >
          <GoogleIcon />
          Google로 로그인
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-slate-500">
        로그인 시 <span className="cursor-pointer text-[#38bdf8]">이용약관</span> 및{' '}
        <span className="cursor-pointer text-[#38bdf8]">개인정보처리방침</span>에 동의합니다.
      </p>

      {onBrowse && (
        <button
          type="button"
          onClick={onBrowse}
          className="mt-6 w-full text-center text-sm text-slate-400 transition-colors hover:text-[#38bdf8]"
        >
          로그인 없이 둘러보기
        </button>
      )}
    </div>
  );
}

export default SocialLoginButtons;
