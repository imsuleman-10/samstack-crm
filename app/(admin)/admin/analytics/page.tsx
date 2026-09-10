import type { Metadata } from 'next'
import { getDashboardMetrics } from '@/lib/queries/analytics'
import { getEmployeesWithPerformance } from '@/lib/queries/employees'
import { formatPKR, formatRate } from '@/lib/analytics/formulas'
import StatCard from '@/components/ui/stat-card'
import DashboardCharts from '@/components/dashboard/dashboard-charts'
import TeamLeaderboard from '@/components/admin/team-leaderboard'
import {
  BarChart3,
  TrendingUp,
  Percent,
  MessageSquare,
  Reply,
  Star,
  FolderKanban,
  Building2,
  DollarSign,
  Users,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = { title: 'Admin - Company Analytics' }
export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const [{ metrics, rates, sourceDistribution, weeklyTrends }, employees] = await Promise.all([
    getDashboardMetrics(),
    getEmployeesWithPerformance(),
  ])

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4" /> Global Business Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Company Performance & Conversion Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            End-to-end sales funnel, response velocity, lead channel acquisition, and closed PKR revenue.
          </p>
        </div>
      </div>

      {/* Conversion Funnel Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Organization Sales Conversion Pipeline</h2>
          <p className="text-xs text-slate-500 mt-0.5">Progressive lead drop-off and conversion rates across stages.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <FunnelStep
            label="1. Total Leads Captured"
            value={metrics.total_leads}
            icon={Building2}
            color="bg-slate-50 text-slate-700 border-slate-200"
          />
          <FunnelStep
            label="2. Leads Contacted"
            value={metrics.leads_contacted}
            rate={`${formatRate(rates.contact_rate)}% of total leads`}
            icon={MessageSquare}
            color="bg-blue-50 text-blue-700 border-blue-200"
          />
          <FunnelStep
            label="3. Interested Prospects"
            value={metrics.interested_leads}
            rate={`${formatRate(rates.interest_rate)}% of contacted`}
            icon={Star}
            color="bg-amber-50 text-amber-700 border-amber-200"
          />
          <FunnelStep
            label="4. Won Deals & Revenue"
            value={metrics.deals_won}
            rate={`${formatRate(rates.overall_conversion)}% overall conversion`}
            icon={FolderKanban}
            color="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
        </div>
      </div>

      {/* Interactive Visual Charts */}
      <DashboardCharts
        metrics={metrics}
        sourceDistribution={sourceDistribution}
        weeklyTrends={weeklyTrends}
      />

      {/* Key Rates Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Key Conversion & Efficiency Ratios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Outreach Response Rate"
            value={`${formatRate(rates.reply_rate)}%`}
            subtitle={`${metrics.replies_received} replies received`}
            icon={Reply}
            color="blue"
          />
          <StatCard
            title="Interest Conversion Rate"
            value={`${formatRate(rates.interest_rate)}%`}
            subtitle={`${metrics.interested_leads} marked interested`}
            icon={Star}
            color="orange"
          />
          <StatCard
            title="Deal Qualification Rate"
            value={`${formatRate(rates.qualification_rate)}%`}
            subtitle={`${metrics.qualified_leads} qualified prospects`}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Win Rate (from Interested)"
            value={`${formatRate(rates.win_rate)}%`}
            subtitle={`${metrics.deals_won} deals closed`}
            icon={FolderKanban}
            color="green"
          />
        </div>
      </div>

      {/* Team Leaderboard Component */}
      <TeamLeaderboard employees={employees} />

      {/* Total Revenue Highlight Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
            Total Closed Value (PKR)
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold mt-1 text-white">{formatPKR(metrics.total_project_value)}</div>
          <div className="text-xs text-slate-400 mt-1 max-w-md">
            Generated from {metrics.deals_won} won projects across {employees.length} team members.
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-6">
          <div>
            <div className="text-[11px] text-slate-300 font-medium">Average Deal Size</div>
            <div className="text-xl font-extrabold text-white mt-0.5">
              {metrics.deals_won > 0
                ? formatPKR(metrics.total_project_value / metrics.deals_won)
                : formatPKR(0)}
            </div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <div className="text-[11px] text-slate-300 font-medium">Active Pipeline</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
              {metrics.total_leads} Leads
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FunnelStep({ label, value, rate, icon: Icon, color }: any) {
  return (
    <div className={`p-5 rounded-2xl border ${color} flex flex-col justify-between shadow-xs space-y-3`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold">{label}</span>
        <Icon className="w-5 h-5 opacity-80" />
      </div>
      <div>
        <div className="text-2xl font-extrabold tracking-tight">{value}</div>
        {rate && <div className="text-[11px] opacity-80 mt-1 font-medium">{rate}</div>}
      </div>
    </div>
  )
}

