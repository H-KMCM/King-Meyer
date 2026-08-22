// King & Meyer Institutional Platform Types

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'VERIFIED_LP' | 'PROSPECT_LP';

export type UserStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type DocumentAccessTier = 'PUBLIC' | 'PROSPECT_ONLY' | 'VERIFIED_LP_ONLY' | 'INTERNAL_ADMIN';

export type DocumentCategory = 
  | 'PITCH_BOOK' 
  | 'LP_AGREEMENT' 
  | 'PERFORMANCE_REPORT' 
  | 'FINANCIAL_STATEMENT' 
  | 'CONFIDENTIAL_MEMO' 
  | 'DUE_DILIGENCE_VDR';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  entityName?: string;
  entityType?: 'FAMILY_OFFICE' | 'INSTITUTIONAL_FUND' | 'UHNWI' | 'PENSION_SOVEREIGN' | 'CORPORATE';
  signatories?: string[];
  isAccredited: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttestationData {
  id: string;
  userId: string;
  userEmail: string;
  investorType: 'ELECTIVE_PROFESSIONAL' | 'PER_SE_PROFESSIONAL' | 'QUALIFIED_PURCHASER' | 'ACCREDITED_INVESTOR';
  jurisdiction: string;
  confirmedNetWorth: boolean;
  confirmedExperience: boolean;
  confirmedRiskAwareness: boolean;
  signatureName: string;
  signedAt: string;
  ipAddress: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
}

export interface VaultDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  accessTier: DocumentAccessTier;
  fileUrl: string;
  fileSizeBytes: number;
  fileName: string;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  expiresAt: string | null;
  downloadCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userRole?: UserRole;
  action: 
    | 'AUTH_LOGIN_SUCCESS' 
    | 'AUTH_LOGIN_FAILURE' 
    | 'AUTH_2FA_VERIFIED' 
    | 'AUTH_LOGOUT' 
    | 'DOC_UPLOAD' 
    | 'DOC_DOWNLOAD' 
    | 'DOC_DELETE' 
    | 'USER_STATUS_CHANGE' 
    | 'USER_ROLE_CHANGE' 
    | 'ATTESTATION_SUBMITTED' 
    | 'CMS_BLOCK_UPDATED' 
    | 'SETTINGS_UPDATED';
  details: string;
  ipAddress: string;
  userAgent?: string;
  resourceId?: string;
}

export interface CMSCopyBlock {
  id: string;
  section: 'HERO' | 'DOCTRINE' | 'VERTICALS' | 'STRUCTURAL_SOLVENCY' | 'METADATA';
  title: string;
  key: string;
  content: string;
  lastModifiedBy: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  maintenanceMode: boolean;
  require2FAForAdmins: boolean;
  allowedRegistrationDomains: string[];
  maxDownloadTokenMinutes: number;
  rateLimitWindowSeconds: number;
  rateLimitMaxAttempts: number;
}

export interface WatermarkPayload {
  userEmail: string;
  ipAddress: string;
  timestamp: string;
  documentTitle: string;
  securityHash: string;
}
