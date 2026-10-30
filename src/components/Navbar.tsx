import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Landmark,
  Scale,
  GraduationCap,
  QrCode,
  Sliders,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface Props {
  currentSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export const Navbar: React.FC<Props> = ({ currentSubTab, onSubTabChange }) => {
  const { role, currentUser, logout, issues, resetDemoData, showToast } = useApp();
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  // Issues relevant to institution or reviewer
  const openIssuesCount = issues.filter((i) => i.status === 'OPEN' || i.status === 'INVESTIGATING').length;

  const getRoleHeaderInfo = () => {
    switch (role) {
      case 'institution':
        return {
          title: 'Institution Administrator Portal',
          badge: 'APEX INSTITUTE OF TECHNOLOGY (1-938210331)',
          badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          icon: <Building2 className="w-5 h-5 text-indigo-400" />,
        };
      case 'aicte':
        return {
          title: 'AICTE National Regulatory Portal',
          badge: 'CENTRAL APPROVALS BUREAU • NEW DELHI',
          badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <Landmark className="w-5 h-5 text-amber-400" />,
        };
      case 'compliance':
        return {
          title: 'Compliance & Anomaly Resolution Desk',
          badge: 'WESTERN REGIONAL VIGILANCE BUREAU',
          badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: <Scale className="w-5 h-5 text-rose-400" />,
        };
      case 'student':
        return {
          title: 'Student Academic Identity Passport',
          badge: 'APAAR ID: 9823-4412-8819 • ABC LINKED',
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
        };
      case 'verifier':
        return {
          title: 'Authorised Academic Verifier Portal',
          badge: 'ZERO-KNOWLEDGE VERIFICATION GATEWAY',
          badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: <QrCode className="w-5 h-5 text-purple-400" />,
        };
      case 'admin':
        return {
          title: 'Platform Governance & Security Portal',
          badge: 'NATIONAL E-GOVERNANCE DIVISION (NeGD)',
          badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: <Sliders className="w-5 h-5 text-cyan-400" />,
        };
    }
  };

  const roleInfo = getRoleHeaderInfo();

  return (
    <header className="sticky top-0 z-40 bg-[#0d1322]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Gov-Tech Ribbon */}
      <div className="bg-[#080c16] px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">
            Ministry of Education • Government of India
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">
            Academic Bank of Credits (ABC) & APAAR Depository System
          </span>
        </div>

        {/* Demo Scenarios for Hackathon Judges */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowScenarioMenu(!showScenarioMenu)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Judge Test Scenarios</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showScenarioMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 text-slate-200 animate-fade-in-scale">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  PRE-CONFIGURED TEST SCENARIOS
                </div>
                <button
                  onClick={() => {
                    resetDemoData('overflow');
                    setShowScenarioMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-amber-300">Intake Capacity Overflow</div>
                    <div className="text-[11px] text-slate-400">Apex Tech CSE at 184/180 seats (Breach)</div>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                </button>
                <button
                  onClick={() => {
                    resetDemoData('duplicates');
                    setShowScenarioMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-rose-300">Cross-Institution Duplicate</div>
                    <div className="text-[11px] text-slate-400">Same APAAR enrolled in two colleges</div>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                </button>
                <button
                  onClick={() => {
                    resetDemoData('clean');
                    setShowScenarioMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-emerald-300">100% Clean Benchmark</div>
                    <div className="text-[11px] text-slate-400">All records verified with zero flags</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    resetDemoData('default');
                    setShowScenarioMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 rounded-xl flex items-center gap-2 text-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset All Data to Default</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Strict Active Role Indicator */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-brand-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/30 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                EduSure <span className="animate-text-shimmer font-black">AI</span>
              </span>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${roleInfo.badgeColor}`}
              >
                {roleInfo.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {roleInfo.title}
            </p>
          </div>
        </div>

        {/* User Profile & Single "Sign Out / Switch Role" Action */}
        <div className="flex items-center gap-3">
          {/* Anomaly Badge only for relevant roles */}
          {(role === 'institution' || role === 'compliance' || role === 'aicte') && openIssuesCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Bell className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>{openIssuesCount} Flagged Anomalies</span>
            </div>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 p-1.5 pl-3 pr-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-xs text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                {currentUser.designation}
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser.avatarInitials}
            </div>

            {/* Strict Sign Out Button */}
            <button
              onClick={() => {
                logout();
                showToast('Signed out. Please select a role to sign in.', 'info');
              }}
              title="Sign Out / Switch Persona"
              className="p-1.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-600/80 transition-all border border-rose-500/20 ml-1 flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
