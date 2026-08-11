import { useState, useEffect } from 'react';

export default function InteractionCounter() {
  const [count, setCount] = useState(() => {
    const saved = sessionStorage.getItem('user_interaction_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const handleClick = () => {
      setCount(prev => {
        const next = prev + 1;
        sessionStorage.setItem('user_interaction_count', next.toString());
        return next;
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div
      className="font-mono"
      style={{
        position: 'fixed',
        top: '20px',
        right: '24px',
        zIndex: 9990,
        backgroundColor: 'rgba(10, 5, 5, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(200, 16, 46, 0.35)',
        borderRadius: '4px',
        padding: '0.35rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'white',
        fontSize: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--red)', boxShadow: '0 0 8px var(--red)' }} />
      <span style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>INTERACTIONS:</span>
      <span style={{ color: 'var(--red)', fontWeight: 700, letterSpacing: '0.12em', fontSize: '11px' }}>
        {String(count).padStart(4, '0')}
      </span>
    </div>
  );
}
