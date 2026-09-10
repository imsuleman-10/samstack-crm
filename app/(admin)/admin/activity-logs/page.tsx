import type { Metadata } from 'next'
import { getAuditLogs } from '@/lib/queries/audit'
import { getEmployees } from '@/lib/queries/employees'
import { formatDateTime } from '@/lib/utils'
import { ClipboardList, Shield, Filter, User } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - System Audit Logs' }
export const dynamic = 'force-dynamic'

interface SearchParams {
  entityType?: string
  userId?: string
  page?: string
}

export default async function AdminActivityLogsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  const pageSize = 30

  const [employees, { logs, count }] = await Promise.all([
    getEmployees(),
    getAuditLogs({
      entityType: sp.entityType,
      userId: sp.userId,
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
            <ClipboardList className="w-4 h-4" /> Security & Audit
          </div>
          <h1 className="text-xl font-bold text-slate-900">System Activity Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable audit trail of actions, entity updates, and administrative changes.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form className="flex flex-col sm:flex-row items-center gap-3">
          <select
            name="userId"
            defaultValue={sp.userId || ''}
            className="w-full sm:w-64 h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Users</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} ({emp.role})
              </option>
            ))}
          </select>

          <select
            name="entityType"
            defaultValue={sp.entityType || ''}
            className="w-full sm:w-48 h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Entity Types</option>
            <option value="lead">Lead</option>
            <option value="outreach">Outreach</option>
            <option value="followup">Follow-up</option>
            <option value="project">Project</option>
            <option value="employee">Employee</option>
          </select>

          <button
            type="submit"
            className="h-9 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Filter Logs
          </button>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600 text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Entity ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono text-[11px]">
                  <td className="py-3 px-4 font-sans text-slate-500">{formatDateTime(log.created_at)}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    {log.user?.full_name || 'System / Service'}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold uppercase text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans capitalize text-slate-800">{log.entity_type}</td>
                  <td className="py-3 px-4 text-slate-400">{log.entity_id?.slice(0, 8)}...</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 font-sans">
                    No activity logs recorded matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs">
            <span className="text-slate-500">
              Page {page} of {totalPages} &bull; {count} log entries
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/admin/activity-logs?page=${page - 1}${sp.userId ? `&userId=${sp.userId}` : ''}${sp.entityType ? `&entityType=${sp.entityType}` : ''}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Prev
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/admin/activity-logs?page=${page + 1}${sp.userId ? `&userId=${sp.userId}` : ''}${sp.entityType ? `&entityType=${sp.entityType}` : ''}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
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
