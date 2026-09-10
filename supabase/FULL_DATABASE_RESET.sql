-- ================================================================
-- SAMStack CRM — COMPLETE DATABASE SETUP
-- File: FULL_DATABASE_RESET.sql
--
-- HOW TO RUN:
-- 1. Go to: https://supabase.com/dashboard/project/nqxhmdtsnwezwucnvckq/sql/new
-- 2. Copy this ENTIRE file and paste it in the SQL editor
-- 3. Click "Run" (or press Ctrl+Enter)
-- 4. Done! Super admin will be ready to login.
--
-- Super Admin Login:
--   Email:    samstacktechs@gmail.com
--   Password: Salman123@
-- ================================================================


-- ================================================================
-- STEP 1: DROP EVERYTHING (Clean Slate)
-- ================================================================

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS leads_updated_at ON leads;
DROP TRIGGER IF EXISTS lead_social_links_updated_at ON lead_social_links;
DROP TRIGGER IF EXISTS follow_ups_updated_at ON follow_ups;
DROP TRIGGER IF EXISTS projects_updated_at ON projects;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS get_my_role() CASCADE;
DROP FUNCTION IF EXISTS get_my_profile_id() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Drop tables (in dependency order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS follow_ups CASCADE;
DROP TABLE IF EXISTS outreach_activities CASCADE;
DROP TABLE IF EXISTS lead_social_links CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS business_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop enums
DROP TYPE IF EXISTS audit_action CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS followup_priority CASCADE;
DROP TYPE IF EXISTS followup_status CASCADE;
DROP TYPE IF EXISTS response_status CASCADE;
DROP TYPE IF EXISTS message_status CASCADE;
DROP TYPE IF EXISTS outreach_channel CASCADE;
DROP TYPE IF EXISTS lead_source CASCADE;
DROP TYPE IF EXISTS pipeline_stage CASCADE;
DROP TYPE IF EXISTS employee_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Note: Storage buckets and objects must be deleted via the Supabase Dashboard UI or Storage API.
-- Direct SQL deletion from storage tables is protected.


-- ================================================================
-- STEP 2: CREATE EXTENSIONS
-- ================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- ================================================================
-- STEP 3: CREATE ENUMS
-- ================================================================

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'employee');

CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

CREATE TYPE pipeline_stage AS ENUM (
  'new', 'contacted', 'seen', 'replied', 'interested', 'qualified',
  'proposal_sent', 'negotiation', 'won', 'project_started',
  'project_completed', 'not_interested', 'not_qualified', 'lost'
);

CREATE TYPE lead_source AS ENUM (
  'google_maps', 'facebook', 'instagram', 'tiktok',
  'website', 'referral', 'manual_entry', 'other'
);

CREATE TYPE outreach_channel AS ENUM (
  'facebook', 'instagram', 'tiktok', 'whatsapp',
  'email', 'phone_call', 'website_form', 'linkedin', 'sms', 'other'
);

CREATE TYPE message_status AS ENUM (
  'not_sent', 'sent', 'delivered', 'seen', 'opened', 'failed', 'unknown'
);

CREATE TYPE response_status AS ENUM (
  'no_response', 'seen_no_reply', 'replied', 'interested', 'not_interested',
  'asked_for_details', 'meeting_requested', 'meeting_scheduled',
  'negotiating', 'converted', 'lost'
);

CREATE TYPE followup_status AS ENUM (
  'pending', 'completed', 'skipped', 'overdue', 'cancelled'
);

CREATE TYPE followup_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TYPE project_status AS ENUM (
  'pending', 'approved', 'in_progress', 'completed', 'cancelled'
);

CREATE TYPE audit_action AS ENUM (
  'created', 'updated', 'deleted', 'activated', 'deactivated',
  'suspended', 'assigned', 'reassigned', 'status_changed',
  'stage_changed', 'completed', 'cancelled'
);


-- ================================================================
-- STEP 4: CREATE TABLES
-- ================================================================

