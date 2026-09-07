import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './lib/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CitySelectorModal } from './components/CitySelectorModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModals } from './components/AuthModals';
import { IdUploadModal } from './components/IdUploadModal';

import { HomePage } from './pages/HomePage';
import { BookEventPage } from './pages/BookEventPage';
import { EventsPage } from './pages/EventsPage';
import { OrganizersPage } from './pages/OrganizersPage';
import { CrewDashboardPage } from './pages/CrewDashboardPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { EditProfileModal } from './components/EditProfileModal';
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
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans antialiased">
      <SEOHead />
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book-event" element={<BookEventPage />} />
            <Route path="/book-event/" element={<BookEventPage />} />
            <Route path="/find-crew" element={<CrewDashboardPage />} />
            <Route path="/find-crew/" element={<CrewDashboardPage />} />
            <Route path="/jobs" element={<EventsPage />} />
            <Route path="/jobs/" element={<EventsPage />} />
            <Route path="/hire-crew" element={<OrganizersPage />} />
            <Route path="/hire-crew/" element={<OrganizersPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/" element={<AdminPage />} />

            {/* Client fallbacks for legacy URLs */}
            <Route path="/events" element={<Navigate to="/jobs" replace />} />
            <Route path="/events/" element={<Navigate to="/jobs" replace />} />
            <Route path="/organizers" element={<Navigate to="/hire-crew" replace />} />
            <Route path="/organizers/" element={<Navigate to="/hire-crew" replace />} />
            <Route path="/crew-dashboard" element={<Navigate to="/find-crew" replace />} />
            <Route path="/crew-dashboard/" element={<Navigate to="/find-crew" replace />} />

            {/* True 404 page instead of redirect loop to homepage */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <Footer />
      <MobileBottomNav />

      {/* Global Modals */}
      <CitySelectorModal />
      <SubscriptionModal />
      <AuthModals />
      <IdUploadModal />
      <EditProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
