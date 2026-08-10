import React, { useEffect, useState } from 'react';
import { fetchCertificates } from '../../api';
import { Certificate } from '../../types';
import { useReveal } from '../../hooks/useReveal';
import { playBeep } from '../../utils/audio';

const FALLBACK_CERTS: Certificate[] = [
  {
    id: 'xmedia-internship',
    title: 'Development Team Internship',
    issuer: 'M/s. Xmedia Solutions, Ambattur',
    issue_date: '24/07/2026',
    credential_id: '241501251',
    category: 'Internship',
    image_url: '/certificates/xmedia_internship.png',
    visible: true,
  },
  {
    id: 'vibe-hack-2',
    title: 'Vibe Hack 2.0 (BuildwithIndia Finale)',
    issuer: 'Hack With India (Finale at Google Office)',
    issue_date: '2026',
    credential_id: 'TOP-5000',
    category: 'Hackathon',
    image_url: '/certificates/vibe_hack_2.jpg',
    visible: true,
  },
  {
    id: 'hack-a-cure',
    title: 'Hack A Cure',
    issuer: 'VIT, Chennai (TechnoVIT\'25)',
    issue_date: '28/10/2025',
    credential_id: 'TECHNOVIT25',
    category: 'Hackathon',
    image_url: '/certificates/hack_a_cure.jpg',
    visible: true,
  },
];

/* ═══════════════════════════════════════════════════════
   DECRYPTED CREDENTIAL CARD (VAULT CHASSIS)
═══════════════════════════════════════════════════════ */
interface VaultCardProps {
  cert: Certificate;
  index: number;
  delay: number;
  onOpen: (cert: Certificate) => void;
}

