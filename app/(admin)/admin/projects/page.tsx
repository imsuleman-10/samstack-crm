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
  const totalReceived = projects.reduce((sum: number, p: any) => sum + (p.amount_received || 0), 0)
  const totalPending = Math.max(0, totalValue - totalReceived)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" /> Portfolio & Deal Revenue
          </div>
          <h1 className="text-xl font-bold text-slate-900">Converted Projects & Deal Financials</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track locked deal prices, advance/received payments, and pending client balances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-500">Locked Value</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900">{formatPKR(totalValue)}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-emerald-700">Total Received</div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-900">{formatPKR(totalReceived)}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-amber-700">Remaining Balance</div>
            <div className="text-sm sm:text-base font-extrabold text-amber-900">{formatPKR(totalPending)}</div>
          </div>
        </div>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/projects${sp.employeeId ? `?employeeId=${sp.employeeId}` : ''}`}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            !sp.status
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Projects ({projects.length})
        </Link>
        <Link
          href={`/admin/projects?status=in_progress${sp.employeeId ? `&employeeId=${sp.employeeId}` : ''}`}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            sp.status === 'in_progress'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Active / In Progress ({projects.filter((p) => p.status === 'in_progress').length})
        </Link>
        <Link
          href={`/admin/projects?status=completed${sp.employeeId ? `&employeeId=${sp.employeeId}` : ''}`}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            sp.status === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed &amp; Delivered ({projects.filter((p) => p.status === 'completed').length})
        </Link>
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
                <th className="py-3 px-4">Offered Quote</th>
                <th className="py-3 px-4">Locked Deal Value</th>
                <th className="py-3 px-4">Received / Paid</th>
                <th className="py-3 px-4">Pending Balance</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((proj: any) => {
                const lockedVal = Number(proj.project_value || 0)
                const recVal = Number(proj.amount_received || 0)
                const balanceVal = Math.max(0, lockedVal - recVal)
                const cur = proj.currency || 'PKR'

                return (
                  <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{proj.project_name}</div>
                      <div className="text-[10px] text-slate-400">
                        Closer: {proj.employee?.full_name || 'System'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {proj.lead ? (
                        <Link href={`/admin/leads/${proj.lead.id}`} className="font-medium text-blue-600 hover:underline">
                          {proj.lead.business_name}
                        </Link>
                      ) : (
                        'Direct Client'
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {proj.offered_price ? (
                        <span className="font-semibold text-amber-700">
                          {cur} {Number(proj.offered_price).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {cur} {lockedVal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {cur} {recVal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {balanceVal > 0 ? (
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                          {cur} {balanceVal.toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                          Fully Paid
                        </span>
                      )}
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
                )
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
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
