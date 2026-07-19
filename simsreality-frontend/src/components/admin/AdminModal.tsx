import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';

type AdminModalSize = 'md' | 'lg' | '2xl';

interface AdminModalProps {
  onClose: () => void;
  isCloseDisabled?: boolean;
  /** 카드 최대 너비. 기본 '2xl' (넓은 트윈 폼). 사용자 폼처럼 좁은 모달은 'md'. */
  size?: AdminModalSize;
  children: ReactNode;
}

const SIZE_CLASS: Record<AdminModalSize, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  '2xl': 'max-w-2xl',
};

function AdminModal({
  onClose,
  isCloseDisabled = false,
  size = '2xl',
  children,
}: AdminModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isCloseDisabled) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isCloseDisabled]);

  const handleBackdropClick = () => {
    if (!isCloseDisabled) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Rajdhani',sans-serif]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(6px)' }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full ${SIZE_CLASS[size]} max-h-[90vh] overflow-y-auto rounded-2xl`}
        style={{ background: '#071222', border: '1px solid rgba(0,212,255,0.2)' }}
      >
        <button
          type="button"
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={onClose}
          disabled={isCloseDisabled}
          aria-label="닫기"
        >
          <X size={16} />
        </button>
        {children}
      </motion.div>
    </div>,
    document.body,
  );
}

export default AdminModal;
