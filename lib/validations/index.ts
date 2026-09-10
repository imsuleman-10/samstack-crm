import { z } from 'zod'

// ============================================================
// LEAD VALIDATION
// ============================================================

export const quickAddLeadSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  category: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default('Pakistan'),
  google_maps_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  facebook_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  instagram_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  tiktok_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  lead_source: z.enum(['google_maps', 'facebook', 'instagram', 'tiktok', 'website', 'referral', 'manual_entry', 'other']).default('google_maps'),
})

export const fullLeadSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  business_type: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  country: z.string().default('Pakistan'),
  city: z.string().optional(),
  area: z.string().optional(),
  full_address: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  google_maps_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  google_place_id: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  alternative_phone: z.string().optional(),
  contact_person: z.string().optional(),
  contact_position: z.string().optional(),
  number_of_employees: z.coerce.number().int().positive().optional(),
  google_rating: z.coerce.number().min(0).max(5).optional(),
  google_reviews_count: z.coerce.number().int().min(0).optional(),
  has_website: z.boolean().default(false),
  has_social_media: z.boolean().default(false),
  has_online_presence: z.boolean().default(false),
  lead_source: z.enum(['google_maps', 'facebook', 'instagram', 'tiktok', 'website', 'referral', 'manual_entry', 'other']).default('google_maps'),
  // Social links (nested)
  facebook_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  instagram_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  tiktok_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  youtube_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

export type QuickAddLeadInput = z.infer<typeof quickAddLeadSchema>
export type FullLeadInput = z.infer<typeof fullLeadSchema>

// ============================================================
// OUTREACH VALIDATION
// ============================================================

export const outreachSchema = z.object({
  lead_id: z.string().uuid(),
  channel: z.enum(['facebook', 'instagram', 'tiktok', 'whatsapp', 'email', 'phone_call', 'website_form', 'linkedin', 'sms', 'other']),
  sent_at: z.string().datetime().optional(),
  message_status: z.enum(['not_sent', 'sent', 'delivered', 'seen', 'opened', 'failed', 'unknown']).default('sent'),
  response_status: z.enum(['no_response', 'seen_no_reply', 'replied', 'interested', 'not_interested', 'asked_for_details', 'meeting_requested', 'meeting_scheduled', 'negotiating', 'converted', 'lost']).default('no_response'),
  message_summary: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  follow_up_date: z.string().optional(),
})

export type OutreachInput = z.infer<typeof outreachSchema>

// ============================================================
// FOLLOW-UP VALIDATION
// ============================================================

export const followUpSchema = z.object({
  lead_id: z.string().uuid(),
  assigned_to: z.string().uuid(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  due_date: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
})

export type FollowUpInput = z.infer<typeof followUpSchema>

// ============================================================
// PROJECT VALIDATION
// ============================================================

export const projectSchema = z.object({
  lead_id: z.string().uuid().optional(),
  project_name: z.string().min(2, 'Project name is required'),
  project_value: z.coerce.number().positive().optional(),
  currency: z.string().default('PKR'),
  status: z.enum(['pending', 'approved', 'in_progress', 'completed', 'cancelled']).default('pending'),
  start_date: z.string().optional(),
  expected_completion_date: z.string().optional(),
  notes: z.string().optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>

// ============================================================
// PROFILE / ONBOARDING VALIDATION
// ============================================================

export const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  job_title: z.string().min(2, 'Job title is required'),
  employee_id: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500).optional(),
  joining_date: z.string().optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500).optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

// ============================================================
// EMPLOYEE CREATION (Admin)
// ============================================================

export const createEmployeeSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'employee']).default('employee'),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  employee_id: z.string().optional(),
  department: z.string().optional(),
  joining_date: z.string().optional(),
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>

// ============================================================
// AUTH VALIDATION
// ============================================================

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

// ============================================================
// NOTE VALIDATION
// ============================================================

export const noteSchema = z.object({
  lead_id: z.string().uuid(),
  content: z.string().min(1, 'Note cannot be empty').max(5000),
})

export type NoteInput = z.infer<typeof noteSchema>
