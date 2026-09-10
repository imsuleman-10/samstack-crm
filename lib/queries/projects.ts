import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function getProjects(params?: {
  employeeId?: string
  status?: string
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
    .from('projects')
    .select('*, lead:leads(id, business_name), employee:profiles!projects_employee_id_fkey(full_name, profile_photo_url)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (params?.employeeId) {
    query = query.eq('employee_id', params.employeeId)
  } else if (!isAdmin) {
    query = query.eq('employee_id', profile.id)
  }
  
  if (params?.status) {
    query = query.eq('status', params.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data
}

export async function getProjectById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return null

  const { data, error } = await adminSupabase
    .from('projects')
    .select('*, lead:leads(id, business_name), employee:profiles!projects_employee_id_fkey(full_name, profile_photo_url)')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return null
  }

  const isAdmin = ['admin', 'super_admin'].includes(profile.role)
  if (!isAdmin && data.employee_id !== profile.id) {
    return null
  }

  return data
}
