-- ================================================================
-- SAMStack CRM — DIAGNOSTIC & COMPREHENSIVE FIX
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nqxhmdtsnwezwucnvckq/sql/new
-- ================================================================

-- ================================================================
-- STEP 1: DIAGNOSE — See current state
-- ================================================================

SELECT 
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data->>'role' as meta_role,
  u.raw_user_meta_data->>'admin_created' as admin_created,
  p.id as profile_id,
  p.role as profile_role,
  p.status as profile_status,
  p.onboarding_completed
FROM auth.users u
LEFT JOIN public.profiles p ON p.auth_user_id = u.id
ORDER BY u.created_at DESC
LIMIT 20;

-- ================================================================
-- STEP 2: FIX — Drop and recreate the trigger with bulletproof safety
-- ================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role    user_role;
  v_status  employee_status;
  v_meta_role TEXT;
  v_admin_created BOOLEAN;
BEGIN
  v_meta_role := COALESCE(NEW.raw_user_meta_data->>'role', 'employee');
  
  BEGIN
    v_role := v_meta_role::user_role;
  EXCEPTION WHEN others THEN
    v_role := 'employee'::user_role;
  END;

  BEGIN
    v_admin_created := (NEW.raw_user_meta_data->>'admin_created')::boolean;
  EXCEPTION WHEN others THEN
    v_admin_created := FALSE;
  END;

  IF v_role IN ('admin'::user_role, 'super_admin'::user_role) THEN
    v_status := 'active'::employee_status;
  ELSIF v_admin_created IS TRUE THEN
    v_status := 'active'::employee_status;
  ELSE
    v_status := 'pending'::employee_status;
  END IF;

  INSERT INTO public.profiles (
    auth_user_id, email, full_name, role, status, onboarding_completed
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_role,
    v_status,
    (v_role IN ('admin'::user_role, 'super_admin'::user_role))
  )
  ON CONFLICT (auth_user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN others THEN
  RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================================
-- STEP 3: FIX — Repair orphaned auth users (missing profiles)
-- ================================================================

INSERT INTO public.profiles (auth_user_id, email, full_name, role, status, onboarding_completed)
SELECT 
  u.id,
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  CASE 
    WHEN (u.raw_user_meta_data->>'role') IN ('admin', 'super_admin') 
      THEN (u.raw_user_meta_data->>'role')::user_role
    ELSE 'employee'::user_role
  END,
  CASE 
    WHEN (u.raw_user_meta_data->>'role') IN ('admin', 'super_admin') THEN 'active'::employee_status
    WHEN (u.raw_user_meta_data->>'admin_created')::boolean IS TRUE THEN 'active'::employee_status
    ELSE 'pending'::employee_status
  END,
  (u.raw_user_meta_data->>'role') IN ('admin', 'super_admin')
FROM auth.users u
LEFT JOIN public.profiles p ON p.auth_user_id = u.id
WHERE p.id IS NULL
ON CONFLICT (auth_user_id) DO NOTHING;

-- ================================================================
-- STEP 4: FIX — profiles RLS insert policy
-- ================================================================

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_service_insert" ON profiles;

CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL OR
    is_admin() OR 
    auth_user_id = auth.uid()
  );

-- ================================================================
-- STEP 5: Ensure super admin profile is correct
-- Dynamically pulls auth.users ID to avoid any foreign key errors
-- ================================================================

INSERT INTO public.profiles (
  auth_user_id, email, full_name, role, status, onboarding_completed, job_title, department
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Super Admin'),
  'super_admin'::user_role,
  'active'::employee_status,
  true,
  'Super Administrator',
  'Management'
FROM auth.users u
WHERE u.email IN ('samstacktechs@gmail.com', 'samstackteam@gmail.com')
   OR u.raw_user_meta_data->>'role' = 'super_admin'
ON CONFLICT (auth_user_id) DO UPDATE SET
  role = 'super_admin',
  status = 'active',
  onboarding_completed = true,
  updated_at = now();

-- ================================================================
-- STEP 6: VERIFY — Final state
-- ================================================================

SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as meta_role,
  p.role as db_role,
  p.status,
  p.onboarding_completed,
  CASE WHEN p.id IS NULL THEN 'NO PROFILE - BROKEN' ELSE 'OK' END as check_result
FROM auth.users u
LEFT JOIN public.profiles p ON p.auth_user_id = u.id
ORDER BY u.created_at DESC;
