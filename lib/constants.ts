// ============================================================
// SAMStack CRM — Label Maps & Constants
// ============================================================

import type {
  PipelineStage,
  LeadSource,
  OutreachChannel,
  MessageStatus,
  ResponseStatus,
  FollowUpStatus,
  FollowUpPriority,
  ProjectStatus,
  EmployeeStatus,
} from '@/lib/types/database'

// ============================================================
// PIPELINE STAGES
// ============================================================

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  seen: 'Message Seen',
  replied: 'Replied',
  interested: 'Interested',
  qualified: 'Qualified',
  proposal_sent: 'Proposal Sent',
  negotiation: 'Negotiation',
  won: 'Won',
  project_started: 'Project Started',
  project_completed: 'Project Completed',
  not_interested: 'Not Interested',
  not_qualified: 'Not Qualified',
  lost: 'Lost',
}

export const PIPELINE_STAGE_COLORS: Record<PipelineStage, string> = {
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  contacted: 'bg-blue-100 text-blue-700 border-blue-200',
  seen: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  replied: 'bg-violet-100 text-violet-700 border-violet-200',
  interested: 'bg-amber-100 text-amber-700 border-amber-200',
  qualified: 'bg-orange-100 text-orange-700 border-orange-200',
  proposal_sent: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  negotiation: 'bg-purple-100 text-purple-700 border-purple-200',
  won: 'bg-green-100 text-green-700 border-green-200',
  project_started: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  project_completed: 'bg-teal-100 text-teal-700 border-teal-200',
  not_interested: 'bg-red-100 text-red-700 border-red-200',
  not_qualified: 'bg-rose-100 text-rose-700 border-rose-200',
  lost: 'bg-gray-100 text-gray-500 border-gray-200',
}

export const PIPELINE_STAGES_ORDERED: PipelineStage[] = [
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
]

export const PIPELINE_LOST_STAGES: PipelineStage[] = [
  'not_interested',
  'not_qualified',
  'lost',
]

// ============================================================
// LEAD SOURCES
// ============================================================

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  google_maps: 'Google Maps',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  website: 'Website',
  referral: 'Referral',
  manual_entry: 'Manual Entry',
  other: 'Other',
}

export const LEAD_SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'google_maps', label: 'Google Maps' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'manual_entry', label: 'Manual Entry' },
  { value: 'other', label: 'Other' },
]

// ============================================================
// OUTREACH CHANNELS
// ============================================================

export const CHANNEL_LABELS: Record<OutreachChannel, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  email: 'Email',
  phone_call: 'Phone Call',
  website_form: 'Website Form',
  linkedin: 'LinkedIn',
  sms: 'SMS',
  other: 'Other',
}

export const CHANNEL_COLORS: Record<OutreachChannel, string> = {
  facebook: 'bg-blue-100 text-blue-700',
  instagram: 'bg-pink-100 text-pink-700',
  tiktok: 'bg-slate-100 text-slate-700',
  whatsapp: 'bg-green-100 text-green-700',
  email: 'bg-yellow-100 text-yellow-700',
  phone_call: 'bg-purple-100 text-purple-700',
  website_form: 'bg-cyan-100 text-cyan-700',
  linkedin: 'bg-sky-100 text-sky-700',
  sms: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-600',
}

export const CHANNEL_OPTIONS: { value: OutreachChannel; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'phone_call', label: 'Phone Call' },
  { value: 'website_form', label: 'Website Form' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'sms', label: 'SMS' },
  { value: 'other', label: 'Other' },
]

// ============================================================
// MESSAGE STATUS
// ============================================================

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  not_sent: 'Not Sent',
  sent: 'Sent',
  delivered: 'Delivered',
  seen: 'Seen',
  opened: 'Opened',
  failed: 'Failed',
  unknown: 'Unknown',
}

