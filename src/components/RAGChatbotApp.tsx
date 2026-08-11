import { useState, useEffect, useRef } from 'react';
import { playBeep } from '../utils/audio';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: string[];
}

const KNOWLEDGE_BASE = [
  {
    keywords: ['project', 'projects', 'built', 'work', 'portfolio'],
    answer: 'Yashwanth has engineered standout full-stack AI applications:\n\n1. 🚗 **AutoTrack** (2026) — Full-stack Vehicle Service & Workshop Management System with real-time job status tracking, customer records, Supabase persistence, and automated PDF invoicing.\n2. 🏋️ **LeeSculpt Gym Application** (2026) — AI-powered Gym Management System with personalized fitness tracking, automated diet guidance via Groq & Gemini API, and WhatsApp notifications.\n3. 🔮 **CodeSage AI** (2026) — Intelligent Codebase Analysis & RAG Debugging Platform that extracts repository .zip files, detects project architecture, flags bugs & security issues, and provides an interactive Deep AI RAG assistant.\n4. 🤖 **RAG-Tech Assistant** (2025) — Technical QA Chatbot featuring query expansion, FAISS vector retrieval, reranking, and Llama 3.3 70B generation.',
    sources: ['PROJECT_INDEX.DB', 'STATIC_PROJECTS.TS'],
  },
  {
    keywords: ['autotrack', 'auto', 'vehicle', 'workshop', 'service', 'car', 'billing', 'invoice'],
    answer: '🚗 **AutoTrack (2026)**:\n- **Problem**: Automotive workshops struggle with manual paperwork, fragmented vehicle histories, delayed billing, and a lack of real-time job status visibility.\n- **Solution**: Full-stack workshop management system featuring Supabase real-time database persistence, interactive service order status tracking (Pending, In Progress, Completed), automated PDF invoice generation via jsPDF & html2canvas, and customer feedback analytics.\n- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Supabase, TanStack Query v5, Framer Motion, jsPDF, html2canvas.',
    sources: ['AUTOTRACK_DOCS.MD', 'SUPABASE_SERVICE_SCHEMA.SQL'],
  },
  {
    keywords: ['codesage', 'sage', 'code-sage', 'zip', 'analyzer', 'repository', 'ast', 'debugging'],
    answer: '🔮 **CodeSage AI (2026)**:\n- **Problem**: Developers spend hours understanding unfamiliar codebases, tracing architectural symbols, and finding hidden bugs.\n- **Solution**: Upload complete project .zip folders to extract files, detect project architecture types, extract AST symbols, run issue detection, generate feature roadmaps, and chat with a Deep AI RAG assistant.\n- **Tech Stack**: Python, FastAPI, React, TypeScript, RAG, Groq API, Llama 3.3 70B, ZIP Parsing, AST Parser, Tailwind CSS.',
    sources: ['CODESAGE_AI_DOCS.MD', 'AST_PARSER_ENGINE.PY'],
  },
  {
    keywords: ['leesculpt', 'gym', 'health', 'fitness'],
    answer: '🏋️ **LeeSculpt Gym Application (2026)**:\n- **Problem**: Fragmented gym member tracking and communication.\n- **Solution**: Multi-role web app (Admins, Trainers, Members) with AI diet & workout recommendation engines, progress analytics, and automated WhatsApp dispatches.\n- **Tech Stack**: Python, FastAPI, React, TypeScript, PostgreSQL, Supabase, Groq API, Google Gemini, SQLAlchemy, JWT Auth, WhatsApp API.',
    sources: ['LEESCULPT_CASE_STUDY.MD'],
  },
  {
    keywords: ['rag', 'rag-tech', 'bot', 'knowledge', 'faiss', 'llama'],
    answer: '🤖 **RAG-Tech Bot (2025)**:\n- **Problem**: Standard LLMs hallucinate or lack domain-specific technical context.\n- **Solution**: Multi-stage RAG pipeline with query expansion, FAISS vector retrieval, reranking, and grounded generation via Llama 3.3 70B.\n- **Tech Stack**: Python, FastAPI, FAISS, Sentence Transformers, Groq, Llama 3.3 70B, React, Vite, Three.js, PyTorch.',
    sources: ['RAG_PIPELINE_DOCS.MD'],
  },
  {
    keywords: ['skill', 'skills', 'stack', 'technologies', 'python', 'fastapi', 'react', 'language'],
    answer: '💻 **Yashwanth\'s Core Tech Stack**:\n- **Languages**: Python, TypeScript\n- **Backend**: FastAPI, SQLAlchemy, REST APIs, JWT Auth\n- **AI & ML**: AI/LLMs, RAG Pipelines, Groq API, Google Gemini, FAISS, PyTorch\n- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Vanilla CSS\n- **Database**: PostgreSQL, Supabase',
    sources: ['STACK_NEURAL_MAP.JSON'],
  },
  {
    keywords: ['internship', 'xmedia', 'experience', 'work experience', 'job'],
    answer: '📜 **Internship Experience**:\n- **Role**: Development Team Intern at **M/s. Xmedia Solutions, Ambattur** (June 15 – July 20, 2026).\n- **Focus**: Full-stack development, API integration, and system optimization under senior supervision.',
    sources: ['XMEDIA_INTERNSHIP_CERT.PDF'],
  },
  {
    keywords: ['certificate', 'certificates', 'proof', 'hackathon', 'vibe', 'google', 'vit'],
    answer: '🏆 **Certifications & Achievements**:\n1. 📜 **Development Team Internship** — Xmedia Solutions, Ambattur (July 2026)\n2. 🏆 **Vibe Hack 2.0 (BuildwithIndia Finale)** — Placed in top 5,000 teams out of 25,000 teams at Google Office finale\n3. 🥇 **Hack A Cure** — VIT Chennai (TechnoVIT\'25)',
    sources: ['CREDENTIAL_VAULT.DB'],
  },
  {
    keywords: ['contact', 'email', 'github', 'linkedin', 'hire', 'reach'],
    answer: '📫 **Connect with Yashwanth**:\n- **Email**: yashwanth02092006@gmail.com\n- **GitHub**: github.com/Yash-0209-git\n- **LinkedIn**: linkedin.com/in/yashwanth-c-918a53317\n- **Status**: Transmitting & Open to Opportunities ●',
    sources: ['CONTACT_TELEMETRY.CONFIG'],
  },
  {
    keywords: ['who', 'about', 'yashwanth', 'bio'],
    answer: '👤 **Yashwanth** is an AI/ML-focused Full Stack Developer who enjoys building practical, intelligent software that solves real-world problems. He bridges robust backend architecture (FastAPI & PostgreSQL) with dynamic frontend UIs (React) and LLM engines (Groq & Gemini).',
    sources: ['IDENTITY_PROFILE.JSON'],
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'bot',
    text: '🤖 **RAG-ASSISTANT v2.0 ONLINE**\nI am Yashwanth\'s portfolio AI assistant equipped with custom vector RAG knowledge about his projects, tech stack, experience, and contact info. How can I assist you?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: ['KNOWLEDGE_BASE.INDEX'],
  },
];

