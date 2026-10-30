import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { LoginView } from './views/LoginView';
import { InstitutionView } from './views/InstitutionView';
import { AicteView } from './views/AicteView';
import { ComplianceView } from './views/ComplianceView';
import { StudentView } from './views/StudentView';
import { VerificationView } from './views/VerificationView';
import { AdminView } from './views/AdminView';
import { ShieldCheck, LogOut } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { role, isAuthenticated, logout, currentUser } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-dark flex flex-col text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 animate-fade-in-scale">
        {role === 'institution' && <InstitutionView />}
        {role === 'aicte' && <AicteView />}
        {role === 'compliance' && <ComplianceView />}
        {role === 'student' && <StudentView />}
        {role === 'verifier' && <VerificationView />}
        {role === 'admin' && <AdminView />}
      </main>

      {/* Clean, Role-Isolated Gov-Tech Footer */}
      <footer className="bg-[#080c16] border-t border-slate-900 text-slate-400 text-xs py-7 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200">
                EduSure AI — Smart India Hackathon (SIH) Blueprint
              </div>
              <div className="text-[11px] text-slate-400">
                Logged in as <strong className="text-indigo-400">{currentUser.name}</strong> •{' '}
                {currentUser.organization}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">
              Session Security: <strong className="text-emerald-400 font-mono">TLS 1.3 Active</strong>
            </span>
            <span className="text-slate-800">•</span>
            <button
              onClick={() => logout()}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
