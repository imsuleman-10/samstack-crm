// ============================================================
// SAMStack CRM — Analytics Formulas
// SINGLE SOURCE OF TRUTH for all conversion metrics
// ============================================================

export interface AnalyticsMetrics {
  total_leads: number
  leads_contacted: number
  messages_sent: number
  messages_seen: number
  replies_received: number
  interested_leads: number
  qualified_leads: number
  proposals_sent: number
  deals_won: number
  deals_lost: number
  total_project_value: number
  followups_completed: number
  followups_total: number
}

/**
 * Response Rate = Replies / Messages Sent × 100
 */
export function responseRate(metrics: Pick<AnalyticsMetrics, 'replies_received' | 'messages_sent'>): number {
  if (metrics.messages_sent === 0) return 0
  return Math.round((metrics.replies_received / metrics.messages_sent) * 100 * 10) / 10
}

/**
 * Interest Rate = Interested Leads / Leads Contacted × 100
 */
export function interestRate(metrics: Pick<AnalyticsMetrics, 'interested_leads' | 'leads_contacted'>): number {
  if (metrics.leads_contacted === 0) return 0
  return Math.round((metrics.interested_leads / metrics.leads_contacted) * 100 * 10) / 10
}

/**
 * Qualification Rate = Qualified Leads / Interested Leads × 100
 */
export function qualificationRate(metrics: Pick<AnalyticsMetrics, 'qualified_leads' | 'interested_leads'>): number {
  if (metrics.interested_leads === 0) return 0
  return Math.round((metrics.qualified_leads / metrics.interested_leads) * 100 * 10) / 10
}

/**
 * Win Rate = Won Deals / Qualified Leads × 100
 */
export function winRate(metrics: Pick<AnalyticsMetrics, 'deals_won' | 'qualified_leads'>): number {
  if (metrics.qualified_leads === 0) return 0
  return Math.round((metrics.deals_won / metrics.qualified_leads) * 100 * 10) / 10
}

/**
 * Overall Conversion = Won Deals / Total Contacted × 100
 */
export function overallConversion(metrics: Pick<AnalyticsMetrics, 'deals_won' | 'leads_contacted'>): number {
  if (metrics.leads_contacted === 0) return 0
  return Math.round((metrics.deals_won / metrics.leads_contacted) * 100 * 10) / 10
}

/**
 * Follow-up Completion Rate = Completed / Total × 100
 */
export function followupCompletionRate(metrics: Pick<AnalyticsMetrics, 'followups_completed' | 'followups_total'>): number {
  if (metrics.followups_total === 0) return 0
  return Math.round((metrics.followups_completed / metrics.followups_total) * 100 * 10) / 10
}

/**
 * Seen Rate = Messages Seen / Messages Sent × 100
 */
export function seenRate(metrics: Pick<AnalyticsMetrics, 'messages_seen' | 'messages_sent'>): number {
  if (metrics.messages_sent === 0) return 0
  return Math.round((metrics.messages_seen / metrics.messages_sent) * 100 * 10) / 10
}

/**
 * Compute all rates at once
 */
export function computeAllRates(metrics: AnalyticsMetrics) {
  return {
    response_rate: responseRate(metrics),
    reply_rate: responseRate(metrics),
    contact_rate: metrics.total_leads ? Math.round((metrics.leads_contacted / metrics.total_leads) * 100 * 10) / 10 : 0,
    interest_rate: interestRate(metrics),
    qualification_rate: qualificationRate(metrics),
    proposal_rate: metrics.interested_leads ? Math.round((metrics.proposals_sent / metrics.interested_leads) * 100 * 10) / 10 : 0,
    win_rate: winRate(metrics),
    overall_conversion: overallConversion(metrics),
    conversion_rate: overallConversion(metrics),
    followup_completion_rate: followupCompletionRate(metrics),
    seen_rate: seenRate(metrics),
  }
}

export function formatRate(rate: number): string {
  return `${rate}`
}

export function formatPercent(rate: number): string {
  return `${rate}%`
}

export function formatCurrency(value: number | null | undefined, currency = 'PKR'): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPKR(value: number | null | undefined): string {
  return formatCurrency(value, 'PKR')
}

