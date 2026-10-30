import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  ShieldCheck,
  QrCode,
  Lock,
  Eye,
  EyeOff,
  Clock,
  FileText,
  Building,
  CheckCircle2,
  Send,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const { students, correctionRequests, submitCorrectionRequest, showToast, setRole } = useApp();
  const student = students.find((s) => s.id === 'stu-001') || students[0];

  const [activeTab, setActiveTab] = useState<'passport' | 'consent' | 'correction' | 'activity'>('passport');

  // Privacy toggles
  const [consentCgpa, setConsentCgpa] = useState(false);
  const [consentDob, setConsentDob] = useState(false);
  const [consentQr, setConsentQr] = useState(true);

  // Correction request form state
  const [corrField, setCorrField] = useState('High School Affiliation No');
  const [corrCurrent, setCorrCurrent] = useState('CBSE-27104 (Unverified)');
  const [corrRequested, setCorrRequested] = useState('');
  const [corrReason, setCorrReason] = useState('');

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corrRequested.trim()) {
      showToast('Please enter requested value.', 'error');
      return;
    }
    submitCorrectionRequest({
      studentId: student.id,
      studentName: student.name,
      apaarId: student.apaarId,
      fieldName: corrField,
      currentValue: corrCurrent,
      requestedValue: corrRequested,
      reason: corrReason || 'Demographic alignment with Class 10/12 original marksheet',
    });
    setCorrRequested('');
    setCorrReason('');
  };

  const [showCertModal, setShowCertModal] = useState(false);
  const studentCorrections = correctionRequests.filter((c) => c.studentId === student.id);

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              NATIONAL ACADEMIC REGISTRY (APAAR)
            </span>
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Academic Identity & Digital Passport
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Official APAAR credential synchronized with National Academic Depository (NAD) & Academic Bank of Credits (ABC)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCertModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Print Degree Certificate (APAAR & Roll No)</span>
          </button>
        </div>
      </div>

      {/* Digilocker / APAAR Digital Card Component */}
      <div className="max-w-xl mx-auto bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-brand-500/30 relative overflow-hidden">
        {/* Subtle background seal */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-brand-500/10 pointer-events-none blur-2xl"></div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-brand-400">
                GOVERNMENT OF INDIA • MOE
              </div>
              <div className="text-xs font-semibold text-slate-300">
                APAAR (Automated Permanent Academic Account Registry)
              </div>
            </div>
          </div>
          <div className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-[10px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            VERIFIED
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-24 h-28 bg-slate-800 rounded-2xl border-2 border-brand-400/30 flex flex-col items-center justify-center text-slate-400 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg mb-1">
              AS
            </div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Student Photo</span>
          </div>

          <div className="space-y-1.5 flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white tracking-wide">{student.name}</h2>
            <div className="font-mono text-brand-300 font-bold text-sm tracking-wider">
              {student.apaarId}
            </div>
            <div className="text-xs text-slate-300">{student.courseName}</div>
            <div className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <Building className="w-3.5 h-3.5" />
              {student.institutionName}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Roll No: {student.rollNumber} • Admission: {student.admissionBatch}
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center p-1.5">
              <QrCode className="w-full h-full text-white" />
            </div>
            <span className="text-[9px] font-mono text-slate-800 font-bold mt-1">
              {student.verificationToken}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>ABC ID: ABC-2022-984128</span>
          <span className="font-mono text-emerald-400">Cryptographically Signed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('passport')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'passport'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Enrolment & Credits</span>
        </button>

        <button
          onClick={() => setActiveTab('consent')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'consent'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacy & Verifier Consent</span>
        </button>

        <button
          onClick={() => setActiveTab('correction')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'correction'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Request Record Correction ({studentCorrections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'activity'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Verification Activity Log</span>
        </button>
      </div>

      {/* Tab 1: Academic Enrolment & ABC */}
      {activeTab === 'passport' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Academic Bank of Credits (ABC)</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Credits Completed</span>
                <span className="font-bold text-slate-900">{student.creditsEarned} / 160 Credits</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full"
                  style={{ width: `${(student.creditsEarned / 160) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Cumulative GPA (CGPA)</span>
                <span className="font-extrabold text-emerald-600 text-sm">{student.cgpa} / 10.0</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Academic Standing</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  Regular / Good Standing
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle space-y-4 md:col-span-2">
            <h3 className="font-bold text-slate-900 text-sm">Completed Curricular Milestones</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Semester 1–4 Core Engineering Modules</div>
                  <div className="text-[11px] text-slate-500">Data Structures, Algorithms, Computer Architecture, Discrete Math</div>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  88 Credits Verified
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Semester 5–6 Advanced Specialization</div>
                  <div className="text-[11px] text-slate-500">Operating Systems, Database Systems, Cloud Computing, ML</div>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  44 Credits Verified
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Semester 7–8 Capstone & Industry Internship</div>
                  <div className="text-[11px] text-slate-500">In Progress (Expected Completion: May 2026)</div>
                </div>
                <span className="text-brand-700 font-semibold bg-brand-100 px-2 py-0.5 rounded text-[11px]">
                  Pending 28 Credits
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Consent Center */}
      {activeTab === 'consent' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5 max-w-2xl">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Privacy-Preserving Selective Disclosure</h3>
            <p className="text-xs text-slate-500">
              Under Indian Digital Personal Data Protection (DPDP) Act, you have sovereignty over which academic
              claims are exposed when an external recruiter or agency scans your APAAR QR code.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 text-xs block">
                  Expose Numerical CGPA & Marks
                </span>
                <span className="text-[11px] text-slate-500">
                  When disabled, verifiers only see "Active Enrolment / Eligible" without your exact GPA numbers.
                </span>
              </div>
              <button
                onClick={() => {
                  setConsentCgpa(!consentCgpa);
                  showToast(`CGPA sharing set to ${!consentCgpa ? 'Enabled' : 'Masked'}.`, 'info');
                }}
              >
                {consentCgpa ? (
                  <ToggleRight className="w-7 h-7 text-brand-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 text-xs block">
                  Disclose Date of Birth (DOB)
                </span>
                <span className="text-[11px] text-slate-500">
                  Keep exact date of birth private; verifiers will only see Year of Admission.
                </span>
              </div>
              <button
                onClick={() => {
                  setConsentDob(!consentDob);
                  showToast(`DOB privacy toggled.`, 'info');
                }}
              >
                {consentDob ? (
                  <ToggleRight className="w-7 h-7 text-brand-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 text-xs block">
                  Enable Instant QR Code Verification
                </span>
                <span className="text-[11px] text-slate-500">
                  Permits instant one-click credential resolution for campus recruiters using token {student.verificationToken}.
                </span>
              </div>
              <button
                onClick={() => {
                  setConsentQr(!consentQr);
                  showToast(`QR verification ${!consentQr ? 'Activated' : 'Suspended'}.`, 'info');
                }}
              >
                {consentQr ? (
                  <ToggleRight className="w-7 h-7 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Correction Request */}
      {activeTab === 'correction' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Submit Demographic Correction Request</h3>
              <p className="text-xs text-slate-500">
                Noticed a typo in your name, school affiliation, or birth details? Submit a verifiable correction request
                to Apex Institute's academic registrar.
              </p>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Requiring Correction</label>
                <select
                  value={corrField}
                  onChange={(e) => {
                    setCorrField(e.target.value);
                    if (e.target.value === 'Student Full Name') setCorrCurrent(student.name);
                    else if (e.target.value === 'Date of Birth') setCorrCurrent(student.dob);
                    else setCorrCurrent('Delhi Public School, R.K Puram (Unverified Affiliation)');
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="High School Affiliation No">High School Affiliation / Roll No</option>
                  <option value="Student Full Name">Student Full Name Spelling</option>
                  <option value="Date of Birth">Date of Birth</option>
                  <option value="Admission Category">Admission Category / Quota</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Stored Value</label>
                <input
                  type="text"
                  disabled
                  value={corrCurrent}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proposed Corrected Value *</label>
                <input
                  type="text"
                  required
                  value={corrRequested}
                  onChange={(e) => setCorrRequested(e.target.value)}
                  placeholder="e.g. Delhi Public School, R.K. Puram (Affiliation #27104)"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason & Remarks</label>
                <textarea
                  rows={2}
                  value={corrReason}
                  onChange={(e) => setCorrReason(e.target.value)}
                  placeholder="Explain discrepancy with reference to original government certificate..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Institution Registrar</span>
              </button>
            </form>
          </div>

          {/* Past Correction Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Your Past Correction Submissions</h3>
            <div className="space-y-3">
              {studentCorrections.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.fieldName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-slate-600 space-y-0.5">
                    <div>
                      <span className="text-slate-400">From: </span>
                      <span className="line-through">{item.currentValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">To: </span>
                      <span className="font-semibold text-emerald-700">{item.requestedValue}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                    Submitted on: {item.submittedDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Verification Activity */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-900 text-sm">Third-Party Verification Transparency Log</h3>
          <p className="text-xs text-slate-500">
            Whenever an authorized employer or regulator verifies your APAAR academic claim, an immutable audit event is logged.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Tata Consultancy Services (HR Campus Drive)</div>
                <div className="text-[11px] text-slate-500">
                  Purpose: Graduate Engineering Trainee Hiring • Method: QR Token Scan
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  AUTHENTICATED
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">14 Oct 2026, 02:15 PM</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">AICTE Regional Western Office</div>
                <div className="text-[11px] text-slate-500">
                  Purpose: Annual Routine Academic Depository Audit
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  VERIFIED
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">20 Sep 2026, 11:40 AM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requirement #10: Official Degree Certificate Modal with APAAR ID & Student ID */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-scale">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-500/30 max-w-2xl w-full text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">
                  Official Academic Degree Certificate (SIH Req #10 Compliant)
                </span>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Certificate Canvas */}
            <div className="p-8 bg-[#fffdfa] border-8 border-double border-amber-600/30 m-4 rounded-2xl text-center space-y-4 relative">
              <div className="text-amber-800 font-serif text-xs uppercase tracking-widest font-bold">
                All India Council for Technical Education • Autonomous Degree Conferment
              </div>
              <h2 className="text-2xl font-serif font-black tracking-wide text-slate-900 uppercase">
                Apex Institute of Technology
              </h2>
              <p className="text-xs text-slate-500 italic">
                Established under statutory authority of Maharashtra Act No. 42 • AICTE Code: 1-938210331
              </p>

              <div className="my-3 text-xs uppercase tracking-widest text-slate-600">
                This is to certify that
              </div>

              <h3 className="text-2xl font-serif font-bold text-indigo-950 tracking-wide border-b-2 border-amber-400/60 pb-1 inline-block px-8">
                {student.name}
              </h3>

              <div className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                having completed the prescribed curriculum and passed the statutory examinations in First Class with Distinction is admitted to the degree of
              </div>

              <div className="text-lg font-serif font-bold text-amber-900 uppercase">
                {student.courseName}
              </div>

              {/* Requirement #10: APAAR ID + Student ID Dual Identification */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-amber-50/70 border border-amber-300 rounded-xl text-left my-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">
                    Student ID / Roll No
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-700 uppercase block font-sans font-bold">
                    National APAAR ID
                  </span>
                  <span className="font-bold text-indigo-900 text-xs">{student.apaarId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 uppercase block font-sans font-bold">
                    ABC Depository ID
                  </span>
                  <span className="font-bold text-emerald-900 text-xs">ABC-2022-984128</span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-6 grid grid-cols-3 items-end text-center text-[10px] text-slate-600 font-sans border-t border-slate-200">
                <div>
                  <div className="font-serif italic font-semibold text-slate-800">Dr. S. Nair</div>
                  <div className="border-t border-slate-400 pt-0.5 mt-1 font-bold">Registrar</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-600 flex items-center justify-center text-amber-800 font-bold text-[9px] shadow-sm">
                    SEAL
                  </div>
                  <div className="mt-1 font-mono text-[9px] text-slate-400">{student.verificationToken}</div>
                </div>
                <div>
                  <div className="font-serif italic font-semibold text-slate-800">Prof. V. Agnihotri</div>
                  <div className="border-t border-slate-400 pt-0.5 mt-1 font-bold">Dean of Academic Affiliation</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Digital tamper-proof certificate registered with National Academic Depository (NAD).
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
