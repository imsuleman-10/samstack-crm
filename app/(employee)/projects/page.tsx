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

  return (
    <div className="space-y-5 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} converted projects</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No projects found</p>
                    <p className="text-xs mt-1">Convert a lead to a project to see it here.</p>
                  </td>
                </tr>
              ) : (
                projects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 font-medium text-slate-900">{project.project_name}</td>
                    <td className="px-4 py-3">
                      <Link href={`/leads/${project.lead?.id}`} className="text-blue-600 hover:underline font-medium">
                        {project.lead?.business_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-green-600">
                      {formatCurrency(project.project_value)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type="project" value={project.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(project.start_date)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/leads/${project.lead?.id}`} className="text-xs text-blue-600 hover:underline">
                        Lead
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