export default function RAGChatbotApp() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('yash_groq_api_key') || '');
  const [showConfig, setShowConfig] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    playBeep(650, 0.04);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate RAG vector retrieval & response delay
    setTimeout(async () => {
      let botResponse = '';
      let sources: string[] = ['RAG_VECTOR_STORE.FAISS'];

      // If user provided custom Groq API Key, make live LLM call
      if (apiKey) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                {
                  role: 'system',
                  content: `You are Yashwanth's portfolio AI assistant. Answer concisely and accurately based on Yashwanth's profile: AI Full Stack Developer, builds in Python, FastAPI, React, PostgreSQL, RAG, Groq API. Built LeeSculpt Gym App and RAG-Tech Bot. Interned at Xmedia Solutions. Email: yashwanth02092006@gmail.com, GitHub: Yash-0209-git.`,
                },
                { role: 'user', content: query },
              ],
            }),
          });
          const data = await res.json();
          if (data.choices && data.choices[0]?.message?.content) {
            botResponse = data.choices[0].message.content;
            sources = ['GROQ_LLAMA_3.3_70B_STREAM'];
          }
        } catch {
          // Fallback to local RAG knowledge base if API call fails
        }
      }

      // Local RAG Knowledge Base matching if no response yet
      if (!botResponse) {
        const qLower = query.toLowerCase();
        const match = KNOWLEDGE_BASE.find(item =>
          item.keywords.some(kw => qLower.includes(kw))
        );

        if (match) {
          botResponse = match.answer;
          sources = match.sources;
        } else {
          botResponse = `I searched Yashwanth's portfolio knowledge base for "${query}".\n\nHere is a quick overview:\n- **Identity**: AI Full Stack Developer working in Python, FastAPI, React & AI/LLMs.\n- **Projects**: LeeSculpt Gym App & RAG-Tech Bot.\n- **Contact**: yashwanth02092006@gmail.com`;
          sources = ['DEFAULT_FALLBACK.INDEX'];
        }
      }

      playBeep(850, 0.06);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('yash_groq_api_key', key);
    setShowConfig(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '480px', color: 'white', fontFamily: 'monospace' }}>

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(200,16,46,0.12)', border: '1px solid rgba(200,16,46,0.3)', padding: '0.6rem 0.9rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00FF66', boxShadow: '0 0 8px #00FF66' }} />
          <span style={{ color: 'var(--red)', fontWeight: 700 }}>RAG-ASSISTANT v2.0</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>| FAISS RAG STORE ONLINE</span>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            backgroundColor: apiKey ? 'rgba(0,255,102,0.15)' : 'rgba(200,16,46,0.15)',
            border: `1px solid ${apiKey ? '#00FF66' : 'rgba(200,16,46,0.4)'}`,
            color: apiKey ? '#00FF66' : 'white',
            fontSize: '9.5px', padding: '0.25rem 0.55rem', borderRadius: '3px', cursor: 'pointer',
          }}
        >
          {apiKey ? '⚡ GROQ API ACTIVE' : '⚙ GROQ API KEY'}
        </button>
      </div>

      {/* Config Modal */}
      {showConfig && (
        <div style={{ backgroundColor: 'rgba(10,10,14,0.95)', border: '1px solid var(--red)', padding: '0.85rem', borderRadius: '4px', marginBottom: '0.75rem', fontSize: '11px' }}>
          <div style={{ color: 'var(--red)', fontWeight: 700, marginBottom: '0.35rem' }}>OPTIONAL: LIVE GROQ / LLAMA API KEY</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '0.5rem' }}>
            Enter your Groq API key to enable live Llama 3.3 70B generation, or leave blank to use built-in RAG dataset.
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ flex: 1, backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.35rem 0.6rem', borderRadius: '3px', fontSize: '11px', fontFamily: 'monospace' }}
            />
            <button
              onClick={() => saveApiKey(apiKey)}
              style={{ backgroundColor: 'var(--red)', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 700, fontSize: '10px' }}
            >
              SAVE KEY
            </button>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
        {[
          'Tell me about LeeSculpt',
          'Tell me about CodeSage AI',
          'What is RAG-Tech Bot?',
          'What is Yashwanth\'s tech stack?',
          'Internship details',
          'How to contact him?',
        ].map(p => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,16,46,0.25)',
              color: 'rgba(237,235,230,0.7)',
              fontSize: '9px', padding: '0.25rem 0.55rem', borderRadius: '12px',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'rgba(8,8,10,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {messages.map(m => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>
              <span>{m.sender === 'user' ? 'YOU' : 'RAG-BOT'}</span>
              <span>·</span>
              <span>{m.timestamp}</span>
            </div>
            <div
              style={{
                maxWidth: '85%',
                backgroundColor: m.sender === 'user' ? 'rgba(200,16,46,0.25)' : 'rgba(20,20,26,0.9)',
                border: `1px solid ${m.sender === 'user' ? 'var(--red)' : 'rgba(200,16,46,0.3)'}`,
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '11px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.text}
              {m.sources && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '8px', color: 'rgba(200,16,46,0.7)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span>SOURCES:</span>
                  {m.sources.map(s => (
                    <span key={s} style={{ backgroundColor: 'rgba(200,16,46,0.15)', padding: '0.1rem 0.3rem', borderRadius: '2px' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ fontSize: '10px', color: 'var(--red)', animation: 'blink 1s infinite' }}>
            ⚡ RETRIEVING FAISS EMBEDDINGS & GENERATING RESPONSE...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <input
          type="text"
          placeholder="Ask RAG Assistant about Yashwanth's projects, skills..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          style={{
            flex: 1,
            backgroundColor: 'rgba(12,12,16,0.9)',
            border: '1px solid rgba(200,16,46,0.3)',
            color: 'white',
            padding: '0.55rem 0.85rem',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
          }}
        />
        <button
          onClick={() => handleSend()}
          style={{
            backgroundColor: 'var(--red)',
            color: 'white',
            border: 'none',
            padding: '0.55rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '10px',
            letterSpacing: '0.1em',
            boxShadow: '0 0 12px rgba(200,16,46,0.3)',
          }}
        >
          SEND ➔
        </button>
      </div>
    </div>
  );
}
