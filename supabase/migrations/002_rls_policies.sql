-- ============================================================
-- SAMStack CRM — Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Apply AFTER 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- HELPER FUNCTION — get current user's role
-- ============================================================

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_my_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read their own profile
CREATE POLICY "profiles_own_select"
  ON profiles FOR SELECT
  USING (auth_user_id = auth.uid() OR is_admin());

-- Admin can see all profiles
CREATE POLICY "profiles_admin_select"
  ON profiles FOR SELECT
  USING (is_admin());

-- Users can update their own profile
CREATE POLICY "profiles_own_update"
  ON profiles FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (
    -- Employees cannot change their own role
    (auth_user_id = auth.uid() AND (role = (SELECT role FROM profiles WHERE auth_user_id = auth.uid())))
    OR is_admin()
  );

-- Admin can update any profile
CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Admin can insert new profiles (create employees)
CREATE POLICY "profiles_admin_insert"
  ON profiles FOR INSERT
  WITH CHECK (is_admin() OR auth_user_id = auth.uid());

-- ============================================================
-- BUSINESS CATEGORIES
-- ============================================================

ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_all"
  ON business_categories FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "categories_admin_all"
  ON business_categories FOR ALL
  USING (is_admin());

-- ============================================================
-- LEADS
-- ============================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Employees can see their own leads; Admins see all
CREATE POLICY "leads_select"
  ON leads FOR SELECT
  USING (
    deleted_at IS NULL AND (
      is_admin() OR
      owner_id = get_my_profile_id() OR
      created_by = get_my_profile_id()
    )
  );

-- Employees can insert leads
CREATE POLICY "leads_insert"
  ON leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Employees can update their own leads; Admins update any
CREATE POLICY "leads_update"
  ON leads FOR UPDATE
  USING (
    is_admin() OR
    owner_id = get_my_profile_id() OR
    created_by = get_my_profile_id()
  );

-- Only admins can soft-delete (set deleted_at)
CREATE POLICY "leads_delete"
  ON leads FOR DELETE
  USING (is_admin());

-- ============================================================
-- LEAD SOCIAL LINKS
-- ============================================================

ALTER TABLE lead_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_social_select"
  ON lead_social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_id
        AND l.deleted_at IS NULL
        AND (is_admin() OR l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

CREATE POLICY "lead_social_insert"
  ON lead_social_links FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "lead_social_update"
  ON lead_social_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_id
        AND (is_admin() OR l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

-- ============================================================
-- OUTREACH ACTIVITIES
-- ============================================================

ALTER TABLE outreach_activities ENABLE ROW LEVEL SECURITY;

-- Employees see activities for their leads
CREATE POLICY "outreach_select"
  ON outreach_activities FOR SELECT
  USING (
    is_admin() OR
    employee_id = get_my_profile_id() OR
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_id
        AND (l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

CREATE POLICY "outreach_insert"
  ON outreach_activities FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    employee_id = get_my_profile_id()
  );

-- Employees can update their own outreach records; Admins can update all
CREATE POLICY "outreach_update"
  ON outreach_activities FOR UPDATE
  USING (is_admin() OR employee_id = get_my_profile_id());

-- ============================================================
-- FOLLOW-UPS
-- ============================================================

ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "followups_select"
  ON follow_ups FOR SELECT
  USING (
    deleted_at IS NULL AND (
      is_admin() OR
      assigned_to = get_my_profile_id() OR
      created_by = get_my_profile_id()
    )
  );

CREATE POLICY "followups_insert"
  ON follow_ups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "followups_update"
  ON follow_ups FOR UPDATE
  USING (is_admin() OR assigned_to = get_my_profile_id() OR created_by = get_my_profile_id());

-- ============================================================
-- PROJECTS
-- ============================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select"
  ON projects FOR SELECT
  USING (
    deleted_at IS NULL AND (
      is_admin() OR
      employee_id = get_my_profile_id()
    )
  );

CREATE POLICY "projects_insert"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projects_update"
  ON projects FOR UPDATE
  USING (is_admin() OR employee_id = get_my_profile_id());

-- ============================================================
-- NOTES
-- ============================================================

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select"
  ON notes FOR SELECT
  USING (
    is_admin() OR
    employee_id = get_my_profile_id() OR
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_id
        AND (l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

CREATE POLICY "notes_insert"
  ON notes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    employee_id = get_my_profile_id()
  );

-- Notes are append-only: no UPDATE, no DELETE for employees
CREATE POLICY "notes_admin_delete"
  ON notes FOR DELETE
  USING (is_admin());

-- ============================================================
-- AUDIT LOGS
-- ============================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "audit_logs_admin_select"
  ON audit_logs FOR SELECT
  USING (is_admin());

-- Authenticated users can insert audit logs (via server actions)
CREATE POLICY "audit_logs_insert"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- No UPDATE or DELETE on audit logs — ever

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- avatars bucket: users can upload/read their own avatar
CREATE POLICY "avatars_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- outreach-attachments: authenticated users can insert/read for their own activities
CREATE POLICY "outreach_attachments_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'outreach-attachments' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "outreach_attachments_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'outreach-attachments' AND
    auth.role() = 'authenticated'
  );
