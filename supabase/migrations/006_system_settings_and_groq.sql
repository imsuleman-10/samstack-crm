-- ================================================================
-- Migration: 006_system_settings_and_groq.sql
-- Description: Create system_settings table for CRM configurations & Groq AI
-- ================================================================

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users with admin role to view and update system settings
DROP POLICY IF EXISTS "Admins can view and update system_settings" ON system_settings;
CREATE POLICY "Admins can view and update system_settings" ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_user_id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Pre-seed CRM configuration with Groq AI integration
INSERT INTO system_settings (key, value, updated_at)
VALUES (
  'crm_config',
  jsonb_build_object(
    'groq_api_key', '',
    'groq_model', 'openai/gpt-oss-20b',
    'default_currency', 'PKR',
    'default_country', 'Pakistan',
    'auto_ai_mapping_enabled', true
  ),
  NOW()
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = NOW();
