import React, { useState } from 'react';
import { ValidationIssue, CaseStatus } from '../types';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  X,
  FileText,
  Building,
  UserCheck,
  Send,
  Scale,
  Sparkles,
} from 'lucide-react';

interface Props {
  issue: ValidationIssue | null;
  onClose: () => void;
}

export const ExplainableModal: React.FC<Props> = ({ issue, onClose }) => {
  const { updateIssueStatus, showToast } = useApp();
  const [reviewerNotes, setReviewerNotes] = useState(issue?.reviewerNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!issue) return null;

  const handleAction = (status: CaseStatus) => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateIssueStatus(issue.id, status, reviewerNotes);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const getSeverityBadge = () => {
    switch (issue.severity) {
      case 'Critical':
        return (
          <span className="px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Critical Discrepancy
          </span>
        );
      case 'High':
        return (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-700 border border-yellow-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-blue-500/10 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Notice
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase text-brand-400">
                  Case #{issue.caseNumber}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-300">{issue.institutionName}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">{issue.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Key Identifiers Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-4 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block font-medium">Student Name</span>
                <span className="font-semibold text-slate-900 text-sm">{issue.studentName}</span>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <span className="text-slate-400 block font-medium">APAAR Identifier</span>
                <span className="font-mono font-semibold text-brand-700">{issue.apaarId}</span>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <span className="text-slate-400 block font-medium">Programme</span>
                <span className="font-medium text-slate-800">{issue.courseName}</span>
              </div>
            </div>
            <div>{getSeverityBadge()}</div>
          </div>

          {/* Explainable Anomaly Cards */}
          <div className="space-y-4">
            {/* 1. What triggered this alert */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
              <h4 className="font-semibold text-rose-900 flex items-center gap-2 mb-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Explainable Anomaly Root Cause
              </h4>
              <p className="text-rose-950 text-xs sm:text-sm leading-relaxed">{issue.explanation}</p>
            </div>

            {/* 2. Affected Fields */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider text-slate-500">
                <FileText className="w-4 h-4 text-slate-400" />
                Affected Submission Fields
              </h4>
              <div className="flex flex-wrap gap-2">
                {issue.affectedFields.map((field) => (
                  <span
                    key={field}
                    className="px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded font-mono text-xs font-medium shadow-sm"
                  >
                    {field}
                  </span>
                ))}
                {issue.evidenceRef && (
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded text-xs font-medium flex items-center gap-1">
                    <Scale className="w-3 h-3 text-amber-600" />
                    Reference: {issue.evidenceRef}
                  </span>
                )}
              </div>
            </div>

            {/* 3. Recommended Remediation */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-1 text-sm">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                AICTE Compliance Protocol & Next Step
              </h4>
              <p className="text-blue-950 text-xs leading-relaxed">{issue.suggestedAction}</p>
            </div>
          </div>

          {/* Reviewer Note Area */}
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Compliance Reviewer Case Notes
            </label>
            <textarea
              rows={2}
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="Add verification notes, college explanation references, or audit comments..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            Current Status:{' '}
            <span className="font-semibold text-slate-800 uppercase">{issue.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isSubmitting}
              onClick={() => handleAction('FALSE_POSITIVE')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
            >
              Mark False Positive
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => handleAction('CLARIFICATION_REQUESTED')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Request College Clarification
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => handleAction('RESOLVED')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Verify & Resolve Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
