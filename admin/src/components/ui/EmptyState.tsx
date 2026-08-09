import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>{title}</h3>
      <p style={{ color: 'var(--admin-muted)', marginBottom: '24px' }}>{description}</p>
      {action}
    </div>
  );
};
