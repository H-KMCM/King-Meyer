import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { z } from 'zod';
import { checkRateLimit } from './lib/auth/rate-limit';
import { verifyTOTP, generateTOTPSecret } from './lib/auth/totp';
import { canAccessDocumentTier } from './lib/auth/roles';
import { generateSignedDocumentToken, verifySignedDocumentToken } from './lib/storage/signed-urls';
import { createBaseSamplePdf, stampDynamicWatermark } from './lib/pdf/watermark';
import { 
  UserProfile, 
  VaultDocument, 
  AuditLogEntry, 
  CMSCopyBlock, 
  SiteSettings, 
  AttestationData,
  UserRole
} from './lib/types';

// In-Memory Seed Storage for Instant Full-Stack Execution
let mockUsers: UserProfile[] = [
  {
    id: 'usr-admin-001',
    email: 'principal@kingandmeyer.com',
    name: 'Haris King & Meyer (Principal)',
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    entityName: 'King & Meyer Executive General Partner Ltd',
    entityType: 'FAMILY_OFFICE',
    signatories: ['Haris King', 'Senior Managing Director'],
    isAccredited: true,
    twoFactorEnabled: true,
    lastLoginAt: new Date().toISOString(),
    lastLoginIp: '127.0.0.1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr-admin-002',
    email: 'operations@kingandmeyer.com',
    name: 'Institutional Operations Lead',
    role: 'ADMIN',
    status: 'APPROVED',
    entityName: 'King & Meyer Operational SPV',
    entityType: 'INSTITUTIONAL_FUND',
    signatories: ['VP Risk & Operations'],
    isAccredited: true,
    twoFactorEnabled: true,
    lastLoginAt: new Date().toISOString(),
    lastLoginIp: '192.168.1.10',
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr-lp-001',
    email: 'investor@genevacapital.ch',
    name: 'Geneva Multi-Family Office S.A.',
    role: 'VERIFIED_LP',
    status: 'APPROVED',
    entityName: 'Geneva Multi-Family Office Asset Holding',
    entityType: 'FAMILY_OFFICE',
    signatories: ['Dr. Philippe Laurent', 'Marcelle Dupont (CIO)'],
    isAccredited: true,
    twoFactorEnabled: false,
    lastLoginAt: new Date().toISOString(),
    lastLoginIp: '185.107.56.12',
    createdAt: '2024-05-10T12:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr-lp-002',
    email: 'allocator@mayfair-partners.co.uk',
    name: 'Mayfair Strategic Holdings',
    role: 'PROSPECT_LP',
    status: 'PENDING_REVIEW',
    entityName: 'Mayfair Capital LLP',
    entityType: 'INSTITUTIONAL_FUND',
    signatories: ['Edward Sterling'],
    isAccredited: false,
    twoFactorEnabled: false,
    lastLoginAt: new Date().toISOString(),
    lastLoginIp: '82.165.197.1',
    createdAt: '2024-08-01T09:30:00.000Z',
    updatedAt: new Date().toISOString(),
  }
];

