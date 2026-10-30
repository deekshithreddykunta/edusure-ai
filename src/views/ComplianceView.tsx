import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ValidationIssue, IssueSeverity, CaseStatus } from '../types';
import { ExplainableModal } from '../components/ExplainableModal';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Send,
  Building,
  User,
  ShieldAlert,
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const { issues, updateIssueStatus, showToast } = useApp();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [activeIssue, setActiveIssue] = useState<ValidationIssue | null>(null);

  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
    const matchesSearch =
      issue.studentName.toLowerCase().includes(search.toLowerCase()) ||
      issue.apaarId.includes(search) ||
      issue.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      issue.institutionName.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const criticalCount = issues.filter((i) => i.severity === 'Critical' && i.status !== 'RESOLVED').length;
  const highCount = issues.filter((i) => i.severity === 'High' && i.status !== 'RESOLVED').length;
  const resolvedCount = issues.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Compliance Header */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              DISCREPANCY RESOLUTION DESK
            </span>
            <span className="text-slate-400 text-xs">Assigned Officer: Dr. Ramesh Chandra (Western Region)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-brand-400" />
            AICTE Regulatory Compliance & Anomaly Queue
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Human-in-the-loop review of automated intake breaches, dual-institution enrolments, and identifier syntax anomalies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            Active Cases: <span className="font-bold text-white">{issues.length}</span>
          </div>
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-rose-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-rose-600 block">
              Critical Priority Cases
            </span>
            <div className="text-2xl font-extrabold text-rose-700 mt-1">{criticalCount}</div>
            <span className="text-[11px] text-slate-500">Cross-institution duplicates & syntax errors</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-amber-700 block">
              High Priority Alerts
            </span>
            <div className="text-2xl font-extrabold text-amber-800 mt-1">{highCount}</div>
            <span className="text-[11px] text-slate-500">Intake capacity ceiling violations</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-700 block">
              Resolved Cases
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">{resolvedCount}</div>
            <span className="text-[11px] text-slate-500">Audited & verified with college proof</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Issues Queue and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case #, student name, APAAR, or institution..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none"
            >
              <option value="ALL">All Case Statuses</option>
              <option value="OPEN">Open Cases</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="CLARIFICATION_REQUESTED">Clarification Requested</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredIssues.length} of {issues.length} cases
          </span>
        </div>

        {/* Case Cards List */}
        <div className="divide-y divide-slate-200">
          {filteredIssues.map((issue) => {
            const isCritical = issue.severity === 'Critical';
            const isHigh = issue.severity === 'High';

            return (
              <div
                key={issue.id}
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white">
                      #{issue.caseNumber}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {issue.severity} Priority
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      Status: {issue.status}
                    </span>

                    <span className="text-[11px] text-slate-400">Filed: {issue.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{issue.title}</h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {issue.explanation}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Candidate: <strong className="text-slate-800">{issue.studentName}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      APAAR: <strong className="text-brand-700">{issue.apaarId}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {issue.institutionName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveIssue(issue)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Investigate Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ExplainableModal issue={activeIssue} onClose={() => setActiveIssue(null)} />
    </div>
  );
};
