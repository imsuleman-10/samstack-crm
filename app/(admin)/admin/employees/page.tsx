import Link from 'next/link'
import { getEmployees } from '@/lib/queries/employees'
import EmployeeTable from '@/components/admin/employee-table'
import { UserPlus, Users, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminEmployeesPage() {
  const employees = await getEmployees()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Team Management
          </div>
          <h1 className="text-xl font-bold text-slate-900">Employees Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your team members, credentials, targets, and account status.
          </p>
        </div>
        <Link
          href="/admin/employees/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add New Employee
        </Link>
      </div>

      {/* Employee List Table */}
      <EmployeeTable initialEmployees={employees} />
    </div>
  )
}