let mockDocuments: VaultDocument[] = [
  {
    id: 'doc-001',
    title: 'Quantitative Core & Risk Insulation Memo (Q3 2026)',
    description: 'Algorithmic Treasury positioning, volatility surface modeling, and fixed income execution architecture.',
    category: 'CONFIDENTIAL_MEMO',
    accessTier: 'VERIFIED_LP_ONLY',
    fileUrl: '/api/investor/documents/doc-001/download',
    fileSizeBytes: 2450000,
    fileName: 'KM_QuantCore_RiskArchitecture_Q3_2026.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'usr-admin-001',
    uploadedAt: '2026-08-10T14:20:00.000Z',
    expiresAt: null,
    downloadCount: 14,
  },
  {
    id: 'doc-002',
    title: 'Vitae Monaco Longevity Infrastructure LP Agreement',
    description: 'Constituent limited partnership agreement and high-barrier physical real estate master asset structure.',
    category: 'LP_AGREEMENT',
    accessTier: 'VERIFIED_LP_ONLY',
    fileUrl: '/api/investor/documents/doc-002/download',
    fileSizeBytes: 4120000,
    fileName: 'Vitae_Monaco_LP_Agreement_Master_v4.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'usr-admin-001',
    uploadedAt: '2026-07-22T10:15:00.000Z',
    expiresAt: null,
    downloadCount: 28,
  },
  {
    id: 'doc-003',
    title: 'NEON Cognitive Architecture & Executive Diagnostics Pitch Book',
    description: 'Overview of clinical neuro-performance architecture, high-stakes key person underwriting, and SPV economics.',
    category: 'PITCH_BOOK',
    accessTier: 'PROSPECT_ONLY',
    fileUrl: '/api/investor/documents/doc-003/download',
    fileSizeBytes: 1890000,
    fileName: 'NEON_Executive_Performance_Overview_2026.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'usr-admin-002',
    uploadedAt: '2026-08-15T11:00:00.000Z',
    expiresAt: null,
    downloadCount: 63,
  },
  {
    id: 'doc-004',
    title: 'Digital Infrastructure (Tier-4 AI Data Center & Grid Power SPV)',
    description: 'Fibre-dense site acquisition memorandum, sovereign power grid entitlements, and long-term enterprise lease modeling.',
    category: 'DUE_DILIGENCE_VDR',
    accessTier: 'VERIFIED_LP_ONLY',
    fileUrl: '/api/investor/documents/doc-004/download',
    fileSizeBytes: 5600000,
    fileName: 'KM_DigitalInfrastructure_ComputePower_VDR.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'usr-admin-001',
    uploadedAt: '2026-08-18T09:00:00.000Z',
    expiresAt: null,
    downloadCount: 9,
  },
  {
    id: 'doc-005',
    title: 'King & Meyer Institutional Platform Whitepaper (Public Synopsis)',
    description: 'High-level doctrine regarding Structural Solvency, principal-first majority control, and multidisciplinary compounding.',
    category: 'PERFORMANCE_REPORT',
    accessTier: 'PUBLIC',
    fileUrl: '/api/investor/documents/doc-005/download',
    fileSizeBytes: 1200000,
    fileName: 'KM_Doctrine_Institutional_Synopsis_2026.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'usr-admin-001',
    uploadedAt: '2026-06-01T08:00:00.000Z',
    expiresAt: null,
    downloadCount: 142,
  }
];

let mockAuditTrail: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userId: 'usr-admin-001',
    userEmail: 'principal@kingandmeyer.com',
    userRole: 'SUPER_ADMIN',
    action: 'AUTH_LOGIN_SUCCESS',
    details: 'Authenticated via 2FA (TOTP) from primary terminal.',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 Institutional Terminal',
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    userId: 'usr-lp-001',
    userEmail: 'investor@genevacapital.ch',
    userRole: 'VERIFIED_LP',
    action: 'DOC_DOWNLOAD',
    details: 'Downloaded dynamically watermarked PDF: KM_QuantCore_RiskArchitecture_Q3_2026.pdf',
    ipAddress: '185.107.56.12',
    resourceId: 'doc-001',
  },
  {
    id: 'audit-003',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    userId: 'usr-lp-002',
    userEmail: 'allocator@mayfair-partners.co.uk',
    userRole: 'PROSPECT_LP',
    action: 'ATTESTATION_SUBMITTED',
    details: 'Submitted Elective Professional self-declaration attestation.',
    ipAddress: '82.165.197.1',
    resourceId: 'usr-lp-002',
  }
];

let mockCMSBlocks: CMSCopyBlock[] = [
  {
    id: 'cms-001',
    section: 'HERO',
    title: 'Landing Page Hero Headline',
    key: 'hero_headline',
    content: 'Engineering Balance Sheet Solvency. Eliminating Cognitive Drag.',
    lastModifiedBy: 'Haris King & Meyer',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cms-002',
    section: 'STRUCTURAL_SOLVENCY',
    title: 'Definition of Structural Solvency',
    key: 'structural_solvency_definition',
    content: 'Structural Solvency is the alignment of liquid quantitative execution, inflation-hedged physical infrastructure, and strict capital preservation parameters, ensuring multi-generational balance sheet durability regardless of macro regime shifts.',
    lastModifiedBy: 'Haris King & Meyer',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cms-003',
    section: 'DOCTRINE',
    title: 'The Doctrine Main Header',
    key: 'doctrine_header',
    content: 'The King & Meyer Doctrine: Majority Control, Structural Durability.',
    lastModifiedBy: 'Haris King & Meyer',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cms-004',
    section: 'DOCTRINE',
    title: 'The Philosophy Statement',
    key: 'doctrine_philosophy',
    content: 'We do not invest in "potential." We invest in Systems of Conviction. King & Meyer was established to solve a specific market failure: the lack of institutional-grade capital architecture for high-stakes, high-intensity operators.',
    lastModifiedBy: 'Haris King & Meyer',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cms-005',
    section: 'VERTICALS',
    title: 'Verticals Focus Header',
    key: 'verticals_header',
    content: 'An Infrastructure of Structural Solvency.',
    lastModifiedBy: 'Haris King & Meyer',
    updatedAt: new Date().toISOString(),
  }
];

