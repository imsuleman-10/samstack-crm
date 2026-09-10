-- ============================================================
-- SAMStack CRM — Seed Data
-- seed.sql — Run AFTER all migrations
-- ============================================================

-- Business Categories
INSERT INTO business_categories (name) VALUES
  ('Restaurant'),
  ('Cafe / Coffee Shop'),
  ('Dental Clinic'),
  ('Medical Clinic'),
  ('Hospital'),
  ('Pharmacy'),
  ('Gym / Fitness Center'),
  ('Salon / Beauty Parlor'),
  ('Barber Shop'),
  ('Real Estate'),
  ('Law Firm'),
  ('Accounting / Finance'),
  ('Hotel / Guesthouse'),
  ('Bakery'),
  ('Grocery Store'),
  ('Clothing Store'),
  ('Electronics Store'),
  ('Furniture Store'),
  ('E-commerce'),
  ('Software Company'),
  ('Marketing Agency'),
  ('Photography Studio'),
  ('Event Management'),
  ('Travel Agency'),
  ('Education / School'),
  ('Auto Repair / Garage'),
  ('Construction'),
  ('Interior Design'),
  ('Courier / Logistics'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Admin Account Setup Instructions
-- ============================================================
-- The auth user has been created via the seed script:
--   Email   : samstacktechs@gmail.com
--   Password: Salman123@
--   UUID    : 4863b4ff-feb1-4ed4-9eb0-c4fbbc3cfb5c
--
-- After running ALL migrations (001, 002, 003) in Supabase SQL Editor,
-- run this SQL to finalize the admin profile:
-- ============================================================

-- Step 1: The trigger should auto-create a profiles row.
-- If it didn't, insert manually:
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
  full_name          = 'Super Admin',
  role               = 'super_admin',
  status             = 'active',
  onboarding_completed = true,
  job_title          = 'Super Administrator',
  department         = 'Management',
  updated_at         = now();


