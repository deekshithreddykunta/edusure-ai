import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Student,
  Institution,
  ValidationIssue,
  CorrectionRequest,
  AuditRecord,
  RegulatoryRule,
  CaseStatus,
} from '../types';
import {
  initialInstitutions,
  initialStudents,
  initialIssues,
  initialCorrectionRequests,
  initialAuditLogs,
  initialRules,
  demoProfiles,
} from '../data/mockData';

export type AppLanguage = 'en' | 'hi' | 'mr' | 'ta';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const translations: Record<AppLanguage, Record<string, string>> = {
  en: {
    appTitle: 'EduSure AI',
    tagline: 'APAAR Student Data Validation & Regulatory Intelligence Platform',
    institutionPortal: 'Institution Administrator Portal',
    aictePortal: 'AICTE National Oversight Portal',
    complianceDesk: 'Compliance & Anomaly Resolution Desk',
    studentPortal: 'Student Academic Identity Passport',
    verifierPortal: 'Authorised External Verifier Portal',
    adminPortal: 'Platform Governance & Security Administration',
    signOut: 'Sign Out',
    askAicte: 'Ask AICTE AI',
    blockchainLedger: 'Blockchain Ledger',
    enrolment: 'Enrolment',
    dataQuality: 'Data Quality Score',
    flaggedAnomalies: 'Flagged Anomalies',
    verifiedApaar: 'Verified APAAR & ABC',
    bulkUpload: 'Bulk CSV / Excel Upload',
    addStudent: 'Add Student Record',
  },
  hi: {
    appTitle: 'एडुश्योर AI (EduSure AI)',
    tagline: 'अपार (APAAR) छात्र डेटा सत्यापन एवं विनियामक बुद्धिमत्ता मंच',
    institutionPortal: 'संस्थान प्रशासक पोर्टल',
    aictePortal: 'एआईसीटीई (AICTE) राष्ट्रीय विनियामक पोर्टल',
    complianceDesk: 'अनुपालन एवं विसंगति समाधान डेस्क',
    studentPortal: 'छात्र अकादमिक पहचान पासपोर्ट',
    verifierPortal: 'अधिकृत बाहरी सत्यापनकर्ता पोर्टल',
    adminPortal: 'मंच शासन एवं सुरक्षा प्रशासन',
    signOut: 'लॉग आउट',
    askAicte: 'AICTE से पूछें (AI)',
    blockchainLedger: 'ब्लॉकचेन लेजर',
    enrolment: 'कुल नामांकन',
    dataQuality: 'डेटा गुणवत्ता सूचकांक',
    flaggedAnomalies: 'चिह्नित विसंगतियां',
    verifiedApaar: 'सत्यापित अपार और एबीसी',
    bulkUpload: 'बल्क CSV / एक्सेल अपलोड',
    addStudent: 'छात्र रिकॉर्ड जोड़ें',
  },
  mr: {
    appTitle: 'एड्युश्युअर AI (EduSure AI)',
    tagline: 'अपार (APAAR) विद्यार्थी डेटा पडताळणी व नियामक व्यासपीठ',
    institutionPortal: 'संस्था प्रशासक पोर्टल',
    aictePortal: 'AICTE राष्ट्रीय नियामक पोर्टल',
    complianceDesk: 'तक्रार व विसंगती निवारण कक्ष',
    studentPortal: 'विद्यार्थी शैक्षणिक ओळख पासपोर्ट',
    verifierPortal: 'अधिकृत बाह्य पडताळणी पोर्टल',
    adminPortal: 'सुरक्षा व प्रणाली प्रशासन',
    signOut: 'साइन आउट',
    askAicte: 'AICTE ला विचारा (AI)',
    blockchainLedger: 'ब्लॉकचेन खातेवही',
    enrolment: 'एकूण प्रवेश',
    dataQuality: 'डेटा गुणवत्ता निर्देशांक',
    flaggedAnomalies: 'फ्लॅग केलेल्या त्रुटी',
    verifiedApaar: 'पडताळलेले अपार आयडी',
    bulkUpload: 'बल्क CSV अपलोड',
    addStudent: 'विद्यार्थी नोंदणी करा',
  },
  ta: {
    appTitle: 'எஜூர்ஷூர் AI (EduSure AI)',
    tagline: 'APAAR மாணவர் தரவு சரிபார்ப்பு மற்றும் ஒழுங்குமுறை நுண்ணறிவு தளம்',
    institutionPortal: 'நிறுவன நிர்வாகி போர்டல்',
    aictePortal: 'AICTE தேசிய ஒழுங்குமுறை போர்டல்',
    complianceDesk: 'இணக்கம் மற்றும் முரண்பாடு தீர்வு மையம்',
    studentPortal: 'மாணவர் கல்வி அடையாள பாஸ்போர்ட்',
    verifierPortal: 'அங்கீகரிக்கப்பட்ட சரிபார்ப்பாளர் போர்டல்',
    adminPortal: 'பாதுகாப்பு மற்றும் மேலாண்மை போர்டல்',
    signOut: 'வெளியேறு',
    askAicte: 'AICTE இடம் கேளுங்கள் (AI)',
    blockchainLedger: 'பிளாக்செயின் லெட்ஜர்',
    enrolment: 'மாணவர் சேர்க்கை',
    dataQuality: 'தரவு தரக் குறியீடு',
    flaggedAnomalies: 'கண்டறியப்பட்ட முரண்பாடுகள்',
    verifiedApaar: 'சரிபார்க்கப்பட்ட APAAR',
    bulkUpload: 'CSV பதிவேற்றம்',
    addStudent: 'புதிய மாணவர் சேர்க்கை',
  },
};

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  login: (role: UserRole, customProfile?: Partial<UserProfile>) => void;
  logout: () => void;
  lang: AppLanguage;
  setLang: (l: AppLanguage) => void;
  t: (key: string) => string;
  isTampered: boolean;
  tamperRecord: () => void;
  restoreIntegrity: () => void;
  isAskAicteOpen: boolean;
  setIsAskAicteOpen: (b: boolean) => void;
  isBlockchainOpen: boolean;
  setIsBlockchainOpen: (b: boolean) => void;
  students: Student[];
  institutions: Institution[];
  issues: ValidationIssue[];
  correctionRequests: CorrectionRequest[];
  auditLogs: AuditRecord[];
  rules: RegulatoryRule[];
  activeInstitutionId: string;
  setActiveInstitutionId: (id: string) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  addStudent: (student: Partial<Student>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateIssueStatus: (issueId: string, status: CaseStatus, notes?: string) => void;
  submitCorrectionRequest: (req: {
    studentId: string;
    studentName: string;
    apaarId: string;
    fieldName: string;
    currentValue: string;
    requestedValue: string;
    reason: string;
  }) => void;
  updateCorrectionStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  processBulkUpload: (rawRows: Record<string, any>[]) => {
    total: number;
    validCount: number;
    flaggedCount: number;
  };
  toggleRule: (ruleId: string) => void;
  resetDemoData: (scenario?: 'default' | 'clean' | 'overflow' | 'duplicates') => void;
  addAuditLog: (
    action: string,
    target: string,
    details: string,
    status?: 'SUCCESS' | 'WARNING' | 'ALERT'
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('institution');
  const [activeInstitutionId, setActiveInstitutionId] = useState<string>('inst-001');
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-001');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lang, setLang] = useState<AppLanguage>('en');

  // Advanced features state
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [isAskAicteOpen, setIsAskAicteOpen] = useState<boolean>(false);
  const [isBlockchainOpen, setIsBlockchainOpen] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('edusure_auth');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('edusure_user');
    return saved ? JSON.parse(saved) : demoProfiles.institution;
  });

  // Local storage initialization or mock defaults
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edusure_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem('edusure_institutions');
    return saved ? JSON.parse(saved) : initialInstitutions;
  });

  const [issues, setIssues] = useState<ValidationIssue[]>(() => {
    const saved = localStorage.getItem('edusure_issues');
    return saved ? JSON.parse(saved) : initialIssues;
  });

  const [correctionRequests, setCorrectionRequests] = useState<CorrectionRequest[]>(() => {
    const saved = localStorage.getItem('edusure_corrections');
    return saved ? JSON.parse(saved) : initialCorrectionRequests;
  });

  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(() => {
    const saved = localStorage.getItem('edusure_audit');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [rules, setRules] = useState<RegulatoryRule[]>(() => {
    const saved = localStorage.getItem('edusure_rules');
    return saved ? JSON.parse(saved) : initialRules;
  });

  // Translation function
  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  // Blockchain anti-tamper attack simulation
  const tamperRecord = () => {
    setIsTampered(true);
    setStudents((prev) =>
      prev.map((s) => (s.id === 'stu-001' ? { ...s, name: 'Aarav Sharma [TAMPERED_GRADE_9.99]', cgpa: 9.99 } : s))
    );
    addAuditLog('DB_SECURITY_BREACH', 'stu-001 (Aarav Sharma)', 'Cryptographic Merkle Root mismatch detected! Database row was modified outside consensus ledger.', 'ALERT');
    showToast('🚨 TAMPER ATTACK DETECTED: Merkle Hash Mismatch!', 'error');
  };

  const restoreIntegrity = () => {
    setIsTampered(false);
    setStudents((prev) =>
      prev.map((s) => (s.id === 'stu-001' ? { ...s, name: 'Aarav Sharma', cgpa: 8.84 } : s))
    );
    addAuditLog('BLOCKCHAIN_CONSENSUS_RESTORE', 'stu-001 (Aarav Sharma)', 'Restored student record to cryptographically signed genesis block state.', 'SUCCESS');
    showToast('✅ Cryptographic integrity restored from Blockchain Ledger.', 'success');
  };

  // Sync auth state to localStorage
  useEffect(() => {
    localStorage.setItem('edusure_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('edusure_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('edusure_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edusure_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('edusure_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('edusure_corrections', JSON.stringify(correctionRequests));
  }, [correctionRequests]);

  useEffect(() => {
    localStorage.setItem('edusure_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('edusure_rules', JSON.stringify(rules));
  }, [rules]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (demoProfiles[newRole]) {
      setCurrentUser(demoProfiles[newRole]);
    }
  };

  const login = (targetRole: UserRole, customProfile?: Partial<UserProfile>) => {
    const profile = demoProfiles[targetRole] || demoProfiles.institution;
    const finalUser = customProfile ? { ...profile, ...customProfile } : profile;
    setCurrentUser(finalUser);
    setRoleState(targetRole);
    setIsAuthenticated(true);
    showToast(`Authenticated as ${finalUser.name} (${finalUser.role.toUpperCase()})`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of EduSure AI session.', 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (
    action: string,
    target: string,
    details: string,
    status: 'SUCCESS' | 'WARNING' | 'ALERT' = 'SUCCESS'
  ) => {
    const newEntry: AuditRecord = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name || 'System Operator',
      role: role.toUpperCase(),
      action,
      target,
      details,
      status,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const addStudent = (stu: Partial<Student>) => {
    const newId = 'stu-' + Date.now();
    const token = 'EDU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const fullStudent: Student = {
      id: newId,
      apaarId: stu.apaarId || '9823-0000-' + Math.floor(1000 + Math.random() * 9000),
      name: stu.name || 'New Student',
      dob: stu.dob || '2004-01-01',
      gender: stu.gender || 'Male',
      institutionId: activeInstitutionId,
      institutionName:
        institutions.find((i) => i.id === activeInstitutionId)?.name || 'Apex Institute of Technology',
      courseId: stu.courseId || 'c-cse',
      courseName: stu.courseName || 'Computer Science & Engineering',
      academicYear: stu.academicYear || '2024-2028',
      admissionBatch: 'Batch 2024',
      category: stu.category || 'General',
      enrolmentDate: new Date().toISOString().split('T')[0],
      status: stu.status || 'Verified',
      validationSource: 'Rule Based',
      creditsEarned: 24,
      cgpa: 8.0,
      verificationToken: token,
      rollNumber: stu.rollNumber || '24CS' + Math.floor(1000 + Math.random() * 9000),
      email: stu.email || 'student@apextech.edu.in',
      flagReason: stu.flagReason,
      flagSeverity: stu.flagSeverity,
    };

    setStudents((prev) => [fullStudent, ...prev]);
    addAuditLog('ADD_STUDENT', fullStudent.name, `Manually created student record [${fullStudent.apaarId}]`);
    showToast(`Student record for ${fullStudent.name} registered.`, 'success');
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          if (updates.status === 'Verified') {
            updated.flagReason = undefined;
            updated.flagSeverity = undefined;
          }
          return updated;
        }
        return s;
      })
    );
    addAuditLog('UPDATE_STUDENT', id, `Updated student fields: ${Object.keys(updates).join(', ')}`);
    showToast('Student record updated successfully.', 'success');
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    addAuditLog('DELETE_STUDENT', student?.name || id, 'Removed student record', 'WARNING');
    showToast('Record deleted.', 'info');
  };

  const updateIssueStatus = (issueId: string, status: CaseStatus, notes?: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status,
            reviewerNotes: notes || issue.reviewerNotes,
          };
        }
        return issue;
      })
    );

    if (status === 'RESOLVED') {
      const targetIssue = issues.find((i) => i.id === issueId);
      if (targetIssue) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === targetIssue.studentId ? { ...s, status: 'Verified', flagReason: undefined } : s
          )
        );
      }
    }

    addAuditLog(
      'UPDATE_ISSUE',
      issueId,
      `Case marked as ${status}${notes ? `. Notes: ${notes}` : ''}`,
      status === 'RESOLVED' ? 'SUCCESS' : 'WARNING'
    );
    showToast(`Case status updated to ${status}.`, 'info');
  };

  const submitCorrectionRequest = (req: {
    studentId: string;
    studentName: string;
    apaarId: string;
    fieldName: string;
    currentValue: string;
    requestedValue: string;
    reason: string;
  }) => {
    const newReq: CorrectionRequest = {
      id: 'cor-' + Date.now(),
      studentId: req.studentId,
      studentName: req.studentName,
      apaarId: req.apaarId,
      fieldName: req.fieldName,
      currentValue: req.currentValue,
      requestedValue: req.requestedValue,
      reason: req.reason,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      documentProofName: 'supporting_affidavit_or_doc.pdf',
    };
    setCorrectionRequests((prev) => [newReq, ...prev]);
    addAuditLog('STUDENT_CORRECTION_REQUEST', req.studentName, `Correction requested for field: ${req.fieldName}`);
    showToast('Correction request submitted to institution registrar.', 'success');
  };

  const updateCorrectionStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setCorrectionRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    const req = correctionRequests.find((r) => r.id === id);
    if (status === 'Approved' && req) {
      setStudents((prev) =>
        prev.map((s) => (s.id === req.studentId ? { ...s, [req.fieldName]: req.requestedValue } : s))
      );
    }
    addAuditLog('CORRECTION_STATUS_UPDATE', id, `Correction request marked ${status}`);
    showToast(`Correction request ${status}.`, 'info');
  };

  const processBulkUpload = (rawRows: Record<string, any>[]) => {
    let validCount = 0;
    let flaggedCount = 0;
    const newStudents: Student[] = [];
    const newIssues: ValidationIssue[] = [];

    const activeInst = institutions.find((i) => i.id === activeInstitutionId) || institutions[0];
    const cseCourse = activeInst.courses.find((c) => c.code === 'BTECH-CSE') || activeInst.courses[0];
    const existingCseEnrolled = students.filter(
      (s) => s.institutionId === activeInst.id && s.courseId === cseCourse.id
    ).length;

    let rollingCseCount = existingCseEnrolled;

    rawRows.forEach((row, index) => {
      const apaar = String(row.apaarId || row.APAAR || row.apaar_id || '').trim();
      const name = String(row.name || row.studentName || row.Student_Name || `Candidate ${index + 1}`).trim();
      const dob = String(row.dob || row.date_of_birth || row.DOB || '').trim();
      const courseName = String(row.courseName || row.course || row.Course || 'Computer Science & Engineering').trim();
      const roll = String(row.rollNumber || row.Roll_No || `24CS${1200 + index}`).trim();
      const category = (row.category || row.Quota || 'General') as any;

      let isFlagged = false;
      let flagReason = '';
      let flagSeverity: any = 'Low';
      let issueType: any = null;

      if (!name || !dob) {
        isFlagged = true;
        flagReason = 'Mandatory field Date of Birth (DOB) or Full Name is missing.';
        flagSeverity = 'High';
        issueType = 'MISSING_MANDATORY_FIELD';
      } else if (!apaar || apaar.replace(/[-\s]/g, '').length !== 12 || !/^\d{4}-\d{4}-\d{4}$/.test(apaar)) {
        isFlagged = true;
        flagReason = `Invalid APAAR syntax "${apaar}": Must be exact 12-digit numeric format formatted as XXXX-XXXX-XXXX.`;
        flagSeverity = 'Critical';
        issueType = 'INVALID_APAAR_FORMAT';
      } else if (students.some((s) => s.apaarId === apaar && s.institutionId !== activeInst.id)) {
        const otherInst = students.find((s) => s.apaarId === apaar && s.institutionId !== activeInst.id);
        isFlagged = true;
        flagReason = `Dual Enrolment Detected: Student already actively enrolled at ${otherInst?.institutionName}.`;
        flagSeverity = 'Critical';
        issueType = 'DUPLICATE_APAAR_CROSS_INSTITUTION';
      } else if (newStudents.some((s) => s.apaarId === apaar) || students.some((s) => s.apaarId === apaar && s.institutionId === activeInst.id)) {
        isFlagged = true;
        flagReason = `Duplicate APAAR in submission: ID "${apaar}" is already present in this institution registry.`;
        flagSeverity = 'High';
        issueType = 'INVALID_APAAR_FORMAT';
      } else if (courseName.includes('Computer Science') && rollingCseCount >= cseCourse.approvedSeats) {
        rollingCseCount++;
        isFlagged = true;
        flagReason = `Approved Intake Exceeded: Enrolment exceeds sanctioned seat capacity of ${cseCourse.approvedSeats} in ${cseCourse.name}.`;
        flagSeverity = 'High';
        issueType = 'INTAKE_CAPACITY_EXCEEDED';
      }

      if (courseName.includes('Computer Science') && !isFlagged) {
        rollingCseCount++;
      }

      const studentId = 'stu-bulk-' + Date.now() + '-' + index;
      const newStudent: Student = {
        id: studentId,
        apaarId: apaar,
        name,
        dob,
        gender: (row.gender || 'Male') as any,
        institutionId: activeInst.id,
        institutionName: activeInst.name,
        courseId: cseCourse.id,
        courseName,
        academicYear: '2024-2028',
        admissionBatch: 'Batch 2024',
        category,
        enrolmentDate: new Date().toISOString().split('T')[0],
        status: isFlagged ? 'Flagged' : 'Verified',
        validationSource: isFlagged ? 'Format Check' : 'Rule Based',
        creditsEarned: 20,
        cgpa: 8.1,
        verificationToken: 'EDU-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        rollNumber: roll,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@apextech.edu.in`,
        flagReason: isFlagged ? flagReason : undefined,
        flagSeverity: isFlagged ? flagSeverity : undefined,
      };

      if (isFlagged) {
        flaggedCount++;
        const newIssue: ValidationIssue = {
          id: 'issue-bulk-' + Date.now() + '-' + index,
          caseNumber: 'CR-' + (1050 + issues.length + index),
          studentId,
          studentName: name,
          apaarId: apaar || 'N/A',
          institutionId: activeInst.id,
          institutionName: activeInst.name,
          courseName,
          issueType: issueType || 'INVALID_APAAR_FORMAT',
          title: flagReason.split(':')[0] || 'Validation Discrepancy Detected',
          severity: flagSeverity,
          explanation: flagReason,
          affectedFields: [issueType === 'MISSING_MANDATORY_FIELD' ? 'dob' : 'apaarId'],
          suggestedAction: 'Review record details and correct via the inline spreadsheet editor.',
          status: 'OPEN',
          createdAt: new Date().toLocaleString(),
        };
        newIssues.push(newIssue);
      } else {
        validCount++;
      }

      newStudents.push(newStudent);
    });

    setStudents((prev) => [...newStudents, ...prev]);
    if (newIssues.length > 0) {
      setIssues((prev) => [...newIssues, ...prev]);
    }

    addAuditLog(
      'BULK_CSV_IMPORT',
      `${rawRows.length} Records`,
      `Import completed. ${validCount} valid records ingested, ${flaggedCount} anomalies isolated.`,
      flaggedCount > 0 ? 'WARNING' : 'SUCCESS'
    );

    return { total: rawRows.length, validCount, flaggedCount };
  };

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
    showToast('Regulatory validation parameter updated.', 'info');
  };

  const resetDemoData = (scenario: 'default' | 'clean' | 'overflow' | 'duplicates' = 'default') => {
    if (scenario === 'clean') {
      const cleanStudents = initialStudents.filter((s) => s.status === 'Verified');
      setStudents(cleanStudents);
      setIssues([]);
      showToast('Loaded 100% Clean Synthetic Dataset (0 anomalies).', 'success');
    } else if (scenario === 'overflow') {
      setStudents(initialStudents);
      setIssues(initialIssues.filter((i) => i.issueType === 'INTAKE_CAPACITY_EXCEEDED'));
      showToast('Loaded Intake Overflow Scenario (Sanctioned Intake Breach).', 'warning');
    } else if (scenario === 'duplicates') {
      setStudents(initialStudents);
      setIssues(initialIssues.filter((i) => i.issueType === 'DUPLICATE_APAAR_CROSS_INSTITUTION'));
      showToast('Loaded Cross-Institution Duplicate APAAR Scenario.', 'error');
    } else {
      localStorage.clear();
      setStudents(initialStudents);
      setInstitutions(initialInstitutions);
      setIssues(initialIssues);
      setCorrectionRequests(initialCorrectionRequests);
      setAuditLogs(initialAuditLogs);
      setRules(initialRules);
      showToast('Reset all platform data to standard SIH demo state.', 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        isAuthenticated,
        login,
        logout,
        lang,
        setLang,
        t,
        isTampered,
        tamperRecord,
        restoreIntegrity,
        isAskAicteOpen,
        setIsAskAicteOpen,
        isBlockchainOpen,
        setIsBlockchainOpen,
        students,
        institutions,
        issues,
        correctionRequests,
        auditLogs,
        rules,
        activeInstitutionId,
        setActiveInstitutionId,
        activeStudentId,
        setActiveStudentId,
        toasts,
        showToast,
        dismissToast,
        addStudent,
        updateStudent,
        deleteStudent,
        updateIssueStatus,
        submitCorrectionRequest,
        updateCorrectionStatus,
        processBulkUpload,
        toggleRule,
        resetDemoData,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
