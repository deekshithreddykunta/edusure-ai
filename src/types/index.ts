export type UserRole =
  | 'institution'
  | 'aicte'
  | 'compliance'
  | 'student'
  | 'verifier'
  | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  organization: string;
  avatarInitials: string;
  apaarId?: string;
  aicteCode?: string;
  securityClearance: 'L1' | 'L2' | 'L3' | 'NATIONAL_OVERSIGHT';
}

export type StudentStatus = 'Verified' | 'Flagged' | 'Pending' | 'Rejected';
export type QuotaCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'NRI' | 'OCI' | 'FN';
export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE' | 'CLARIFICATION_REQUESTED';

export interface Student {
  id: string;
  apaarId: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  institutionId: string;
  institutionName: string;
  courseId: string;
  courseName: string;
  academicYear: string;
  admissionBatch: string;
  category: QuotaCategory;
  enrolmentDate: string;
  status: StudentStatus;
  validationSource: 'Format Check' | 'Rule Based' | 'Simulated APAAR Authority' | 'Pending Review';
  creditsEarned: number;
  cgpa: number;
  verificationToken: string;
  rollNumber: string;
  email: string;
  flagReason?: string;
  flagSeverity?: IssueSeverity;
}

export interface CourseIntake {
  id: string;
  name: string;
  code: string;
  approvedSeats: number;
  enrolledCount: number;
  nriQuota: number;
  nriEnrolled: number;
  fnQuota: number;
  fnEnrolled: number;
}

export interface Institution {
  id: string;
  name: string;
  aicteCode: string;
  aisheCode: string;
  state: string;
  region: string;
  totalApprovedIntake: number;
  totalEnrolled: number;
  dataQualityScore: number;
  status: 'Compliant' | 'Review Required' | 'Action Flagged';
  courses: CourseIntake[];
}

export interface ValidationIssue {
  id: string;
  caseNumber: string;
  studentId: string;
  studentName: string;
  apaarId: string;
  institutionId: string;
  institutionName: string;
  courseName: string;
  issueType:
    | 'DUPLICATE_APAAR_CROSS_INSTITUTION'
    | 'INTAKE_CAPACITY_EXCEEDED'
    | 'INVALID_APAAR_FORMAT'
    | 'MISSING_MANDATORY_FIELD'
    | 'SUPERNUMERARY_QUOTA_BREACH';
  title: string;
  severity: IssueSeverity;
  explanation: string;
  affectedFields: string[];
  suggestedAction: string;
  status: CaseStatus;
  assignedReviewer?: string;
  reviewerNotes?: string;
  createdAt: string;
  evidenceRef?: string;
}

export interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  apaarId: string;
  fieldName: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  documentProofName?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export interface VerificationLog {
  id: string;
  timestamp: string;
  verifierOrganization: string;
  verifierPurpose: string;
  verificationMethod: 'QR Scan' | 'Reference Code' | 'API Query';
  referenceCode: string;
  result: 'AUTHENTIC' | 'REVOKED' | 'EXPIRED' | 'NOT_FOUND';
  disclosedClaims: string[];
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export interface RegulatoryRule {
  id: string;
  name: string;
  category: 'INTAKE' | 'APAAR' | 'TIMELINE' | 'SUPERNUMERARY';
  description: string;
  parameterValue: string | number;
  unit?: string;
  isActive: boolean;
  lastUpdated: string;
}
