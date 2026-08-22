-- ==============================================================================
-- King & Meyer Supabase Row-Level Security (RLS) Policies
-- Enforces zero-trust isolation on all tables based on JWT claims and user role
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_copy_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper functions for JWT claims inspection
CREATE OR REPLACE FUNCTION auth.current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role',
    'ANONYMOUS'
  );
$$ LANGUAGE SQL STABLE;

-- 2. USERS TABLE POLICIES
-- Super Admins and Admins can view/edit all users
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL
  USING (
    auth.current_user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );

-- Users can only view and update their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT
  USING (
    auth.uid() = id
  );

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE
  USING (
    auth.uid() = id
  )
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM users WHERE id = auth.uid()) -- Cannot escalate role
  );

-- 3. USER ATTESTATIONS POLICIES
CREATE POLICY "Admins can view all attestations" ON user_attestations
  FOR SELECT
  USING (
    auth.current_user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );

CREATE POLICY "Users can view and submit their own attestation" ON user_attestations
  FOR ALL
  USING (
    auth.uid() = user_id
  );

-- 4. DOCUMENTS VAULT POLICIES
-- Admins can do everything
CREATE POLICY "Admins full control over documents" ON documents
  FOR ALL
  USING (
    auth.current_user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );

-- Public documents accessible to authenticated or prospect
CREATE POLICY "Public documents viewable by all" ON documents
  FOR SELECT
  USING (
    access_tier = 'PUBLIC' AND is_active = TRUE
  );

-- Prospect documents viewable by PROSPECT_LP and VERIFIED_LP
CREATE POLICY "Prospect docs viewable by prospects and verified LPs" ON documents
  FOR SELECT
  USING (
    access_tier = 'PROSPECT_ONLY' AND 
    auth.current_user_role() IN ('PROSPECT_LP', 'VERIFIED_LP', 'ADMIN', 'SUPER_ADMIN') AND
    is_active = TRUE
  );

-- Verified LP documents viewable ONLY by VERIFIED_LP and Admins
CREATE POLICY "Verified LP docs restricted to verified LPs" ON documents
  FOR SELECT
  USING (
    access_tier = 'VERIFIED_LP_ONLY' AND 
    auth.current_user_role() IN ('VERIFIED_LP', 'ADMIN', 'SUPER_ADMIN') AND
    is_active = TRUE
  );

-- 5. AUDIT TRAIL POLICIES (IMMUTABLE)
-- Strictly read-only for Admins; Inserts allowed via service role or trigger; NO updates or deletes!
CREATE POLICY "Admins can view audit logs" ON audit_trail
  FOR SELECT
  USING (
    auth.current_user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );

CREATE POLICY "Audit trail is strictly insert only" ON audit_trail
  FOR INSERT
  WITH CHECK (true);

-- Explicitly deny UPDATE and DELETE on audit trail to preserve immutability
REVOKE UPDATE, DELETE ON audit_trail FROM authenticated, anon;

-- 6. CMS COPY BLOCKS POLICIES
-- Read-only for public/investor, editable by Admins
CREATE POLICY "CMS blocks viewable by anyone" ON cms_copy_blocks
  FOR SELECT
  USING (true);

CREATE POLICY "CMS blocks editable only by Admins" ON cms_copy_blocks
  FOR ALL
  USING (
    auth.current_user_role() IN ('SUPER_ADMIN', 'ADMIN')
  );
