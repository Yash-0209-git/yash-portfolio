import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'entry',        num: '00' },
  { id: 'identity',     num: '01' },
  { id: 'work',         num: '02' },
  { id: 'stack',        num: '03' },
  { id: 'certificates', num: '04' },
  { id: 'contact',      num: '05' },
];

export default function SideProgress() {
  const [active, setActive] = useState('entry');

  useEffect(() => {
    // Section tracker
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(s.id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    // No additional scroll tracking needed

    return () => {
      observers.forEach(o => o.disconnect());
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0',
      }}
    >
      {SECTIONS.map((s, i) => {
        const isActive = s.id === active;
        const activeIdx = SECTIONS.findIndex(x => x.id === active);
        const isPast = i < activeIdx;

        return (
          <div
            key={s.id}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Dot */}
            <button
              data-cursor="pointer"
              onClick={() => scrollTo(s.id)}
              title={`SIGNAL ${s.num}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Active label */}
              {isActive && (
                <span
                  className="font-mono"
                  style={{
                    position: 'absolute',
                    right: '16px',
                    fontSize: '8px',
                    color: 'rgba(200,16,46,0.6)',
                    letterSpacing: '0.15em',
                    whiteSpace: 'nowrap',
                    animation: 'sideIn 0.2s ease',
                  }}
                >
                  {s.num}
                </span>
              )}
              <div
                style={{
                  width: isActive ? 7 : 4,
                  height: isActive ? 7 : 4,
                  borderRadius: '50%',
                  backgroundColor: isActive
                    ? 'var(--red)'
                    : isPast
                    ? 'rgba(200,16,46,0.25)'
                    : 'rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 0 8px rgba(200,16,46,0.5)' : 'none',
                }}
              />
            </button>

            {/* Connector (not after last) */}
            {i < SECTIONS.length - 1 && (
              <div
                style={{
                  width: '1px',
                  height: '18px',
                  background: isPast
                    ? 'rgba(200,16,46,0.2)'
                    : 'rgba(255,255,255,0.04)',
                  transition: 'background 0.4s ease',
                }}
              />
            )}
          </div>
        );
      })}
      <style>{`
        @keyframes sideIn {
          from { opacity: 0; transform: translateX(4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
