import { createAdminClient } from '@/lib/supabase/server'
import type { AnalyticsMetrics } from '../analytics/formulas'
import { computeAllRates } from '../analytics/formulas'

export async function getDashboardMetrics(employeeId?: string) {
  const adminSupabase = createAdminClient()

  // 1. Leads counts & channel distribution
  let leadsQuery = adminSupabase.from('leads').select('id, pipeline_stage, lead_source').is('deleted_at', null)
  if (employeeId) leadsQuery = leadsQuery.eq('owner_id', employeeId)
  
  const { data: leadsData } = await leadsQuery

  const total_leads = leadsData?.length || 0
  const leads_contacted = leadsData?.filter(l => l.pipeline_stage !== 'new').length || 0
  const interested_leads = leadsData?.filter(l => ['interested', 'qualified', 'proposal_sent', 'negotiation', 'won', 'project_started', 'project_completed'].includes(l.pipeline_stage)).length || 0
  const qualified_leads = leadsData?.filter(l => ['qualified', 'proposal_sent', 'negotiation', 'won', 'project_started', 'project_completed'].includes(l.pipeline_stage)).length || 0
  const deals_won = leadsData?.filter(l => ['won', 'project_started', 'project_completed'].includes(l.pipeline_stage)).length || 0
  const deals_lost = leadsData?.filter(l => ['not_interested', 'not_qualified', 'lost'].includes(l.pipeline_stage)).length || 0

  // Real source distribution
  const sourceCountMap: Record<string, number> = {}
  const sourceLabelMap: Record<string, string> = {
    google_maps: 'Google Maps',
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    website: 'Website',
    referral: 'Referral',
    manual_entry: 'Manual Entry',
    other: 'Other',
  }
  leadsData?.forEach((l) => {
    const rawSrc = l.lead_source || 'other'
    const label = sourceLabelMap[rawSrc] || rawSrc
    sourceCountMap[label] = (sourceCountMap[label] || 0) + 1
  })

  const sourceDistribution = Object.entries(sourceCountMap).map(([name, value]) => ({
    name,
    value,
  }))

  // 2. Outreach counts & weekly trends
  let outreachQuery = adminSupabase.from('outreach_activities').select('id, message_status, response_status, sent_at')
  if (employeeId) outreachQuery = outreachQuery.eq('employee_id', employeeId)

  const { data: outreachData } = await outreachQuery

  const messages_sent = outreachData?.filter(o => o.message_status !== 'not_sent' && o.message_status !== 'failed').length || 0
  const messages_seen = outreachData?.filter(o => ['seen', 'opened'].includes(o.message_status)).length || 0
  const replies_received = outreachData?.filter(o => !['no_response', 'seen_no_reply'].includes(o.response_status)).length || 0

  // Calculate real Mon-Fri weekly trend from recent 7 days of outreach
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const trendCounts: Record<string, { sent: number; replies: number }> = {
    Mon: { sent: 0, replies: 0 },
    Tue: { sent: 0, replies: 0 },
    Wed: { sent: 0, replies: 0 },
    Thu: { sent: 0, replies: 0 },
    Fri: { sent: 0, replies: 0 },
  }

  const dayIndexMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  outreachData?.forEach((act) => {
    if (act.sent_at) {
      const dayName = dayIndexMap[new Date(act.sent_at).getDay()]
      if (trendCounts[dayName]) {
        if (act.message_status !== 'not_sent' && act.message_status !== 'failed') {
          trendCounts[dayName].sent += 1
        }
        if (!['no_response', 'seen_no_reply'].includes(act.response_status)) {
          trendCounts[dayName].replies += 1
        }
      }
    }
  })

  const weeklyTrends = daysOfWeek.map((day) => ({
    day,
    sent: trendCounts[day].sent,
    replies: trendCounts[day].replies,
  }))

  // 3. Follow-ups
  let followupsQuery = adminSupabase.from('follow_ups').select('id, status').is('deleted_at', null)
  if (employeeId) followupsQuery = followupsQuery.eq('assigned_to', employeeId)
  
  const { data: followupsData } = await followupsQuery
  
  const followups_total = followupsData?.length || 0
  const followups_completed = followupsData?.filter(f => f.status === 'completed').length || 0

  // 4. Projects
  let projectsQuery = adminSupabase.from('projects').select('project_value').is('deleted_at', null)
  if (employeeId) projectsQuery = projectsQuery.eq('employee_id', employeeId)
  
  const { data: projectsData } = await projectsQuery
  const total_project_value = projectsData?.reduce((sum, p) => sum + (p.project_value || 0), 0) || 0

  const metrics: AnalyticsMetrics = {
    total_leads,
    leads_contacted,
    messages_sent,
    messages_seen,
    replies_received,
    interested_leads,
    qualified_leads,
    proposals_sent: leadsData?.filter(l => ['proposal_sent', 'negotiation', 'won', 'project_started', 'project_completed'].includes(l.pipeline_stage)).length || 0,
    deals_won,
    deals_lost,
    total_project_value,
    followups_completed,
    followups_total,
  }

  return {
    metrics,
    rates: computeAllRates(metrics),
    sourceDistribution,
    weeklyTrends,
  }
}

export async function getTodayActivity(employeeId?: string) {
  const adminSupabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  let leadsQuery = adminSupabase.from('leads').select('id, created_at', { count: 'exact' }).is('deleted_at', null).gte('created_at', `${today}T00:00:00Z`)
  let outreachQuery = adminSupabase.from('outreach_activities').select('id, sent_at, response_status', { count: 'exact' }).gte('sent_at', `${today}T00:00:00Z`)
  let projectsQuery = adminSupabase.from('projects').select('id, created_at', { count: 'exact' }).is('deleted_at', null).gte('created_at', `${today}T00:00:00Z`)

  if (employeeId) {
    leadsQuery = leadsQuery.eq('owner_id', employeeId)
    outreachQuery = outreachQuery.eq('employee_id', employeeId)
    projectsQuery = projectsQuery.eq('employee_id', employeeId)
  }

  const [{ count: leadsCount }, { data: outreachData, count: outreachCount }, { count: projectsCount }] = await Promise.all([
    leadsQuery,
    outreachQuery,
    projectsQuery
  ])

  const replies = outreachData?.filter(o => !['no_response', 'seen_no_reply'].includes(o.response_status)).length || 0
  const interested = outreachData?.filter(o => ['interested', 'meeting_requested', 'meeting_scheduled', 'negotiating', 'converted'].includes(o.response_status)).length || 0

  return {
    leads_added: leadsCount || 0,
    messages_sent: outreachCount || 0,
    replies,
    interested,
    projects_won: projectsCount || 0
  }
}
