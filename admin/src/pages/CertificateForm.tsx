import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useNavigate, useParams } from 'react-router-dom';

export const CertificateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    verification_url: '',
    category: '',
    image: '',
    visible: true,
    display_order: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchCertificate = async () => {
        try {
          const data = await api.getCertificate(id!);
          // Ensure date is in YYYY-MM-DD format for input type="date"
          const formattedDate = data.issue_date ? new Date(data.issue_date).toISOString().split('T')[0] : '';
          setFormData({ ...data, issue_date: formattedDate });
        } catch (err) {
          showToast('Failed to load certificate', 'error');
          navigate('/certificates');
        }
      };
      fetchCertificate();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.updateCertificate(id!, formData);
        showToast('Certificate updated', 'success');
      } else {
        await api.createCertificate(formData);
        showToast('Certificate created', 'success');
      }
      navigate('/certificates');
    } catch (err) {
      showToast('Failed to save certificate', 'error');
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
      setFormData(prev => ({ ...prev, image: res.url }));
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
          {isEdit ? 'Edit Certificate' : 'Add Certificate'}
        </h1>
        <Button variant="secondary" onClick={() => navigate('/certificates')}>Cancel</Button>
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
              label="Issuer" 
              value={formData.issuer} 
              onChange={e => setFormData({...formData, issuer: e.target.value})} 
            />
            <Input 
              label="Issue Date" 
              type="date"
              value={formData.issue_date} 
              onChange={e => setFormData({...formData, issue_date: e.target.value})} 
            />
            <Input 
              label="Category" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
            />
            <Input 
              label="Credential ID" 
              value={formData.credential_id} 
              onChange={e => setFormData({...formData, credential_id: e.target.value})} 
            />
            <Input 
              label="Verification URL" 
              type="url"
              value={formData.verification_url} 
              onChange={e => setFormData({...formData, verification_url: e.target.value})} 
            />
            <Input 
              label="Display Order" 
              type="number"
              value={formData.display_order} 
              onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} 
            />
          </div>

          <div style={{ margin: '24px 0' }}>
            <label className="form-label">Certificate Image</label>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              {formData.image && (
                <img src={formData.image} alt="Certificate" style={{ width: '150px', objectFit: 'contain', border: '1px solid var(--admin-border)' }} />
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
            {isLoading ? 'Saving...' : 'Save Certificate'}
          </Button>
        </form>
      </div>
    </div>
  );
};
