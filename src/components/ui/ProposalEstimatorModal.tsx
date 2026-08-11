import React, { useState } from 'react';
import { playBeep } from '../../utils/audio';

interface ProposalEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  { id: 'rag_ai', title: '🤖 AI / RAG Chatbot Architecture', desc: 'Domain-grounded LLMs, FAISS vector embeddings, document parsing & voice input.' },
  { id: 'fullstack', title: '🌐 Full Stack Web Application', desc: 'High-performance React + TypeScript frontend with FastAPI / Supabase backend.' },
  { id: 'backend', title: '⚡ High-Throughput FastAPI Backend', desc: 'RESTful APIs, SQLAlchemy, JWT auth, WebSockets & PostgreSQL database design.' },
  { id: 'custom', title: '🛠️ Custom Software & AI Workflows', desc: 'Automated notification pipelines, WhatsApp/SMTP bots & specialized algorithms.' },
];

const TECH_OPTIONS = [
  'Python & FastAPI',
  'React 18 & TypeScript',
  'Groq API (Llama 3.3 70B)',
  'FAISS Vector Database',
  'PostgreSQL & Supabase',
  'Google Gemini API',
  'Tailwind CSS & Canvas UI',
  'WhatsApp & Email Automation',
];

const TIMELINES = [
  { id: 'rapid', title: '⚡ Rapid Prototype', duration: '1 – 2 Weeks' },
  { id: 'standard', title: '🚀 Full Production Platform', duration: '3 – 4 Weeks' },
  { id: 'enterprise', title: '🏢 Scale & Enterprise Architecture', duration: '1 – 2 Months' },
];

export const ProposalEstimatorModal: React.FC<ProposalEstimatorModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['Python & FastAPI', 'React 18 & TypeScript', 'Groq API (Llama 3.3 70B)']);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINES[1]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleTech = (tech: string) => {
    playBeep(640, 0.04);
    if (selectedTechs.includes(tech)) {
      if (selectedTechs.length > 1) {
        setSelectedTechs(selectedTechs.filter(t => t !== tech));
      }
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const constructMailto = () => {
    const subject = encodeURIComponent(`Project Proposal: ${selectedType.title} [Yashwanth.sys]`);
    const body = encodeURIComponent(
      `Hello Yashwanth,\n\nI would like to collaborate with you on a project:\n\n` +
      `● Project Type: ${selectedType.title}\n` +
      `● Recommended Tech Stack: ${selectedTechs.join(', ')}\n` +
      `● Target Timeline: ${selectedTimeline.title} (${selectedTimeline.duration})\n\n` +
      `Project Brief / Notes:\n[Please add any specific goals or notes here]\n\n` +
      `Looking forward to building this together!`
    );
    return `mailto:yashwanth02092006@gmail.com?subject=${subject}&body=${body}`;
  };

  const copyToClipboard = () => {
    playBeep(920, 0.06);
    const summaryText =
      `Project Proposal for Yashwanth C:\n` +
      `Project Type: ${selectedType.title}\n` +
      `Tech Stack: ${selectedTechs.join(', ')}\n` +
      `Timeline: ${selectedTimeline.title} (${selectedTimeline.duration})\n` +
      `Email: yashwanth02092006@gmail.com`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 8, 12, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'rgba(14, 14, 18, 0.96)',
          border: '1px solid rgba(200, 16, 46, 0.45)',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 35px rgba(200, 16, 46, 0.25)',
          padding: '1.75rem',
          position: 'relative',
          color: 'white',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(200, 16, 46, 0.25)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
          <div>
            <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em', fontWeight: 700 }}>
              // CYBER ORB SIMULATOR
            </div>
            <h2 className="font-share-tech" style={{ fontSize: '24px', margin: 0, color: 'white' }}>
              PROJECT ESTIMATOR & PROPOSAL BUILDER
            </h2>
          </div>

          <button
            onClick={() => { playBeep(400, 0.05); onClose(); }}
            data-cursor="pointer"
            style={{
              background: 'rgba(200,16,46,0.15)',
              border: '1px solid rgba(200,16,46,0.4)',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Step 1: Select Project Type */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '0.6rem', fontWeight: 700 }}>
            STEP 1: SELECT PROJECT GOAL
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
            {PROJECT_TYPES.map(type => {
              const active = selectedType.id === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => { playBeep(720, 0.04); setSelectedType(type); }}
                  data-cursor="pointer"
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem',
                    backgroundColor: active ? 'rgba(200, 16, 46, 0.22)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? '#FF2A4B' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: active ? 'white' : 'rgba(255,255,255,0.85)', marginBottom: '0.2rem' }}>
                    {type.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.35 }}>
                    {type.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Tech Stack Selection */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '0.6rem', fontWeight: 700 }}>
            STEP 2: SELECT TECH STACK & COMPONENTS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {TECH_OPTIONS.map(tech => {
              const active = selectedTechs.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  data-cursor="pointer"
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono, monospace',
                    backgroundColor: active ? 'rgba(200,16,46,0.3)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                    color: active ? '#FF2A4B' : 'rgba(255,255,255,0.65)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {active ? '✓ ' : '+ '} {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Target Timeline */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '0.6rem', fontWeight: 700 }}>
            STEP 3: TARGET SCOPE & TIMELINE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
            {TIMELINES.map(tl => {
              const active = selectedTimeline.id === tl.id;
              return (
                <button
                  key={tl.id}
                  onClick={() => { playBeep(800, 0.04); setSelectedTimeline(tl); }}
                  data-cursor="pointer"
                  style={{
                    textAlign: 'left',
                    padding: '0.65rem 0.75rem',
                    backgroundColor: active ? 'rgba(200, 16, 46, 0.22)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? '#FF2A4B' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{tl.title}</div>
                  <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', marginTop: '0.15rem' }}>Est: {tl.duration}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Proposal Summary Box & Actions */}
        <div style={{
          backgroundColor: 'rgba(10,5,5,0.9)',
          border: '1px solid rgba(200,16,46,0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
        }}>
          <div className="font-mono" style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '0.4rem' }}>
            [ PROPOSAL BREAKDOWN SUMMARY ]
          </div>
          <div style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>
            {selectedType.title}
          </div>
          <div className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
            Stack: {selectedTechs.join(' • ')} | Timeline: {selectedTimeline.duration}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href={constructMailto()}
            onClick={() => playBeep(960, 0.08)}
            data-cursor="pointer"
            style={{
              flex: 1,
              minWidth: '220px',
              backgroundColor: 'var(--red)',
              color: 'white',
              padding: '0.75rem 1.25rem',
              borderRadius: '6px',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              boxShadow: '0 4px 18px rgba(200,16,46,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            ✉️ SEND PROPOSAL TO YASHWANTH
          </a>

          <button
            onClick={copyToClipboard}
            data-cursor="pointer"
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: 'transparent',
              border: `1px solid ${copied ? '#00FF66' : 'rgba(255,255,255,0.2)'}`,
              color: copied ? '#00FF66' : 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
            }}
          >
            {copied ? '✓ COPIED TO CLIPBOARD' : '📋 COPY SUMMARY'}
          </button>
        </div>
      </div>
    </div>
  );
};