const VaultCard: React.FC<VaultCardProps> = ({ cert, index, delay, onOpen }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.08, delay });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`reveal-scale${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          playBeep(700, 0.05);
          onOpen(cert);
        }}
        data-cursor="view"
        style={{
          backgroundColor: hovered ? 'rgba(22, 10, 14, 0.96)' : 'rgba(14, 14, 16, 0.9)',
          border: `1px solid ${hovered ? 'rgba(200,16,46,0.65)' : 'rgba(200,16,46,0.18)'}`,
          borderLeft: `3px solid ${hovered ? '#C8102E' : 'rgba(200,16,46,0.35)'}`,
          borderRadius: '4px',
          padding: '1.35rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: hovered ? 'translateY(-4px) scale(1.015)' : 'translateY(0) scale(1)',
          boxShadow: hovered
            ? '0 0 32px rgba(200,16,46,0.28), 0 10px 36px rgba(0,0,0,0.7)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* HUD Corner Brackets */}
        {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            top: pos.startsWith('t') ? 5 : undefined,
            bottom: pos.startsWith('b') ? 5 : undefined,
            left: pos.endsWith('l') ? 5 : undefined,
            right: pos.endsWith('r') ? 5 : undefined,
            width: 7, height: 7,
            borderTop: pos.startsWith('t') ? `1.5px solid ${hovered ? 'var(--red)' : 'rgba(200,16,46,0.3)'}` : undefined,
            borderBottom: pos.startsWith('b') ? `1.5px solid ${hovered ? 'var(--red)' : 'rgba(200,16,46,0.3)'}` : undefined,
            borderLeft: pos.endsWith('l') ? `1.5px solid ${hovered ? 'var(--red)' : 'rgba(200,16,46,0.3)'}` : undefined,
            borderRight: pos.endsWith('r') ? `1.5px solid ${hovered ? 'var(--red)' : 'rgba(200,16,46,0.3)'}` : undefined,
            transition: 'border-color 0.3s ease',
          }} />
        ))}

        {/* Laser Scanner Line (Sweeps when hovered) */}
        {hovered && (
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #C8102E, transparent)',
            boxShadow: '0 0 8px #C8102E',
            animation: 'vaultScanSweep 2s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 4,
          }} />
        )}

        {/* Header HUD Status Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div className="font-mono" style={{ fontSize: '8px', color: 'rgba(200,16,46,0.7)', letterSpacing: '0.18em' }}>
            DOC-0{index + 1} // {cert.category?.toUpperCase() || 'PROOF'}
          </div>
          <div className="font-mono" style={{ fontSize: '7.5px', color: '#00FF66', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#00FF66', boxShadow: '0 0 6px #00FF66', display: 'inline-block' }} />
            VERIFIED
          </div>
        </div>

        {/* Certificate Image Frame */}
        {cert.image_url && (
          <div style={{
            width: '100%',
            height: '175px',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '1rem',
            backgroundColor: '#0a0a0c',
            border: `1px solid ${hovered ? 'rgba(200,16,46,0.4)' : 'rgba(255,255,255,0.06)'}`,
            position: 'relative',
            transition: 'border-color 0.3s ease',
          }}>
            <img
              src={cert.image_url}
              alt={cert.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: hovered ? 'brightness(0.95) contrast(1.05)' : 'brightness(0.7) contrast(1)',
                transition: 'all 0.4s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
            />
            {/* CRT Scanline Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
              pointerEvents: 'none',
            }} />
            {/* View prompt */}
            <div className="font-mono" style={{
              position: 'absolute', bottom: 8, right: 8,
              fontSize: '7.5px', color: 'var(--text-primary)',
              backgroundColor: 'rgba(8,5,5,0.88)',
              border: '1px solid rgba(200,16,46,0.4)',
              padding: '0.2rem 0.5rem', borderRadius: '2px',
              letterSpacing: '0.12em',
              boxShadow: '0 0 8px rgba(0,0,0,0.6)',
            }}>
              DECRYPT IMAGE ↗
            </div>
          </div>
        )}

        {/* Certificate Title */}
        <h3 className="font-bebas" style={{
          fontSize: 'clamp(20px, 2.2vw, 24px)',
          color: hovered ? 'var(--text-primary)' : 'rgba(237,235,230,0.85)',
          margin: '0 0 0.4rem 0',
          lineHeight: 1.15,
          letterSpacing: '0.03em',
          transition: 'color 0.3s ease',
        }}>
          {cert.title}
        </h3>

        {/* Issuer & Date */}
        <p className="font-mono" style={{ fontSize: '10px', color: 'rgba(237,235,230,0.5)', margin: '0 0 0.8rem 0', lineHeight: 1.5 }}>
          {cert.issuer}
          {cert.issue_date && (
            <span style={{ marginLeft: '0.5rem', color: 'var(--red)' }}>
              · [{cert.issue_date}]
            </span>
          )}
        </p>

        {/* Credential ID / Hash */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono" style={{ fontSize: '7.5px', color: 'rgba(200,16,46,0.5)', letterSpacing: '0.15em' }}>
            ID: {cert.credential_id || 'SHA256-VERIFIED'}
          </span>
          <span className="font-mono" style={{ fontSize: '8px', color: hovered ? 'var(--red)' : 'rgba(237,235,230,0.3)', letterSpacing: '0.1em', transition: 'color 0.3s ease' }}>
            INSPECT VAULT ➔
          </span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN CERTIFICATES SECTION
═══════════════════════════════════════════════════════ */
const Certificates: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });

  useEffect(() => {
    (async () => {
      const data = await fetchCertificates();
      setCerts(data.length > 0 ? data : FALLBACK_CERTS);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="certificates" style={{ backgroundColor: 'var(--bg)', position: 'relative' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">
        {/* Chapter Header */}
        <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`}>
          <h2 className="font-bebas chapter-number">04</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span className="font-mono signal-label">SIGNAL 04</span>
            <span className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.18em' }}>
              PROOF & CREDENTIALS
            </span>
          </div>
        </div>

        {/* Security Clearance Telemetry HUD Bar */}
        <div style={{
          padding: '0.9rem 1.2rem',
          backgroundColor: 'rgba(10,6,8,0.85)',
          border: '1px solid rgba(200,16,46,0.25)',
          borderRadius: '4px',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#00FF66', boxShadow: '0 0 8px #00FF66', display: 'inline-block' }} />
            <span className="font-mono" style={{ fontSize: '9.5px', color: 'var(--text-primary)', letterSpacing: '0.12em' }}>
              SECURITY CLEARANCE: <span style={{ color: 'var(--red)' }}>LEVEL 5</span> // DECRYPTED CREDENTIAL VAULT
            </span>
          </div>
          <div className="font-mono" style={{ fontSize: '8.5px', color: 'rgba(200,16,46,0.5)', letterSpacing: '0.15em' }}>
            ● {certs.length} CREDENTIALS DECRYPTED & VERIFIED
          </div>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '320px',
                background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.8s infinite',
                borderRadius: '4px',
              }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {certs.map((cert, idx) => (
              <VaultCard
                key={cert.id}
                cert={cert}
                index={idx}
                delay={idx * 80}
                onOpen={setSelectedCert}
              />
            ))}
          </div>
        )}
      </div>

      {/* High-Tech Lightbox Modal */}
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6,4,6,0.94)',
            backdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '850px',
              width: '100%',
              backgroundColor: 'rgba(16,16,20,0.98)',
              border: '1px solid var(--red)',
              borderRadius: '6px',
              padding: '1.75rem',
              boxShadow: '0 0 50px rgba(200,16,46,0.4), 0 20px 60px rgba(0,0,0,0.8)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(200,16,46,0.2)', paddingBottom: '0.75rem' }}>
              <div className="font-mono" style={{ fontSize: '9px', color: 'var(--red)', letterSpacing: '0.2em' }}>
                DECRYPTED VAULT FILE // {selectedCert.category?.toUpperCase() || 'PROOF'}
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="font-mono"
                style={{
                  background: 'none',
                  border: '1px solid rgba(200,16,46,0.4)',
                  color: 'white',
                  fontSize: '10px',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                CLOSE [ESC] ×
              </button>
            </div>

            {/* Image display */}
            {selectedCert.image_url && (
              <div style={{ width: '100%', maxHeight: '55vh', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.25rem', backgroundColor: '#000' }}>
                <img
                  src={selectedCert.image_url}
                  alt={selectedCert.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '55vh' }}
                />
              </div>
            )}

            {/* Credential Details */}
            <h3 className="font-bebas" style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 0.4rem 0', lineHeight: 1.1 }}>
              {selectedCert.title}
            </h3>
            <p className="font-mono" style={{ fontSize: '11px', color: 'rgba(237,235,230,0.6)', margin: '0 0 1rem 0' }}>
              {selectedCert.issuer} {selectedCert.issue_date && <span style={{ color: 'var(--red)', marginLeft: '0.5rem' }}>· Issued: {selectedCert.issue_date}</span>}
            </p>

            {selectedCert.verification_url && (
              <a
                href={selectedCert.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="open"
                className="font-mono"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--red)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '3px',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  boxShadow: '0 0 16px rgba(200,16,46,0.4)',
                }}
              >
                VERIFY OFFICIAL CREDENTIAL ↗
              </a>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes vaultScanSweep {
          0% { top: 0%; opacity: 0.8; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Certificates;
