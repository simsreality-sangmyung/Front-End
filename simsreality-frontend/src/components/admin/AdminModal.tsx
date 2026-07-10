import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface AdminModalProps {
  onClose: () => void;
  isCloseDisabled?: boolean;
  children: ReactNode;
}

function AdminModal({
  onClose,
  isCloseDisabled = false,
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
    <div className="twin-modal" role="dialog" aria-modal="true">
      <div
        className="twin-modal__backdrop"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div className="twin-modal__panel">
        <button
          type="button"
          className="twin-modal__close"
          onClick={onClose}
          disabled={isCloseDisabled}
          aria-label="닫기"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default AdminModal;
