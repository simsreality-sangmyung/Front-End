import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const navClass =
    'w-9 h-9 flex items-center justify-center rounded-lg text-white/40 transition-colors hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40 disabled:cursor-not-allowed';

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-1.5 font-['JetBrains_Mono',monospace]"
      aria-label="페이지네이션"
    >
      <button
        type="button"
        className={navClass}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-all ${
              isActive
                ? 'text-[#020b18] font-bold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
            style={isActive ? { background: '#00d4ff' } : undefined}
            onClick={() => onPageChange(page)}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className={navClass}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}

export default AdminPagination;
