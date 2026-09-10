import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function getFollowUps(params?: {
  employeeId?: string
  status?: string
  dateRange?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return []

  const isAdmin = ['admin', 'super_admin'].includes(profile.role)

  let query = adminSupabase
    .from('follow_ups')
    .select('*, lead:leads(id, business_name), assignee:profiles!follow_ups_assigned_to_fkey(full_name, profile_photo_url)')
    .is('deleted_at', null)
    .order('due_date', { ascending: true })

  if (params?.employeeId) {
    query = query.eq('assigned_to', params.employeeId)
  } else if (!isAdmin) {
    query = query.eq('assigned_to', profile.id)
  }
  
  if (params?.status) {
    query = query.eq('status', params.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching follow ups:', error)
    return []
  }

  return data
}

export async function getTodayFollowUpsWidget(employeeId: string) {
  const adminSupabase = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await adminSupabase
    .from('follow_ups')
    .select('id, title, due_date, priority, status, lead:leads(id, business_name)')
    .is('deleted_at', null)
    .eq('assigned_to', employeeId)
    .lte('due_date', today)
    .neq('status', 'completed')
    .neq('status', 'cancelled')
    .order('due_date', { ascending: true })
    .order('priority', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching today follow ups:', error)
    return []
  }

  return data
}
