import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Sliders,
  History,
  Lock,
  Database,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Server,
  Key,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { auditLogs, resetDemoData, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'audit' | 'rbac' | 'synthetic'>('audit');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              SECURITY & ACCESS CONTROL
            </span>
            <span className="text-slate-400 text-xs">Platform Governance & Compliance Trails</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-400" />
            Platform & Security Administration
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Role-based access boundaries, immutable audit logs, cryptographic credential keys, and synthetic demo harness
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>PostgreSQL Synced • Uptime 99.98%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'audit'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>System Audit Log Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'rbac'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>RBAC Matrix & Data Isolation</span>
        </button>

        <button
          onClick={() => setActiveTab('synthetic')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'synthetic'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Synthetic Data & Safeguards</span>
        </button>
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter logs by action, actor, target or details..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              />
            </div>
            <span className="text-xs text-slate-500">{filteredLogs.length} events logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor & Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-900">{log.actor}</div>
                      <div className="text-[10px] text-slate-500">{log.role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-800">{log.target}</td>
                    <td className="py-3 px-4 font-sans text-slate-600 max-w-sm">{log.details}</td>
                    <td className="py-3 px-4">
                      {log.status === 'SUCCESS' ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          SUCCESS
                        </span>
                      ) : log.status === 'WARNING' ? (
                        <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                          WARNING
                        </span>
                      ) : (
                        <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[10px]">
                          ALERT
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Role-Based Access Control (RBAC) Enforcement</h3>
            <p className="text-xs text-slate-500">
              Institutional boundaries ensure colleges can never access each other's private data, and external verifiers receive zero-knowledge claims.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Platform Role</th>
                  <th className="py-3 px-4">Upload Records</th>
                  <th className="py-3 px-4">Cross-Institution View</th>
                  <th className="py-3 px-4">Resolve Compliance Cases</th>
                  <th className="py-3 px-4">Modify Rules</th>
                  <th className="py-3 px-4">Raw APAAR Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Institution Administrator</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Yes (Own College)</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-slate-500">Respond Only</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Own Students</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">AICTE National Admin</td>
                  <td className="py-3 px-4 text-slate-400">View Aggregated</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">National Scope</td>
                  <td className="py-3 px-4 text-slate-500">Oversee</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Authorized</td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">Masked / Audited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Compliance Reviewer</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Flagged Cases Only</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Authorized (Decide)</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">Masked</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Student</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Own Profile</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">External Verifier</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Denied</td>
                  <td className="py-3 px-4 text-rose-500 font-semibold">Redacted (ZK Claim)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Synthetic Data & Safeguards */}
      {activeTab === 'synthetic' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5 max-w-2xl">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Synthetic Data & SIH Compliance Safeguards</h3>
            <p className="text-xs text-slate-500">
              Under SIH Hackathon rules, all demonstrations must utilize synthetic dummy datasets to protect personal
              privacy. No real citizen Aadhaar or live government credentials should be stored in testing environments.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => resetDemoData('default')}
              className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-bold text-slate-900 text-xs block">Reset to Standard SIH State</span>
                <span className="text-[11px] text-slate-500">
                  Restores 4 institutions, 8 students (including Aarav Sharma, Pooja Verma, and Rohan Kulkarni) and pre-seeded cases.
                </span>
              </div>
              <RefreshCw className="w-4 h-4 text-brand-600 shrink-0" />
            </button>

            <button
              onClick={() => resetDemoData('clean')}
              className="w-full text-left p-4 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-bold text-emerald-900 text-xs block">Load 100% Clean Benchmark</span>
                <span className="text-[11px] text-emerald-700">
                  Purges all anomaly cases to demonstrate high compliance state.
                </span>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            </button>

            <button
              onClick={() => resetDemoData('overflow')}
              className="w-full text-left p-4 bg-amber-50/50 hover:bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-bold text-amber-900 text-xs block">Load Intake Capacity Overflow</span>
                <span className="text-[11px] text-amber-800">
                  Sets Apex Institute B.Tech CSE to 184/180 students and triggers Case #CR-1043.
                </span>
              </div>
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
