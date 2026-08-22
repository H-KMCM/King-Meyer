// Database Schema Definitions (Supabase / PostgreSQL / Drizzle ORM format)

export interface DBSchemaDefinition {
  tables: {
    users: string;
    user_roles: string;
    user_attestations: string;
    documents: string;
    document_access_logs: string;
    audit_trail: string;
    cms_copy_blocks: string;
    site_settings: string;
  };
}

export const DB_TABLES = {
  USERS: 'users',
  USER_ROLES: 'user_roles',
  USER_ATTESTATIONS: 'user_attestations',
  DOCUMENTS: 'documents',
  DOCUMENT_ACCESS_LOGS: 'document_access_logs',
  AUDIT_TRAIL: 'audit_trail',
  CMS_COPY_BLOCKS: 'cms_copy_blocks',
  SITE_SETTINGS: 'site_settings',
} as const;

// TypeScript definitions corresponding to PostgreSQL tables
export interface DBUser {
  id: string;
  email: string;
  encrypted_password?: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VERIFIED_LP' | 'PROSPECT_LP';
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  entity_name: string | null;
  entity_type: string | null;
  signatories: string[] | null;
  is_accredited: boolean;
  two_factor_secret: string | null;
  two_factor_enabled: boolean;
  last_login_at: string | null;
  last_login_ip: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  access_tier: 'PUBLIC' | 'PROSPECT_ONLY' | 'VERIFIED_LP_ONLY' | 'INTERNAL_ADMIN';
  storage_path: string;
  file_size_bytes: number;
  file_name: string;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface DBAuditTrail {
  id: string;
  timestamp: string;
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  action: string;
  details: string;
  ip_address: string;
  user_agent: string | null;
  resource_id: string | null;
}

export interface DBCMSBlock {
  id: string;
  section: string;
  title: string;
  block_key: string;
  content: string;
  last_modified_by: string;
  updated_at: string;
}
