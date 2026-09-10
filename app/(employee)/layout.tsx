import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('id, full_name, role, status, onboarding_completed, profile_photo_url')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.status !== 'active') redirect('/login?error=account_disabled')
  if (!profile.onboarding_completed) redirect('/onboarding')

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        role={profile.role}
        fullName={profile.full_name}
        photoUrl={profile.profile_photo_url}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header role={profile.role} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
