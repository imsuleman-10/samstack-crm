import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProjects } from '@/lib/queries/projects'
import StatusBadge from '@/components/ui/status-badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FolderKanban, Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')

  const projects = await getProjects({
    employeeId: !['admin', 'super_admin'].includes(profile.role) ? profile.id : undefined,
  })

  const totalValue = projects.reduce((sum: number, p: any) => sum + (p.project_value || 0), 0)
  const totalReceived = projects.reduce((sum: number, p: any) => sum + (p.amount_received || 0), 0)
  const totalPending = Math.max(0, totalValue - totalReceived)

  return (
    <div className="space-y-5 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Projects & Deal Financials</h1>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} converted projects assigned to you</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-500">Locked Value</div>
            <div className="text-sm font-bold text-slate-900">{formatCurrency(totalValue)}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-emerald-700">Received</div>
            <div className="text-sm font-bold text-emerald-900">{formatCurrency(totalReceived)}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-amber-700">Balance</div>
            <div className="text-sm font-bold text-amber-900">{formatCurrency(totalPending)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Offer</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Locked Deal</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Received</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No projects found</p>
                    <p className="text-xs mt-1">Convert a lead to a project to see it here.</p>
                  </td>
                </tr>
              ) : (
                projects.map((project: any) => {
                  const lockedVal = Number(project.project_value || 0)
                  const recVal = Number(project.amount_received || 0)
                  const balanceVal = Math.max(0, lockedVal - recVal)
                  const cur = project.currency || 'PKR'

                  return (
                    <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3 font-medium text-slate-900">{project.project_name}</td>
                      <td className="px-4 py-3">
                        <Link href={`/leads/${project.lead?.id}`} className="text-blue-600 hover:underline font-medium">
                          {project.lead?.business_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-amber-700 font-medium">
                        {project.offered_price ? `${cur} ${Number(project.offered_price).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {cur} {lockedVal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">
                        {cur} {recVal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {balanceVal > 0 ? (
                          <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            {cur} {balanceVal.toLocaleString()}
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Fully Paid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge type="project" value={project.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/leads/${project.lead?.id}`} className="text-xs text-blue-600 hover:underline">
                          Lead
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
