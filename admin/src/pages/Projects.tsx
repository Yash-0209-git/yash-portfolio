import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Project } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      showToast('Failed to load projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      showToast('Project deleted', 'success');
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      showToast('Failed to delete project', 'error');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Projects</h1>
        <Button onClick={() => navigate('/projects/new')}>+ Add Project</Button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input 
          type="text" 
          placeholder="Search projects..." 
          className="form-input" 
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div>Loading projects...</div>
      ) : filteredProjects.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Year</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.category}</td>
                  <td>{p.year}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      backgroundColor: p.status === 'Completed' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(200, 16, 46, 0.1)',
                      color: p.status === 'Completed' ? 'var(--admin-success)' : 'var(--admin-red)'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td>{p.published ? 'Yes' : 'No'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" onClick={() => navigate(`/projects/${p.id}/edit`)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState 
          title="No projects found" 
          description={search ? "No projects match your search." : "You haven't added any projects yet."}
          action={!search && <Button onClick={() => navigate('/projects/new')}>Add Your First Project</Button>}
        />
      )}
    </div>
  );
};
