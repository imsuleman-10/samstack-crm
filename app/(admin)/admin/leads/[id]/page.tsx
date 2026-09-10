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
  Star, User, Shield
} from 'lucide-react'
import Link from 'next/link'
import DeleteLeadModal from '@/components/leads/delete-lead-modal'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const lead = await getLeadById(id)
  return { title: `Admin - ${lead?.business_name || 'Lead'}` }
}

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [lead, activities] = await Promise.all([
    getLeadById(id),
    getOutreachByLeadId(id),
  ])

  if (!lead) notFound()

  const adminSupabase = createAdminClient()

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

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Back Nav */}
      <div className="flex items-center gap-2">
        <Link href="/admin/leads" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <span className="text-xs text-slate-500">Admin Lead Directory</span>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-semibold text-slate-800">{lead.business_name}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Lead Overview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{lead.business_name}</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {[lead.category, lead.city].filter(Boolean).join(' · ')}
                  </p>
                  {lead.description && (
                    <p className="text-xs text-slate-600 mt-2">{lead.description}</p>
                  )}
                </div>
              </div>
              <StatusBadge type="pipeline" value={lead.pipeline_stage} />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>Assigned Owner: <span className="font-semibold text-slate-900">{(lead.owner as any)?.full_name || 'Unassigned'}</span></div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-400">ID: {lead.id.slice(0, 8)}</span>
                <DeleteLeadModal
                  leadId={lead.id}
                  leadName={lead.business_name}
                  redirectTo="/admin/leads"
                />
              </div>
            </div>
          </div>

          {/* Outreach Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Company Outreach Timeline
              <span className="ml-auto text-xs text-slate-400 font-normal">{activities.length} activities</span>
            </h2>

            {activities.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No outreach recorded for this lead yet.
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity: any) => (
                  <div key={activity.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusBadge type="channel" value={activity.channel} className="text-[10px]" />
                        <StatusBadge type="response" value={activity.response_status} className="text-[10px]" />
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatDateTime(activity.sent_at)}
                      </span>
                    </div>
                    {activity.message_summary && (
                      <p className="text-slate-800 font-medium">{activity.message_summary}</p>
                    )}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>Logged by: {activity.employee?.full_name || 'System'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 text-sm mb-4">Internal Team Notes</h2>
            <div className="space-y-3">
              {notes?.map((n: any) => (
                <div key={n.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800">{n.author?.full_name || 'Admin'}</span>
                    <span className="text-[10px]">{formatDate(n.created_at)}</span>
                  </div>
                  <p className="text-slate-700">{n.content}</p>
                </div>
              ))}
              {(!notes || notes.length === 0) && (
                <div className="text-xs text-slate-400 text-center py-4">No team notes posted yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Contact Details</h3>
            {lead.phone && <div><span className="text-slate-400">Phone:</span> <span className="font-medium text-slate-800">{lead.phone}</span></div>}
            {lead.whatsapp && <div><span className="text-slate-400">WhatsApp:</span> <span className="font-medium text-emerald-600">{lead.whatsapp}</span></div>}
            {lead.email && <div><span className="text-slate-400">Email:</span> <span className="font-medium text-blue-600">{lead.email}</span></div>}
            {lead.website && <div><span className="text-slate-400">Website:</span> <a href={lead.website} target="_blank" className="font-medium text-blue-600 underline">{lead.website}</a></div>}
            {lead.contact_person && <div><span className="text-slate-400">Contact Person:</span> <span className="font-medium text-slate-800">{lead.contact_person}</span></div>}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Follow-ups ({followUps?.length || 0})</h3>
            <div className="space-y-2">
              {followUps?.map((f: any) => (
                <div key={f.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-900">{f.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Due: {formatDate(f.due_date)} &bull; Assigned: {f.assignee?.full_name || 'Staff'}</div>
                </div>
              ))}
              {(!followUps || followUps.length === 0) && (
                <div className="text-slate-400 text-center py-2">No follow-ups pending.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
