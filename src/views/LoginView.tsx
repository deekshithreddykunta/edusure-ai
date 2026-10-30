import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { demoProfiles } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Building2,
  Landmark,
  Scale,
  GraduationCap,
  QrCode,
  Sliders,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('institution');
  const [email, setEmail] = useState(demoProfiles.institution.email);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const personas = [
    {
      role: 'institution' as UserRole,
      title: 'Institution Administrator',
      org: 'Apex Institute of Technology',
      desc: 'Upload student batches, manage approved intake & fix errors',
      icon: <Building2 className="w-5 h-5 text-brand-400" />,
      color: 'from-blue-600/30 to-indigo-600/10 border-blue-500/40',
      badge: 'College Portal',
    },
    {
      role: 'aicte' as UserRole,
      title: 'AICTE National Oversight',
      org: 'AICTE HQ, New Delhi',
      desc: 'Pan-India capacity monitoring, regional heatmaps & rule engine',
      icon: <Landmark className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-600/30 to-orange-600/10 border-amber-500/40',
      badge: 'Central Council',
    },
    {
      role: 'compliance' as UserRole,
      title: 'Compliance Reviewer',
      org: 'Western Regional Vigilance',
      desc: 'Investigate intake breaches, dual enrolments & explainable AI cases',
      icon: <Scale className="w-5 h-5 text-rose-400" />,
      color: 'from-rose-600/30 to-pink-600/10 border-rose-500/40',
      badge: 'Review Desk',
    },
    {
      role: 'student' as UserRole,
      title: 'Student Identity Portal',
      org: 'Aarav Sharma (APAAR 9823)',
      desc: 'Digital academic passport, ABC credit ledger & consent manager',
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-600/30 to-teal-600/10 border-emerald-500/40',
      badge: 'APAAR Card',
    },
    {
      role: 'verifier' as UserRole,
      title: 'Authorised External Verifier',
      org: 'Tata Consultancy Services',
      desc: 'Zero-knowledge QR verification & privacy-safe credential claims',
      icon: <QrCode className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-600/30 to-indigo-600/10 border-purple-500/40',
      badge: 'Public Verifier',
    },
    {
      role: 'admin' as UserRole,
      title: 'Security & Platform Admin',
      org: 'NeGD Gov-Cloud Division',
      desc: 'RBAC boundaries, immutable audit logs & synthetic test engine',
      icon: <Sliders className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-600/30 to-blue-600/10 border-cyan-500/40',
      badge: 'System Governance',
    },
  ];

  const handleSelectPersona = (roleKey: UserRole) => {
    setSelectedRole(roleKey);
    setEmail(demoProfiles[roleKey].email);
    setPassword('••••••••••••');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
      });
      login(selectedRole);
    }, 600);
  };

  const activePersona = demoProfiles[selectedRole];

  return (
    <div className="min-h-screen bg-mesh-dark flex flex-col justify-between text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Gov-Tech Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 py-2 text-xs flex flex-wrap items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-slate-200">
            Ministry of Education • All India Council for Technical Education (AICTE)
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">
            Academic Bank of Credits (ABC) & APAAR Core
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-400">
          <span>SECURE TLS 1.3 • DPDP ACT COMPLIANT</span>
        </div>
      </div>

      {/* Main Login Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-center">
        {/* Brand Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Smart India Hackathon (SIH) Prototype
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            EduSure <span className="animate-gradient-text font-black">AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            APAAR-Based Academic Identity, Student Data Validation & Regulatory Intelligence Platform
          </p>
        </div>

        {/* Two-Column Grid: Persona Switcher + Sign-in Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Persona Switcher (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-brand-400" />
                Select Role Persona to Sign In:
              </h2>
              <span className="text-[11px] text-brand-400 font-mono">1-Click Fast Auth Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {personas.map((p) => {
                const isSelected = selectedRole === p.role;
                return (
                  <div
                    key={p.role}
                    onClick={() => handleSelectPersona(p.role)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left relative overflow-hidden ${
                      isSelected
                        ? `bg-slate-900/90 border-brand-400 ring-2 ring-brand-500/40 shadow-xl ${p.color}`
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-400" />
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                        {p.icon}
                      </div>
                      <div className="space-y-0.5 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-white leading-tight">{p.title}</h3>
                        </div>
                        <div className="text-[11px] font-semibold text-brand-300 truncate">
                          {p.org}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed pt-0.5">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Secure Login Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 relative overflow-hidden">
              {/* Top ambient glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-brand-400" />
                    Authorized Access
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Signing in as <strong className="text-brand-300">{activePersona.name}</strong>
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand-600/30 border border-brand-400/30 flex items-center justify-center font-bold text-xs text-brand-300">
                  {activePersona.avatarInitials}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Government Email / APAAR Registered ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Security Credentials / Token Pass
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Designation:</span>
                    <span className="font-semibold text-slate-200">{activePersona.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Clearance:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {activePersona.securityClearance}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Platform as {activePersona.role.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        EduSure AI • Government of India Academic Integrity Network • Synthetic Safeguards Enabled
      </div>
    </div>
  );
};
