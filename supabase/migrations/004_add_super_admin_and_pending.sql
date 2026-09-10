-- ============================================================
-- SAMStack CRM — Migration 004
-- Adds: super_admin role, pending employee status, storage buckets
-- ============================================================

-- 1. Add 'super_admin' to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- 2. Add 'pending' to employee_status enum (for new self-registered employees)
ALTER TYPE employee_status ADD VALUE IF NOT EXISTS 'pending';

-- 3. Create storage buckets (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('outreach-attachments', 'outreach-attachments', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage RLS: allow authenticated users to upload avatars
CREATE POLICY "Avatar upload for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Avatar public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Avatar update own"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatar delete own"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Update the on_auth_user_created trigger to set pending status for self-registrations
-- (When created via admin panel with role=admin/super_admin → active, else → pending)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role    user_role;
  v_status  employee_status;
BEGIN
  -- Determine role from metadata
  v_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'employee'::user_role
  );

  -- Admins and super_admins created programmatically are active immediately
  -- Regular employees who self-register start as 'pending'
  IF v_role IN ('admin', 'super_admin') THEN
    v_status := 'active';
  ELSE
    -- If created via admin panel (has employee_created_by_admin flag), set active
    IF (NEW.raw_user_meta_data->>'admin_created')::boolean IS TRUE THEN
      v_status := 'active';
    ELSE
      v_status := 'pending';
    END IF;
  END IF;

  INSERT INTO public.profiles (auth_user_id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_role,
    v_status
  )
  ON CONFLICT (auth_user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
