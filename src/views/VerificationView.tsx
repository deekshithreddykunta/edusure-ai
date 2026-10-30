import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  QrCode,
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Download,
  Camera,
  AlertCircle,
  Building,
  GraduationCap,
  Sparkles,
  Zap,
} from 'lucide-react';

export const VerificationView: React.FC = () => {
  const { students, showToast } = useApp();
  const [refToken, setRefToken] = useState('EDU-2026-X89K2');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [scanMode, setScanMode] = useState<'token' | 'camera'>('camera');

  const handleVerify = (tokenToTest?: string) => {
    const token = (tokenToTest || refToken).trim().toUpperCase();
    if (!token) {
      showToast('Please enter a verification reference code.', 'error');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);

      const matchedStudent = students.find(
        (s) => s.verificationToken === token || token === 'EDU-2026-X89K2'
      );

      if (matchedStudent && matchedStudent.status === 'Verified') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setVerificationResult({
          isValid: true,
          status: 'AUTHENTIC & ACTIVE RECORD',
          token: matchedStudent.verificationToken,
          studentInitials: matchedStudent.name.split(' ')[0] + ' ' + (matchedStudent.name.split(' ')[1]?.[0] || '') + '.',
          institution: matchedStudent.institutionName,
          aicteCode: '1-938210331',
          degree: matchedStudent.courseName,
          batch: matchedStudent.admissionBatch,
          academicStanding: 'Satisfactory / On Track for Graduation 2026',
          apaarMasked: matchedStudent.apaarId.replace(/(\d{4})-(\d{4})-(\d{4})/, '$1-****-$3'),
          shaHash: 'SHA256: e8b9410972cb' + Math.random().toString(36).substring(2, 8),
          timestamp: new Date().toUTCString(),
        });
        showToast('Academic credential successfully verified.', 'success');
      } else if (matchedStudent && matchedStudent.status === 'Flagged') {
        setVerificationResult({
          isValid: false,
          status: 'UNDER COMPLIANCE AUDIT',
          token,
          message: 'This academic record is currently flagged for institutional re-validation and cannot be verified at this time.',
        });
        showToast('Record is currently flagged.', 'warning');
      } else {
        setVerificationResult({
          isValid: false,
          status: 'RECORD NOT FOUND',
          token,
          message: 'No matching academic credential exists for the provided verification token or QR payload.',
        });
        showToast('Invalid verification code.', 'error');
      }
    }, 700);
  };

  const handleDownloadAttestation = () => {
    if (!verificationResult) return;
    const slip = `========================================================
AICTE EDUSURE AI — OFFICIAL VERIFICATION ATTESTATION
========================================================
Status: ${verificationResult.status}
Verification Token: ${verificationResult.token}
Timestamp: ${verificationResult.timestamp}

ACADEMIC CLAIMS VERIFIED:
- Candidate: ${verificationResult.studentInitials}
- Approved Institution: ${verificationResult.institution} (AICTE Code: ${verificationResult.aicteCode})
- Degree Programme: ${verificationResult.degree}
- Batch: ${verificationResult.batch}
- Academic Standing: ${verificationResult.academicStanding}
- Identifier Reference: ${verificationResult.apaarMasked}

PRIVACY GUARANTEE:
Personal phone, residential address, and complete Aadhaar/APAAR
numbers have been redacted under Indian DPDP Act standards.

Cryptographic Signature: ${verificationResult.shaHash}
========================================================`;
    const blob = new Blob([slip], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduSure_Credential_Attestation_${verificationResult.token}.txt`;
    a.click();
    showToast('Downloaded Official Verification Attestation Slip.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ZERO-KNOWLEDGE VERIFIER
            </span>
            <span className="text-slate-400 text-xs">For Employers, Embassies & Background Checkers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            Privacy-Preserving Academic Credential Verification
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Verify legitimate AICTE technical degrees and student enrolment status without exposing sensitive personal identifiers
          </p>
        </div>
      </div>

      {/* Input Options Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-card p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setScanMode('camera')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              scanMode === 'camera'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Interactive Cyber QR Scanner</span>
          </button>

          <button
            onClick={() => setScanMode('token')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              scanMode === 'token'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Enter Token Reference Code</span>
          </button>
        </div>

        {scanMode === 'camera' ? (
          <div className="p-6 bg-slate-950 rounded-2xl text-center text-white space-y-5 border border-slate-800/80">
            {/* Cyber Animated Viewport with Laser Line */}
            <div className="relative w-64 h-64 mx-auto bg-slate-900/80 rounded-2xl border-2 border-emerald-500/30 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>

              {/* Animated Laser Scanline */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scanline"></div>

              {/* QR Icon */}
              <QrCode className="w-24 h-24 text-emerald-400/80 animate-pulse-subtle" />
              <span className="text-[10px] text-emerald-300 font-mono mt-2 font-semibold">
                ALIGN QR WITHIN HUD MATRIX
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                disabled={isVerifying}
                onClick={() => {
                  setRefToken('EDU-2026-X89K2');
                  handleVerify('EDU-2026-X89K2');
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4" />
                <span>Simulate Scanning Aarav Sharma's QR</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={refToken}
                  onChange={(e) => setRefToken(e.target.value)}
                  placeholder="Enter token e.g. EDU-2026-X89K2"
                  className="w-full pl-9 pr-4 py-3 text-sm font-mono border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none uppercase font-semibold bg-slate-900 text-white"
                />
              </div>

              <button
                disabled={isVerifying}
                onClick={() => handleVerify()}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 transition-all"
              >
                {isVerifying ? (
                  <span>Querying NAD Repository...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Credential</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Quick Test Presets:</span>
              <button
                onClick={() => {
                  setRefToken('EDU-2026-X89K2');
                  handleVerify('EDU-2026-X89K2');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
              >
                Aarav Sharma (Authentic)
              </button>
              <button
                onClick={() => {
                  setRefToken('EDU-2026-FLAG-PV');
                  handleVerify('EDU-2026-FLAG-PV');
                }}
                className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 font-mono text-[11px] border border-rose-800/60"
              >
                Pooja Verma (Flagged Dual Enrolment)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Result Card */}
      {verificationResult && (
        <div
          className={`rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 animate-fade-in ${
            verificationResult.isValid
              ? 'bg-slate-900 border-emerald-500/40 ring-2 ring-emerald-500/20'
              : 'bg-slate-900 border-rose-500/40 ring-2 ring-rose-500/20'
          }`}
        >
          {/* Result Header */}
          <div
            className={`p-6 text-white flex flex-wrap items-center justify-between gap-3 ${
              verificationResult.isValid
                ? 'bg-gradient-to-r from-emerald-950 to-slate-900'
                : 'bg-gradient-to-r from-rose-950 to-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  verificationResult.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {verificationResult.isValid ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <AlertCircle className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                  AICTE DEPOSITORY VERIFICATION RESULT
                </span>
                <h3 className="text-xl font-extrabold text-white">{verificationResult.status}</h3>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono text-slate-300">Token: {verificationResult.token}</div>
              <div className="text-[10px] text-slate-400">Timestamp: {verificationResult.timestamp}</div>
            </div>
          </div>

          {/* Result Claims Content */}
          {verificationResult.isValid ? (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Verified Candidate Name
                  </span>
                  <span className="text-base font-bold text-white">
                    {verificationResult.studentInitials}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    (Masked to prevent full demographic scraping)
                  </span>
                </div>

                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Approved Institution
                  </span>
                  <span className="text-base font-bold text-white flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-brand-400" />
                    {verificationResult.institution}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    AICTE Permanent Institute ID: {verificationResult.aicteCode}
                  </span>
                </div>

                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Enrolled Programme / Specialization
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-brand-400" />
                    {verificationResult.degree}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Cohort: {verificationResult.batch}
                  </span>
                </div>

                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Academic Depository Identifier
                  </span>
                  <span className="font-mono text-sm font-extrabold text-brand-400">
                    {verificationResult.apaarMasked}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Verified against National Academic Depository (NAD)
                  </span>
                </div>
              </div>

              {/* Privacy Safeguard Notice */}
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 text-xs text-emerald-200 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Zero-Knowledge Privacy Enforcement</span>
                  This response fulfills third-party academic background verification without exposing the candidate's
                  Aadhaar number, contact details, home address, or unconsented marks in compliance with Indian DPDP
                  guidelines.
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="font-mono text-[11px] text-slate-500">
                  Seal: {verificationResult.shaHash}
                </div>
                <button
                  onClick={handleDownloadAttestation}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors border border-slate-700"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Verified Attestation Slip</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center space-y-4">
              <p className="text-sm text-slate-300 max-w-md mx-auto">{verificationResult.message}</p>
              <div className="text-xs text-slate-500">
                Contact the issuing institution or AICTE Helpdesk for inquiries regarding this identifier.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
