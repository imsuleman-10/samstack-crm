# Supabase Database Migrations Guide

This directory contains the database schema and migration scripts for the **SAMStack CRM** platform.

## Execution Order

When deploying to Supabase, run these scripts in sequence in the **Supabase Dashboard -> SQL Editor**:

1. `001_initial_schema.sql` - Core tables (`profiles`, `leads`, `projects`, `outreach_logs`, `follow_ups`, `notes`)
2. `002_rls_policies.sql` - Row Level Security policies for RBAC (super_admin, admin, employee)
3. `003_indexes.sql` - Performance indexing on search & foreign keys
4. `004_add_super_admin_and_pending.sql` - Role hierarchy & pending approval status
5. `005_fix_is_admin_super_admin.sql` - Helper functions for role checks
6. `006_system_settings_and_groq.sql` - CRM settings table, default currency (PKR), and Groq AI configurations
7. `007_deal_financials.sql` - Deal financial tracking (`offered_price`, `deal_value`, `amount_received`, `currency`) on leads and projects

## How to Apply Migrations

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/nqxhmdtsnwezwucnvckq).
2. Click on **SQL Editor** in the left sidebar.
3. Open `006_system_settings_and_groq.sql` and click **Run**.
4. Open `007_deal_financials.sql` and click **Run**.
