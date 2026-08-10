import { useState, useEffect, useRef } from 'react';

type Tab = 'PERFORMANCE' | 'PROCESSES' | 'AI_TELEMETRY';

interface ProcessItem {
  id: string;
  name: string;
  type: string;
  cpu: number;
  memory: string;
  status: string;
  threads: number;
}

const SYSTEM_PROCESSES: ProcessItem[] = [
  { id: '1', name: 'FastAPI Backend Engine', type: 'Backend Service', cpu: 14.2, memory: '284 MB', status: 'RUNNING', threads: 8 },
  { id: '2', name: 'FAISS Vector Search Index', type: 'Vector Database', cpu: 8.7, memory: '1.4 GB', status: 'ACTIVE', threads: 16 },
  { id: '3', name: 'Llama 3.3 70B Generation', type: 'LLM Pipeline', cpu: 22.4, memory: '4.2 GB', status: 'PROCESSING', threads: 32 },
  { id: '4', name: 'React 18 Virtual DOM Engine', type: 'Frontend Core', cpu: 4.1, memory: '142 MB', status: 'RUNNING', threads: 4 },
  { id: '5', name: 'PostgreSQL Connection Pool', type: 'Database Engine', cpu: 2.8, memory: '98 MB', status: 'IDLE', threads: 10 },
  { id: '6', name: 'Groq API Streaming Proxy', type: 'AI Gateway', cpu: 6.5, memory: '210 MB', status: 'STREAMING', threads: 12 },
];

