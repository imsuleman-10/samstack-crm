import { CheckCircle2, Building2, Send, MessageSquare, Award } from 'lucide-react'

interface ActivityOverviewProps {
  today: {
    leads_added: number
    messages_sent: number
    replies: number
    interested: number
    projects_won: number
  }
}

export default function ActivityOverview({ today }: ActivityOverviewProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Today&apos;s Team Velocity</h2>
          <p className="text-xs text-slate-500">Real-time daily activity tracking across all active reps</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
          Live Today
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-500" /> Leads Added
          </div>
          <div className="text-xl font-bold text-slate-900">{today.leads_added}</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Send className="w-3.5 h-3.5 text-indigo-500" /> Outreach Sent
          </div>
          <div className="text-xl font-bold text-slate-900">{today.messages_sent}</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-teal-500" /> Replies Received
          </div>
          <div className="text-xl font-bold text-slate-900">{today.replies}</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Interested
          </div>
          <div className="text-xl font-bold text-slate-900">{today.interested}</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> Deals Won
          </div>
          <div className="text-xl font-bold text-emerald-700">{today.projects_won}</div>
        </div>
      </div>
    </div>
  )
}
