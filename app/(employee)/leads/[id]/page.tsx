import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getLeadById } from '@/lib/queries/leads'
import { getOutreachByLeadId } from '@/lib/queries/outreach'
import StatusBadge from '@/components/ui/status-badge'
import { formatDate, formatDateTime, getInitials } from '@/lib/utils'
import {
  Building2, Globe, Phone, Mail, MapPin, ChevronLeft,
  ExternalLink, MessageSquare, Calendar,
  Star, User, Clock
} from 'lucide-react'

const FacebookIcon = (props: any) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
)
const InstagramIcon = (props: any) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
)

import Link from 'next/link'
import { CHANNEL_LABELS } from '@/lib/constants'
import AddOutreachModal from './add-outreach-modal'
import AddFollowUpModal from './add-followup-modal'
import AddNoteForm from './add-note-form'
import LeadNotes from './lead-notes'
import LeadFollowUps from './lead-followups'
import StageSelector from './stage-selector'
import DeleteLeadModal from '@/components/leads/delete-lead-modal'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const lead = await getLeadById(id)
  return { title: lead?.business_name || 'Lead' }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('id, role').eq('auth_user_id', user.id).single()
  if (!profile) redirect('/login')

  const [lead, activities] = await Promise.all([
    getLeadById(id),
    getOutreachByLeadId(id),
  ])

  if (!lead) notFound()

  const { data: notes } = await adminSupabase
    .from('notes')
    .select('*, author:profiles!notes_employee_id_fkey(full_name, profile_photo_url)')
    .eq('lead_id', id)
    .order('created_at', { ascending: false })

  const { data: followUps } = await adminSupabase
    .from('follow_ups')
    .select('*, assignee:profiles!follow_ups_assigned_to_fkey(full_name)')
    .eq('lead_id', id)
    .is('deleted_at', null)
    .order('due_date', { ascending: true })

  const social = lead.social_links as any
  const canDelete = ['admin', 'super_admin'].includes(profile.role) || lead.created_by === profile.id || lead.owner_id === profile.id

  return (
    <div className="space-y-5 animate-in max-w-5xl">
      {/* Back nav */}
      <div className="flex items-center gap-2">
        <Link href="/leads" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <span className="text-sm text-slate-500">My Leads</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-medium text-slate-800">{lead.business_name}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* LEFT COL */}
        <div className="lg:col-span-2 space-y-5">
          {/* Business Card */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{lead.business_name}</h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {[lead.category, lead.city].filter(Boolean).join(' · ')}
                  </p>
                  {lead.description && (
                    <p className="text-sm text-slate-600 mt-2 max-w-md">{lead.description}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge type="pipeline" value={lead.pipeline_stage} />
              </div>
            </div>

            {/* Stage selector */}
            <div className="mt-4 pt-4 border-t border-border">
              <StageSelector currentStage={lead.pipeline_stage} leadId={lead.id} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
              <div className="flex flex-wrap gap-2">
                <AddOutreachModal leadId={lead.id} leadName={lead.business_name} />
                <AddFollowUpModal leadId={lead.id} leadName={lead.business_name} employeeId={profile.id} />
              </div>
              {canDelete && (
                <DeleteLeadModal
                  leadId={lead.id}
                  leadName={lead.business_name}
                  redirectTo="/leads"
                />
              )}
            </div>
          </div>

          {/* Outreach Timeline */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Outreach Timeline
              <span className="ml-auto text-xs text-slate-400 font-normal">{activities.length} activities</span>
            </h2>

            {activities.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No outreach recorded yet</p>
                <p className="text-xs mt-1">Click "Add Outreach" to record your first message</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-5">
                  {activities.map((activity: any, i: number) => (
                    <div key={activity.id} className="relative flex gap-4 pl-10">
                      {/* Dot */}
                      <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-white border-2 border-blue-400 flex-shrink-0" />
                      <div className="flex-1 bg-slate-50 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge type="channel" value={activity.channel} className="text-[10px]" />
                            <StatusBadge type="message" value={activity.message_status} className="text-[10px]" />
                            <StatusBadge type="response" value={activity.response_status} className="text-[10px]" />
                          </div>
                          <span className="text-xs text-slate-400 flex-shrink-0">
                            {formatDateTime(activity.sent_at)}
                          </span>
                        </div>
                        {activity.message_summary && (
                          <p className="text-sm text-slate-700 mt-2">{activity.message_summary}</p>
                        )}
                        {activity.notes && (
                          <p className="text-xs text-slate-500 mt-1">{activity.notes}</p>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          {activity.employee?.profile_photo_url ? (
                            <img src={activity.employee.profile_photo_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                              {getInitials(activity.employee?.full_name || '?')}
                            </div>
                          )}
                          <span className="text-xs text-slate-400">{activity.employee?.full_name || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Notes</h2>
            <AddNoteForm leadId={lead.id} />
            <LeadNotes notes={notes || []} />
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Contact Information</h3>
            <div className="space-y-2.5">
              {lead.phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a href={`tel:${lead.phone}`} className="text-slate-700 hover:text-blue-600">{lead.phone}</a>
                </div>
              )}
              {lead.whatsapp && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-green-600">
                    {lead.whatsapp} <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a href={`mailto:${lead.email}`} className="text-slate-700 hover:text-blue-600 truncate">{lead.email}</a>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-blue-600 truncate">
                    {lead.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </div>
              )}
              {lead.contact_person && (
                <div className="flex items-center gap-2.5 text-sm">
                  <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700">{lead.contact_person}{lead.contact_position && `, ${lead.contact_position}`}</span>
                </div>
              )}
              {lead.full_address && (
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{lead.full_address}</span>
                </div>
              )}
              {lead.google_maps_url && (
                <a href={lead.google_maps_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-border text-xs text-slate-600 hover:bg-slate-100 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  View on Google Maps
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              )}
            </div>
          </div>

          {/* Social Media */}
          {social && (social.facebook_url || social.instagram_url || social.tiktok_url || social.linkedin_url) && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Social Media</h3>
              <div className="space-y-2">
                {social.facebook_url && (
                  <a href={social.facebook_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-blue-600">
                    <FacebookIcon className="w-4 h-4 text-blue-600" />
                    Facebook <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </a>
                )}
                {social.instagram_url && (
                  <a href={social.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-pink-600">
                    <InstagramIcon className="w-4 h-4 text-pink-500" />
                    Instagram <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </a>
                )}
                {social.tiktok_url && (
                  <a href={social.tiktok_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-slate-900">
                    <span className="w-4 h-4 text-center text-xs font-bold">TK</span>
                    TikTok <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Business Info */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Business Info</h3>
            <div className="space-y-2 text-sm">
              {lead.lead_source && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Source</span>
                  <StatusBadge type="message" value={lead.lead_source} className="text-[10px]" />
                </div>
              )}
              {lead.google_rating && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Rating</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    {lead.google_rating} ({lead.google_reviews_count?.toLocaleString() || 0} reviews)
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="font-medium">{formatDate(lead.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner</span>
                <span className="font-medium">{(lead.owner as any)?.full_name || '—'}</span>
              </div>
            </div>
          </div>

          {/* Follow-ups */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Follow-ups
            </h3>
            <LeadFollowUps followUps={followUps || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
