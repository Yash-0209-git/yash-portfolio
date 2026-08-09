import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { About as AboutType } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const About: React.FC = () => {
  const [about, setAbout] = useState<AboutType>({
    name: 'C Yashwanth',
    role: 'AI Full Stack Developer',
    tagline: 'Ideas, engineered into reality.',
    bio: 'An AI/ML-focused developer who enjoys building practical, intelligent software that solves real-world problems.',
    profile_photo_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await api.getAbout();
        if (data) {
          setAbout({
            name: data.name || 'C Yashwanth',
            role: data.role || '',
            tagline: data.tagline || '',
            bio: data.bio || '',
            profile_photo_url: data.profile_photo_url || ''
          });
        }
      } catch (err) {
        showToast('Failed to load about info', 'error');
      }
    };
    fetchAbout();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.updateAbout(about);
      showToast('About section updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update about info', 'error');
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
      setAbout(prev => ({ ...prev, profile_photo_url: res.url }));
      showToast('Photo uploaded successfully', 'success');
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>About Me</h1>
      
      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Profile Photo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {about.profile_photo_url && (
                <img 
                  src={about.profile_photo_url} 
                  alt="Profile" 
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} 
                />
              )}
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              {isUploading && <span>Uploading...</span>}
            </div>
          </div>

          <Input 
            label="Name" 
            value={about.name || ''} 
            onChange={e => setAbout({...about, name: e.target.value})} 
            placeholder="e.g. C Yashwanth"
            required
          />

          <Input 
            label="Role" 
            value={about.role || ''} 
            onChange={e => setAbout({...about, role: e.target.value})} 
            placeholder="e.g. AI Full Stack Developer"
            required
          />
          
          <Input 
            label="Tagline" 
            value={about.tagline || ''} 
            onChange={e => setAbout({...about, tagline: e.target.value})} 
            placeholder="A short catchy phrase"
            required
          />

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea 
              className="form-textarea"
              value={about.bio || ''}
              onChange={e => setAbout({...about, bio: e.target.value})}
              placeholder="Detailed biography..."
              required
              rows={6}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};
