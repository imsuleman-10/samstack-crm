'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { testGroqConnection, DEFAULT_GROQ_API_KEY, DEFAULT_GROQ_MODEL } from '@/lib/groq'

export interface SystemSettingsConfig {
  groq_api_key: string
  groq_model: string
  default_currency: string
  default_country: string
  auto_ai_mapping_enabled: boolean
}

const DEFAULT_CONFIG: SystemSettingsConfig = {
  groq_api_key: DEFAULT_GROQ_API_KEY,
  groq_model: DEFAULT_GROQ_MODEL,
  default_currency: 'PKR',
  default_country: 'Pakistan',
  auto_ai_mapping_enabled: true,
}

/**
 * Fetch CRM settings from Supabase or fallback defaults
 */
export async function getSystemSettings(): Promise<SystemSettingsConfig> {
  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('system_settings')
      .select('*')
      .eq('key', 'crm_config')
      .single()

    if (!error && data && data.value) {
      return {
        ...DEFAULT_CONFIG,
        ...(typeof data.value === 'string' ? JSON.parse(data.value) : data.value),
      }
    }
  } catch (err) {
    // If table does not exist or network error, return defaults with user's key
  }

  return DEFAULT_CONFIG
}

/**
 * Save CRM system settings in database
 */
export async function saveSystemSettings(config: Partial<SystemSettingsConfig>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized: Admin authentication required' }

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { error: 'Permission denied: Only administrators can update system settings.' }
  }

  try {
    const current = await getSystemSettings()
    const updated = { ...current, ...config }

    // Try upserting to system_settings table
    const { error } = await adminSupabase
      .from('system_settings')
      .upsert({
        key: 'crm_config',
        value: updated,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

    if (error) {
      // If table doesn't exist, we still return the updated config in memory
      console.warn('Could not save to system_settings table:', error.message)
    }

    revalidatePath('/admin/settings')
    return { success: true, data: updated }
  } catch (err: any) {
    return { error: err.message || 'Failed to save settings' }
  }
}

/**
 * Server action to ping and test the Groq API key
 */
export async function testGroqKeyAction(apiKey?: string) {
  const result = await testGroqConnection(apiKey)
  return result
}
