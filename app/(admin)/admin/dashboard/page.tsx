import Link from 'next/link'
import { getDashboardMetrics, getTodayActivity } from '@/lib/queries/analytics'
import { getEmployeesWithPerformance } from '@/lib/queries/employees'
import { getLeads } from '@/lib/queries/leads'
import { getOutreachActivities } from '@/lib/queries/outreach'
import { getProjects } from '@/lib/queries/projects'
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
  Lock,
  Wallet,
  Clock,
  Briefcase,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [{ metrics, rates, sourceDistribution, weeklyTrends }, today, employees, recentLeadsData, recentOutreach, projects] = await Promise.all([
    getDashboardMetrics(),
    getTodayActivity(),
    getEmployeesWithPerformance(),
    getLeads({ pageSize: 5 }),
    getOutreachActivities({ pageSize: 5 }),
    getProjects(),
  ])

  const activeEmployees = employees.filter((e) => e.status === 'active' && e.role === 'employee')

  // Separate Active / In-Progress Projects vs Completed Projects
  const activeProjects = projects.filter(
    (p) => ['in_progress', 'approved', 'pending'].includes(p.status) || (Number(p.project_value || 0) > 0 && p.status !== 'completed')
  )
  const completedProjects = projects.filter((p) => p.status === 'completed')

  const cashReceived = metrics.total_received_value || 0
  const lockedTotal = metrics.total_project_value || 0
  const pendingReceivables = metrics.total_pending_value || Math.max(0, lockedTotal - cashReceived)

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Admin Executive Center
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Organization Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Real-time outreach KPIs, closed sales revenue, team conversion ratios, and pipeline health.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/admin/employees/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-blue-500/25 active:scale-95 min-h-[42px]"
          >
            <UserPlus className="w-4 h-4" /> Add Team Member
          </Link>
          <Link
            href="/admin/reports"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 sm:py-3 rounded-xl border border-white/10 transition-all backdrop-blur-sm min-h-[42px]"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel Reports
          </Link>
        </div>
      </div>

      {/* EXCLUSIVE ADMIN FINANCIAL VAULT */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">Executive Cashflow &amp; Financial Vault</h2>
              <p className="text-[11px] text-slate-400">Direct money tracking — Cash received, signed contracts, and outstanding balances.</p>
            </div>
          </div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold self-start sm:self-auto transition-colors"
          >
            <span>Full Converted Projects Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Cash Received */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Cash Received</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">
              {formatPKR(cashReceived)}
            </div>
            <div className="text-[11px] text-emerald-400/80">
              Paid in hand / verified client deposits
            </div>
          </div>

          {/* Card 2: Locked Contract Value */}
          <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span>Locked Deal Value</span>
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-300">
              {formatPKR(lockedTotal)}
            </div>
            <div className="text-[11px] text-blue-400/80">
              Total agreed closed project pricing ({metrics.deals_won} deals)
            </div>
          </div>

          {/* Card 3: Pending Receivables */}
          <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>Remaining Balance Due</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {formatPKR(pendingReceivables)}
            </div>
            <div className="text-[11px] text-amber-400/80">
              Pending client payments to be collected
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          title="Total Won Projects"
          value={metrics.deals_won}
          subtitle={`Win Rate: ${rates.win_rate}%`}
          icon={Briefcase}
          color="green"
        />
      </div>

      {/* DEDICATED SECTION 1: Active & Ongoing Projects */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" /> Active Workflows
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Ongoing &amp; In-Progress Projects ({activeProjects.length})
            </h2>
            <p className="text-xs text-slate-500">
              Client projects currently in production, awaiting milestone payments or active delivery.
            </p>
          </div>
          <Link
            href="/admin/projects?status=in_progress"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            Manage Active Projects &rarr;
          </Link>
        </div>

        {activeProjects.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No projects currently in progress. Converted deals will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeProjects.slice(0, 6).map((proj: any) => {
              const val = Number(proj.project_value || 0)
              const rec = Number(proj.amount_received || 0)
              const bal = Math.max(0, val - rec)
              const progressPct = val > 0 ? Math.min(100, Math.round((rec / val) * 100)) : 0
              const cur = proj.currency || 'PKR'

              return (
                <div
                  key={proj.id}
                  className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">
                        {proj.project_name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Client: {proj.lead?.business_name || 'Direct Client'}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-blue-100 text-blue-800">
                      {proj.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="bg-white p-1.5 rounded-xl border border-slate-200">
                      <div className="text-[9px] uppercase font-bold text-slate-400">Locked</div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {cur} {val.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-1.5 rounded-xl border border-emerald-200">
                      <div className="text-[9px] uppercase font-bold text-emerald-700">Paid</div>
                      <div className="text-xs font-extrabold text-emerald-900">
                        {cur} {rec.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-amber-50 p-1.5 rounded-xl border border-amber-200">
                      <div className="text-[9px] uppercase font-bold text-amber-700">Due</div>
                      <div className="text-xs font-extrabold text-amber-900">
                        {cur} {bal.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Payment Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span>Payment Collected</span>
                      <span className="text-emerald-700">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* DEDICATED SECTION 2: Completed & Delivered Projects */}
      <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4" /> Delivered Success
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Completed &amp; Delivered Projects ({completedProjects.length})
            </h2>
            <p className="text-xs text-slate-600">
              Successfully delivered client systems, fulfilled contracts, and closed revenue accounts.
            </p>
          </div>
          <Link
            href="/admin/projects?status=completed"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            Delivered Archive &rarr;
          </Link>
        </div>

        {completedProjects.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No projects marked completed yet. Once a project is finished, it will be catalogued here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {completedProjects.slice(0, 6).map((proj: any) => {
              const val = Number(proj.project_value || 0)
              const rec = Number(proj.amount_received || 0)
              const bal = Math.max(0, val - rec)
              const cur = proj.currency || 'PKR'

              return (
                <div
                  key={proj.id}
                  className="p-4 bg-white/90 hover:bg-white border border-emerald-200/90 rounded-2xl space-y-2.5 shadow-xs transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">
                        {proj.project_name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Client: {proj.lead?.business_name || 'Direct Client'}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Completed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-emerald-50/80 rounded-xl text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Delivered Value</div>
                      <div className="font-extrabold text-emerald-950">
                        {cur} {val.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-medium">Payment Status</div>
                      <div className={`font-bold ${bal === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {bal === 0 ? '100% Fully Settled' : `Due: ${cur} ${bal.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Top Employees Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200">
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

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-thin">
            <table className="w-full text-left text-xs text-slate-600 min-w-[500px]">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-l-lg">Employee</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4">Role / Dept</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4">Weekly Target</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4">Status</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.slice(0, 6).map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {emp.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{emp.full_name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                      <div className="capitalize font-medium text-slate-800">{emp.job_title || emp.role}</div>
                      <div className="text-[11px] text-slate-400">{emp.department || 'Outreach'}</div>
                    </td>
                    <td className="py-2.5 sm:py-3 px-3 sm:px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{emp.target_weekly_outreach || 50}</span>
                      <span className="text-slate-400"> msgs/wk</span>
                    </td>
                    <td className="py-2.5 sm:py-3 px-3 sm:px-4">
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
                    <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right">
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
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Leads Captured</h2>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              All Leads <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto">
            {recentLeadsData.leads.map((lead: any) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="block p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-white transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {lead.business_name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {lead.contact_person || 'No contact specified'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 capitalize flex-shrink-0">
                    {lead.pipeline_stage.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span className="truncate">Owner: {lead.owner?.full_name || 'Unassigned'}</span>
                  <span className="flex-shrink-0">{new Date(lead.updated_at).toLocaleDateString()}</span>
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
