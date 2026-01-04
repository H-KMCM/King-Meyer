
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DoctrinePage from './pages/DoctrinePage';
import VerticalsPage from './pages/VerticalsPage';
import SolvencyPage from './pages/SolvencyPage';
import InquiryPage from './pages/InquiryPage';
import InstitutionalAccessPage from './pages/InstitutionalAccessPage';
import IntelligenceThesesPage from './pages/IntelligenceThesesPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { SiteProvider } from './context/SiteContext';

function App() {
  return (
    <SiteProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/the-doctrine" element={<DoctrinePage />} />
          <Route path="/verticals" element={<VerticalsPage />} />
          <Route path="/solvency" element={<SolvencyPage />} />
          <Route path="/institutional-access" element={<InstitutionalAccessPage />} />
          <Route path="/intelligence-theses" element={<IntelligenceThesesPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </SiteProvider>
  );
}

export default App;