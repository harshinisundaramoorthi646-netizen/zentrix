import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/authContext';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { Toast } from './components/common/Toast';
import { Toaster } from 'react-hot-toast';

// Component Views
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeamADashboard } from './components/dashboard/TeamADashboard';
import { TeamBDashboard } from './components/dashboard/TeamBDashboard';
import { LeadManagement } from './components/leads/LeadManagement';
import { TeamManagement } from './components/teams/TeamManagement';
import { ContributionTracker } from './components/teams/ContributionTracker';
import { CommissionTracker } from './components/commission/CommissionTracker';
import { BillingRevenue } from './components/billing/BillingRevenue';
import { ClientManagement } from './components/clients/ClientManagement';
import { ProjectManagement } from './components/projects/ProjectManagement';
import { TaskKanban } from './components/tasks/TaskKanban';
import { TimeTrackerWidget } from './components/timetracker/TimeTrackerWidget';
import { ReportsAnalytics } from './components/analytics/ReportsAnalytics';
import { AiIntelligenceLayer } from './components/ai/AiIntelligenceLayer';
import { AuditLogViewer } from './components/settings/AuditLogViewer';
import { SettingsPage } from './components/settings/SettingsPage';
import { ShieldAlert } from 'lucide-react';

const AccessDeniedView: React.FC<{ role: string | null }> = ({ role }) => {
  const { setActiveSection } = useAuth();
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#0D1118] border border-red-500/20 text-center space-y-4 max-w-xl mx-auto my-12 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-white">Access Denied</h2>
      <p className="text-sm text-[#9BA7B7]">
        Your role <strong className="text-[#38E8FF] uppercase">({role || 'User'})</strong> does not have permission to view this section.
      </p>
      <button
        onClick={() => setActiveSection(role === 'TEAM_A' ? 'Lead Journey' : role === 'TEAM_B' ? 'Follow-ups' : 'Overview')}
        className="py-2.5 px-6 rounded-xl bg-[#38E8FF] text-black font-bold text-xs font-mono tracking-wider uppercase hover:bg-[#22d6ed] transition-all"
      >
        Return to My Dashboard
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoadingSession, role, activeSection, toastMessage } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // 1. Session verification loading state
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#05070B] flex flex-col items-center justify-center space-y-4">
        <AnimatedBackground />
        <div className="w-12 h-12 border-4 border-[#38E8FF] border-t-transparent rounded-full animate-spin z-10" />
        <span className="text-xs font-mono text-[#38E8FF] uppercase tracking-widest z-10">Authenticating Session...</span>
      </div>
    );
  }

  // 2. Unauthenticated state: Always render LoginScreen
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <LoginScreen />
        <Toast message={toastMessage} />
      </div>
    );
  }

  // 3. Role-based view renderer
  const renderView = () => {
    switch (activeSection) {
      case 'Overview':
        if (role === 'TEAM_A') return <TeamADashboard />;
        if (role === 'TEAM_B') return <TeamBDashboard />;
        return <AdminDashboard />;

      case 'Lead Journey':
        if (role === 'TEAM_B') return <AccessDeniedView role={role} />;
        return <LeadManagement />;

      case 'Follow-ups':
        if (role === 'TEAM_A') return <AccessDeniedView role={role} />;
        return <TeamBDashboard />;

      case 'Clients':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <ClientManagement />;

      case 'Projects':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <ProjectManagement />;

      case 'Tasks':
        return <TaskKanban />;

      case 'Time Tracker':
        return <TimeTrackerWidget />;

      case 'Team':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <TeamManagement />;

      case 'Contributions':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <ContributionTracker />;

      case 'Commission':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <CommissionTracker />;

      case 'Billing':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <BillingRevenue />;

      case 'Analytics':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <ReportsAnalytics />;

      case 'AI Intelligence':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <AiIntelligenceLayer />;

      case 'Audit Log':
        if (role !== 'ADMIN') return <AccessDeniedView role={role} />;
        return <AuditLogViewer />;

      case 'Settings':
        return <SettingsPage />;

      default:
        if (role === 'TEAM_A') return <TeamADashboard />;
        if (role === 'TEAM_B') return <TeamBDashboard />;
        return <AdminDashboard />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080A0F] text-[#F5F7FA]">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen">
        {/* Navigation Sidebar */}
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main Content Workspace */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
          <Header onOpenCommandPalette={() => setShowCommandPalette(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Global Command Palette & Toast Notifications */}
      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
      <Toast message={toastMessage} />
      <Toaster position="top-right" toastOptions={{ style: { background: '#0D1118', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
