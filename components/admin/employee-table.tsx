'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateEmployeeStatus } from '@/lib/actions/employees'
import type { EmployeeWithLeadCount } from '@/lib/queries/employees'
import { Search, Filter, CheckCircle2, Ban, Clock, Shield, User } from 'lucide-react'
import { toast } from 'sonner'
import DeleteEmployeeModal from './delete-employee-modal'

interface EmployeeTableProps {
  initialEmployees: EmployeeWithLeadCount[]
}

const STATUS_CONFIG = {
  active:    { label: 'Active',    class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive:  { label: 'Inactive',  class: 'bg-slate-50 text-slate-600 border-slate-200' },
  suspended: { label: 'Suspended', class: 'bg-red-50 text-red-700 border-red-200' },
  pending:   { label: 'Pending',   class: 'bg-amber-50 text-amber-700 border-amber-200' },
} as const

const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin', class: 'bg-purple-100 text-purple-700 border border-purple-300' },
  admin:       { label: 'Admin',       class: 'bg-blue-50 text-blue-700 border border-blue-200' },
  employee:    { label: 'Employee',    class: 'bg-slate-100 text-slate-600 border border-slate-200' },
} as const

export default function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<EmployeeWithLeadCount[]>(initialEmployees)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const pendingCount = employees.filter(e => e.status === 'pending').length

  const handleStatusChange = async (id: string, newStatus: 'active' | 'inactive' | 'suspended' | 'pending') => {
    setLoadingId(id)
    const res = await updateEmployeeStatus(id, newStatus)
    setLoadingId(null)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Employee ${newStatus === 'active' ? 'approved & activated' : newStatus}`)
      setEmployees(prev =>
        prev.map(emp => (emp.id === id ? { ...emp, status: newStatus } : emp))
      )
    }
  }

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase()
    const matchesSearch =
      emp.full_name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.job_title?.toLowerCase().includes(q)) ||
      (emp.department?.toLowerCase().includes(q))

    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Pending Approval Banner */}
      {pendingCount > 0 && statusFilter !== 'pending' && (
        <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              {pendingCount} employee{pendingCount > 1 ? 's' : ''} waiting for approval
            </p>
          </div>
          <button
            onClick={() => setStatusFilter('pending')}
            className="text-xs text-amber-700 font-semibold underline hover:no-underline"
          >
            Review now
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role & Dept</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(emp => {
                const statusCfg = STATUS_CONFIG[emp.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.inactive
                const roleCfg = ROLE_CONFIG[emp.role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.employee
                const isAdmin = emp.role === 'admin' || emp.role === 'super_admin'

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Employee Info with Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {emp.profile_photo_url ? (
                          <img
                            src={emp.profile_photo_url}
                            alt={emp.full_name}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {emp.full_name ? emp.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {emp.full_name || '(No name)'}
                            {isAdmin && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                <Shield className="w-2.5 h-2.5" />
                                {roleCfg.label}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                          {emp.phone && <div className="text-[11px] text-slate-400">{emp.phone}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ${roleCfg.class}`}>
                        {emp.job_title || roleCfg.label}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{emp.department || '—'}</div>
                    </td>

                    {/* Join Date */}
                    <td className="py-3 px-4 text-slate-500">
                      {emp.joining_date
                        ? new Date(emp.joining_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
                        : emp.created_at
                          ? new Date(emp.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize border ${statusCfg.class}`}>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/employees/${emp.id}`}
                          className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          View
                        </Link>

                        {/* Pending → Approve button */}
                        {emp.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(emp.id, 'active')}
                            disabled={loadingId === emp.id}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {loadingId === emp.id ? '…' : 'Approve'}
                          </button>
                        )}

                        {/* Active → Deactivate */}
                        {emp.status === 'active' && !isAdmin && (
                          <button
                            onClick={() => handleStatusChange(emp.id, 'inactive')}
                            disabled={loadingId === emp.id}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                          >
                            <Ban className="w-3 h-3" />
                            {loadingId === emp.id ? '…' : 'Deactivate'}
                          </button>
                        )}

                        {/* Inactive/Suspended → Activate */}
                        {(emp.status === 'inactive' || emp.status === 'suspended') && !isAdmin && (
                          <button
                            onClick={() => handleStatusChange(emp.id, 'active')}
                            disabled={loadingId === emp.id}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {loadingId === emp.id ? '…' : 'Activate'}
                          </button>
                        )}

                        {/* Delete Employee */}
                        {emp.role !== 'super_admin' && (
                          <DeleteEmployeeModal
                            employeeId={emp.id}
                            employeeName={emp.full_name}
                            leadCount={emp.lead_count}
                            onSuccess={() => {
                              setEmployees(prev => prev.filter(e => e.id !== emp.id))
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    {statusFilter === 'pending' ? 'No pending approval requests.' : 'No employees matching your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
