import Link from 'next/link'
import { getDashboardMetrics, getTodayActivity } from '@/lib/queries/analytics'
import { getEmployeesWithPerformance } from '@/lib/queries/employees'
import { getLeads } from '@/lib/queries/leads'
import { getOutreachActivities } from '@/lib/queries/outreach'
import { formatPKR } from '@/lib/analytics/formulas'
import StatCard from '@/components/ui/stat-card'
import ActivityOverview from '@/components/dashboard/activity-overview'
import DashboardCharts from '@/components/dashboard/dashboard-charts'
import TeamLeaderboard from '@/components/admin/team-leaderboard'
import {
  Users,
  Building2,
  Send,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  UserPlus,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [{ metrics, rates, sourceDistribution, weeklyTrends }, today, employees, recentLeadsData, recentOutreach] = await Promise.all([
    getDashboardMetrics(),
    getTodayActivity(),
    getEmployeesWithPerformance(),
    getLeads({ pageSize: 5 }),
    getOutreachActivities({ pageSize: 5 }),
  ])

  const activeEmployees = employees.filter((e) => e.status === 'active' && e.role === 'employee')

  return (
    <div className="space-y-6 animate-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Admin Executive Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Organization Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time outreach KPIs, closed sales revenue, team conversion ratios, and pipeline health.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/employees/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-md shadow-blue-500/25 active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Add Team Member
          </Link>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-3 rounded-xl border border-white/10 transition-all backdrop-blur-sm"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel Reports
          </Link>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Sales Reps"
          value={activeEmployees.length}
          subtitle={`Total ${employees.length} team members`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Pipeline Leads"
          value={metrics.total_leads}
          subtitle={`${metrics.interested_leads} interested`}
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Total Messages Sent"
          value={metrics.messages_sent}
          subtitle={`${metrics.replies_received} replies received`}
          icon={Send}
          color="orange"
        />
        <StatCard
          title="Total Closed Revenue"
          value={formatPKR(metrics.total_project_value)}
          subtitle={`${metrics.deals_won} won projects`}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Interactive Visual Charts (Recharts) */}
      <DashboardCharts
        metrics={metrics}
        sourceDistribution={sourceDistribution}
        weeklyTrends={weeklyTrends}
      />

      {/* Today's Live Activity */}
      <ActivityOverview today={today} />

      {/* Team Leaderboard */}
      <TeamLeaderboard employees={employees} />

      {/* Team Performance & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Employees Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active Team Directory</h2>
              <p className="text-xs text-slate-500">Sales representatives and outreach targets</p>
            </div>
            <Link
              href="/admin/employees"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Employee</th>
                  <th className="py-3 px-4">Role / Dept</th>
                  <th className="py-3 px-4">Weekly Target</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.slice(0, 6).map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {emp.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{emp.full_name}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="capitalize font-medium text-slate-800">{emp.job_title || emp.role}</div>
                      <div className="text-[11px] text-slate-400">{emp.department || 'Outreach'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{emp.target_weekly_outreach || 50}</span>
                      <span className="text-slate-400"> msgs/wk</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          emp.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/employees/${emp.id}`}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      No employees registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Pipeline Activity (1 col) */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Leads Captured</h2>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              All Leads <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentLeadsData.leads.map((lead: any) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="block p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-white transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lead.business_name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {lead.contact_person || 'No contact specified'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 capitalize">
                    {lead.pipeline_stage.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Owner: {lead.owner?.full_name || 'Unassigned'}</span>
                  <span>{new Date(lead.updated_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
            {recentLeadsData.leads.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">No leads captured yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

