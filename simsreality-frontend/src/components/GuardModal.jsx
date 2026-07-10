import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

function GuardModal({ open, onClose, onLogin }) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#0f172a', border: '1px solid #334155' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                style={{ background: 'rgba(56,189,248,0.1)' }}
              >
                🔒
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mb-1 text-lg font-semibold text-slate-50">로그인이 필요합니다</h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              이 기능은 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동할까요?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-slate-200 transition-colors"
                style={{ background: '#1e293b', border: '1px solid #334155' }}
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogin();
                }}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: '#38bdf8', color: '#020617' }}
              >
                로그인 하러가기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default GuardModal;
