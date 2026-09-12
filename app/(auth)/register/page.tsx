'use client'

import { useState, useRef, useTransition } from 'react'
import {
  sendRegistrationOtp,
  verifyRegistrationOtp,
  registerEmployee,
} from '@/lib/actions/auth'
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  KeyRound,
  User,
  Phone,
  Lock,
  Star,
  Zap,
  Users,
  BarChart3,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 'form' | 'otp' | 'success'

// ─── Left Panel Benefits ─────────────────────────────────────────────────────
const benefits = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Track Your Sales',
    desc: 'Monitor leads, follow-ups, and conversions in real-time.',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Team Collaboration',
    desc: 'Work seamlessly with your team across projects.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Smart Automation',
    desc: 'Automate outreach and get AI-powered insights.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Enterprise Security',
    desc: 'Your data is protected with Supabase Enterprise Auth.',
  },
]

// ─── OTP Input Component ──────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const focusAt = (idx: number) => {
    requestAnimationFrame(() => {
      inputRefs.current[idx]?.focus()
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) {
      const next = [...value]
      next[idx] = ''
      onChange(next)
      return
    }
    const char = raw.slice(-1)
    const next = [...value]
    next[idx] = char
    onChange(next)
    if (idx < 5) focusAt(idx + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...value]
      if (next[idx]) {
        next[idx] = ''
        onChange(next)
      } else if (idx > 0) {
        next[idx - 1] = ''
        onChange(next)
        focusAt(idx - 1)
      }
      return
    }
    if (e.key === 'ArrowLeft' && idx > 0) { e.preventDefault(); focusAt(idx - 1) }
    else if (e.key === 'ArrowRight' && idx < 5) { e.preventDefault(); focusAt(idx + 1) }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '')
    onChange(next)
    focusAt(Math.min(pasted.length, 5))
  }

  return (
    <div className="flex justify-center gap-3">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          value={digit}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={(e) => e.target.select()}
          onPaste={handlePaste}
          className={[
            'w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all duration-200 caret-transparent select-none outline-none',
            digit
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/15'
              : 'border-slate-200 bg-white text-slate-900 focus:border-blue-400 focus:bg-blue-50/40 focus:shadow-md focus:shadow-blue-500/10',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

// ─── Password Strength ────────────────────────────────────────────────────────
function getStrength(pw: string) {
  if (pw.length < 8) return { level: 1, label: 'Too short', color: 'bg-red-500' }
  if (pw.length >= 12 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw))
    return { level: 4, label: 'Strong 💪', color: 'bg-emerald-500' }
  if (pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw))
    return { level: 3, label: 'Good', color: 'bg-blue-500' }
  return { level: 2, label: 'Fair — add numbers & symbols', color: 'bg-amber-500' }
}

// ─── Left Branding Panel (register.png on Form) ─────────────────────────────
function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden bg-slate-950 border-r border-white/10">
      {/* register.png on the form */}
      <img
        src="/register.png"
        alt="SAMStack Team"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-90 pointer-events-none"
      />
      {/* Soft gradient overlay so team photo is clear in the center while text is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/15 to-slate-950/85 pointer-events-none" />

      {/* Top logo & badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-2 border border-white/20 shadow-lg flex items-center justify-center">
            <img src="/logo.png" alt="SAMStack Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-white font-extrabold text-lg tracking-tight leading-none drop-shadow">
              SAMStack <span className="text-blue-400">CRM</span>
            </p>
            <p className="text-slate-300 text-[10px] font-bold tracking-wider uppercase mt-0.5">
              Enterprise Sales Suite
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-emerald-300 text-[11px] font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Official Team
        </div>
      </div>

      {/* Bottom info glassmorphic card */}
      <div className="relative z-10 p-5 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/15 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5 drop-shadow-md">
          Join the team.{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Close more deals.
          </span>
        </h2>
        <p className="text-slate-200 text-xs leading-relaxed mb-3.5 drop-shadow-sm">
          Create your employee account and get instant access to the most powerful CRM built for SAMStack&apos;s sales force.
        </p>

        {/* Benefits list (compact) */}
        <div className="space-y-2 mb-3.5">
          {benefits.slice(0, 2).map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-blue-300 flex-shrink-0">
                {b.icon}
              </div>
              <span className="font-semibold">{b.title}</span>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[
                { init: 'SZ', bg: '#2563eb' },
                { init: 'SA', bg: '#7c3aed' },
                { init: 'SJ', bg: '#059669' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                  style={{ background: m.bg }}
                >
                  {m.init}
                </div>
              ))}
            </div>
            <span className="text-slate-300 text-[11px] font-semibold">Active Team</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>5.0 Satisfaction</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const EMPTY_OTP = Array(6).fill('')

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const [otpDigits, setOtpDigits] = useState<string[]>(EMPTY_OTP)
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const strength = password.length > 0 ? getStrength(password) : null

  const startCooldown = () => {
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    setResendCooldown(60)
    cooldownRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(cooldownRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!fullName.trim()) return setError('Please enter your full name.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    startTransition(async () => {
      const res = await sendRegistrationOtp(email)
      if (res?.error) { setError(res.error); return }
      setOtpDigits(EMPTY_OTP)
      setStep('otp')
      startCooldown()
    })
  }

  const handleOtpVerify = () => {
    const code = otpDigits.join('')
    if (code.length !== 6 || otpDigits.some((d) => !d)) {
      return setError('Please enter the complete 6-digit code.')
    }
    setError(null)
    startTransition(async () => {
      const verifyRes = await verifyRegistrationOtp(email, code)
      if (verifyRes?.error) { setError(verifyRes.error); return }
      const regRes = await registerEmployee({ email, password, full_name: fullName, phone })
      if (regRes?.error) { setError(regRes.error); return }
      setStep('success')
    })
  }

  const handleResend = () => {
    if (resendCooldown > 0 || isPending) return
    setError(null)
    setOtpDigits(EMPTY_OTP)
    startTransition(async () => {
      const res = await sendRegistrationOtp(email)
      if (res?.error) { setError(res.error); return }
      startCooldown()
    })
  }

  // ─── Page shell ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-950">
      {/* Background Image: crm.png clearly visible */}
      <img
        src="/crm.png"
        alt="SAMStack Team"
        className="fixed inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none"
      />
      {/* Dark gradient overlay for contrast */}
      <div className="fixed inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/85 pointer-events-none" />

      {/* Mobile logo */}
      <div className="fixed top-4 left-4 lg:hidden flex items-center gap-2.5 z-50 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
          <img src="/logo.png" alt="SAMStack Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-extrabold text-white text-xs">
          SAMStack <span className="text-blue-400">CRM</span>
        </span>
      </div>

      {/* Ambient glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10">

        {/* ─── SUCCESS ──────────────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-10 text-center border border-slate-100">
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/25">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">You&apos;re all set! 🎉</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-1">
                Your email has been verified and your account is now
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Pending Administrator Approval
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-8 max-w-xs mx-auto">
                An administrator will review and activate your account shortly. You&apos;ll be able to sign in once approved.
              </p>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* ─── OTP STEP ─────────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />
              <div className="p-8">
                <div className="text-center mb-7">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 mb-4 ring-4 ring-blue-50">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">Check your inbox</h2>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                    We sent a 6-digit code to{' '}
                    <span className="font-semibold text-slate-700 break-all">{email}</span>
                  </p>
                </div>

                <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">📬</span>
                  <div className="text-xs leading-snug space-y-0.5">
                    <p className="font-semibold text-amber-900">
                      Code not arriving? Check <u>Spam / Junk</u> folder.
                    </p>
                    <p className="text-amber-700/80">Also check Promotions if using Gmail.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <OtpInput value={otpDigits} onChange={setOtpDigits} />

                  <div className="flex justify-center gap-1.5">
                    {otpDigits.map((d, i) => (
                      <div
                        key={i}
                        className={`h-1 w-7 rounded-full transition-all duration-300 ${d ? 'bg-blue-500 scale-y-125' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleOtpVerify}
                    disabled={isPending || otpDigits.filter(Boolean).length !== 6}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Verify &amp; Create Account</>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => { setStep('form'); setError(null); setOtpDigits(EMPTY_OTP) }}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Change email
                    </button>
                    <button
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || isPending}
                      className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <p className="text-[11px] text-slate-400">
                    Code expires in <strong className="text-slate-600">10 minutes</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── FORM STEP ────────────────────────────────────────────────────── */}
        {step === 'form' && (
          <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80 border border-slate-200/60">
            <LeftPanel />

            {/* Right: Form */}
            <div className="bg-white">
              {/* Mobile banner with register.png */}
              <div className="lg:hidden relative h-48 overflow-hidden">
                <img
                  src="/register.png"
                  alt="SAMStack Team"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />
              </div>
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 lg:hidden" />

              <div className="p-8 sm:p-10">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-4">
                    <User className="w-3 h-3" />
                    Employee Signup
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Create your account
                  </h1>
                  <p className="text-slate-500 text-sm mt-1.5">
                    Fill in your details to join SAMStack CRM.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        placeholder="Muhammad Ahmed"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Work Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        placeholder="you@samstack.tech"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        placeholder="+92 300 0000000"
                      />
                    </div>
                  </div>

                  {/* Password + Confirm */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-password"
                          type={showPass ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                          placeholder="Min. 8 chars"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                          tabIndex={-1}
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Confirm <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-confirm"
                          type={showPass ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                          placeholder="Re-enter"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password strength */}
                  {strength && (
                    <div className="space-y-1.5 -mt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${lvl <= strength.level ? strength.color : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500">{strength.label}</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11.5px] text-blue-700 leading-snug">
                      <strong>Email verification required.</strong> A 6-digit code will be sent before your account is created.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending verification code…</>
                    ) : (
                      <>
                        Continue — Verify Email
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 font-bold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
