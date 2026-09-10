'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding, uploadProfilePhoto, getNextEmployeeId } from '@/lib/actions/employees'
import { compressImage, validateImageFile } from '@/lib/utils/compress-image'
import { Building2, User, Camera, Loader2, CheckCircle2, Sparkles, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isPending, startTransition] = useTransition()

  // Step 1 data
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [bio, setBio] = useState('')

  // Restore draft from localStorage on mount so refresh never loses data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('samstack_onboarding_draft')
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.fullName) setFullName(draft.fullName)
        if (draft.phone) setPhone(draft.phone)
        if (draft.jobTitle) setJobTitle(draft.jobTitle)
        if (draft.department) setDepartment(draft.department)
        if (draft.bio) setBio(draft.bio)
        if (draft.employeeId) setEmployeeId(draft.employeeId)
        if (draft.step && draft.step <= 2) setStep(draft.step)
      }
    } catch {}

    getNextEmployeeId().then((id) => {
      setEmployeeId((prev) => prev || id)
    }).catch(() => {
      setEmployeeId((prev) => prev || 'EMP-001')
    })
  }, [])

  // Auto-save draft on input change
  useEffect(() => {
    try {
      localStorage.setItem('samstack_onboarding_draft', JSON.stringify({
        fullName,
        phone,
        jobTitle,
        department,
        employeeId,
        bio,
        step,
      }))
    } catch {}
  }, [fullName, phone, jobTitle, department, employeeId, bio, step])

  // Step 2 data
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    // Compress if larger than 2MB
    let finalFile = file
    if (file.size > 2 * 1024 * 1024) {
      toast.loading('Compressing image…', { id: 'compress' })
      try {
        finalFile = await compressImage(file)
        toast.success(`Compressed: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(finalFile.size / 1024 / 1024).toFixed(1)}MB`, { id: 'compress' })
      } catch {
        toast.error('Compression failed, using original', { id: 'compress' })
      }
    }

    setPhotoFile(finalFile)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(finalFile)
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim() || !jobTitle.trim()) {
      toast.error('Please fill all required fields')
      return
    }
    setStep(2)
  }

  function handleFinish() {
    startTransition(async () => {
      // Upload photo if provided (already compressed in handlePhotoChange)
      if (photoFile) {
        const fd = new FormData()
        fd.append('file', photoFile)
        const photoResult = await uploadProfilePhoto(fd)
        if (photoResult.error) {
          toast.error(`Photo upload failed: ${photoResult.error}`)
        }
      }

      const result = await completeOnboarding({
        full_name: fullName,
        phone,
        job_title: jobTitle,
        employee_id: employeeId || undefined,
        department: department || undefined,
        bio: bio || undefined,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      setStep(3)
      try {
        localStorage.removeItem('samstack_onboarding_draft')
      } catch {}

      const target = (result.role === 'admin' || result.role === 'super_admin') ? '/admin/dashboard' : '/dashboard'
      setTimeout(() => {
        router.push(target)
        router.refresh()
      }, 1500)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Let's get you set up in SAMStack CRM</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                step >= s ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
              )}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={cn('h-px w-8', step > s ? 'bg-blue-500' : 'bg-white/20')} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 1 – Personal Info */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ali Khan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Outreach Specialist"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700">Employee ID</label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      <Sparkles className="w-2.5 h-2.5" /> Auto-assigned
                    </span>
                  </div>
                  <input
                    readOnly
                    value={employeeId || 'Generating ID...'}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/80 font-mono font-bold text-blue-900 text-sm focus:outline-none cursor-default"
                    placeholder="EMP-001"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">System assigned sequential ID</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sales"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio (optional)</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    maxLength={500}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Brief introduction about yourself..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue →
              </button>
            </form>
          )}

          {/* Step 2 – Photo Upload */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                Profile Photo
              </h2>

              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Camera className="w-4 h-4" />
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  </span>
                </label>

                <p className="text-xs text-slate-500 text-center">
                  JPEG, PNG or WebP · Max 5MB<br />
                  You can also skip this and add it later from your profile.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-10 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isPending}
                  className="flex-1 h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {photoPreview ? 'Save & Continue' : 'Skip & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 – Done */}
          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">You're all set!</h2>
              <p className="text-slate-500 text-sm">
                Welcome to SAMStack CRM, {fullName.split(' ')[0]}. Redirecting to your dashboard…
              </p>
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