let mockAttestations: AttestationData[] = [
  {
    id: 'att-001',
    userId: 'usr-lp-001',
    userEmail: 'investor@genevacapital.ch',
    investorType: 'PER_SE_PROFESSIONAL',
    jurisdiction: 'Switzerland / EU (MIFID II)',
    confirmedNetWorth: true,
    confirmedExperience: true,
    confirmedRiskAwareness: true,
    signatureName: 'Dr. Philippe Laurent',
    signedAt: '2024-05-10T11:45:00.000Z',
    ipAddress: '185.107.56.12',
    status: 'ACCEPTED',
  }
];

let siteSettings: SiteSettings = {
  id: 'settings-001',
  maintenanceMode: false,
  require2FAForAdmins: true,
  allowedRegistrationDomains: ['familyoffice.com', 'investors.ch', 'kingandmeyer.com'],
  maxDownloadTokenMinutes: 15,
  rateLimitWindowSeconds: 60,
  rateLimitMaxAttempts: 5,
};

// Helper: Log to immutable audit trail
function logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const newLog: AuditLogEntry = {
    id: 'audit-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  mockAuditTrail.unshift(newLog);
  // Keep last 1000 records
  if (mockAuditTrail.length > 1000) {
    mockAuditTrail.pop();
  }
}

// Zod Validation Schemas
const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password or Access Code is required'),
  roleRequested: z.enum(['SUPER_ADMIN', 'ADMIN', 'VERIFIED_LP', 'PROSPECT_LP']).optional(),
});

const Verify2FARequestSchema = z.object({
  userId: z.string(),
  totpCode: z.string().length(6, 'TOTP code must be 6 digits'),
});

const UserStatusUpdateSchema = z.object({
  userId: z.string(),
  status: z.enum(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED']),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VERIFIED_LP', 'PROSPECT_LP']),
});

const DocumentUploadSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum([
    'PITCH_BOOK',
    'LP_AGREEMENT',
    'PERFORMANCE_REPORT',
    'FINANCIAL_STATEMENT',
    'CONFIDENTIAL_MEMO',
    'DUE_DILIGENCE_VDR'
  ]),
  accessTier: z.enum(['PUBLIC', 'PROSPECT_ONLY', 'VERIFIED_LP_ONLY', 'INTERNAL_ADMIN']),
  fileName: z.string(),
  fileSizeBytes: z.number().positive(),
  expiresAt: z.string().nullable().optional(),
});

const CMSBlockUpdateSchema = z.object({
  key: z.string(),
  title: z.string(),
  content: z.string().min(1),
  section: z.enum(['HERO', 'DOCTRINE', 'VERTICALS', 'STRUCTURAL_SOLVENCY', 'METADATA']),
});

const AttestationSubmitSchema = z.object({
  userId: z.string(),
  investorType: z.enum(['ELECTIVE_PROFESSIONAL', 'PER_SE_PROFESSIONAL', 'QUALIFIED_PURCHASER', 'ACCREDITED_INVESTOR']),
  jurisdiction: z.string().min(2),
  confirmedNetWorth: z.boolean(),
  confirmedExperience: z.boolean(),
  confirmedRiskAwareness: z.boolean(),
  signatureName: z.string().min(2),
});

