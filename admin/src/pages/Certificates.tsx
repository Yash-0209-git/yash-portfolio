import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Certificate } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

export const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCertificates();
      setCertificates(data);
    } catch (err) {
      showToast('Failed to load certificates', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await api.deleteCertificate(id);
      showToast('Certificate deleted', 'success');
      setCertificates(certificates.filter(c => c.id !== id));
    } catch (err) {
      showToast('Failed to delete certificate', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Certificates</h1>
        <Button onClick={() => navigate('/certificates/new')}>+ Add Certificate</Button>
      </div>

      {isLoading ? (
        <div>Loading certificates...</div>
      ) : certificates.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Issuer</th>
                <th>Date</th>
                <th>Category</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.issuer}</td>
                  <td>{c.issue_date ? new Date(c.issue_date).toLocaleDateString() : 'N/A'}</td>
                  <td>{c.category}</td>
                  <td>{c.visible ? 'Yes' : 'No'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" onClick={() => navigate(`/certificates/${c.id}/edit`)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(c.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState 
          title="No certificates yet" 
          description="Add your first certificate to showcase your skills."
          action={<Button onClick={() => navigate('/certificates/new')}>Add Certificate</Button>}
        />
      )}
    </div>
  );
};