-- PROFILES — Both admins and employees
CREATE TABLE profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id         UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            TEXT NOT NULL DEFAULT '',
  email                TEXT NOT NULL DEFAULT '',
  phone                TEXT,
  profile_photo_url    TEXT,
  role                 user_role NOT NULL DEFAULT 'employee',
  status               employee_status NOT NULL DEFAULT 'pending',
  job_title            TEXT,
  employee_id          TEXT UNIQUE,
  department           TEXT,
  bio                  TEXT,
  joining_date         DATE,
  target_weekly_outreach    INTEGER DEFAULT 0,
  target_monthly_conversions INTEGER DEFAULT 0,
  target_monthly_revenue    NUMERIC(15,2) DEFAULT 0,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BUSINESS CATEGORIES
CREATE TABLE business_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LEADS
CREATE TABLE leads (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name         TEXT NOT NULL,
  business_type         TEXT,
  category              TEXT,
  description           TEXT,
  country               TEXT DEFAULT 'Pakistan',
  city                  TEXT,
  area                  TEXT,
  full_address          TEXT,
  website               TEXT,
  google_maps_url       TEXT,
  google_place_id       TEXT,
  email                 TEXT,
  phone                 TEXT,
  whatsapp              TEXT,
  alternative_phone     TEXT,
  contact_person        TEXT,
  contact_position      TEXT,
  number_of_employees   INTEGER,
  google_rating         NUMERIC(3, 1),
  google_reviews_count  INTEGER,
  has_website           BOOLEAN DEFAULT FALSE,
  has_social_media      BOOLEAN DEFAULT FALSE,
  has_online_presence   BOOLEAN DEFAULT FALSE,
  lead_source           lead_source DEFAULT 'google_maps',
  pipeline_stage        pipeline_stage NOT NULL DEFAULT 'new',
  owner_id              UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LEAD SOCIAL LINKS
CREATE TABLE lead_social_links (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id       UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  facebook_url  TEXT,
  instagram_url TEXT,
  tiktok_url    TEXT,
  linkedin_url  TEXT,
  youtube_url   TEXT,
  other_url     TEXT,
  other_label   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OUTREACH ACTIVITIES
CREATE TABLE outreach_activities (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id          UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  employee_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  channel          outreach_channel NOT NULL,
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  message_status   message_status NOT NULL DEFAULT 'sent',
  response_status  response_status NOT NULL DEFAULT 'no_response',
  message_summary  TEXT,
  notes            TEXT,
  attachment_url   TEXT,
  follow_up_date   DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FOLLOW-UPS
CREATE TABLE follow_ups (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id      UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to  UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_by   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  due_date     DATE NOT NULL,
  priority     followup_priority NOT NULL DEFAULT 'normal',
  status       followup_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE projects (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id                  UUID REFERENCES leads(id) ON DELETE SET NULL,
  employee_id              UUID REFERENCES profiles(id) ON DELETE SET NULL,
  project_name             TEXT NOT NULL,
  project_value            NUMERIC(15, 2),
  currency                 TEXT NOT NULL DEFAULT 'PKR',
  status                   project_status NOT NULL DEFAULT 'pending',
  start_date               DATE,
  expected_completion_date DATE,
  completed_at             TIMESTAMPTZ,
  notes                    TEXT,
  deleted_at               TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTES (append-only)
CREATE TABLE notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AUDIT LOGS (immutable)
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  action      audit_action NOT NULL,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ================================================================
-- STEP 5: TRIGGERS — auto updated_at
-- ================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER lead_social_links_updated_at
  BEFORE UPDATE ON lead_social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER follow_ups_updated_at
  BEFORE UPDATE ON follow_ups FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ================================================================
-- STEP 6: TRIGGER — Auto-create profile when user signs up
-- ================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role    user_role;
  v_status  employee_status;
BEGIN
  -- Determine role from metadata (default: employee)
  v_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'employee'::user_role
  );

  -- super_admin and admin are always active
  -- Employees created by admin (admin_created=true) are active immediately
  -- Employees who self-register start as 'pending'
  IF v_role IN ('admin', 'super_admin') THEN
    v_status := 'active';
  ELSIF (NEW.raw_user_meta_data->>'admin_created')::boolean IS TRUE THEN
    v_status := 'active';
  ELSE
    v_status := 'pending';
  END IF;

  INSERT INTO public.profiles (auth_user_id, email, full_name, role, status, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    v_role,
    v_status,
    -- Admins and super_admins skip onboarding
    v_role IN ('admin', 'super_admin')
  )
  ON CONFLICT (auth_user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ================================================================
-- STEP 7: HELPER FUNCTIONS FOR RLS
-- ================================================================

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_my_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns true for both admin AND super_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
      AND status = 'active'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ================================================================
-- STEP 8: ROW LEVEL SECURITY POLICIES
-- ================================================================

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select"
  ON profiles FOR SELECT
  USING (auth_user_id = auth.uid() OR is_admin());

CREATE POLICY "profiles_own_update"
  ON profiles FOR UPDATE
  USING (auth_user_id = auth.uid() OR is_admin());

CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  WITH CHECK (is_admin() OR auth_user_id = auth.uid());

-- BUSINESS CATEGORIES
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select"
  ON business_categories FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "categories_admin"
  ON business_categories FOR ALL
  USING (is_admin());

-- LEADS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select"
  ON leads FOR SELECT
  USING (
    deleted_at IS NULL AND (
      is_admin() OR
      owner_id = get_my_profile_id() OR
      created_by = get_my_profile_id()
    )
  );

CREATE POLICY "leads_insert"
  ON leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "leads_update"
  ON leads FOR UPDATE
  USING (
    is_admin() OR
    owner_id = get_my_profile_id() OR
    created_by = get_my_profile_id()
  );

CREATE POLICY "leads_delete"
  ON leads FOR DELETE
  USING (is_admin());

-- LEAD SOCIAL LINKS
ALTER TABLE lead_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_social_select"
  ON lead_social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l WHERE l.id = lead_id AND l.deleted_at IS NULL AND
      (is_admin() OR l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

CREATE POLICY "lead_social_insert"
  ON lead_social_links FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "lead_social_update"
  ON lead_social_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM leads l WHERE l.id = lead_id AND
      (is_admin() OR l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

-- OUTREACH ACTIVITIES
ALTER TABLE outreach_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "outreach_select"
  ON outreach_activities FOR SELECT
  USING (
    is_admin() OR
    employee_id = get_my_profile_id() OR
    EXISTS (
      SELECT 1 FROM leads l WHERE l.id = lead_id AND
      (l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

CREATE POLICY "outreach_insert"
  ON outreach_activities FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND employee_id = get_my_profile_id());

CREATE POLICY "outreach_update"
  ON outreach_activities FOR UPDATE
  USING (is_admin() OR employee_id = get_my_profile_id());

-- FOLLOW-UPS
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

-- PROJECTS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select"
  ON projects FOR SELECT
  USING (
    deleted_at IS NULL AND (
      is_admin() OR employee_id = get_my_profile_id()
    )
  );

CREATE POLICY "projects_insert"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projects_update"
  ON projects FOR UPDATE
  USING (is_admin() OR employee_id = get_my_profile_id());

-- NOTES
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select"
  ON notes FOR SELECT
  USING (
    is_admin() OR
    employee_id = get_my_profile_id() OR
    EXISTS (
      SELECT 1 FROM leads l WHERE l.id = lead_id AND
      (l.owner_id = get_my_profile_id() OR l.created_by = get_my_profile_id())
    )
  );

CREATE POLICY "notes_insert"
  ON notes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND employee_id = get_my_profile_id());

CREATE POLICY "notes_admin_delete"
  ON notes FOR DELETE
  USING (is_admin());

-- AUDIT LOGS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_admin_select"
  ON audit_logs FOR SELECT
  USING (is_admin());

CREATE POLICY "audit_insert"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');


-- ================================================================
-- STEP 9: INDEXES (for performance)
-- ================================================================

CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE INDEX idx_leads_owner_id ON leads(owner_id);
CREATE INDEX idx_leads_created_by ON leads(created_by);
CREATE INDEX idx_leads_pipeline_stage ON leads(pipeline_stage);
CREATE INDEX idx_leads_business_name ON leads USING gin(business_name gin_trgm_ops);
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_category ON leads(category);
CREATE INDEX idx_leads_deleted_at ON leads(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_lead_source ON leads(lead_source);

CREATE INDEX idx_outreach_lead_id ON outreach_activities(lead_id);
CREATE INDEX idx_outreach_employee_id ON outreach_activities(employee_id);
CREATE INDEX idx_outreach_sent_at ON outreach_activities(sent_at DESC);
CREATE INDEX idx_outreach_channel ON outreach_activities(channel);
CREATE INDEX idx_outreach_response_status ON outreach_activities(response_status);

CREATE INDEX idx_followups_lead_id ON follow_ups(lead_id);
CREATE INDEX idx_followups_assigned_to ON follow_ups(assigned_to);
CREATE INDEX idx_followups_due_date ON follow_ups(due_date);
CREATE INDEX idx_followups_status ON follow_ups(status);
CREATE INDEX idx_followups_deleted_at ON follow_ups(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_projects_employee_id ON projects(employee_id);
CREATE INDEX idx_projects_lead_id ON projects(lead_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_notes_lead_id ON notes(lead_id);
CREATE INDEX idx_notes_employee_id ON notes(employee_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);


-- ================================================================
-- STEP 10: STORAGE BUCKETS
-- ================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('outreach-attachments', 'outreach-attachments', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars_own_update" ON storage.objects;
DROP POLICY IF EXISTS "avatars_own_delete" ON storage.objects;
DROP POLICY IF EXISTS "outreach_attach_insert" ON storage.objects;
DROP POLICY IF EXISTS "outreach_attach_select" ON storage.objects;

CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_own_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_own_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "outreach_attach_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'outreach-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "outreach_attach_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'outreach-attachments' AND auth.role() = 'authenticated');



-- ================================================================
-- STEP 11: SEED — Business Categories
-- ================================================================

INSERT INTO business_categories (name) VALUES
  ('Restaurant'), ('Cafe / Coffee Shop'), ('Dental Clinic'),
  ('Medical Clinic'), ('Hospital'), ('Pharmacy'),
  ('Gym / Fitness Center'), ('Salon / Beauty Parlor'), ('Barber Shop'),
  ('Real Estate'), ('Law Firm'), ('Accounting / Finance'),
  ('Hotel / Guesthouse'), ('Bakery'), ('Grocery Store'),
  ('Clothing Store'), ('Electronics Store'), ('Furniture Store'),
  ('E-commerce'), ('Software Company'), ('Marketing Agency'),
  ('Photography Studio'), ('Event Management'), ('Travel Agency'),
  ('Education / School'), ('Auto Repair / Garage'), ('Construction'),
  ('Interior Design'), ('Courier / Logistics'), ('Other')
ON CONFLICT (name) DO NOTHING;


-- ================================================================
-- STEP 12: SUPER ADMIN PROFILE
-- Auth user already exists (created via seed script)
-- UUID: 4863b4ff-feb1-4ed4-9eb0-c4fbbc3cfb5c
-- Email: samstacktechs@gmail.com
-- ================================================================

INSERT INTO profiles (
  auth_user_id,
  email,
  full_name,
  role,
  status,
  onboarding_completed,
  job_title,
  department
)
VALUES (
  '4863b4ff-feb1-4ed4-9eb0-c4fbbc3cfb5c',
  'samstacktechs@gmail.com',
  'Super Admin',
  'super_admin',
  'active',
  true,
  'Super Administrator',
  'Management'
)
ON CONFLICT (auth_user_id) DO UPDATE SET
  full_name            = 'Super Admin',
  role                 = 'super_admin',
  status               = 'active',
  onboarding_completed = true,
  job_title            = 'Super Administrator',
  department           = 'Management',
  updated_at           = now();


-- ================================================================
-- DONE!
-- Login at: http://localhost:3000/login
-- Email:    samstacktechs@gmail.com
-- Password: Salman123@
-- ================================================================
