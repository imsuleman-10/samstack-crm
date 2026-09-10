import type { Metadata } from 'next'
import { getEmployees } from '@/lib/queries/employees'
import { getDashboardMetrics } from '@/lib/queries/analytics'
import { formatPKR, formatRate } from '@/lib/analytics/formulas'
import { FileText, Download, Printer, Filter, Building2, Send, Award, DollarSign } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - Reports & Summaries' }
export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  const [{ metrics, rates }, employees] = await Promise.all([
    getDashboardMetrics(),
    getEmployees(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Reporting Engine
          </div>
          <h1 className="text-xl font-bold text-slate-900">Executive Reports & Performance Summaries</h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and export comprehensive team productivity and revenue reports.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Company Overview Summary</h2>
            <p className="text-xs text-slate-500">Aggregated pipeline & outreach performance snapshot</p>
          </div>
          <span className="text-xs text-slate-400">Generated: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-slate-500 font-medium">Total Pipeline Leads</div>
            <div className="text-xl font-bold text-slate-900">{metrics.total_leads}</div>
            <div className="text-[11px] text-slate-400">{metrics.interested_leads} marked interested</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-slate-500 font-medium">Total Messages Sent</div>
            <div className="text-xl font-bold text-slate-900">{metrics.messages_sent}</div>
            <div className="text-[11px] text-slate-400">{rates.reply_rate}% response rate</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-slate-500 font-medium">Deals Closed</div>
            <div className="text-xl font-bold text-slate-900">{metrics.deals_won}</div>
            <div className="text-[11px] text-slate-400">{rates.overall_conversion}% conversion</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-slate-500 font-medium">Total Revenue (PKR)</div>
            <div className="text-xl font-bold text-slate-900">{formatPKR(metrics.total_project_value)}</div>
            <div className="text-[11px] text-slate-400">Closed project value</div>
          </div>
        </div>

        {/* Employee Roster Summary Table */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Employee Performance Roster</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-slate-600 text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Weekly Outreach Target</th>
                  <th className="py-3 px-4">Monthly Revenue Target</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{emp.full_name}</td>
                    <td className="py-3 px-4 capitalize">{emp.job_title || emp.role}</td>
                    <td className="py-3 px-4">{emp.target_weekly_outreach} msgs/wk</td>
                    <td className="py-3 px-4">{formatPKR(emp.target_monthly_revenue)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                        emp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : emp.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
