'use client'

import { useState, useTransition } from 'react'
import { updateFollowUpStatus } from '@/lib/actions/followups'
import StatusBadge from '@/components/ui/status-badge'
import { formatDateTime, isOverdue } from '@/lib/utils'
import { CalendarCheck2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { FollowUpStatus } from '@/lib/types/database'

interface FollowUpItem {
  id: string
  title: string
  description?: string | null
  due_date: string
  status: FollowUpStatus
  priority: string
  assignee?: { full_name: string } | null
}

export default function LeadFollowUps({ followUps }: { followUps: FollowUpItem[] }) {
  if (followUps.length === 0) {
    return <p className="text-sm text-slate-400 py-2">No follow-ups scheduled.</p>
  }

  return (
    <div className="space-y-3">
      {followUps.map(fu => (
        <FollowUpRow key={fu.id} fu={fu} />
      ))}
    </div>
  )
}

function FollowUpRow({ fu }: { fu: FollowUpItem }) {
  const [status, setStatus] = useState<FollowUpStatus>(fu.status)
  const [isPending, startTransition] = useTransition()
  const overdue = isOverdue(fu.due_date) && status !== 'completed' && status !== 'cancelled'

  function handleComplete() {
    if (status === 'completed') return
    startTransition(async () => {
      const result = await updateFollowUpStatus(fu.id, 'completed')
      if (result.error) {
        toast.error(result.error)
        return
      }
      setStatus('completed')
      toast.success('Follow-up marked as completed')
    })
  }

  return (
    <div className={`p-3 rounded-xl border ${status === 'completed' ? 'bg-slate-50 border-transparent opacity-60' : overdue ? 'bg-red-50 border-red-100' : 'bg-white border-border'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={handleComplete}
            disabled={isPending || status === 'completed'}
            className={`mt-0.5 flex-shrink-0 transition-colors ${status === 'completed' ? 'text-green-500 cursor-default' : 'text-slate-300 hover:text-green-500'}`}
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <CheckCircle2 className="w-5 h-5" />}
          </button>
          
          <div className="min-w-0">
            <h4 className={`text-sm font-medium ${status === 'completed' ? 'text-slate-500 line-through' : overdue ? 'text-red-700' : 'text-slate-800'}`}>
              {fu.title}
            </h4>
            {fu.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{fu.description}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs font-medium flex items-center gap-1 ${overdue ? 'text-red-600' : 'text-slate-500'}`}>
                {overdue ? <AlertCircle className="w-3.5 h-3.5" /> : <CalendarCheck2 className="w-3.5 h-3.5" />}
                {new Date(fu.due_date).toLocaleDateString()}
              </span>
              <span className="text-slate-300">•</span>
              <StatusBadge type="priority" value={fu.priority} className="text-[10px]" />
              <span className="text-slate-300">•</span>
              <StatusBadge type="followup" value={status} className="text-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
