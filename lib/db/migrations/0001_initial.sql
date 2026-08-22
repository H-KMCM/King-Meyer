-- ==============================================================================
-- King & Meyer Institutional Platform Migration 0001_initial.sql
-- Compatible with PostgreSQL 15+ and Supabase Database Engine
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('SUPER_ADMIN', 'ADMIN', 'VERIFIED_LP', 'PROSPECT_LP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status_enum AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_access_tier_enum AS ENUM ('PUBLIC', 'PROSPECT_ONLY', 'VERIFIED_LP_ONLY', 'INTERNAL_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    encrypted_password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'PROSPECT_LP',
    status user_status_enum NOT NULL DEFAULT 'PENDING_REVIEW',
    entity_name VARCHAR(255),
    entity_type VARCHAR(100),
    signatories JSONB DEFAULT '[]'::jsonb,
    is_accredited BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USER ATTESTATIONS TABLE (MIFID II / SEC Accredited Status)
CREATE TABLE IF NOT EXISTS user_attestations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investor_type VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    confirmed_net_worth BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed_experience BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed_risk_awareness BOOLEAN NOT NULL DEFAULT FALSE,
    signature_name VARCHAR(255) NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACCEPTED'
);

-- 4. DOCUMENTS TABLE (Vault Assets)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    access_tier document_access_tier_enum NOT NULL DEFAULT 'PROSPECT_ONLY',
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. IMMUTABLE AUDIT TRAIL TABLE
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    resource_id VARCHAR(255)
);

-- 6. CMS COPY BLOCKS TABLE
CREATE TABLE IF NOT EXISTS cms_copy_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    block_key VARCHAR(100) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    last_modified_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    require_2fa_for_admins BOOLEAN NOT NULL DEFAULT TRUE,
    allowed_registration_domains JSONB DEFAULT '[]'::jsonb,
    max_download_token_minutes INT NOT NULL DEFAULT 15,
    rate_limit_window_seconds INT NOT NULL DEFAULT 60,
    rate_limit_max_attempts INT NOT NULL DEFAULT 5,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_documents_access_tier ON documents(access_tier);
CREATE INDEX IF NOT EXISTS idx_audit_trail_timestamp ON audit_trail(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_trail_action ON audit_trail(action);
CREATE INDEX IF NOT EXISTS idx_cms_copy_blocks_key ON cms_copy_blocks(block_key);
