-- ============================================================
-- SAMStack CRM — Fix is_admin() to include super_admin
-- Migration: 005_fix_is_admin_super_admin.sql
--
-- PROBLEM: is_admin() only checked role = 'admin', excluding
-- super_admin. This caused RLS violations for super_admin users
-- on INSERT/UPDATE operations across all tables.
-- ============================================================

-- Fix is_admin() to cover both admin AND super_admin roles
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;