const ProfileUpdateSchema = z.object({
  userId: z.string(),
  entityName: z.string().optional(),
  entityType: z.enum(['FAMILY_OFFICE', 'INSTITUTIONAL_FUND', 'UHNWI', 'PENSION_SOVEREIGN', 'CORPORATE']).optional(),
  signatories: z.array(z.string()).optional(),
  isAccredited: z.boolean().optional(),
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Strict Rate Limiting Middleware for Auth Endpoints
  const authRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const check = checkRateLimit(ip);
    if (!check.allowed) {
      logAudit({
        action: 'AUTH_LOGIN_FAILURE',
        details: `Rate limit exceeded from IP ${ip}. Blocked for ${check.retryAfterSeconds}s.`,
        ipAddress: ip,
      });
      return res.status(429).json({
        error: 'Too many authentication attempts. Please wait before retrying.',
        retryAfterSeconds: check.retryAfterSeconds,
      });
    }
    next();
  };

  // ==========================================
  // 1. AUTHENTICATION & RBAC ENDPOINTS
  // ==========================================

  // POST /api/auth/login
  app.post('/api/auth/login', authRateLimiter, (req, res) => {
    const parse = LoginRequestSchema.safeParse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const { email, password } = parse.data;

    // Check credentials (supports hardcoded codes & simulated user accounts)
    let matchedUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Fallback: If user enters demo keys (e.g. admin or investor password)
    if (!matchedUser) {
      if (password === 'KM-PARTNER-2024' || password === 'admin' || password === 'SUPERADMIN2026') {
        matchedUser = mockUsers[0]; // Super Admin
      } else if (password === 'INVESTOR2024' || password === 'VERIFIEDLP2026') {
        matchedUser = mockUsers[2]; // Verified LP
      } else if (password === 'PROSPECT2026') {
        matchedUser = mockUsers[3]; // Prospect LP
      }
    }

    if (!matchedUser) {
      logAudit({
        action: 'AUTH_LOGIN_FAILURE',
        details: `Failed login attempt for ${email}`,
        ipAddress: ip,
        userAgent: req.headers['user-agent'],
      });
      return res.status(401).json({ error: 'Invalid institutional credentials or access code.' });
    }

    // Check if 2FA (TOTP) is required for SUPER_ADMIN
    if (matchedUser.role === 'SUPER_ADMIN' && matchedUser.twoFactorEnabled) {
      return res.json({
        requires2FA: true,
        userId: matchedUser.id,
        email: matchedUser.email,
        message: '2FA authentication required for SUPER_ADMIN role.',
      });
    }

    matchedUser.lastLoginAt = new Date().toISOString();
    matchedUser.lastLoginIp = ip;

    logAudit({
      userId: matchedUser.id,
      userEmail: matchedUser.email,
      userRole: matchedUser.role,
      action: 'AUTH_LOGIN_SUCCESS',
      details: `Successful login as ${matchedUser.role}`,
      ipAddress: ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      requires2FA: false,
      user: matchedUser,
      token: `km-jwt-${matchedUser.id}-${Date.now()}`,
    });
  });

  // POST /api/auth/verify-2fa
  app.post('/api/auth/verify-2fa', authRateLimiter, (req, res) => {
    const parse = Verify2FARequestSchema.safeParse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid 2FA format', details: parse.error.format() });
    }

    const { userId, totpCode } = parse.data;
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify TOTP code (accepts master dev code 882026 or algorithm)
    const isValid = verifyTOTP(totpCode, 'KMINSTITUTIONAL2026SECRETKEY32BIT');
    if (!isValid) {
      logAudit({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'AUTH_LOGIN_FAILURE',
        details: 'Invalid 2FA TOTP code entered.',
        ipAddress: ip,
      });
      return res.status(401).json({ error: 'Invalid 2FA verification code.' });
    }

    user.lastLoginAt = new Date().toISOString();
    user.lastLoginIp = ip;

    logAudit({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'AUTH_2FA_VERIFIED',
      details: 'TOTP 2FA successfully verified for SUPER_ADMIN',
      ipAddress: ip,
    });

    res.json({
      success: true,
      user,
      token: `km-jwt-2fa-verified-${user.id}-${Date.now()}`,
    });
  });

  // GET /api/auth/users (Admin user management)
  app.get('/api/admin/users', (req, res) => {
    res.json({ users: mockUsers });
  });

  // PATCH /api/admin/users/status
  app.patch('/api/admin/users/status', (req, res) => {
    const parse = UserStatusUpdateSchema.safeParse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const { userId, status, role } = parse.data;
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    const oldRole = user.role;
    const oldStatus = user.status;
    user.status = status;
    user.role = role;
    user.updatedAt = new Date().toISOString();

    logAudit({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'USER_STATUS_CHANGE',
      details: `User status changed from ${oldStatus} to ${status}, role from ${oldRole} to ${role}`,
      ipAddress: ip,
      resourceId: user.id,
    });

    res.json({ success: true, user });
  });

  // ==========================================
  // 2. DOCUMENT VAULT & WATERMARKING
  // ==========================================

  // GET /api/documents (Admin view all docs)
  app.get('/api/admin/documents', (req, res) => {
    res.json({ documents: mockDocuments });
  });

  // POST /api/admin/documents (Upload new doc to vault)
  app.post('/api/admin/documents', (req, res) => {
    const parse = DocumentUploadSchema.safeParse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const newDocId = 'doc-' + Math.random().toString(36).substring(2, 9);
    const newDoc: VaultDocument = {
      id: newDocId,
      title: parse.data.title,
      description: parse.data.description,
      category: parse.data.category,
      accessTier: parse.data.accessTier,
      fileName: parse.data.fileName,
      fileSizeBytes: parse.data.fileSizeBytes,
      fileUrl: `/api/investor/documents/${newDocId}/download`,
      mimeType: 'application/pdf',
      uploadedBy: 'usr-admin-001',
      uploadedAt: new Date().toISOString(),
      expiresAt: parse.data.expiresAt || null,
      downloadCount: 0,
    };

    mockDocuments.unshift(newDoc);

    logAudit({
      action: 'DOC_UPLOAD',
      details: `Uploaded vault document: ${newDoc.title} [Tier: ${newDoc.accessTier}]`,
      ipAddress: ip,
      resourceId: newDoc.id,
    });

    res.json({ success: true, document: newDoc });
  });

  // DELETE /api/admin/documents/:id
  app.delete('/api/admin/documents/:id', (req, res) => {
    const { id } = req.params;
    const docIndex = mockDocuments.findIndex((d) => d.id === id);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (docIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const [deleted] = mockDocuments.splice(docIndex, 1);
    logAudit({
      action: 'DOC_DELETE',
      details: `Deleted vault document: ${deleted.title}`,
      ipAddress: ip,
      resourceId: id,
    });

    res.json({ success: true, message: 'Document deleted from vault' });
  });

  // GET /api/investor/documents (Filtered by user role & tier)
  app.get('/api/investor/documents', (req, res) => {
    const userRole = (req.query.role as UserRole) || 'PROSPECT_LP';
    const accessible = mockDocuments.filter((doc) => canAccessDocumentTier(userRole, doc.accessTier));
    res.json({ documents: accessible });
  });

  // POST /api/investor/documents/:id/signed-token (Generates 15-minute expiring token)
  app.post('/api/investor/documents/:id/signed-token', (req, res) => {
    const { id } = req.params;
    const { userId, userEmail } = req.body;
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    const doc = mockDocuments.find((d) => d.id === id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const token = generateSignedDocumentToken(
      id,
      userId || 'usr-anon',
      userEmail || 'investor@firm.com',
      ip,
      15
    );

    res.json({
      success: true,
      token,
      downloadUrl: `/api/investor/documents/${id}/download?token=${token}`,
      expiresInMinutes: 15,
    });
  });

  // GET /api/investor/documents/:id/download (Streams dynamically watermarked PDF)
  app.get('/api/investor/documents/:id/download', async (req, res) => {
    const { id } = req.params;
    const token = req.query.token as string;
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    const doc = mockDocuments.find((d) => d.id === id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found in vault.' });
    }

    let userEmail = 'CONFIDENTIAL_LP@INSTITUTIONAL.COM';
    let requestIp = ip;

    if (token) {
      const verify = verifySignedDocumentToken(token);
      if (!verify.valid || !verify.payload) {
        return res.status(403).json({ error: verify.error || 'Invalid or expired signed token.' });
      }
      userEmail = verify.payload.userEmail;
      requestIp = verify.payload.userIp || ip;
    }

    try {
      // 1. Generate base document
      const basePdf = await createBaseSamplePdf(
        doc.title,
        doc.category,
        doc.description
      );

      // 2. Stamp dynamic watermarking with email, IP, and UTC timestamp
      const watermarkedPdf = await stampDynamicWatermark(basePdf, {
        userEmail,
        ipAddress: requestIp,
        title: doc.title,
      });

      // 3. Increment download counter & log to immutable audit trail
      doc.downloadCount += 1;
      logAudit({
        userEmail,
        action: 'DOC_DOWNLOAD',
        details: `Downloaded watermarked PDF [${doc.fileName}] stamped for ${userEmail} [IP: ${requestIp}]`,
        ipAddress: requestIp,
        resourceId: doc.id,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="KM_Watermarked_${doc.fileName}"`);
      res.send(Buffer.from(watermarkedPdf));
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate watermarked document: ' + err.message });
    }
  });

  // ==========================================
  // 3. INVESTOR ATTESTATION & ONBOARDING
  // ==========================================

  // POST /api/investor/attestation
  app.post('/api/investor/attestation', (req, res) => {
    const parse = AttestationSubmitSchema.safeParse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const { userId, investorType, jurisdiction, confirmedNetWorth, confirmedExperience, confirmedRiskAwareness, signatureName } = parse.data;
    const user = mockUsers.find((u) => u.id === userId);

    const newAttestation: AttestationData = {
      id: 'att-' + Math.random().toString(36).substring(2, 9),
      userId,
      userEmail: user ? user.email : 'applicant@firm.com',
      investorType,
      jurisdiction,
      confirmedNetWorth,
      confirmedExperience,
      confirmedRiskAwareness,
      signatureName,
      signedAt: new Date().toISOString(),
      ipAddress: ip,
      status: 'ACCEPTED',
    };

    mockAttestations.push(newAttestation);

    if (user) {
      user.isAccredited = true;
      user.status = 'APPROVED';
      user.role = 'VERIFIED_LP'; // Upgrade to verified LP upon valid signed attestation
    }

    logAudit({
      userId,
      userEmail: newAttestation.userEmail,
      action: 'ATTESTATION_SUBMITTED',
      details: `Self-declaration executed as ${investorType} (${jurisdiction}) by ${signatureName}`,
      ipAddress: ip,
      resourceId: newAttestation.id,
    });

    res.json({ success: true, attestation: newAttestation, user });
  });

  // ==========================================
  // 4. CMS COPY BLOCKS & SITE SETTINGS
  // ==========================================

  // GET /api/admin/cms
  app.get('/api/admin/cms', (req, res) => {
    res.json({ blocks: mockCMSBlocks });
  });

  // PUT /api/admin/cms/:key
  app.put('/api/admin/cms/:key', (req, res) => {
    const { key } = req.params;
    const parse = CMSBlockUpdateSchema.safeParse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const block = mockCMSBlocks.find((b) => b.key === key);
    if (!block) {
      const newBlock: CMSCopyBlock = {
        id: 'cms-' + Math.random().toString(36).substring(2, 9),
        key,
        title: parse.data.title,
        content: parse.data.content,
        section: parse.data.section,
        lastModifiedBy: 'Principal / Admin',
        updatedAt: new Date().toISOString(),
      };
      mockCMSBlocks.push(newBlock);
      logAudit({
        action: 'CMS_BLOCK_UPDATED',
        details: `Created new CMS block: ${key}`,
        ipAddress: ip,
        resourceId: key,
      });
      return res.json({ success: true, block: newBlock });
    }

    block.title = parse.data.title;
    block.content = parse.data.content;
    block.section = parse.data.section;
    block.updatedAt = new Date().toISOString();

    logAudit({
      action: 'CMS_BLOCK_UPDATED',
      details: `Updated CMS copy block: ${key}`,
      ipAddress: ip,
      resourceId: key,
    });

    res.json({ success: true, block });
  });

  // GET /api/admin/audit-trail
  app.get('/api/admin/audit-trail', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 100;
    res.json({ auditTrail: mockAuditTrail.slice(0, limit) });
  });

  // GET & PUT /api/admin/settings
  app.get('/api/admin/settings', (req, res) => {
    res.json({ settings: siteSettings });
  });

  app.put('/api/admin/settings', (req, res) => {
    siteSettings = { ...siteSettings, ...req.body };
    logAudit({
      action: 'SETTINGS_UPDATED',
      details: 'Updated global site security and rate limit settings',
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    });
    res.json({ success: true, settings: siteSettings });
  });

  // PUT /api/investor/profile
  app.put('/api/investor/profile', (req, res) => {
    const parse = ProfileUpdateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const { userId, entityName, entityType, signatories } = parse.data;
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (entityName) user.entityName = entityName;
    if (entityType) user.entityType = entityType;
    if (signatories) user.signatories = signatories;
    user.updatedAt = new Date().toISOString();

    res.json({ success: true, user });
  });

  // ==========================================
  // 5. VITE & STATIC FILE MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`King & Meyer Institutional Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
