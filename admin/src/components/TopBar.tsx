import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <header className="topbar">
      <div className="topbar-title">Portfolio Manager</div>
      <div>
        <span style={{ fontSize: '0.875rem', color: 'var(--admin-muted)' }}>Admin Mode</span>
      </div>
    </header>
  );
};
