import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useNavigate, useParams } from 'react-router-dom';

export const AchievementForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    organization: '',
    category: '',
    image_url: '',
    visible: true,
    display_order: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchAchievement = async () => {
        try {
          const data = await api.getAchievement(id!);
          const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
          setFormData({ ...data, date: formattedDate });
        } catch (err) {
          showToast('Failed to load achievement', 'error');
          navigate('/achievements');
        }
      };
      fetchAchievement();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.updateAchievement(id!, formData);
        showToast('Achievement updated', 'success');
      } else {
        await api.createAchievement(formData);
        showToast('Achievement created', 'success');
      }
      navigate('/achievements');
    } catch (err) {
      showToast('Failed to save achievement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadMedia(file);
      setFormData(prev => ({ ...prev, image_url: res.url }));
      showToast('Image uploaded', 'success');
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          {isEdit ? 'Edit Achievement' : 'Add Achievement'}
        </h1>
        <Button variant="secondary" onClick={() => navigate('/achievements')}>Cancel</Button>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <Input 
              label="Title *" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required
            />
            <Input 
              label="Organization" 
              value={formData.organization} 
              onChange={e => setFormData({...formData, organization: e.target.value})} 
            />
            <Input 
              label="Date" 
              type="date"
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})} 
            />
            <Input 
              label="Category" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
            />
            <Input 
              label="Display Order" 
              type="number"
              value={formData.display_order} 
              onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>

          <div style={{ margin: '24px 0' }}>
            <label className="form-label">Image (Optional)</label>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              {formData.image_url && (
                <img src={formData.image_url} alt="Achievement" style={{ width: '150px', objectFit: 'contain', border: '1px solid var(--admin-border)' }} />
              )}
              <div>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                {isUploading && <span style={{ marginLeft: '8px' }}>Uploading...</span>}
              </div>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="visible"
              checked={formData.visible} 
              onChange={e => setFormData({...formData, visible: e.target.checked})} 
            />
            <label htmlFor="visible" style={{ margin: 0, fontWeight: 500 }}>Visible on portfolio</label>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Achievement'}
          </Button>
        </form>
      </div>
    </div>
  );
};
