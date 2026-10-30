import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, QuotaCategory } from '../types';
import { UserPlus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addStudent, institutions, activeInstitutionId } = useApp();
  const currentInst = institutions.find((i) => i.id === activeInstitutionId) || institutions[0];

  const [formData, setFormData] = useState({
    name: '',
    apaarId: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    courseId: currentInst.courses[0]?.id || '',
    courseName: currentInst.courses[0]?.name || '',
    category: 'General' as QuotaCategory,
    rollNumber: '',
    email: '',
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Student name is required.');
      return;
    }
    if (!formData.dob) {
      setError('Date of Birth is mandatory.');
      return;
    }
    if (!formData.apaarId || !/^\d{4}-\d{4}-\d{4}$/.test(formData.apaarId)) {
      setError('APAAR ID must be 12 digits formatted as XXXX-XXXX-XXXX.');
      return;
    }

    addStudent({
      ...formData,
      status: 'Verified',
      validationSource: 'Simulated APAAR Authority',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-base">Register Single Student Record</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Aarav Sharma"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                APAAR ID (12-Digit Format) *
              </label>
              <input
                type="text"
                required
                value={formData.apaarId}
                onChange={(e) => setFormData({ ...formData, apaarId: e.target.value })}
                placeholder="9823-4412-8819"
                className="w-full p-2.5 font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course / Branch *</label>
              <select
                value={formData.courseName}
                onChange={(e) => {
                  const course = currentInst.courses.find((c) => c.name === e.target.value);
                  setFormData({
                    ...formData,
                    courseName: e.target.value,
                    courseId: course?.id || '',
                  });
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                {currentInst.courses.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category / Quota</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="General">General (Open Merit)</option>
                <option value="OBC">OBC (Non-Creamy Layer)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker)</option>
                <option value="NRI">NRI (Supernumerary 5%)</option>
                <option value="FN">FN (Foreign National 15%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll / Enrolment No</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 24CS1190"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
