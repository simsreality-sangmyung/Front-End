import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronRight, Shield } from 'lucide-react';
import { oauthAuthorizeUrl } from '../api/domains/authApi';
import { useAuth } from '../hooks/useAuth';
import { markAppEntered } from '../navigation/sessionEntry';
import { savePostLoginRedirect } from '../navigation/postLoginRedirect';
import { USER_DASHBOARD_URL } from '../navigation/externalLinks';

function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(null);

  // 외부 앱에서 /?redirect=... 로 넘어온 경우, OAuth 왕복 동안 복귀 주소가 유실되지
  // 않도록 저장한다. (로그인 후 콜백에서 이 주소로 복귀)
  useEffect(() => {
    savePostLoginRedirect(searchParams.get('redirect'));
  }, [searchParams]);

  // 이 앱(admin 도메인)에서 직접 로그인하는 대상은 관리자이므로 관리자 홈으로 보낸다.
  useEffect(() => {
    if (isLoggedIn) {
      markAppEntered();
      navigate('/admin', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // 소셜 로그인 시작 — 브라우저 전체 이동으로 백엔드 OAuth 엔드포인트로 넘어간다.
  const handleLogin = (provider) => {
    setLoading(provider);
    window.location.assign(oauthAuthorizeUrl(provider));
  };

  // 둘러보기(비로그인) 화면은 다른 팀의 유저 대시보드가 담당한다.
  const handleBrowse = () => {
    window.location.assign(USER_DASHBOARD_URL);
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: '#020b18', color: '#e2e8f0', fontFamily: 'Rajdhani, sans-serif' }}
    >
      {/* Animated grid background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridpan 20s linear infinite',
        }}
      />
      {/* Radial glow center */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.08) 0%, transparent 70%)',
        }}
      />

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)' }}
          >
            <Globe className="h-4 w-4 text-[#00d4ff]" />
          </div>
          <span className="text-xl font-bold tracking-widest text-[#00d4ff]">
            TWIN<span className="text-white">OS</span>
          </span>
        </div>
        <div className="hidden items-center gap-1 font-['JetBrains_Mono',monospace] text-xs text-white/30 sm:flex">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff88]" />
          SYSTEM ONLINE
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-5xl flex-col items-center gap-16 lg:flex-row">
          {/* Left — hero copy */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="mb-4 text-xs font-semibold tracking-[0.3em]"
              style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace' }}
            >
              // DIGITAL TWIN PLATFORM
            </p>
            <h1
              className="mb-5 font-extrabold leading-[1.1]"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              현실을 그대로
              <br />
              <span style={{ color: '#00d4ff' }}>디지털로 연결</span>합니다
            </h1>
            <p
              className="mx-auto mb-10 max-w-md leading-relaxed text-white/50 lg:mx-0"
              style={{ fontSize: 15 }}
            >
              물류·제조 현장의 디지털트윈을 실시간으로 모니터링하고 관리하는 통합 플랫폼입니다.
            </p>
          </motion.div>

          {/* Right — login card */}
          <motion.div
            className="w-full max-w-sm shrink-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ animation: 'floatY 6s ease-in-out infinite' }}
          >
            <div
              className="overflow-hidden rounded-3xl"
              style={{
                background: 'rgba(7,18,34,0.9)',
                border: '1px solid rgba(0,212,255,0.2)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 60px rgba(0,212,255,0.08), 0 30px 60px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{ height: 2, background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
              />

              <div className="p-8">
                <div className="mb-8 text-center">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}
                  >
                    <Shield className="h-6 w-6 text-[#00d4ff]" />
                  </div>
                  <h2 className="mb-1 text-xl font-bold tracking-wide">플랫폼 로그인</h2>
                  <p className="text-sm text-white/40">소셜 계정으로 간편하게 시작하세요</p>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    <motion.button
                      key="kakao"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLogin('kakao')}
                      disabled={!!loading}
                      className="relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-5 py-3.5 text-sm font-bold tracking-wide transition-all"
                      style={{ background: '#FEE500', color: '#3C1E1E' }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3C1E1E]/20 text-sm font-black">
                        K
                      </span>
                      <span className="flex-1 text-center">카카오톡으로 로그인</span>
                      {loading === 'kakao' && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3C1E1E]/30 border-t-[#3C1E1E]" />
                      )}
                    </motion.button>

                    <motion.button
                      key="naver"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLogin('naver')}
                      disabled={!!loading}
                      className="flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-bold tracking-wide transition-all"
                      style={{ background: '#03C75A', color: '#fff' }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-black">
                        N
                      </span>
                      <span className="flex-1 text-center">네이버로 로그인</span>
                      {loading === 'naver' && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      )}
                    </motion.button>

                    <motion.button
                      key="google"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLogin('google')}
                      disabled={!!loading}
                      className="flex w-full items-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-bold tracking-wide transition-all"
                      style={{ background: '#fff', color: '#1f1f1f', borderColor: '#e5e7eb' }}
                    >
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
                      <span className="flex-1 text-center">Google로 로그인</span>
                      {loading === 'google' && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1f1f1f]/20 border-t-[#1f1f1f]" />
                      )}
                    </motion.button>
                  </AnimatePresence>
                </div>

                <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-center text-xs leading-relaxed text-white/25">
                    로그인 시{' '}
                    <span className="cursor-pointer text-[#00d4ff]/60 transition-colors hover:text-[#00d4ff]">
                      이용약관
                    </span>{' '}
                    및{' '}
                    <span className="cursor-pointer text-[#00d4ff]/60 transition-colors hover:text-[#00d4ff]">
                      개인정보처리방침
                    </span>
                    에 동의합니다.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              className="mt-5 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="button"
                onClick={handleBrowse}
                className="inline-flex items-center gap-1.5 text-sm text-white/30 transition-colors hover:text-white/60"
              >
                로그인 없이 둘러보기 <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 py-6 text-center text-xs text-white/20"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        © 2026 HN Inc. — DIGITALTWIN Platform
      </footer>
    </div>
  );
}

export default LandingPage;
