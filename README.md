# SAMStack CRM

<p align="center">
  <img src="./app/icon.png" alt="SAMStack CRM" width="72" />
</p>

<p align="center">
  <strong>A full-featured, role-based Customer Relationship Management system built for modern sales teams.</strong><br/>
  Built with Next.js 15, Supabase, and Tailwind CSS.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## ✨ Overview

SAMStack CRM is a production-grade sales management platform that helps teams track leads, manage outreach, coordinate follow-ups, and measure performance — all under a strict role-based access control (RBAC) model backed by Supabase Row-Level Security (RLS).

## 🗂️ Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Roles & Permissions](#-roles--permissions)
- [Registration & Onboarding Flow](#-registration--onboarding-flow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Security Model](#-security-model)
- [Scripts](#-scripts)

---

## 🚀 Features

### Employee Portal
- 📋 **Lead Management** — Create, update, and track leads through a configurable pipeline
- 📞 **Outreach Tracking** — Log calls, emails, meetings, and WhatsApp interactions per lead
- 📅 **Follow-up Scheduling** — Set reminders and follow-up tasks with due dates and priorities
- 📝 **Notes** — Attach free-form notes to any lead for context
- 📁 **Project Management** — Convert won leads into active projects with value tracking
- 👤 **Profile & Onboarding** — Self-serve profile setup with photo upload on first login

### Admin / Super Admin Portal
- 👥 **Employee Directory** — Full team management with approval, activation, suspension
- 🔐 **OTP-verified Signup** — New employees verify their email via 6-digit OTP before account creation
- 🗑️ **Employee Deletion** — Two-mode delete: *reassign leads to admin* OR *permanently delete employee + all data*
- 📊 **Analytics Dashboard** — Team-wide KPIs, pipeline stage breakdowns, conversion rates, revenue
- 🏆 **Leaderboard & Reports** — Top performers ranked by deals closed and revenue generated
- 📜 **Activity Audit Log** — Full changelog for all entity mutations (leads, employees, projects)
- ⚙️ **Settings** — System configuration and preferences

### Platform
- 🔒 **Row-Level Security** — Every database operation is guarded by Supabase RLS + server-side role validation
- 🌗 **Dark/Light Glassmorphism UI** — Premium design system with micro-animations
- 📱 **Responsive** — Optimised for desktop and tablet

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Server Actions) |
| Language | TypeScript 5 |
| Database | [Supabase](https://supabase.com/) (PostgreSQL 15) |
| Auth | Supabase Auth (Email OTP + Password) |
| ORM / Query | Supabase JS client (`@supabase/ssr`) |
| Styling | Tailwind CSS 4 |
| UI Components | Custom design system + Lucide React icons |
| Toast Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Validation | [Zod](https://zod.dev/) |
| Deployment | Vercel (recommended) |

---

## 🏗 Architecture

```
Browser
  │
  ├── Next.js App Router (RSC + Server Actions)
  │     ├── (auth)/*       → Login, Register (OTP), Forgot Password
  │     ├── (admin)/*      → Admin-only pages (employees, analytics, reports …)
  │     └── (employee)/*   → Employee-only pages (leads, follow-ups, projects …)
  │
  ├── Server Actions (lib/actions/*)
  │     ├── auth.ts        → login, logout, OTP send/verify, register
  │     ├── employees.ts   → CRUD, status changes, delete (with/without leads)
  │     ├── leads.ts       → Lead pipeline management
  │     ├── followups.ts   → Follow-up scheduling
  │     ├── outreach.ts    → Outreach activity logging
  │     ├── notes.ts       → Lead notes
  │     ├── projects.ts    → Project tracking
  │     └── audit.ts       → Audit log writer
  │
  └── Supabase (PostgreSQL + Auth + Storage)
        ├── profiles        → Extended user info, role, status
        ├── leads           → Lead pipeline records
        ├── follow_ups      → Follow-up tasks
        ├── outreach_activities → Call/email/meeting logs
        ├── notes           → Lead notes
        ├── projects        → Active project records
        └── audit_logs      → Immutable change history
```

---

## 👤 Roles & Permissions

| Permission | Employee | Admin | Super Admin |
|---|:---:|:---:|:---:|
| View own leads | ✅ | ✅ | ✅ |
| View all leads | ❌ | ✅ | ✅ |
| Create/edit leads | ✅ | ✅ | ✅ |
| Delete leads | ❌ | ✅ | ✅ |
| View analytics | ❌ | ✅ | ✅ |
| Approve employees | ❌ | ✅ | ✅ |
| Create employee accounts | ❌ | ✅ | ✅ |
| Delete employees (reassign) | ❌ | ✅ | ✅ |
| Delete employees + leads | ❌ | ✅ | ✅ |
| Create Admin accounts | ❌ | ❌ | ✅ |
| Delete Admin accounts | ❌ | ❌ | ✅ |

---

## 🔐 Registration & Onboarding Flow

```
1. Employee visits /register
2. Fills in: Name, Email, Phone, Password
3. System sends 6-digit OTP to their email (via Supabase Auth)
4. Employee enters OTP → verified ✓
5. Account created with status = "pending"
6. Admin sees pending badge → reviews → clicks Approve
7. Employee logs in → routed to /onboarding (first login)
8. Employee completes profile (job title, department, etc.)
9. Employee accesses full dashboard
```

> **Admin-created accounts** skip the OTP step and are set to `active` immediately.

---

## 🏁 Getting Started

### Prerequisites

- Node.js ≥ 18.17
- A [Supabase](https://supabase.com/) project (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/samstack-crm.git
cd samstack-crm

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.local.example .env.local
# → Fill in your Supabase credentials (see below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following keys:

```env
# Supabase project URL (from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase anon public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase service role secret key — NEVER expose to the browser
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Public site URL used for password-reset redirect links
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ **`SUPABASE_SERVICE_ROLE_KEY`** grants full database access bypassing RLS. Keep it server-side only and never commit it to source control.

---

## 📁 Project Structure

```
samstack-crm/
├── app/
│   ├── (auth)/            → Auth pages (login, register, forgot-password)
│   ├── (admin)/           → Admin layout + all admin pages
│   ├── (employee)/        → Employee layout + all employee pages
│   ├── onboarding/        → First-login profile setup
│   ├── pending-approval/  → Holding page for pending accounts
│   ├── layout.tsx         → Root layout
│   └── page.tsx           → Root redirect (role-based)
│
├── components/
│   ├── admin/             → Admin-specific components (tables, modals)
│   ├── employee/          → Employee-specific components
│   └── ui/                → Shared UI primitives
│
├── lib/
│   ├── actions/           → Next.js Server Actions
│   ├── queries/           → Read-only data fetching functions
│   ├── supabase/          → Supabase client factories (client / server / admin)
│   ├── types/             → TypeScript type definitions
│   ├── validations/       → Zod schemas
│   └── utils/             → Shared utility functions
│
├── supabase/              → SQL migrations
└── public/                → Static assets
```

---

## 🗄 Database Schema

### Core Tables

| Table | Purpose |
|---|---|
| `profiles` | Extended user profiles; linked to `auth.users` via `auth_user_id` |
| `leads` | Lead records with pipeline stage, value, contact info |
| `follow_ups` | Scheduled follow-up tasks linked to leads |
| `outreach_activities` | Logged call/email/meeting interactions per lead |
| `notes` | Free-form notes attached to leads |
| `projects` | Active projects created from won leads |
| `audit_logs` | Immutable record of all create/update/delete actions |

### Profile Status Values

| Status | Meaning |
|---|---|
| `pending` | Self-registered, awaiting admin approval |
| `active` | Approved and can log in |
| `inactive` | Deactivated, cannot log in |
| `suspended` | Suspended, cannot log in |

---

## 🔒 Security Model

- **RLS everywhere** — Every table has Row-Level Security policies enforced at the database level
- **Server-side role checks** — Every Server Action re-validates the caller's role using `adminSupabase` before performing any mutation
- **Service Role isolation** — `SUPABASE_SERVICE_ROLE_KEY` is used only in server-side actions after explicit authorization checks; it is never sent to the browser
- **OTP email verification** — New self-registered employees must verify their email with a 6-digit OTP before their account is created
- **Pending approval gate** — Even after OTP verification, accounts are `pending` until an admin manually activates them
- **Audit logging** — All critical mutations write to `audit_logs` with the actor's ID, timestamp, old/new values

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT © SAMStack — Built with ❤️ for high-performance sales teams.
