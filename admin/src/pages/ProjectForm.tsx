import React, { useEffect, useState, KeyboardEvent } from 'react';
import { api } from '../api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useNavigate, useParams } from 'react-router-dom';

export const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Web Development',
    year: new Date().getFullYear(),
    status: 'Completed',
    short_description: '',
    github_url: '',
    live_url: '',
    technologies: [] as string[],
    thumbnail: '',
    featured: false,
    published: false,
    display_order: 0
  });
  
  const [techInput, setTechInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProject = async () => {
        try {
          const data = await api.getProject(id!);
          setFormData(data);
        } catch (err) {
          showToast('Failed to load project', 'error');
          navigate('/projects');
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title, slug });
  };

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData({
          ...formData,
          technologies: [...formData.technologies, techInput.trim()]
        });
      }
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.updateProject(id!, formData);
        showToast('Project updated', 'success');
      } else {
        await api.createProject(formData);
        showToast('Project created', 'success');
      }
      navigate('/projects');
    } catch (err) {
      showToast('Failed to save project', 'error');
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
      setFormData(prev => ({ ...prev, thumbnail: res.url }));
      showToast('Thumbnail uploaded', 'success');
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
          {isEdit ? 'Edit Project' : 'Add Project'}
        </h1>
        <Button variant="secondary" onClick={() => navigate('/projects')}>Cancel</Button>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <Input 
              label="Title *" 
              value={formData.title} 
              onChange={handleTitleChange} 
              required
            />
            <Input 
              label="Slug *" 
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: e.target.value})} 
              required
            />
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-select" 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>

            <Input 
              label="Year" 
              type="number"
              value={formData.year} 
              onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} 
            />
            <Input 
              label="Display Order" 
              type="number"
              value={formData.display_order} 
              onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea 
              className="form-textarea"
              value={formData.short_description}
              onChange={e => setFormData({...formData, short_description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid-2">
            <Input 
              label="GitHub URL" 
              type="url"
              value={formData.github_url} 
              onChange={e => setFormData({...formData, github_url: e.target.value})} 
            />
            <Input 
              label="Live URL" 
              type="url"
              value={formData.live_url} 
              onChange={e => setFormData({...formData, live_url: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Technologies (Press Enter to add)</label>
            <input 
              type="text" 
              className="form-input" 
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={handleTechKeyDown}
              placeholder="e.g. React, Node.js"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {formData.technologies.map(tech => (
                <div key={tech} style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', 
                  backgroundColor: 'var(--admin-bg)', padding: '4px 12px', 
                  borderRadius: '16px', fontSize: '0.875rem' 
                }}>
                  {tech}
                  <button 
                    type="button"
                    onClick={() => removeTech(tech)}
                    style={{ background: 'none', border: 'none', color: 'var(--admin-error)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ margin: '24px 0' }}>
            <label className="form-label">Thumbnail Image</label>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              {formData.thumbnail && (
                <img src={formData.thumbnail} alt="Thumbnail" style={{ width: '160px', height: '90px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
              )}
              <div>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                {isUploading && <span style={{ marginLeft: '8px' }}>Uploading...</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div className="form-group checkbox-group" style={{ marginBottom: 0 }}>
              <input 
                type="checkbox" 
                id="featured"
                checked={formData.featured} 
                onChange={e => setFormData({...formData, featured: e.target.checked})} 
              />
              <label htmlFor="featured" style={{ margin: 0, fontWeight: 500 }}>Featured Project</label>
            </div>
            
            <div className="form-group checkbox-group" style={{ marginBottom: 0 }}>
              <input 
                type="checkbox" 
                id="published"
                checked={formData.published} 
                onChange={e => setFormData({...formData, published: e.target.checked})} 
              />
              <label htmlFor="published" style={{ margin: 0, fontWeight: 500 }}>Published</label>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Project'}
          </Button>
        </form>
      </div>
    </div>
  );
};
