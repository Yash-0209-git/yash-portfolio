import { useEffect } from 'react';
import { playTransmissionSound, playBeep } from '../utils/audio';

export default function ClassifiedDossier({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    playTransmissionSound();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 6, 6, 0.94)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'JetBrains Mono, monospace',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Red CRT Scanline Effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(200,16,46,0.08) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
        }}
      />

      {/* Dossier Card Container */}
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          border: '1px solid var(--red)',
          boxShadow: '0 0 40px rgba(200, 16, 46, 0.3), inset 0 0 20px rgba(200, 16, 46, 0.1)',
          padding: '2.5rem',
          borderRadius: '4px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Top Secret Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--red)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                letterSpacing: '0.25em',
                marginBottom: '0.5rem',
              }}
            >
              [ CLASSIFIED // LEVEL 5 ]
            </div>
            <h2 className="font-bebas" style={{ fontSize: '36px', color: 'white', margin: 0, letterSpacing: '0.05em' }}>
              OVERDRIVE PROTOCOL UNLOCKED
            </h2>
          </div>
          <button
            onClick={() => {
              playBeep(300, 0.1);
              onClose();
            }}
            data-cursor="pointer"
            style={{
              background: 'none',
              border: '1px solid rgba(200,16,46,0.4)',
              color: 'rgba(237,235,230,0.7)',
              fontSize: '11px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
            }}
          >
            CLOSE ×
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(200,16,46,0.3)' }} />

        {/* Dossier Data Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', fontSize: '11px' }}>
          <div>
            <span style={{ color: 'rgba(200,16,46,0.7)', display: 'block', marginBottom: '0.2rem' }}>SUBJECT</span>
            <strong style={{ color: 'white', fontSize: '13px' }}>C YASHWANTH</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(200,16,46,0.7)', display: 'block', marginBottom: '0.2rem' }}>DESIGNATION</span>
            <strong style={{ color: 'white', fontSize: '13px' }}>AI FULL STACK ENGINEER</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(200,16,46,0.7)', display: 'block', marginBottom: '0.2rem' }}>PRIMARY STACK</span>
            <span style={{ color: 'rgba(237,235,230,0.85)' }}>Python · FastAPI · React · TS · PostgreSQL</span>
          </div>
          <div>
            <span style={{ color: 'rgba(200,16,46,0.7)', display: 'block', marginBottom: '0.2rem' }}>SPECIALIZATION</span>
            <span style={{ color: 'rgba(237,235,230,0.85)' }}>AI/LLM Pipelines · RAG · Intelligent Automation</span>
          </div>
        </div>

        {/* Mission Statement */}
        <div
          style={{
            backgroundColor: 'rgba(200,16,46,0.06)',
            borderLeft: '3px solid var(--red)',
            padding: '1rem 1.25rem',
            fontSize: '12px',
            color: 'rgba(237,235,230,0.9)',
            lineHeight: 1.6,
          }}
        >
          <strong>OPERATIONAL DIRECTIVE:</strong> Engineering high-concurrency, intelligent software solutions that merge AI model capabilities (Groq, Gemini, PyTorch) with rock-solid backend infrastructure and responsive frontends.
        </div>

        {/* Secret Achievements List */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--red)', letterSpacing: '0.2em', marginBottom: '0.6rem' }}>
            CLASSIFIED LOGS
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(237,235,230,0.75)', fontSize: '11px', lineHeight: 1.7 }}>
            <li>Shipped LeeSculpt multi-role AI fitness system with automated WhatsApp dispatch & Groq engine.</li>
            <li>Designed zero-latency local JSON persistence fallback engine for 100% uptime reliability.</li>
            <li>Awarded Hack A Cure Hackathon Certificate (VIT Chennai - TechnoVIT'25).</li>
          </ul>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '10px', color: 'rgba(200,16,46,0.5)' }}>
            STATUS: OVERDRIVE ACTIVE
          </span>
          <button
            onClick={() => {
              playBeep(700, 0.15);
              window.open('https://github.com/Yash-0209-git', '_blank');
            }}
            data-cursor="pointer"
            style={{
              backgroundColor: 'var(--red)',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.5rem',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.12em',
              boxShadow: '0 0 15px rgba(200,16,46,0.4)',
            }}
          >
            VIEW GITHUB SPEC REPO 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
