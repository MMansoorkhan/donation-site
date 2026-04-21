// ============================================================
// APP - Root component with routing
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DonorDashboard from './pages/DonorDashboard';
import CollectorDashboard from './pages/CollectorDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />

          {/* Protected routes (auth check inside each component) */}
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/dashboard/collector" element={<CollectorDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
