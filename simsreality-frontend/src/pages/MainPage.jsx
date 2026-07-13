import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Globe, LogOut, Menu, Shield } from 'lucide-react';
import { logisticsTwins, manufacturingTwins } from '../data/twins';
import LoginModal from '../components/LoginModal';
import GuardModal from '../components/GuardModal';
import TwinCarousel from '../components/TwinCarousel';
import { useAuth } from '../hooks/useAuth';
import { markAppEntered } from '../navigation/sessionEntry';

function MainPage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showGuard, setShowGuard] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    markAppEntered();
  }, []);

  const openAdminLogin = (path = '/admin') => {
    if (isLoggedIn) {
      navigate(path);
      return;
    }
    setShowGuard(true);
  };

  const guardAction = (action) => {
    if (!isLoggedIn) {
      setShowGuard(true);
      return;
    }
    action();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ background: '#020617', color: '#e2e8f0' }}>
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(2,6,23,0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <div className="flex items-center gap-2 text-base font-bold">
            <Link
              to="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:brightness-110"
              style={{ background: '#38bdf8', color: '#020617' }}
              title="랜딩으로"
            >
              <Globe className="h-4 w-4" />
            </Link>
            <span className="text-slate-100">
              DIGITAL<span style={{ color: '#38bdf8' }}>TWIN</span>
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#38bdf8]"
            >
              디지털트윈 목록
            </button>

            <div
              className="relative"
              onMouseEnter={() => setAdminOpen(true)}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <button
                type="button"
                onClick={() => openAdminLogin()}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-[#fbbf24]"
              >
                <Shield className="h-3.5 w-3.5" /> 관리자 페이지
              </button>
              <AnimatePresence>
                {adminOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 w-44 overflow-hidden rounded-xl"
                    style={{
                      background: '#0f172a',
                      border: '1px solid #334155',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openAdminLogin('/admin/digital-twins')}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-[#38bdf8]"
                    >
                      🏬 물류센터
                    </button>
                    <button
                      type="button"
                      onClick={() => openAdminLogin('/admin/digital-twins')}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-[#fbbf24]"
                    >
                      🏭 제조센터
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">로그아웃</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-[#38bdf8] sm:block"
                >
                  로그인
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: '#38bdf8', color: '#020617' }}
                >
                  회원가입
                </button>
              </>
            )}
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden md:hidden"
              style={{ borderTop: '1px solid #1e293b' }}
            >
              <div className="space-y-1 px-6 py-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#38bdf8]"
                >
                  디지털트윈 목록
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openAdminLogin();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800"
                >
                  관리자 페이지
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: '33vh', minHeight: 260, borderBottom: '1px solid #1e293b' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#020617',
            backgroundImage: `
              linear-gradient(rgba(56,189,248,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,0.12) 1px, transparent 1px),
              radial-gradient(circle at 50% 30%, rgba(56,189,248,0.22), transparent 60%)
            `,
            backgroundSize: '44px 44px, 44px 44px, 100% 100%',
            animation: 'gridpan 18s linear infinite',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(2,6,23,0.4), rgba(2,6,23,0.25), #020617)',
          }}
        />

        <div className="relative z-10 max-w-3xl px-6 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em]" style={{ color: '#38bdf8' }}>
            DIGITAL TWIN PLATFORM
          </p>
          <h1
            className="leading-tight font-extrabold text-slate-50"
            style={{ fontSize: 'clamp(22px, 4vw, 40px)' }}
          >
            현실을 그대로 옮긴 디지털 트윈
          </h1>
          <p className="mt-3 text-[15px] text-slate-300">
            물류·제조 현장을 3D로 연결하고, 실시간으로 들여다봅니다.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1280px] px-6">
        <section className="py-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-[0.25em]" style={{ color: '#38bdf8' }}>
                LOGISTICS
              </p>
              <h2 className="text-2xl font-extrabold text-slate-50">디지털트윈 · 물류센터</h2>
            </div>
            <button
              type="button"
              onClick={() => guardAction(() => {})}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
              style={{ border: '1px solid #334155' }}
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <TwinCarousel items={logisticsTwins} accent="cyan" />
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid #1e293b' }} />

        <section className="py-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p
                className="mb-1 text-xs font-semibold tracking-[0.25em]"
                style={{ color: '#fbbf24' }}
              >
                MANUFACTURING
              </p>
              <h2 className="text-2xl font-extrabold text-slate-50">디지털트윈 · 제조센터</h2>
            </div>
            <button
              type="button"
              onClick={() => guardAction(() => {})}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
              style={{ border: '1px solid #334155' }}
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <TwinCarousel items={manufacturingTwins} accent="amber" />
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #1e293b', background: '#020617' }}>
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
              style={{ background: '#38bdf8', color: '#020617' }}
            >
              ◇
            </span>
            DIGITALTWIN
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {['서비스 소개', '이용약관', '개인정보처리방침', '고객센터'].map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-slate-200">
                {l}
              </a>
            ))}
          </nav>
          <span className="text-xs">© 2026 HN Inc. All Rights Reserved.</span>
        </div>
      </footer>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <GuardModal
        open={showGuard}
        onClose={() => setShowGuard(false)}
        onLogin={() => setShowLogin(true)}
      />
    </div>
  );
}

export default MainPage;
