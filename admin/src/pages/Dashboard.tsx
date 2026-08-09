import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { DashboardStats, Project } from '../types';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await api.getDashboardStats().catch(() => ({
          projects: 0,
          published_projects: 0,
          certificates: 0,
          achievements: 0,
        }));
        setStats(statsData);
        
        const projectsData = await api.getProjects().catch(() => []);
        setRecentProjects(projectsData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data');
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</h1>
      
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ color: 'var(--admin-muted)', fontSize: '0.875rem' }}>Total Projects</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px' }}>{stats?.projects || 0}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--admin-muted)', fontSize: '0.875rem' }}>Published Projects</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px', color: 'var(--admin-success)' }}>{stats?.published_projects || 0}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--admin-muted)', fontSize: '0.875rem' }}>Certificates</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px' }}>{stats?.certificates || 0}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--admin-muted)', fontSize: '0.875rem' }}>Achievements</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px' }}>{stats?.achievements || 0}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <Button onClick={() => navigate('/projects/new')}>+ Add Project</Button>
        <Button variant="secondary" onClick={() => navigate('/certificates/new')}>+ Add Certificate</Button>
        <Button variant="secondary" onClick={() => navigate('/achievements/new')}>+ Add Achievement</Button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Recent Projects</h2>
        {recentProjects.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(p => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.status}</td>
                    <td>{p.published ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--admin-muted)' }}>No projects found.</p>
        )}
      </div>
    </div>
  );
};
