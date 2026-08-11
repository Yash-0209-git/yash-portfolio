import React, { useState, useEffect, useRef } from 'react';
import { toggleAudioMute, getAudioMuted } from '../utils/audio';

const SECTIONS = [
  { id: 'entry',        num: '00', title: 'ENTRY' },
  { id: 'identity',     num: '01', title: 'IDENTITY' },
  { id: 'work',         num: '02', title: 'WORK' },
  { id: 'stack',        num: '03', title: 'STACK' },
  { id: 'certificates', num: '04', title: 'PROOF' },
  { id: 'contact',      num: '05', title: 'CONTACT' },
];

const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('entry');
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [muted, setMuted] = useState(() => getAudioMuted());
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0));

  useEffect(() => {
    const syncAudioState = () => setMuted(getAudioMuted());
    syncAudioState();
    window.addEventListener('click', syncAudioState);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(section => {
      const el = document.getElementById(section.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            setActiveSection(id => {
              if (id !== section.id) {
                setPulsing(true);
                clearTimeout(pulseTimer.current);
                pulseTimer.current = setTimeout(() => setPulsing(false), 600);
              }
              return section.id;
            });
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('click', syncAudioState);
      observers.forEach(o => o.disconnect());
      clearTimeout(pulseTimer.current);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsExpanded(false);
  };

  const handleAudioToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = toggleAudioMute();
    setMuted(newMuted);
  };

  const active = SECTIONS.find(s => s.id === activeSection) ?? SECTIONS[0];

  return (
    <>
      {/* Signal Index Overlay */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 15, 15, 0.7)',
            zIndex: 98,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--charcoal-2)',
              border: '1px solid rgba(200,16,46,0.2)',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              minWidth: '280px',
              animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.3em',
                marginBottom: '1.25rem',
              }}
            >
              SIGNAL INDEX
            </div>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                data-cursor="enter"
                onClick={() => scrollTo(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.6rem 0',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    color: s.id === activeSection ? 'var(--red)' : 'rgba(255,255,255,0.25)',
                    minWidth: '24px',
                  }}
                >
                  {s.num}
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '13px',
                    color: s.id === activeSection ? 'white' : 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.12em',
                  }}
                >
                  {s.title}
                </span>
                {s.id === activeSection && (
                  <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--red)' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Pill + Audio Toggle */}
      <nav
        style={{
          position: 'fixed',
          bottom: isMobile ? '16px' : '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <button
          data-cursor="enter"
          onClick={() => setIsExpanded(v => !v)}
          style={{
            background: 'var(--charcoal-2)',
            border: `1px solid ${pulsing ? 'rgba(200,16,46,0.5)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '999px',
            padding: '0.55rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            boxShadow: pulsing ? '0 0 18px rgba(200,16,46,0.25)' : '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Pulse dot */}
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--red)',
              animation: pulsing ? 'signalPulse 0.6s ease' : 'none',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'white',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            SIGNAL {active.num}
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.08em',
            }}
          >
            / {active.title}
          </span>
          {/* Expand indicator */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            style={{ opacity: 0.4, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
          >
            <path d="M2 8L6 4L10 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Phase 6 — Sound Telemetry Toggle */}
        <button
          data-cursor="pointer"
          onClick={handleAudioToggle}
          title={muted ? 'Enable Audio Telemetry' : 'Mute Audio Telemetry'}
          style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: muted ? 'rgba(255,255,255,0.3)' : 'var(--red)',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <span className="font-mono" style={{ fontSize: '10px' }}>
            {muted ? 'MUTED' : 'BGM 🎵'}
          </span>
        </button>
      </nav>

      <style>{`
        @keyframes signalPulse {
          0%   { transform: scale(1); box-shadow: 0 0 0 0 rgba(200,16,46,0.5); }
          50%  { transform: scale(1.5); box-shadow: 0 0 0 6px rgba(200,16,46,0); }
          100% { transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Navigation;
