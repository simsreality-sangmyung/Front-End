import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Globe } from 'lucide-react';
import { refreshAccessToken } from '../api/auth/refresh';
import { clearAccessToken } from '../api/auth/tokenStore';
import { markAppEntered } from '../navigation/sessionEntry';
import { consumePostLoginRedirect } from '../navigation/postLoginRedirect';

const steps = ['인증 요청 중...', '계정 확인 중...', '세션 생성 중...', '완료'];

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const ran = useRef(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
    ];

    refreshAccessToken()
      .then(() => {
        setStep(3);
        setDone(true);
        setTimeout(() => {
          // 외부 앱(유저 대시보드)에서 넘어온 로그인이면 원래 페이지로 복귀.
          // 다른 도메인의 다른 앱이므로 react-router navigate 대신 전체 페이지 이동을 쓴다.
          const redirect = consumePostLoginRedirect();
          if (redirect) {
            window.location.replace(redirect);
            return;
          }
          // redirect 없이 이 앱에서 직접 로그인한 경우 = 관리자 → 관리자 홈으로.
          markAppEntered();
          navigate('/admin', { replace: true });
        }, 700);
      })
      .catch(() => {
        clearAccessToken();
        navigate('/?error=login_required', { replace: true });
      });

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020b18] font-['Rajdhani',sans-serif]">
      <div className="pointer-events-none absolute inset-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-cb" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(0,212,255,0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-cb)" />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute h-96 w-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 mx-4 w-full max-w-sm"
      >
        <div className="overflow-hidden rounded-2xl border border-[#00d4ff]/18 bg-[#071222]">
          <div
            className="h-0.5 w-full"
            style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
          />

          <div className="px-8 py-10 text-center">
            <div className="mb-8 flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00d4ff]/40 bg-[#00d4ff]/15">
                <Globe className="h-4 w-4 text-[#00d4ff]" />
              </div>
              <span className="text-xl font-bold tracking-widest text-[#e8f4ff]">
                TWIN<span className="text-[#00d4ff]">OS</span>
              </span>
            </div>

            <div className="mb-8 flex items-center justify-center">
              {done ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <CheckCircle className="h-14 w-14 text-[#00ff88]" />
                </motion.div>
              ) : (
                <div className="relative h-14 w-14">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(0,212,255,0.1)"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#00d4ff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={150}
                      initial={{ strokeDashoffset: 150 }}
                      animate={{ strokeDashoffset: 30 }}
                      transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
                    />
                  </svg>
                  <Globe className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#00d4ff]" />
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {steps.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: step >= i ? 1 : 0.2, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                    style={{
                      borderColor:
                        step > i ? '#00ff88' : step === i ? '#00d4ff' : 'rgba(255,255,255,0.1)',
                      background: step > i ? '#00ff88' : 'transparent',
                    }}
                  >
                    {step > i && <span className="text-[8px] font-bold text-[#020b18]">✓</span>}
                    {step === i && (
                      <span className="block h-1.5 w-1.5 animate-pulse rounded-full bg-[#00d4ff]" />
                    )}
                  </div>
                  <span
                    style={{
                      color:
                        step > i ? '#00ff88' : step === i ? '#e8f4ff' : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {s}
                  </span>
                </motion.div>
              ))}
            </div>

            {done && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 font-['JetBrains_Mono',monospace] text-xs tracking-wider text-[#00d4ff]"
              >
                메인 화면으로 이동합니다...
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OAuthCallbackPage;
