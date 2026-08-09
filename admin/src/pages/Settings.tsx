import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Settings as SettingsType } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType>({ 
    email: 'yashwanth02092006@gmail.com', 
    github_url: 'https://github.com/Yash-0209-git', 
    linkedin_url: 'https://www.linkedin.com/in/yashwanth-c-918a53317', 
    instagram_handle: 'yashhwanth__', 
    resume_url: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        if (data) {
          setSettings({
            email: data.email || 'yashwanth02092006@gmail.com',
            github_url: data.github_url || 'https://github.com/Yash-0209-git',
            linkedin_url: data.linkedin_url || 'https://www.linkedin.com/in/yashwanth-c-918a53317',
            instagram_handle: data.instagram_handle || 'yashhwanth__',
            resume_url: data.resume_url || ''
          });
        }
      } catch (err) {
        showToast('Failed to load settings', 'error');
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.updateSettings(settings);
      showToast('Settings updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update settings', 'error');
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
      setSettings(prev => ({ ...prev, resume_url: res.url }));
      showToast('Resume uploaded successfully', 'success');
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Settings & Contact Links</h1>
      
      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email Address" 
            type="email"
            value={settings.email || ''} 
            onChange={e => setSettings({...settings, email: e.target.value})} 
            required
          />
          
          <Input 
            label="GitHub URL" 
            type="url"
            value={settings.github_url || ''} 
            onChange={e => setSettings({...settings, github_url: e.target.value})} 
          />

          <Input 
            label="LinkedIn URL" 
            type="url"
            value={settings.linkedin_url || ''} 
            onChange={e => setSettings({...settings, linkedin_url: e.target.value})} 
          />

          <Input 
            label="Instagram Handle" 
            value={settings.instagram_handle || ''} 
            onChange={e => setSettings({...settings, instagram_handle: e.target.value})} 
            placeholder="yashhwanth__"
          />

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Resume (PDF)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} disabled={isUploading} />
              {isUploading && <span>Uploading...</span>}
            </div>
            {settings.resume_url && (
              <div style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                Current file: <a href={settings.resume_url} target="_blank" rel="noreferrer">{settings.resume_url.split('/').pop()}</a>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </div>
    </div>
  );
};
