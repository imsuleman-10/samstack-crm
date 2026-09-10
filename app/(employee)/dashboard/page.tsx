import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDashboardMetrics, getTodayActivity } from '@/lib/queries/analytics'
import { getTodayFollowUpsWidget } from '@/lib/queries/followups'
import { getLeads } from '@/lib/queries/leads'
import StatCard from '@/components/ui/stat-card'
import StatusBadge from '@/components/ui/status-badge'
import DashboardCharts from '@/components/dashboard/dashboard-charts'
import { formatRate, formatCurrency, formatPKR } from '@/lib/analytics/formulas'
import { timeAgo, isOverdue } from '@/lib/utils'
import {
  Building2, MessageSquare, Reply, Star, FolderKanban,
  CalendarCheck2, TrendingUp, Percent, Plus, ArrowRight, AlertCircle, Sparkles, Target
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Employee Dashboard' }
export const dynamic = 'force-dynamic'

export default async function EmployeeDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, target_weekly_outreach, target_monthly_conversions')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')

  const [{ metrics, rates, sourceDistribution, weeklyTrends }, todayActivity, followUps, { leads: recentLeads }] = await Promise.all([
    getDashboardMetrics(profile.id),
    getTodayActivity(profile.id),
    getTodayFollowUpsWidget(profile.id),
    getLeads({ ownerId: profile.id, pageSize: 5 }),
  ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const weeklyTarget = profile.target_weekly_outreach || 50
  const progressPercent = Math.min(100, Math.round((metrics.messages_sent / weeklyTarget) * 100))

  return (
    <div className="space-y-6 animate-in">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Sales Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, {profile.full_name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Here is your daily outreach progression, pipeline leads, and scheduled follow-ups.
          </p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/25 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Lead
        </Link>
      </div>

      {/* Target Progress Bar Widget */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">Weekly Outreach Objective</div>
            <div className="text-[11px] text-slate-500">
              {metrics.messages_sent} of {weeklyTarget} messages sent this period
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Progress</span>
            <span className="text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Assigned Leads"
          value={metrics.total_leads}
          subtitle={`${metrics.interested_leads} interested`}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Outreach Sent"
          value={metrics.messages_sent}
          subtitle={`${metrics.replies_received} replies received`}
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Response Rate"
          value={`${formatRate(rates.reply_rate)}%`}
          subtitle={`${metrics.replies_received} responses`}
          icon={Reply}
          color="green"
        />
        <StatCard
          title="Closed Revenue"
          value={formatPKR(metrics.total_project_value)}
          subtitle={`${metrics.deals_won} won deals`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Interactive Charts */}
      <DashboardCharts
        metrics={metrics}
        sourceDistribution={sourceDistribution}
        weeklyTrends={weeklyTrends}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Follow-ups Due */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-orange-500" />
              Follow-ups Due Today
            </h2>
            <Link href="/follow-ups" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {followUps.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CalendarCheck2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">No follow-ups due today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {followUps.map((fu: any) => (
                <div key={fu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/leads/${fu.lead?.id}`} className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate block">
                      {fu.lead?.business_name}
                    </Link>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{fu.title}</p>
                  </div>
                  <StatusBadge type="priority" value={fu.priority} className="flex-shrink-0 text-[10px]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              My Recent Leads
            </h2>
            <Link href="/leads" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">No leads captured yet</p>
              <Link href="/leads/new" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 hover:underline">
                <Plus className="w-3.5 h-3.5" />
                Add your first lead
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      {lead.business_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/leads/${lead.id}`} className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate block">
                        {lead.business_name}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">{lead.category || 'General'} &bull; {lead.city || 'Pakistan'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge type="pipeline" value={lead.pipeline_stage} className="text-[10px]" />
                    <span className="text-[11px] text-slate-400 hidden sm:inline">{timeAgo(lead.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

