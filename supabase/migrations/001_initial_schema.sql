-- ============================================================
-- SAMStack CRM — Initial Schema
-- Migration: 001_initial_schema.sql
-- Apply in: Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'employee');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'suspended');

CREATE TYPE pipeline_stage AS ENUM (
  'new',
  'contacted',
  'seen',
  'replied',
  'interested',
  'qualified',
  'proposal_sent',
  'negotiation',
  'won',
  'project_started',
  'project_completed',
  'not_interested',
  'not_qualified',
  'lost'
);

CREATE TYPE lead_source AS ENUM (
  'google_maps',
  'facebook',
  'instagram',
  'tiktok',
  'website',
  'referral',
  'manual_entry',
  'other'
);

CREATE TYPE outreach_channel AS ENUM (
  'facebook',
  'instagram',
  'tiktok',
  'whatsapp',
  'email',
  'phone_call',
  'website_form',
  'linkedin',
  'sms',
  'other'
);

CREATE TYPE message_status AS ENUM (
  'not_sent',
  'sent',
  'delivered',
  'seen',
  'opened',
  'failed',
  'unknown'
);

CREATE TYPE response_status AS ENUM (
  'no_response',
  'seen_no_reply',
  'replied',
  'interested',
  'not_interested',
  'asked_for_details',
  'meeting_requested',
  'meeting_scheduled',
  'negotiating',
  'converted',
  'lost'
);

CREATE TYPE followup_status AS ENUM (
  'pending',
  'completed',
  'skipped',
  'overdue',
  'cancelled'
);

CREATE TYPE followup_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TYPE project_status AS ENUM (
  'pending',
  'approved',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE audit_action AS ENUM (
  'created',
  'updated',
  'deleted',
  'activated',
  'deactivated',
  'suspended',
  'assigned',
  'reassigned',
  'status_changed',
  'stage_changed',
  'completed',
  'cancelled'
);

-- ============================================================
-- PROFILES TABLE
-- Extended user information for both admin and employees
-- ============================================================

CREATE TABLE profiles (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id   UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT NOT NULL DEFAULT '',
  email          TEXT NOT NULL DEFAULT '',
  phone          TEXT,
  profile_photo_url TEXT,
  role           user_role NOT NULL DEFAULT 'employee',
  status         employee_status NOT NULL DEFAULT 'active',
  job_title      TEXT,
  employee_id    TEXT UNIQUE,
  department     TEXT,
  bio            TEXT,
  joining_date   DATE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BUSINESS CATEGORIES TABLE
-- ============================================================

CREATE TABLE business_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LEADS TABLE
-- Core entity — one record per business
-- ============================================================

CREATE TABLE leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Information
  business_name       TEXT NOT NULL,
  business_type       TEXT,
  category            TEXT,
  description         TEXT,

  -- Location
  country             TEXT DEFAULT 'Pakistan',
  city                TEXT,
  area                TEXT,
  full_address        TEXT,

  -- Online Presence
  website             TEXT,
  google_maps_url     TEXT,
  google_place_id     TEXT,

  -- Contact Information
  email               TEXT,
  phone               TEXT,
  whatsapp            TEXT,
  alternative_phone   TEXT,
  contact_person      TEXT,
  contact_position    TEXT,

  -- Business Intelligence
  number_of_employees INTEGER,
  google_rating       NUMERIC(3, 1),
  google_reviews_count INTEGER,
  has_website         BOOLEAN DEFAULT FALSE,
  has_social_media    BOOLEAN DEFAULT FALSE,
  has_online_presence BOOLEAN DEFAULT FALSE,

  -- Lead Metadata
  lead_source         lead_source DEFAULT 'google_maps',
  pipeline_stage      pipeline_stage NOT NULL DEFAULT 'new',

  -- Ownership
  owner_id            UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Soft delete
  deleted_at          TIMESTAMPTZ,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LEAD SOCIAL LINKS TABLE
-- ============================================================

CREATE TABLE lead_social_links (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id      UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url   TEXT,
  linkedin_url TEXT,
  youtube_url  TEXT,
  other_url    TEXT,
  other_label  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- OUTREACH ACTIVITIES TABLE
-- Every communication attempt, append-only
-- ============================================================

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

-- ============================================================
-- FOLLOW-UPS TABLE
-- ============================================================

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

-- ============================================================
-- PROJECTS TABLE
-- Won deals that became real projects
-- ============================================================

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

-- ============================================================
-- NOTES TABLE
-- Append-only notes per lead
-- ============================================================

CREATE TABLE notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at — notes are append-only
);

-- ============================================================
-- AUDIT LOGS TABLE
-- Immutable audit trail
-- ============================================================

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,  -- 'lead', 'employee', 'project', etc.
  entity_id   UUID,
  action      audit_action NOT NULL,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS — updated_at auto-update
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER lead_social_links_updated_at
  BEFORE UPDATE ON lead_social_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER follow_ups_updated_at
  BEFORE UPDATE ON follow_ups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER — Sync profile email from auth.users
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employee')
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- STORAGE BUCKETS (run separately or via Supabase dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('outreach-attachments', 'outreach-attachments', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);
