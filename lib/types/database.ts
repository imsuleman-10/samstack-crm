// ============================================================
// SAMStack CRM — Database TypeScript Types
// Auto-maintained (update when schema changes)
// ============================================================

export type UserRole = 'super_admin' | 'admin' | 'employee'
export type EmployeeStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export type PipelineStage =
  | 'new'
  | 'contacted'
  | 'seen'
  | 'replied'
  | 'interested'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'project_started'
  | 'project_completed'
  | 'not_interested'
  | 'not_qualified'
  | 'lost'

export type LeadSource =
  | 'google_maps'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'website'
  | 'referral'
  | 'manual_entry'
  | 'other'

export type OutreachChannel =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'whatsapp'
  | 'email'
  | 'phone_call'
  | 'website_form'
  | 'linkedin'
  | 'sms'
  | 'other'

export type MessageStatus =
  | 'not_sent'
  | 'sent'
  | 'delivered'
  | 'seen'
  | 'opened'
  | 'failed'
  | 'unknown'

export type ResponseStatus =
  | 'no_response'
  | 'seen_no_reply'
  | 'replied'
  | 'interested'
  | 'not_interested'
  | 'asked_for_details'
  | 'meeting_requested'
  | 'meeting_scheduled'
  | 'negotiating'
  | 'converted'
  | 'lost'

export type FollowUpStatus = 'pending' | 'completed' | 'skipped' | 'overdue' | 'cancelled'
export type FollowUpPriority = 'low' | 'normal' | 'high' | 'urgent'

export type ProjectStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'

export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'deleted_with_leads'
  | 'activated'
  | 'deactivated'
  | 'suspended'
  | 'assigned'
  | 'reassigned'
  | 'status_changed'
  | 'stage_changed'
  | 'completed'
  | 'cancelled'

// ============================================================
// TABLE ROW TYPES
// ============================================================

export interface Profile {
  id: string
  auth_user_id: string
  full_name: string
  email: string
  phone: string | null
  profile_photo_url: string | null
  role: UserRole
  status: EmployeeStatus
  job_title: string | null
  employee_id: string | null
  department: string | null
  bio: string | null
  joining_date: string | null
  target_weekly_outreach?: number | null
  target_monthly_conversions?: number | null
  target_monthly_revenue?: number | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface BusinessCategory {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Lead {
  id: string
  business_name: string
  business_type: string | null
  category: string | null
  description: string | null
  country: string | null
  city: string | null
  area: string | null
  full_address: string | null
  website: string | null
  google_maps_url: string | null
  google_place_id: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  alternative_phone: string | null
  contact_person: string | null
  contact_position: string | null
  number_of_employees: number | null
  google_rating: number | null
  google_reviews_count: number | null
  has_website: boolean
  has_social_media: boolean
  has_online_presence: boolean
  lead_source: LeadSource
  pipeline_stage: PipelineStage
  owner_id: string | null
  created_by: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  // Joined
  owner?: Profile | null
  social_links?: LeadSocialLinks | null
}

export interface LeadSocialLinks {
  id: string
  lead_id: string
  facebook_url: string | null
  instagram_url: string | null
  tiktok_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
  other_url: string | null
  other_label: string | null
  created_at: string
  updated_at: string
}

export interface OutreachActivity {
  id: string
  lead_id: string
  employee_id: string
  channel: OutreachChannel
  sent_at: string
  message_status: MessageStatus
  response_status: ResponseStatus
  message_summary: string | null
  notes: string | null
  attachment_url: string | null
  follow_up_date: string | null
  created_at: string
  // Joined
  employee?: Profile | null
  lead?: Lead | null
}

export interface FollowUp {
  id: string
  lead_id: string
  assigned_to: string
  created_by: string | null
  title: string
  description: string | null
  due_date: string
  priority: FollowUpPriority
  status: FollowUpStatus
  completed_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  // Joined
  lead?: Lead | null
  assignee?: Profile | null
}

export interface Project {
  id: string
  lead_id: string | null
  employee_id: string | null
  project_name: string
  project_value: number | null
  currency: string
  status: ProjectStatus
  start_date: string | null
  expected_completion_date: string | null
  completed_at: string | null
  notes: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  // Joined
  lead?: Lead | null
  employee?: Profile | null
}

export interface Note {
  id: string
  lead_id: string
  employee_id: string
  content: string
  created_at: string
  // Joined
  author?: Profile | null
}

export interface AuditLog {
  id: string
  user_id: string | null
  entity_type: string
  entity_id: string | null
  action: AuditAction
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
  // Joined
  user?: Profile | null
}

// ============================================================
// INSERT TYPES
// ============================================================

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'owner' | 'social_links'>
export type OutreachInsert = Omit<OutreachActivity, 'id' | 'created_at' | 'employee' | 'lead'>
export type FollowUpInsert = Omit<FollowUp, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'completed_at' | 'lead' | 'assignee'>
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'completed_at' | 'lead' | 'employee'>
export type NoteInsert = Omit<Note, 'id' | 'created_at' | 'author'>
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type AuditLogInsert = Omit<AuditLog, 'id' | 'created_at' | 'user'>
