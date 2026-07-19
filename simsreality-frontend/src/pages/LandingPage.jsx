import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import SocialLoginButtons from '../components/SocialLoginButtons';
import { useAuth } from '../hooks/useAuth';
import { markAppEntered } from '../navigation/sessionEntry';

function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      markAppEntered();
      navigate('/main', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleBrowse = () => {
    markAppEntered();
    navigate('/main');
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#020617', color: '#e2e8f0' }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: '#020617',
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px),
            radial-gradient(circle at 30% 40%, rgba(56,189,248,0.18), transparent 55%)
          `,
          backgroundSize: '44px 44px, 44px 44px, 100% 100%',
          animation: 'gridpan 18s linear infinite',
        }}
      />

      <header className="relative z-10 border-b border-[#1e293b]/80 bg-[#020617]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center px-6">
          <Link to="/" className="flex items-center gap-2 text-base font-bold">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: '#38bdf8', color: '#020617' }}
            >
              <Globe className="h-4 w-4" />
            </span>
            <span className="text-slate-100">
              DIGITAL<span style={{ color: '#38bdf8' }}>TWIN</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1280px] flex-col items-center justify-center gap-12 px-6 py-12 lg:flex-row lg:gap-16">
        <div className="max-w-xl text-center lg:text-left">
          <p className="mb-4 text-xs font-semibold tracking-[0.3em]" style={{ color: '#38bdf8' }}>
            A DIGITAL TWIN PLATFORM
          </p>
          <h1
            className="leading-tight font-extrabold text-slate-50"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
          >
            현실을 그대로
            <br />
            디지털로 연결합니다
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            물류·제조 현장을 3D로 연결하고, 실시간으로 들여다봅니다.
          </p>
        </div>

        <SocialLoginButtons onBrowse={handleBrowse} />
      </main>
    </div>
  );
}

export default LandingPage;
