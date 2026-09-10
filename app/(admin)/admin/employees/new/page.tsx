'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createEmployee, getMyRole, getNextEmployeeId } from '@/lib/actions/employees'
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle, Crown, Shield, Sparkles, Hash } from 'lucide-react'

export default function NewEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [myRole, setMyRole] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'employee' as 'employee' | 'admin',
    phone: '',
    job_title: 'Outreach Specialist',
    employee_id: '',
    department: 'Sales & Outreach',
    joining_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    getMyRole().then((role) => {
      setMyRole(role)
      setRoleLoading(false)
    })
    getNextEmployeeId().then((nextId) => {
      setFormData((prev) => ({ ...prev, employee_id: nextId }))
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    const res = await createEmployee(formData)
    setLoading(false)

    if (res.error) {
      setErrorMsg(res.error)
    } else {
      const type = formData.role === 'admin' ? 'Admin' : 'Employee'
      setSuccessMsg(`${type} account created successfully! Redirecting...`)
      setTimeout(() => {
        router.push('/admin/employees')
      }, 1500)
    }
  }

  const isSuperAdmin = myRole === 'super_admin'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/employees"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Employee Directory
      </Link>

      {/* Form Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Add New Team Member</h1>
            <p className="text-xs text-slate-500">
              Create account credentials and profile details.
            </p>
          </div>
        </div>

        {/* Super Admin Role Banner */}
        {isSuperAdmin && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
            <Crown className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>
              <strong>Super Admin:</strong> You can create both Employee and Admin accounts.
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector — only super_admin can see this */}
          {!roleLoading && isSuperAdmin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Account Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'employee' })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    formData.role === 'employee'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Employee</div>
                    <div className="text-slate-500 font-normal">Standard access</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    formData.role === 'admin'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Crown className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Admin</div>
                    <div className="text-slate-500 font-normal">Full access</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Ali Ahmed"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. ali@company.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Outreach Specialist"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Employee ID / Code
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  <Sparkles className="w-2.5 h-2.5" /> Auto-generated
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.employee_id || 'Generating ID...'}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  placeholder="EMP-001"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50/70 font-mono font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Sales & Outreach"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              href="/admin/employees"
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-all shadow-sm"
            >
              {loading
                ? 'Creating Account...'
                : formData.role === 'admin'
                ? 'Create Admin Account'
                : 'Create Employee Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
