import React, { useEffect, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_id?: string;
  verification_url?: string;
  category?: string;
  image_url?: string;
  visible?: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Certificates: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });

  useEffect(() => {
    fetch(`${API_BASE}/api/certificates`)
      .then(r => r.json())
      .then((data: Certificate[]) => {
        if (Array.isArray(data) && data.length > 0) setCerts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="certificates" style={{ backgroundColor: 'var(--bg)' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.15), transparent)' }} />

      <div className="section-container">
        <div ref={headerRef} className={`chapter-header reveal${headerVisible ? ' visible' : ''}`}>
          <h2 className="font-bebas chapter-number">04</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span className="font-mono signal-label">SIGNAL 04</span>
            <span className="font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.18em' }}>
              PROOF
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: '280px',
                  height: '180px',
                  background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.8s infinite',
                  borderLeft: '2px solid rgba(200,16,46,0.1)',
                }}
              />
            ))}
          </div>
        ) : certs.length === 0 ? (
          <EmptyState label="PROOF" message="Certifications are being documented." />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {certs.map((cert, idx) => (
              <CertCard
                key={cert.id}
                cert={cert}
                delay={idx * 60}
                onImageClick={(url) => setPreviewImage(url)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full-size Image Preview Modal */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={previewImage}
              alt="Certificate Full View"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '6px',
                border: '1px solid rgba(200,16,46,0.4)',
                boxShadow: '0 0 40px rgba(200,16,46,0.3)',
              }}
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="font-mono"
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              CLOSE ×
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </section>
  );
};

const CertCard: React.FC<{
  cert: Certificate;
  delay: number;
  onImageClick: (url: string) => void;
}> = ({ cert, delay, onImageClick }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.08, delay });
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref} className={`reveal-scale${visible ? ' visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: 'var(--bg-3)',
          borderTop: `1px solid ${hovered ? 'rgba(200,16,46,0.3)' : 'rgba(255,255,255,0.04)'}`,
          borderRight: `1px solid ${hovered ? 'rgba(200,16,46,0.3)' : 'rgba(255,255,255,0.04)'}`,
          borderBottom: `1px solid ${hovered ? 'rgba(200,16,46,0.3)' : 'rgba(255,255,255,0.04)'}`,
          borderLeft: '2px solid var(--red)',
          padding: '1.5rem',
          transition: 'all 0.22s ease',
          transform: hovered ? 'translateY(-3px)' : 'none',
          boxShadow: hovered ? '0 10px 32px rgba(200,16,46,0.15)' : 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Certificate Image Frame */}
        {cert.image_url && (
          <div
            data-cursor="view"
            onClick={() => onImageClick(cert.image_url!)}
            style={{
              width: '100%',
              height: '160px',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '1rem',
              backgroundColor: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <img
              src={cert.image_url}
              alt={cert.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: hovered ? 'brightness(1)' : 'brightness(0.85)',
                transition: 'all 0.3s ease',
                transform: hovered ? 'scale(1.03)' : 'scale(1)',
              }}
            />
            <div
              className="font-mono"
              style={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                fontSize: '8px',
                backgroundColor: 'rgba(8,8,8,0.85)',
                color: 'var(--red)',
                padding: '0.2rem 0.5rem',
                borderRadius: '2px',
                letterSpacing: '0.1em',
                pointerEvents: 'none',
              }}
            >
              VIEW CREDENTIAL ↗
            </div>
          </div>
        )}

        <div className="font-mono" style={{ fontSize: '8px', color: 'var(--red)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          {cert.category?.toUpperCase() || 'CERTIFICATE'}
        </div>
        <h4 className="font-bebas" style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 0.4rem 0', lineHeight: 1.15 }}>
          {cert.title}
        </h4>
        <p className="font-mono" style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          {cert.issuer}
          {cert.issue_date && <span style={{ marginLeft: '0.5rem', color: 'rgba(200,16,46,0.5)' }}>· {cert.issue_date}</span>}
        </p>

        {cert.verification_url && (
          <a
            href={cert.verification_url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="open"
            className="font-mono"
            style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              marginTop: 'auto',
              display: 'inline-block',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--red)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
          >
            VERIFY CREDENTIAL ↗
          </a>
        )}
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ label: string; message: string }> = ({ label, message }) => {
  const [ref, visible] = useReveal<HTMLDivElement>({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}`}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '5rem 0',
        borderLeft: '1px solid rgba(200,16,46,0.1)',
        paddingLeft: '2rem',
      }}
    >
      <div
        className="font-bebas"
        style={{ fontSize: '80px', color: 'rgba(200,16,46,0.04)', lineHeight: 1, userSelect: 'none' }}
      >
        {label}
      </div>
      <p className="font-inter" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
        {message}
      </p>
      <span
        className="font-mono"
        style={{ fontSize: '10px', color: 'rgba(200,16,46,0.4)', letterSpacing: '0.2em', borderBottom: '1px solid rgba(200,16,46,0.2)', paddingBottom: '2px' }}
      >
        CHECK BACK SOON
      </span>
    </div>
  );
};

export default Certificates;
