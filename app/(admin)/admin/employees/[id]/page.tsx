import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEmployeeById } from '@/lib/queries/employees'
import { getDashboardMetrics } from '@/lib/queries/analytics'
import { getLeads } from '@/lib/queries/leads'
import { getOutreachActivities } from '@/lib/queries/outreach'
import { formatPKR, formatRate } from '@/lib/analytics/formulas'
import StatCard from '@/components/ui/stat-card'
import DeleteEmployeeModal from '@/components/admin/delete-employee-modal'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Building2,
  Send,
  MessageSquareCheck,
  Award,
  CheckCircle2,
  DollarSign,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EmployeeDetailPage({ params }: Props) {
  const { id } = await params
  const employee = await getEmployeeById(id)

  if (!employee) {
    notFound()
  }

  const [{ metrics, rates }, assignedLeads, outreachLogs] = await Promise.all([
    getDashboardMetrics(id),
    getLeads({ ownerId: id, pageSize: 10 }),
    getOutreachActivities({ employeeId: id, pageSize: 10 }),
  ])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        href="/admin/employees"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Employee Directory
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {employee.profile_photo_url ? (
            <img
              src={employee.profile_photo_url}
              alt={employee.full_name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-sm">
              {employee.full_name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{employee.full_name}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                  employee.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {employee.status}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 capitalize">
              {employee.job_title || 'Outreach Specialist'} &bull; {employee.department || 'Outreach'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}
              </span>
              {employee.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}
                </span>
              )}
              {employee.joining_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {new Date(employee.joining_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Target summary box & actions */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Assigned Targets
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Weekly Messages:</span>
                <span className="font-bold text-slate-900">{employee.target_weekly_outreach || 50}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Conversions:</span>
                <span className="font-bold text-slate-900">{employee.target_monthly_conversions || 5}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Revenue:</span>
                <span className="font-bold text-slate-900">{formatPKR(employee.target_monthly_revenue || 500000)}</span>
              </div>
            </div>
          </div>

          {employee.role !== 'super_admin' && (
            <div className="flex justify-end">
              <DeleteEmployeeModal
                employeeId={employee.id}
                employeeName={employee.full_name}
                leadCount={assignedLeads.count}
                redirectTo="/admin/employees"
              />
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards for this Employee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Leads"
          value={metrics.total_leads}
          subtitle={`${metrics.interested_leads} interested`}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Outreach Sent"
          value={metrics.messages_sent}
          subtitle={`${metrics.replies_received} replies (${rates.reply_rate}%)`}
          icon={Send}
          color="purple"
        />
        <StatCard
          title="Deals Won"
          value={metrics.deals_won}
          subtitle={`${rates.overall_conversion}% conversion rate`}
          icon={Award}
          color="green"
        />
        <StatCard
          title="Total Revenue Generated"
          value={formatPKR(metrics.total_project_value)}
          subtitle="Closed project value"
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* Assigned Leads & Recent Outreach split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Leads */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Assigned Leads ({assignedLeads.count})</h2>
          <div className="space-y-3">
            {assignedLeads.leads.map((lead: any) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="block p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{lead.business_name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-[10px] capitalize">
                    {lead.pipeline_stage.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lead.contact_person || 'No contact specified'} &bull; {lead.category || 'General'}
                </div>
              </Link>
            ))}
            {assignedLeads.leads.length === 0 && (
              <div className="text-xs text-slate-400 text-center py-6">No leads assigned yet.</div>
            )}
          </div>
        </div>

        {/* Recent Outreach Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Outreach History</h2>
          <div className="space-y-3">
            {outreachLogs.activities.map((act: any) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-900">{act.lead?.business_name || 'Lead'}</span>
                  <span className="capitalize px-2 py-0.5 bg-slate-200/70 text-slate-700 rounded text-[10px]">
                    {act.channel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">
                  {act.message_summary || 'Outreach recorded'}
                </p>
                <div className="text-[10px] text-slate-400">
                  {new Date(act.sent_at).toLocaleString()}
                </div>
              </div>
            ))}
            {outreachLogs.activities.length === 0 && (
              <div className="text-xs text-slate-400 text-center py-6">No outreach recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