export const MESSAGE_STATUS_COLORS: Record<MessageStatus, string> = {
  not_sent: 'bg-gray-100 text-gray-500',
  sent: 'bg-blue-100 text-blue-700',
  delivered: 'bg-indigo-100 text-indigo-700',
  seen: 'bg-violet-100 text-violet-700',
  opened: 'bg-purple-100 text-purple-700',
  failed: 'bg-red-100 text-red-700',
  unknown: 'bg-gray-100 text-gray-500',
}

export const MESSAGE_STATUS_OPTIONS: { value: MessageStatus; label: string }[] = [
  { value: 'not_sent', label: 'Not Sent' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'seen', label: 'Seen' },
  { value: 'opened', label: 'Opened' },
  { value: 'failed', label: 'Failed' },
  { value: 'unknown', label: 'Unknown' },
]

// ============================================================
// RESPONSE STATUS
// ============================================================

export const RESPONSE_STATUS_LABELS: Record<ResponseStatus, string> = {
  no_response: 'No Response',
  seen_no_reply: 'Seen – No Reply',
  replied: 'Replied',
  interested: 'Interested',
  not_interested: 'Not Interested',
  asked_for_details: 'Asked for Details',
  meeting_requested: 'Meeting Requested',
  meeting_scheduled: 'Meeting Scheduled',
  negotiating: 'Negotiating',
  converted: 'Converted',
  lost: 'Lost',
}

export const RESPONSE_STATUS_COLORS: Record<ResponseStatus, string> = {
  no_response: 'bg-gray-100 text-gray-500',
  seen_no_reply: 'bg-slate-100 text-slate-600',
  replied: 'bg-blue-100 text-blue-700',
  interested: 'bg-amber-100 text-amber-700',
  not_interested: 'bg-red-100 text-red-600',
  asked_for_details: 'bg-cyan-100 text-cyan-700',
  meeting_requested: 'bg-violet-100 text-violet-700',
  meeting_scheduled: 'bg-indigo-100 text-indigo-700',
  negotiating: 'bg-orange-100 text-orange-700',
  converted: 'bg-green-100 text-green-700',
  lost: 'bg-rose-100 text-rose-600',
}

export const RESPONSE_STATUS_OPTIONS: { value: ResponseStatus; label: string }[] = [
  { value: 'no_response', label: 'No Response' },
  { value: 'seen_no_reply', label: 'Seen – No Reply' },
  { value: 'replied', label: 'Replied' },
  { value: 'interested', label: 'Interested' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'asked_for_details', label: 'Asked for Details' },
  { value: 'meeting_requested', label: 'Meeting Requested' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
]

// ============================================================
// FOLLOW-UP STATUS
// ============================================================

export const FOLLOWUP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  skipped: 'Skipped',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

export const FOLLOWUP_STATUS_COLORS: Record<FollowUpStatus, string> = {
  pending: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  skipped: 'bg-gray-100 text-gray-500',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-rose-100 text-rose-600',
}

export const FOLLOWUP_PRIORITY_LABELS: Record<FollowUpPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

export const FOLLOWUP_PRIORITY_COLORS: Record<FollowUpPriority, string> = {
  low: 'bg-gray-100 text-gray-500',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

// ============================================================
// PROJECT STATUS
// ============================================================

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

// ============================================================
// EMPLOYEE STATUS
// ============================================================

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  pending: 'Pending Approval',
}

export const EMPLOYEE_STATUS_COLORS: Record<EmployeeStatus, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  suspended: 'bg-red-100 text-red-600',
  pending: 'bg-amber-100 text-amber-700',
}

// ============================================================
// DATE FILTER RANGES
// ============================================================

export const DATE_FILTER_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
] as const

export type DateFilterValue = typeof DATE_FILTER_OPTIONS[number]['value']

// ============================================================
// CURRENCIES
// ============================================================

export const CURRENCIES = [
  { value: 'PKR', label: 'PKR — Pakistani Rupee' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'SAR', label: 'SAR — Saudi Riyal' },
]