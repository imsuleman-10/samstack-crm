import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjects } from '@/lib/queries/projects'
import { getEmployees } from '@/lib/queries/employees'
import { formatPKR } from '@/lib/analytics/formulas'
import { formatDate } from '@/lib/utils'
import { FolderKanban, DollarSign, CheckCircle2, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - Company Projects & Revenue' }
export const dynamic = 'force-dynamic'

interface SearchParams {
  employeeId?: string
  status?: string
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams

  const [employees, projects] = await Promise.all([
    getEmployees(),
    getProjects({
      employeeId: sp.employeeId,
      status: sp.status,
    }),
  ])

  const totalValue = projects.reduce((sum: number, p: any) => sum + (p.project_value || 0), 0)
  const completedValue = projects
    .filter((p: any) => p.status === 'completed')
    .reduce((sum: number, p: any) => sum + (p.project_value || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" /> Portfolio & Revenue
          </div>
          <h1 className="text-xl font-bold text-slate-900">Converted Projects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Total {projects.length} won projects totaling {formatPKR(totalValue)}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <div className="text-[10px] uppercase font-semibold text-emerald-700">Completed Revenue</div>
            <div className="text-base font-bold text-emerald-900">{formatPKR(completedValue)}</div>
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
            <option value="">All Employee Closers</option>
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
            <option value="">All Project Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            className="h-9 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Filter Projects
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600 text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Client Business</th>
                <th className="py-3 px-4">Closer Rep</th>
                <th className="py-3 px-4">Project Value (PKR)</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((proj: any) => (
                <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{proj.project_name}</td>
                  <td className="py-3 px-4">
                    {proj.lead ? (
                      <Link href={`/admin/leads/${proj.lead.id}`} className="font-medium text-blue-600 hover:underline">
                        {proj.lead.business_name}
                      </Link>
                    ) : (
                      'Direct Client'
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {proj.employee?.full_name || 'System'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatPKR(proj.project_value)}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {proj.start_date ? formatDate(proj.start_date) : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`capitalize px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        proj.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : proj.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No converted projects recorded yet.
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
