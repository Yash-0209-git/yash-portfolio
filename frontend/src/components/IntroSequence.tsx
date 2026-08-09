import { useEffect, useState } from 'react';

const STEPS = [
  { text: 'INITIALIZING SIGNAL...', delay: 0 },
  { text: 'ENCODING IDENTITY', delay: 600 },
  { text: 'LOADING PORTFOLIO', delay: 1100 },
  { text: 'SIGNAL READY', delay: 1600 },
];

interface IntroProps {
  onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroProps) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem('intro-shown')) {
      onComplete();
      return;
    }

    STEPS.forEach((s, i) => {
      setTimeout(() => setStep(i + 1), s.delay);
    });

    // Animate progress bar
    let width = 0;
    const barInterval = setInterval(() => {
      width = Math.min(100, width + 1.2);
      setBarWidth(width);
      if (width >= 100) clearInterval(barInterval);
    }, 20);

    // Exit
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        sessionStorage.setItem('intro-shown', '1');
        onComplete();
      }, 600);
    }, 2200);

    return () => {
      clearInterval(barInterval);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: exiting ? 'none' : 'all',
      }}
    >
      {/* Red cross / signal mark */}
      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: 'var(--red)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', height: '100%', width: '1px', backgroundColor: 'var(--red)', transform: 'translateX(-50%)' }} />
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            border: '1px solid rgba(200,16,46,0.3)',
            borderRadius: '50%',
            animation: 'introPulse 1s ease infinite',
          }}
        />
      </div>

      {/* Step lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
        {STEPS.slice(0, step).map((s, i) => (
          <div
            key={i}
            className="font-mono"
            style={{
              fontSize: '11px',
              color: i === step - 1 ? 'rgba(200,16,46,0.9)' : 'rgba(200,16,46,0.3)',
              letterSpacing: '0.25em',
              animation: 'introFadeUp 0.3s ease',
            }}
          >
            {i < step - 1 ? '✓ ' : '> '}{s.text}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '200px',
          height: '1px',
          backgroundColor: 'rgba(200,16,46,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${barWidth}%`,
            backgroundColor: 'var(--red)',
            boxShadow: '0 0 8px rgba(200,16,46,0.5)',
            transition: 'width 0.05s linear',
          }}
        />
      </div>

      <style>{`
        @keyframes introPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes introFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
