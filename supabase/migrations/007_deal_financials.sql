-- ================================================================
-- Migration: 007_deal_financials.sql
-- Description: Add deal price tracking (offered_price, deal_value, amount_received, currency)
-- to leads and projects tables.
-- ================================================================

-- 1. Add financial tracking to leads
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS offered_price NUMERIC(15, 2),
  ADD COLUMN IF NOT EXISTS deal_value NUMERIC(15, 2),
  ADD COLUMN IF NOT EXISTS amount_received NUMERIC(15, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'PKR';

-- 2. Add financial tracking to projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS offered_price NUMERIC(15, 2),
  ADD COLUMN IF NOT EXISTS amount_received NUMERIC(15, 2) DEFAULT 0;

-- 3. Update existing projects to set amount_received equal to project_value if completed
UPDATE projects
SET amount_received = COALESCE(project_value, 0)
WHERE status = 'completed' AND amount_received IS NULL;
