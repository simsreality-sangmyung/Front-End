import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function TwinCarousel({ items, accent = 'cyan' }) {
  const trackRef = useRef(null);
  const STEP = 276;
  const accentColor = accent === 'cyan' ? '#38bdf8' : '#fbbf24';

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * STEP, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-slate-200 transition-colors"
        style={{
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid #334155',
          boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
        }}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div ref={trackRef} className="scrollbar-none flex gap-4 overflow-x-auto px-1 py-1">
        {items.map((t) => (
          <div
            key={t.id}
            className="w-64 flex-none cursor-pointer overflow-hidden rounded-2xl text-left transition-all duration-200 hover:-translate-y-1"
            style={{ background: '#0f172a', border: '1px solid #1e293b' }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
              <img
                src={t.thumb}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span
                className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: `${accentColor}e6`, color: '#020617' }}
              >
                {t.cat}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-50">{t.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{t.desc}</p>
              <div
                className="mt-3 flex justify-between pt-3 text-xs text-slate-500"
                style={{ borderTop: '1px solid #1e293b' }}
              >
                <span>{t.by}</span>
                <span>{t.at}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute top-1/2 right-0 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-slate-200 transition-colors"
        style={{
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid #334155',
          boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
        }}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default TwinCarousel;
