import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Achievement } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAchievements();
      setAchievements(data);
    } catch (err) {
      showToast('Failed to load achievements', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await api.deleteAchievement(id);
      showToast('Achievement deleted', 'success');
      setAchievements(achievements.filter(a => a.id !== id));
    } catch (err) {
      showToast('Failed to delete achievement', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Achievements</h1>
        <Button onClick={() => navigate('/achievements/new')}>+ Add Achievement</Button>
      </div>

      {isLoading ? (
        <div>Loading achievements...</div>
      ) : achievements.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Organization</th>
                <th>Date</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td>{a.organization}</td>
                  <td>{a.date ? new Date(a.date).toLocaleDateString() : 'N/A'}</td>
                  <td>{a.visible ? 'Yes' : 'No'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" onClick={() => navigate(`/achievements/${a.id}/edit`)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(a.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState 
          title="No achievements yet" 
          description="Add your first achievement."
          action={<Button onClick={() => navigate('/achievements/new')}>Add Achievement</Button>}
        />
      )}
    </div>
  );
};
