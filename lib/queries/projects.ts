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

  // 1. Fetch direct projects
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

  const { data: directProjects, error } = await query

  if (error) {
    console.error('Error fetching direct projects:', error)
  }

  // 2. Fetch converted won leads that have deal pricing or are in won/started/completed stages
  let wonLeadsQuery = adminSupabase
    .from('leads')
    .select('id, business_name, category, city, phone, pipeline_stage, owner_id, offered_price, deal_value, amount_received, currency, created_at, updated_at, owner:profiles!leads_owner_id_fkey(full_name, profile_photo_url)')
    .in('pipeline_stage', ['won', 'project_started', 'project_completed'])
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (params?.employeeId) {
    wonLeadsQuery = wonLeadsQuery.eq('owner_id', params.employeeId)
  } else if (!isAdmin) {
    wonLeadsQuery = wonLeadsQuery.eq('owner_id', profile.id)
  }

  const { data: wonLeads } = await wonLeadsQuery

  // Existing lead IDs in directProjects
  const directLeadIds = new Set(
    (directProjects || []).map((p: any) => p.lead_id).filter(Boolean)
  )

  // Transform won leads that don't already have a project into virtual project objects
  const convertedFromLeads = (wonLeads || [])
    .filter((l: any) => !directLeadIds.has(l.id))
    .map((l: any) => {
      let status = 'in_progress'
      if (l.pipeline_stage === 'project_completed') {
        status = 'completed'
      } else if (l.pipeline_stage === 'won' && !l.deal_value) {
        status = 'approved'
      }

      return {
        id: `lead_proj_${l.id}`,
        lead_id: l.id,
        employee_id: l.owner_id,
        project_name: `${l.business_name} - Contract`,
        project_value: Number(l.deal_value || l.offered_price || 0),
        offered_price: Number(l.offered_price || 0),
        amount_received: Number(l.amount_received || 0),
        currency: l.currency || 'PKR',
        status,
        start_date: l.created_at,
        expected_completion_date: null,
        completed_at: l.pipeline_stage === 'project_completed' ? l.updated_at : null,
        notes: `Auto-synced from closed deal (${l.business_name})`,
        deleted_at: null,
        created_at: l.created_at,
        updated_at: l.updated_at,
        lead: { id: l.id, business_name: l.business_name },
        employee: l.owner,
      }
    })

  let allProjects = [...(directProjects || []), ...convertedFromLeads]

  // Filter by status if requested
  if (params?.status) {
    allProjects = allProjects.filter((p) => p.status === params.status)
  }

  return allProjects
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
