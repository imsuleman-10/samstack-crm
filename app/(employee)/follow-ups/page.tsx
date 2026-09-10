import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getFollowUps } from '@/lib/queries/followups'
import StatusBadge from '@/components/ui/status-badge'
import { CalendarCheck2, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { isOverdue, isToday } from '@/lib/utils'

export const metadata: Metadata = { title: 'Follow-ups' }

export default async function FollowUpsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')

  const followUps = await getFollowUps({
    employeeId: !['admin', 'super_admin'].includes(profile.role) ? profile.id : undefined,
  })

  const overdue = followUps.filter(f => isOverdue(f.due_date) && f.status !== 'completed' && f.status !== 'cancelled')
  const today = followUps.filter(f => isToday(f.due_date) && f.status !== 'completed' && f.status !== 'cancelled')
  const upcoming = followUps.filter(f => !isOverdue(f.due_date) && !isToday(f.due_date) && f.status !== 'completed' && f.status !== 'cancelled')
  const completed = followUps.filter(f => f.status === 'completed')

  return (
    <div className="space-y-6 animate-in max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Follow-ups</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your scheduled tasks and follow-ups</p>
      </div>

      <div className="grid gap-6">
        {/* Overdue */}
        {overdue.length > 0 && (
          <FollowUpSection title="Overdue" items={overdue} icon={AlertCircle} color="red" />
        )}

        {/* Today */}
        <FollowUpSection title="Due Today" items={today} icon={Clock} color="orange" defaultEmpty />

        {/* Upcoming */}
        <FollowUpSection title="Upcoming" items={upcoming} icon={CalendarCheck2} color="blue" />

        {/* Completed */}
        {completed.length > 0 && (
          <div className="opacity-60">
            <FollowUpSection title="Completed" items={completed.slice(0, 5)} icon={CalendarCheck2} color="slate" />
          </div>
        )}
      </div>
    </div>
  )
}

function FollowUpSection({ title, items, icon: Icon, color, defaultEmpty = false }: any) {
  if (items.length === 0 && !defaultEmpty) return null

  const colors = {
    red: 'text-red-500 bg-red-50 border-red-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-100',
    blue: 'text-blue-500 bg-blue-50 border-blue-100',
    slate: 'text-slate-500 bg-slate-50 border-slate-200',
  }

  const borderColors = {
    red: 'border-red-100',
    orange: 'border-orange-100',
    blue: 'border-blue-100',
    slate: 'border-border',
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className={`px-5 py-3 border-b flex items-center gap-2 ${borderColors[color as keyof typeof borderColors]} bg-slate-50/50`}>
        <Icon className={`w-4 h-4 ${colors[color as keyof typeof colors].split(' ')[0]}`} />
        <h2 className="font-semibold text-slate-800 text-sm">{title}</h2>
        <span className="ml-auto text-xs font-medium bg-white px-2 py-0.5 rounded-full border border-border">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          <p className="text-sm">Nothing here right now.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((fu: any) => (
            <div key={fu.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/leads/${fu.lead?.id}`} className="text-sm font-medium text-slate-900 hover:text-blue-600 truncate">
                    {fu.lead?.business_name}
                  </Link>
                  <StatusBadge type="priority" value={fu.priority} className="text-[10px]" />
                  <StatusBadge type="followup" value={fu.status} className="text-[10px]" />
                </div>
                <p className="text-sm text-slate-700">{fu.title}</p>
                {fu.description && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{fu.description}</p>}
                
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CalendarCheck2 className="w-3.5 h-3.5" />
                    {new Date(fu.due_date).toLocaleDateString()}
                  </span>
                  <span>Assigned to: {fu.assignee?.full_name || 'Unknown'}</span>
                </div>
              </div>
              <Link
                href={`/leads/${fu.lead?.id}`}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-slate-600 hover:bg-white bg-slate-50 transition-colors flex-shrink-0"
              >
                View Lead
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
