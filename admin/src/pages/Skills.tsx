import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Skill } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const { showToast } = useToast();

  const fetchSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast('Failed to load skills', 'error');
      setSkills([]);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName) return;

    try {
      const newSkill = await api.createSkill({
        name: newSkillName,
        category: newSkillCategory
      });
      setSkills(prev => Array.isArray(prev) ? [...prev, newSkill] : [newSkill]);
      setNewSkillName('');
      showToast('Skill added', 'success');
    } catch (err) {
      showToast('Failed to add skill', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      showToast('Skill deleted', 'success');
    } catch (err) {
      showToast('Failed to delete skill', 'error');
    }
  };

  // Safe grouping
  const skillList = Array.isArray(skills) ? skills : [];
  const groupedSkills = skillList.reduce((acc, skill) => {
    if (skill && skill.category) {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
    }
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = ['Languages', 'Backend', 'Frontend', 'Database', 'AI & ML', 'Tools', 'Other'];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Skills</h1>

      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add New Skill</h2>
        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              label="Skill Name" 
              value={newSkillName} 
              onChange={e => setNewSkillName(e.target.value)} 
              placeholder="e.g. React, Python"
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }} className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={newSkillCategory} onChange={e => setNewSkillCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <Button type="submit">Add Skill</Button>
          </div>
        </form>
      </div>

      <div className="grid-2">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px' }}>
              {category}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categorySkills.map(skill => (
                <div key={skill.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  backgroundColor: 'var(--admin-bg)', padding: '4px 12px', 
                  borderRadius: '16px', fontSize: '0.875rem' 
                }}>
                  {skill.name}
                  <button 
                    onClick={() => handleDelete(skill.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--admin-error)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
