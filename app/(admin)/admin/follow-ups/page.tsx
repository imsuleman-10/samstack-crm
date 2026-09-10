import type { Metadata } from 'next'
import Link from 'next/link'
import { getFollowUps } from '@/lib/queries/followups'
import { getEmployees } from '@/lib/queries/employees'
import { formatDate } from '@/lib/utils'
import { CalendarCheck2, Clock, AlertTriangle, CheckCircle, User } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - Team Follow-ups' }
export const dynamic = 'force-dynamic'

interface SearchParams {
  employeeId?: string
  status?: string
}

export default async function AdminFollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const today = new Date().toISOString().split('T')[0]

  const [employees, followUps] = await Promise.all([
    getEmployees(),
    getFollowUps({
      employeeId: sp.employeeId,
      status: sp.status,
    }),
  ])

  const overdue = followUps.filter((f: any) => f.due_date < today && f.status === 'pending')
  const dueToday = followUps.filter((f: any) => f.due_date === today && f.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarCheck2 className="w-4 h-4" /> Company Follow-up Manager
          </div>
          <h1 className="text-xl font-bold text-slate-900">All Scheduled Follow-ups</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor pending, overdue, and completed follow-up tasks across the team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {overdue.length > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" /> {overdue.length} Overdue
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <Clock className="w-4 h-4" /> {dueToday.length} Due Today
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form className="flex flex-col sm:flex-row items-center gap-3">
          <select
            name="employeeId"
            defaultValue={sp.employeeId || ''}
            className="w-full sm:w-64 h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Team Members</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} ({emp.role})
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={sp.status || ''}
            className="w-full sm:w-48 h-9 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            className="h-9 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Apply Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600 text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Lead / Business</th>
                <th className="py-3 px-4">Assigned Rep</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {followUps.map((task: any) => {
                const isOverdue = task.due_date < today && task.status === 'pending'
                return (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{task.title}</div>
                      {task.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1">{task.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {task.lead ? (
                        <Link href={`/admin/leads/${task.lead.id}`} className="font-medium text-blue-600 hover:underline">
                          {task.lead.business_name}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {task.assignee?.full_name || 'Staff'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                        {formatDate(task.due_date)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {task.priority || 'normal'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`capitalize px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isOverdue
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : task.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {followUps.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No follow-ups recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
