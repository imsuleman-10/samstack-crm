import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDashboardMetrics } from '@/lib/queries/analytics'
import StatCard from '@/components/ui/stat-card'
import DashboardCharts from '@/components/dashboard/dashboard-charts'
import { formatRate, formatPKR } from '@/lib/analytics/formulas'
import {
  TrendingUp, Percent, MessageSquare, Reply,
  Star, FolderKanban, Users, Building2, Sparkles, BarChart3
} from 'lucide-react'

export const metadata: Metadata = { title: 'My Performance Analytics' }
export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { metrics, rates, sourceDistribution, weeklyTrends } = await getDashboardMetrics(
    !['admin', 'super_admin'].includes(profile.role) ? profile.id : undefined
  )

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4" /> Personal Performance Insights
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sales Funnel & Outreach Ratios
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Track your individual contact conversion rates, interested prospect ratios, and closed project revenue.
          </p>
        </div>
      </div>

      {/* Interactive Charts */}
      <DashboardCharts
        metrics={metrics}
        sourceDistribution={sourceDistribution}
        weeklyTrends={weeklyTrends}
      />

      {/* Conversion Funnel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Personal Sales Conversion Stages</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pipeline progression from capture to deal won.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FunnelStep
            label="1. Total Leads"
            value={metrics.total_leads}
            icon={Building2}
            color="bg-slate-50 text-slate-700 border-slate-200"
          />
          <FunnelStep
            label="2. Contacted"
            value={metrics.leads_contacted}
            rate={`${formatRate(rates.contact_rate)}% of total`}
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
            label="4. Won Deals"
            value={metrics.deals_won}
            rate={`${formatRate(rates.overall_conversion)}% of total`}
            icon={FolderKanban}
            color="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Key Ratios & Closed Revenue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Response Rate" value={`${formatRate(rates.reply_rate)}%`} icon={Reply} color="blue" />
          <StatCard title="Interest Rate" value={`${formatRate(rates.interest_rate)}%`} icon={Star} color="orange" />
          <StatCard title="Qualified Rate" value={`${formatRate(rates.qualification_rate)}%`} icon={TrendingUp} color="purple" />
          <StatCard title="Overall Win Rate" value={`${formatRate(rates.win_rate)}%`} icon={FolderKanban} color="green" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
            Total Won Value (PKR)
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold mt-1 text-white">{formatPKR(metrics.total_project_value)}</div>
          <p className="text-xs text-slate-400 mt-1">From {metrics.deals_won} closed deals in your pipeline.</p>
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

