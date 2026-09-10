-- ============================================================
-- SAMStack CRM — Database Indexes
-- Migration: 003_indexes.sql
-- Apply AFTER 001_initial_schema.sql
-- ============================================================

-- profiles
CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_email ON profiles(email);

-- leads
CREATE INDEX idx_leads_owner_id ON leads(owner_id);
CREATE INDEX idx_leads_created_by ON leads(created_by);
CREATE INDEX idx_leads_google_place_id ON leads(google_place_id) WHERE google_place_id IS NOT NULL;
CREATE INDEX idx_leads_business_name ON leads USING gin(business_name gin_trgm_ops);
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_category ON leads(category);
CREATE INDEX idx_leads_pipeline_stage ON leads(pipeline_stage);
CREATE INDEX idx_leads_phone ON leads(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_leads_email ON leads(email) WHERE email IS NOT NULL;
CREATE INDEX idx_leads_website ON leads(website) WHERE website IS NOT NULL;
CREATE INDEX idx_leads_deleted_at ON leads(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_updated_at ON leads(updated_at DESC);
CREATE INDEX idx_leads_lead_source ON leads(lead_source);
CREATE INDEX idx_leads_country ON leads(country);

-- outreach_activities
CREATE INDEX idx_outreach_lead_id ON outreach_activities(lead_id);
CREATE INDEX idx_outreach_employee_id ON outreach_activities(employee_id);
CREATE INDEX idx_outreach_sent_at ON outreach_activities(sent_at DESC);
CREATE INDEX idx_outreach_channel ON outreach_activities(channel);
CREATE INDEX idx_outreach_response_status ON outreach_activities(response_status);
CREATE INDEX idx_outreach_message_status ON outreach_activities(message_status);

-- follow_ups
CREATE INDEX idx_followups_lead_id ON follow_ups(lead_id);
CREATE INDEX idx_followups_assigned_to ON follow_ups(assigned_to);
CREATE INDEX idx_followups_due_date ON follow_ups(due_date);
CREATE INDEX idx_followups_status ON follow_ups(status);
CREATE INDEX idx_followups_priority ON follow_ups(priority);
CREATE INDEX idx_followups_deleted_at ON follow_ups(deleted_at) WHERE deleted_at IS NULL;

-- projects
CREATE INDEX idx_projects_employee_id ON projects(employee_id);
CREATE INDEX idx_projects_lead_id ON projects(lead_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NULL;

-- notes
CREATE INDEX idx_notes_lead_id ON notes(lead_id);
CREATE INDEX idx_notes_employee_id ON notes(employee_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

-- audit_logs
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
