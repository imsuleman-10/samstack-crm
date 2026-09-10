import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function getOutreachByLeadId(leadId: string) {
  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from('outreach_activities')
    .select('*, employee:profiles!outreach_activities_employee_id_fkey(full_name, profile_photo_url)')
    .eq('lead_id', leadId)
    .order('sent_at', { ascending: false })

  if (error) {
    console.error('Error fetching outreach for lead:', error)
    return []
  }

  return data
}

export async function getAllOutreach(params?: {
  employeeId?: string
  channel?: string
  responseStatus?: string
  dateRange?: string
  page?: number
  pageSize?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], count: 0 }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { data: [], count: 0 }

  const isAdmin = ['admin', 'super_admin'].includes(profile.role)

  let query = adminSupabase
    .from('outreach_activities')
    .select('*, lead:leads(id, business_name), employee:profiles!outreach_activities_employee_id_fkey(full_name, profile_photo_url)', { count: 'exact' })
    .order('sent_at', { ascending: false })

  if (params?.employeeId) {
    query = query.eq('employee_id', params.employeeId)
  } else if (!isAdmin) {
    query = query.eq('employee_id', profile.id)
  }
  
  if (params?.channel) {
    query = query.eq('channel', params.channel)
  }

  if (params?.responseStatus) {
    query = query.eq('response_status', params.responseStatus)
  }

  const page = params?.page || 1
  const pageSize = params?.pageSize || 50
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching outreach:', error)
    return { data: [], count: 0 }
  }

  return { data, count: count || 0 }
}

export async function getOutreachActivities(params?: {
  employeeId?: string
  channel?: string
  responseStatus?: string
  page?: number
  pageSize?: number
}) {
  const { data, count } = await getAllOutreach(params)
  return { activities: data, count }
}
