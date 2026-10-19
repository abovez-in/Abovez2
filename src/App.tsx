import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WaferCartProvider } from './context/WaferCartContext';
import { api } from './lib/api';
import { WaferNavbar } from './components/WaferNavbar';
import { WaferFooter } from './components/WaferFooter';
import { WaferCartDrawer } from './components/WaferCartDrawer';
import { FloatingWhatsAppBtn } from './components/FloatingWhatsAppBtn';
import { WaferStorePage } from './pages/WaferStorePage';
import { SEOHead } from './components/SEOHead';

const MainContent: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Record page view / click in database analytics
    api.trackWebsiteClick(location.pathname, user);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-amber-950">
      <SEOHead />
      <div>
        <WaferNavbar />
        <main>
          <Routes>
            <Route path="/" element={<WaferStorePage />} />
            <Route path="/wafers" element={<WaferStorePage />} />
            <Route path="/long-kela-wafers" element={<WaferStorePage />} />
            <Route path="/round-kela-wafers" element={<WaferStorePage />} />
            <Route path="/wholesale" element={<WaferStorePage />} />
            
            {/* Any other routes smoothly show the store page */}
            <Route path="*" element={<WaferStorePage />} />
          </Routes>
        </main>
      </div>

      <WaferFooter />
      
      {/* Global Interactive Wafer Drawers & Floating WhatsApp Button */}
      <WaferCartDrawer />
      <FloatingWhatsAppBtn />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WaferCartProvider>
          <MainContent />
        </WaferCartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
