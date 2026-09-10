import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, Mail, Phone, Building2, Calendar, ShieldCheck, Hash } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your personal information</p>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800" />
        
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end mb-6">
            <div className="relative -mt-12">
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={profile.full_name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                profile.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${profile.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                {profile.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile.full_name}</h2>
              <p className="text-slate-500 font-medium">{profile.job_title || 'Employee'}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Hash className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Employee ID</p>
                  <p className="text-sm font-bold font-mono text-blue-900 truncate">{profile.employee_id || 'System Assigned'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Email</p>
                  <p className="text-sm text-slate-900 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Phone</p>
                  <p className="text-sm text-slate-900 truncate">{profile.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Department</p>
                  <p className="text-sm text-slate-900 truncate">{profile.department || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Joining Date</p>
                  <p className="text-sm text-slate-900 truncate">{formatDate(profile.joining_date) || '—'}</p>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Bio</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
