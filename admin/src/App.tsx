import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './auth/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectForm } from './pages/ProjectForm';
import { Certificates } from './pages/Certificates';
import { CertificateForm } from './pages/CertificateForm';
import { Achievements } from './pages/Achievements';
import { AchievementForm } from './pages/AchievementForm';
import { Skills } from './pages/Skills';
import { About } from './pages/About';
import { Settings } from './pages/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:id/edit" element={<ProjectForm />} />
          
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/certificates/new" element={<CertificateForm />} />
          <Route path="/certificates/:id/edit" element={<CertificateForm />} />
          
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/achievements/new" element={<AchievementForm />} />
          <Route path="/achievements/:id/edit" element={<AchievementForm />} />
          
          <Route path="/skills" element={<Skills />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
