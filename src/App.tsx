import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { ChatView } from './components/ChatView';
import { AcademicWorkBuilder } from './components/AcademicWorkBuilder';
import { AcademicToolsView } from './components/AcademicToolsView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { HelpSupportView } from './components/HelpSupportView';
import { TermsPrivacyView } from './components/TermsPrivacyView';
import { RudderNav } from './components/RudderNav';
import { AuthModal } from './components/AuthModal';
import { PlansAndPaymentModal } from './components/PlansAndPaymentModal';
import { ToastContainer } from './components/ToastContainer';
import { PendingVerificationBanner } from './components/PendingVerificationBanner';

const MainAppContent: React.FC = () => {
  const { currentView, user } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return user ? <DashboardView /> : <LandingView />;
      case 'chat':
        return <ChatView />;
      case 'documents':
        return <AcademicWorkBuilder />;
      case 'tools':
        return <AcademicToolsView />;
      case 'plans':
        return <LandingView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'help':
        return <HelpSupportView />;
      case 'terms':
        return <TermsPrivacyView type="terms" />;
      case 'privacy':
        return <TermsPrivacyView type="privacy" />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors">
      <PendingVerificationBanner />
      <Navbar />

      <main className="flex-1 pb-20 sm:pb-24">
        {renderCurrentView()}
      </main>

      {/* Rudder Bottom Navigation Dock */}
      <RudderNav />

      {currentView !== 'chat' && <Footer />}

      <AuthModal />
      <PlansAndPaymentModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
