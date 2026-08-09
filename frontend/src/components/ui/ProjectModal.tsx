import React, { useState } from 'react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

type TabType = 'OVERVIEW' | 'ARCHITECTURE' | 'STACK';

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'fadeInOverlay 300ms ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-4)',
          borderTop: '2px solid var(--red)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          position: 'relative',
          animation: 'slideUpModal 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close project details"
          data-cursor="pointer"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            cursor: 'none',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--red)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          ×
        </button>

        {/* Category & Status Meta */}
        <div
          className="font-mono"
          style={{ color: 'var(--red)', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '1rem' }}
        >
          {project.category.toUpperCase()} // {project.year} // {project.status.toUpperCase()}
        </div>

        {/* Title */}
        <h2
          className="font-bebas"
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            color: 'white',
            marginBottom: '1.5rem',
            lineHeight: 1,
          }}
        >
          {project.title}
        </h2>

        {/* Interactive Modal Tabs — Phase 4 */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          {(['OVERVIEW', 'ARCHITECTURE', 'STACK'] as TabType[]).map((tab) => (
            <button
              key={tab}
              data-cursor="pointer"
              onClick={() => setActiveTab(tab)}
              className="font-mono"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11px',
                color: activeTab === tab ? 'var(--red)' : 'rgba(255,255,255,0.4)',
                letterSpacing: '0.12em',
                padding: '0.2rem 0',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--red)' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <p
              className="font-inter"
              style={{
                color: 'rgba(240,236,232,0.85)',
                fontSize: '15px',
                lineHeight: 1.85,
                marginBottom: '2rem',
              }}
            >
              {project.short_description}
            </p>

            {project.problem && (
              <div style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(200,16,46,0.04)', borderLeft: '2px solid var(--red)', padding: '1rem 1.25rem' }}>
                <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                  PROBLEM STATEMENT
                </div>
                <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(237,235,230,0.7)', lineHeight: 1.65 }}>
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.2)', padding: '1rem 1.25rem' }}>
                <div className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                  ENGINEERED SOLUTION
                </div>
                <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(237,235,230,0.7)', lineHeight: 1.65 }}>
                  {project.solution}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: ARCHITECTURE & CHALLENGES */}
        {activeTab === 'ARCHITECTURE' && (
          <div style={{ animation: 'fadeIn 0.25s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '4px' }}>
              <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                SYSTEM DESIGN & STACK INTEGRATION
              </div>
              <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(237,235,230,0.7)', lineHeight: 1.7 }}>
                Built on a scalable decoupled architecture with a FastAPI backend processing intelligent AI/LLM requests, connected to Supabase PostgreSQL, and rendered through a high-performance React + TypeScript frontend.
              </p>
            </div>

            {project.challenges ? (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '4px' }}>
                <div className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                  KEY ENGINEERING CHALLENGES
                </div>
                <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(237,235,230,0.7)', lineHeight: 1.7 }}>
                  {project.challenges}
                </p>
              </div>
            ) : (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '4px' }}>
                <div className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                  SECURITY & AUTHENTICATION
                </div>
                <p className="font-inter" style={{ fontSize: '13px', color: 'rgba(237,235,230,0.7)', lineHeight: 1.7 }}>
                  Stateless JWT authentication, hashed credential protection, granular CORS control, environment secret isolation, and optimistic dual-persistence caching.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: STACK */}
        {activeTab === 'STACK' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <div className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
              TECHNOLOGY MATRIX ({project.technologies.length} MODULES)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              {project.technologies.map((tech) => (
                <div
                  key={tech}
                  style={{
                    backgroundColor: 'rgba(200,16,46,0.06)',
                    border: '1px solid rgba(200,16,46,0.2)',
                    padding: '0.6rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--red)' }} />
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ width: '48px', height: '2px', backgroundColor: 'var(--red)', marginBottom: '2rem', marginTop: '1.5rem' }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.5rem',
                border: '1px solid var(--red)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '11px',
                letterSpacing: '0.1em',
                transition: 'background-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--red)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              VIEW REPOSITORY ↗
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '11px',
                letterSpacing: '0.1em',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              LIVE DEMO ↗
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProjectModal;
