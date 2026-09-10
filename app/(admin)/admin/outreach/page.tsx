import type { Metadata } from 'next'
import Link from 'next/link'
import { getOutreachActivities } from '@/lib/queries/outreach'
import { getEmployees } from '@/lib/queries/employees'
import StatusBadge from '@/components/ui/status-badge'
import { formatDateTime } from '@/lib/utils'
import { MessageSquare, Search, Filter, User } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - Team Outreach Feed' }
export const dynamic = 'force-dynamic'

interface SearchParams {
  employeeId?: string
  channel?: string
  responseStatus?: string
  page?: string
}

export default async function AdminOutreachPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const pageSize = 25

  const [employees, { activities, count }] = await Promise.all([
    getEmployees(),
    getOutreachActivities({
      employeeId: sp.employeeId,
      channel: sp.channel,
      responseStatus: sp.responseStatus,
      page,
      pageSize,
    }),
  ])

  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" /> Global Outreach Feed
          </div>
          <h1 className="text-xl font-bold text-slate-900">All Outreach Activities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Total {count} logged outreach attempts across all team members.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Employee</label>
            <select
              name="employeeId"
              defaultValue={sp.employeeId || ''}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Team Members</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Channel</label>
            <select
              name="channel"
              defaultValue={sp.channel || ''}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Channels</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="phone_call">Phone Call</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Response</label>
              <select
                name="responseStatus"
                defaultValue={sp.responseStatus || ''}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Responses</option>
                <option value="no_response">No Response</option>
                <option value="replied">Replied</option>
                <option value="interested">Interested</option>
                <option value="not_interested">Not Interested</option>
                <option value="meeting_requested">Meeting Requested</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            <button
              type="submit"
              className="h-9 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Outreach Timeline / Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="space-y-3">
          {activities.map((act: any) => (
            <div
              key={act.id}
              className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/60 transition-colors space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">
                    {act.employee?.full_name || 'Team Member'}
                  </span>
                  <span className="text-slate-400 text-xs">&rarr;</span>
                  <Link
                    href={`/admin/leads/${act.lead_id}`}
                    className="font-semibold text-xs text-blue-600 hover:underline"
                  >
                    {act.lead?.business_name || 'Lead'}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge type="channel" value={act.channel} className="text-[10px]" />
                  <StatusBadge type="response" value={act.response_status} className="text-[10px]" />
                  <span className="text-[10px] text-slate-400">
                    {formatDateTime(act.sent_at)}
                  </span>
                </div>
              </div>

              {act.message_summary && (
                <p className="text-xs text-slate-700 font-medium">{act.message_summary}</p>
              )}
              {act.notes && <p className="text-[11px] text-slate-500 italic">{act.notes}</p>}
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No outreach records matching the selected filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/admin/outreach?page=${page - 1}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Prev
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/admin/outreach?page=${page + 1}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
