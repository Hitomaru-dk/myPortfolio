import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import OnePage from './pages/OnePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import OwnerLoginPage from './pages/OwnerLoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<OnePage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Route>
          {/* Unlisted route — no layout nav */}
          <Route path="/owner-login" element={<OwnerLoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