export default function TaskManagerApp() {
  const [activeTab, setActiveTab] = useState<Tab>('PERFORMANCE');
  const [cpuHist, setCpuHist] = useState<number[]>(Array(30).fill(25));
  const [memHist, setMemHist] = useState<number[]>(Array(30).fill(52));
  const [netHist, setNetHist] = useState<number[]>(Array(30).fill(35));
  const [processes, setProcesses] = useState<ProcessItem[]>(SYSTEM_PROCESSES);

  const cpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const memCanvasRef = useRef<HTMLCanvasElement>(null);

  // Live telemetry pulse animation
  useEffect(() => {
    const iv = setInterval(() => {
      // Simulate CPU fluctuation
      const newCpu = Math.min(95, Math.max(12, 28 + (Math.random() - 0.48) * 35));
      setCpuHist(prev => [...prev.slice(1), Math.round(newCpu)]);

      // Simulate Memory fluctuation
      const newMem = Math.min(90, Math.max(40, 52 + (Math.random() - 0.5) * 8));
      setMemHist(prev => [...prev.slice(1), Math.round(newMem)]);

      // Simulate Network fluctuation
      const newNet = Math.min(99, Math.max(10, 35 + (Math.random() - 0.45) * 40));
      setNetHist(prev => [...prev.slice(1), Math.round(newNet)]);

      // Fluctuate process CPU percentages
      setProcesses(prev =>
        prev.map(p => ({
          ...p,
          cpu: +(p.cpu + (Math.random() - 0.5) * 2.5).toFixed(1),
        }))
      );
    }, 1000);

    return () => clearInterval(iv);
  }, []);

  // Draw chart canvas
  const drawChart = (canvas: HTMLCanvasElement | null, data: number[], color: string) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = (canvas.width = canvas.offsetWidth || 300);
    const h = (canvas.height = canvas.offsetHeight || 120);

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Line plot
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const step = w / (data.length - 1);

    data.forEach((val, i) => {
      const x = i * step;
      const y = h - (val / 100) * (h - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under chart
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = color === '#C8102E' ? 'rgba(200,16,46,0.12)' : 'rgba(0,255,102,0.1)';
    ctx.fill();
  };

  useEffect(() => {
    if (activeTab === 'PERFORMANCE') {
      drawChart(cpuCanvasRef.current, cpuHist, '#C8102E');
      drawChart(memCanvasRef.current, memHist, '#00FF66');
    }
  }, [cpuHist, memHist, activeTab]);

  const currentCpu = cpuHist[cpuHist.length - 1];
  const currentMem = memHist[memHist.length - 1];
  const currentNet = netHist[netHist.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'white', fontFamily: 'monospace' }}>

      {/* Header Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        {(['PERFORMANCE', 'PROCESSES', 'AI_TELEMETRY'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              backgroundColor: activeTab === t ? 'rgba(200,16,46,0.2)' : 'transparent',
              border: `1px solid ${activeTab === t ? 'var(--red)' : 'transparent'}`,
              color: activeTab === t ? 'white' : 'rgba(255,255,255,0.5)',
              padding: '0.3rem 0.75rem',
              fontSize: '11px',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* ── TAB 1: PERFORMANCE ── */}
      {activeTab === 'PERFORMANCE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ backgroundColor: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.3)', padding: '0.75rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '9px', color: 'var(--red)', letterSpacing: '0.15em' }}>CPU UTILIZATION</div>
              <div style={{ fontSize: '26px', fontWeight: 700, margin: '0.2rem 0' }}>{currentCpu}%</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>8 CORES ACTIVE @ 4.20 GHz</div>
            </div>

            <div style={{ backgroundColor: 'rgba(0,255,102,0.06)', border: '1px solid rgba(0,255,102,0.25)', padding: '0.75rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '9px', color: '#00FF66', letterSpacing: '0.15em' }}>MEMORY ALLOCATION</div>
              <div style={{ fontSize: '26px', fontWeight: 700, margin: '0.2rem 0', color: '#00FF66' }}>{currentMem}%</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>16.6 GB / 32.0 GB USED</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em' }}>SIGNAL BANDWIDTH</div>
              <div style={{ fontSize: '26px', fontWeight: 700, margin: '0.2rem 0' }}>{currentNet * 12}M</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>TX: 940 Mbps | RX: 120 Mbps</div>
            </div>
          </div>

          {/* CPU Chart */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(200,16,46,0.3)', padding: '0.85rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--red)', marginBottom: '0.5rem' }}>
              <span>PROCESSOR LOAD HISTORY (OVER TIME)</span>
              <span>8 CORE SIMD MATRIX</span>
            </div>
            <canvas ref={cpuCanvasRef} style={{ width: '100%', height: '110px' }} />
          </div>

          {/* Memory Chart */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,255,102,0.25)', padding: '0.85rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#00FF66', marginBottom: '0.5rem' }}>
              <span>MEMORY POOL (FAISS + TORCH TENSORS)</span>
              <span>32GB DDR5 @ 6000MHz</span>
            </div>
            <canvas ref={memCanvasRef} style={{ width: '100%', height: '110px' }} />
          </div>
        </div>
      )}

      {/* ── TAB 2: PROCESSES ── */}
      {activeTab === 'PROCESSES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>
            ACTIVE SYSTEM THREADS & SERVICES ({processes.length})
          </div>
          <div style={{ border: '1px solid rgba(200,16,46,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(200,16,46,0.2)', color: 'var(--red)', fontSize: '10px' }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>PROCESS NAME</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>CATEGORY</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>CPU %</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>MEMORY</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600, color: 'white' }}>{p.name}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.5)' }}>{p.type}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: p.cpu > 15 ? 'var(--red)' : '#00FF66' }}>{p.cpu}%</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(255,255,255,0.8)' }}>{p.memory}</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontSize: '9px' }}>
                      <span style={{
                        padding: '0.15rem 0.4rem',
                        borderRadius: '2px',
                        backgroundColor: p.status === 'PROCESSING' ? 'rgba(200,16,46,0.2)' : 'rgba(0,255,102,0.15)',
                        color: p.status === 'PROCESSING' ? 'var(--red)' : '#00FF66',
                        border: `1px solid ${p.status === 'PROCESSING' ? 'var(--red)' : '#00FF66'}`,
                      }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: AI TELEMETRY ── */}
      {activeTab === 'AI_TELEMETRY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(200,16,46,0.08)', border: '1px solid var(--red)', padding: '1rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
              RAG PIPELINE STATUS: ONLINE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '11px' }}>
              <div>• FAISS VECTOR STORE: <span style={{ color: '#00FF66' }}>100% INDEXED</span></div>
              <div>• GROQ INFERENCE SPEED: <span style={{ color: '#00FF66' }}>285 TOKENS/SEC</span></div>
              <div>• QUERY EXPANSION: <span style={{ color: '#00FF66' }}>ACTIVE</span></div>
              <div>• LLM ENGINE: <span style={{ color: '#00FF66' }}>LLAMA-3.3-70B</span></div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
              MODEL LATENCY BREAKDOWN
            </div>
            {[
              { stage: '1. Query Rewriting & Expansion', latency: '24ms' },
              { stage: '2. FAISS Vector Top-K Retrieval', latency: '12ms' },
              { stage: '3. SentenceTransformer Reranking', latency: '35ms' },
              { stage: '4. Llama 3.3 70B Generation', latency: '180ms' },
            ].map((s) => (
              <div key={s.stage} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>{s.stage}</span>
                <span style={{ color: 'var(--red)' }}>{s.latency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
