import React, { useEffect, useState, useRef } from 'react';
import { fetchSettings } from '../../api';
import { Settings } from '../../types';
import { useReveal } from '../../hooks/useReveal';
import { playBeep, playTransmissionSound } from '../../utils/audio';

const FALLBACK: Settings = {
  email: 'yashwanth02092006@gmail.com',
  github_url: 'https://github.com/Yash-0209-git',
  linkedin_url: 'https://www.linkedin.com/in/yashwanth-c-918a53317',
  instagram_handle: 'yashhwanth__',
  resume_url: undefined,
};

const Contact: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(FALLBACK);
  const [headingRef, headingVisible] = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const [linksRef, linksVisible] = useReveal<HTMLDivElement>({ threshold: 0.1, delay: 200 });
  const [cmdInput, setCmdInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '> TERMINAL DISPATCH ONLINE',
    '> TYPE "help" OR CLICK COMMAND CHIPS BELOW',
  ]);
  const bigTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) {
        setSettings({
          email:            data.email            || FALLBACK.email,
          github_url:       data.github_url       || FALLBACK.github_url,
          linkedin_url:     data.linkedin_url     || FALLBACK.linkedin_url,
          instagram_handle: data.instagram_handle || FALLBACK.instagram_handle,
          resume_url:       data.resume_url       || FALLBACK.resume_url,
        });
      }
    });
  }, []);

  const emailVal    = settings.email || FALLBACK.email!;
  const githubVal   = settings.github_url || FALLBACK.github_url!;
  const linkedinVal = settings.linkedin_url || FALLBACK.linkedin_url!;
  const rawInsta    = settings.instagram_handle || FALLBACK.instagram_handle!;
  const instaVal    = rawInsta.replace('@', '');

  const links = [
    { label: 'EMAIL',     value: emailVal,                                         href: `https://mail.google.com/mail/?view=cm&fs=1&to=${emailVal}` },
    { label: 'GITHUB',    value: githubVal.replace('https://', '').replace('www.', ''),   href: githubVal },
    { label: 'LINKEDIN',  value: linkedinVal.replace('https://', '').replace('www.', ''), href: linkedinVal },
    { label: 'INSTAGRAM', value: `@${instaVal}`,                                  href: `https://instagram.com/${instaVal}` },
  ];

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    playBeep(600, 0.05);

    let response = '';

    if (cleanCmd.includes('send_email') || cleanCmd === 'email' || cleanCmd === 'mail') {
      response = `[200 OK] DISPATCHING GMAIL WEB COMPOSE → ${emailVal}`;
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailVal}`, '_blank');
    } else if (cleanCmd.includes('fetch_resume') || cleanCmd === 'resume') {
      if (settings.resume_url) {
        response = `[200 OK] OPENING RESUME DOCUMENT...`;
        window.open(settings.resume_url, '_blank');
      } else {
        response = `[200 OK] RESUME REQUESTED → EMAIL yashwanth02092006@gmail.com FOR DIRECT PDF`;
      }
    } else if (cleanCmd.includes('ping_server') || cleanCmd === 'ping') {
      playTransmissionSound();
      response = `[PING] 127.0.0.1 — LATENCY: 0.34ms — TRANSMISSION: OPTIMAL`;
    } else if (cleanCmd === 'github') {
      response = `[200 OK] NAVIGATING TO GITHUB...`;
      window.open(githubVal, '_blank');
    } else if (cleanCmd === 'clear') {
      setTerminalLogs(['> TERMINAL DISPATCH CLEARED']);
      setCmdInput('');
      return;
    } else if (cleanCmd === 'help') {
      response = `AVAILABLE COMMANDS: send_email, fetch_resume, ping_server, github, clear`;
    } else if (cleanCmd.length > 0) {
      response = `[404 UNKNOWN COMMAND: "${cleanCmd}"] TYPE "help" FOR AVAILABLE COMMANDS.`;
    }

    if (response) {
      setTerminalLogs(prev => [...prev, `> ${cmd}`, response]);
    }
    setCmdInput('');
  };

  return (
    <section id="contact" style={{ backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.2), transparent)' }} />

      {/* Giant BG text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-0.08em',
          right: '-0.04em',
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(180px, 22vw, 380px)',
          color: 'rgba(200,16,46,0.022)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        06
      </div>

      <div
        className="section-container"
        style={{ justifyContent: 'center', paddingBottom: '7rem', position: 'relative', zIndex: 1 }}
      >
        {/* Signal label + heading */}
        <div ref={headingRef} className={`reveal${headingVisible ? ' visible' : ''}`} style={{ marginBottom: '4rem' }}>
          <div
            className="font-mono"
            style={{ fontSize: '10px', color: 'rgba(200,16,46,0.35)', letterSpacing: '0.35em', marginBottom: '2.5rem' }}
          >
            SIGNAL 06 / CONTACT
          </div>

          <div style={{ position: 'relative' }}>
            {/* Ghost red echo of heading */}
            <h2
              aria-hidden="true"
              ref={bigTextRef}
              className="font-bebas"
              style={{
                position: 'absolute',
                top: '4px',
                left: '3px',
                fontSize: 'clamp(52px, 8vw, 100px)',
                color: 'rgba(200,16,46,0.08)',
                lineHeight: 0.95,
                margin: 0,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              LET'S BUILD<br />SOMETHING REAL.
            </h2>
            <h2
              className="font-bebas"
              style={{
                fontSize: 'clamp(52px, 8vw, 100px)',
                color: 'var(--text-primary)',
                lineHeight: 0.95,
                margin: 0,
                position: 'relative',
              }}
            >
              LET'S BUILD
            </h2>
            <h2
              className="font-bebas"
              style={{
                fontSize: 'clamp(52px, 8vw, 100px)',
                color: 'var(--red)',
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              SOMETHING REAL.
            </h2>
          </div>
        </div>

        {/* Red divider */}
        <div
          style={{
            width: headingVisible ? '56px' : '0px',
            height: '2px',
            backgroundColor: 'var(--red)',
            marginBottom: '3rem',
            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1) 0.4s',
            boxShadow: '0 0 12px rgba(200,16,46,0.3)',
          }}
        />

        {/* Contact links */}
        <div
          ref={linksRef}
          className={`reveal${linksVisible ? ' visible' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {links.map((link, idx) => (
            <ContactLink key={link.label} label={link.label} value={link.value} href={link.href} delay={idx * 80} />
          ))}
        </div>

        {/* Phase 6 — Interactive Terminal Dispatch Box */}
        <div
          style={{
            backgroundColor: 'rgba(8,8,8,0.85)',
            border: '1px solid rgba(200,16,46,0.25)',
            borderRadius: '6px',
            padding: '1.5rem',
            maxWidth: '680px',
            marginBottom: '4rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '10px',
              color: 'var(--red)',
              letterSpacing: '0.2em',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--red)' }} />
            TERMINAL DISPATCH // INTERACTIVE COMMAND LINE
          </div>

          {/* Quick Action Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {[
              { label: '> send_email', cmd: 'send_email' },
              { label: '> fetch_resume', cmd: 'fetch_resume' },
              { label: '> ping_server', cmd: 'ping_server' },
              { label: '> clear', cmd: 'clear' },
            ].map(chip => (
              <button
                key={chip.cmd}
                data-cursor="pointer"
                onClick={() => handleCommand(chip.cmd)}
                className="font-mono"
                style={{
                  fontSize: '9px',
                  backgroundColor: 'rgba(200,16,46,0.08)',
                  border: '1px solid rgba(200,16,46,0.25)',
                  color: 'var(--text-primary)',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,16,46,0.2)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,16,46,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,16,46,0.25)';
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Log Window */}
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '0.85rem 1rem',
              borderRadius: '4px',
              maxHeight: '130px',
              overflowY: 'auto',
              marginBottom: '1rem',
            }}
          >
            {terminalLogs.map((log, i) => (
              <div
                key={i}
                className="font-mono"
                style={{
                  fontSize: '10px',
                  color: log.startsWith('>') ? 'rgba(200,16,46,0.85)' : 'rgba(237,235,230,0.6)',
                  lineHeight: 1.6,
                  letterSpacing: '0.05em',
                }}
              >
                {log}
              </div>
            ))}
          </div>

          {/* Command Input Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleCommand(cmdInput);
            }}
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <span className="font-mono" style={{ fontSize: '12px', color: 'var(--red)', alignSelf: 'center' }}>
              &gt;
            </span>
            <input
              type="text"
              value={cmdInput}
              onChange={e => setCmdInput(e.target.value)}
              placeholder="type command (e.g. email, resume, ping)..."
              className="font-mono"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(200,16,46,0.3)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                padding: '0.4rem 0.2rem',
                outline: 'none',
                letterSpacing: '0.05em',
              }}
            />
            <button
              type="submit"
              data-cursor="pointer"
              className="font-mono"
              style={{
                backgroundColor: 'var(--red)',
                border: 'none',
                color: 'white',
                padding: '0.4rem 1rem',
                fontSize: '10px',
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >
              RUN
            </button>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em' }}>
            © 2026 C Yashwanth
          </span>
          <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(200,16,46,0.2)', letterSpacing: '0.15em' }}>
            ALL SIGNALS RECEIVED.
          </span>
        </div>
      </div>
    </section>
  );
};

interface LinkProps {
  label: string;
  value: string;
  href: string;
  delay: number;
}

const ContactLink: React.FC<LinkProps> = ({ label, value, href, delay }) => {
  const [ref, visible] = useReveal<HTMLAnchorElement>({ threshold: 0.05, delay });
  const [hovered, setHovered] = useState(false);

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      data-cursor="open"
      className={`reveal${visible ? ' visible' : ''}`}
      onMouseEnter={() => {
        setHovered(true);
        playBeep(520, 0.04, 0.02);
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        textDecoration: 'none',
        borderBottom: `1px solid ${hovered ? 'rgba(200,16,46,0.4)' : 'rgba(255,255,255,0.06)'}`,
        paddingBottom: '1rem',
        transition: 'border-color 0.25s ease',
        transitionDelay: `${delay}ms`,
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: '8px',
          color: hovered ? 'var(--red)' : 'rgba(200,16,46,0.3)',
          letterSpacing: '0.25em',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </span>
      <span
        className="font-inter"
        style={{
          fontSize: '12px',
          color: hovered ? 'var(--text-primary)' : 'rgba(237,235,230,0.45)',
          transition: 'color 0.2s ease',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </span>
    </a>
  );
};

export default Contact;
