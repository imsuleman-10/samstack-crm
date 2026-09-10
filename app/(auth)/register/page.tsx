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
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 'form' | 'otp' | 'success'

// ─── Shared Layout Wrapper (Defined at module scope so it never remounts inputs) ─
function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md relative z-10 animate-in fade-in duration-300">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 mb-3 shadow-xl shadow-blue-500/25 ring-4 ring-white/10">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            SAMStack <span className="text-blue-400">CRM</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">Create your employee sales account</p>
        </div>
        {children}
      </div>
    </div>
  )
}

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

    // Always take the newest digit typed
    const char = raw.slice(-1)
    const next = [...value]
    next[idx] = char
    onChange(next)

    // Move to next input
    if (idx < 5) {
      focusAt(idx + 1)
    }
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

    if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault()
      focusAt(idx - 1)
    } else if (e.key === 'ArrowRight' && idx < 5) {
      e.preventDefault()
      focusAt(idx + 1)
    }
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
    <div className="flex justify-center gap-2.5">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el
          }}
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
          className="w-11 h-12 text-center text-lg font-bold text-slate-900 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all caret-transparent select-none"
        />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const EMPTY_OTP = Array(6).fill('')

export default function RegisterPage() {
  // Form fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(EMPTY_OTP)
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Flow state
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // ── Cooldown timer ──────────────────────────────────────────────────────────
  const startCooldown = () => {
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    setResendCooldown(60)
    cooldownRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(cooldownRef.current!)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  // ── Step 1: validate form → send OTP ───────────────────────────────────────
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) return setError('Please enter your full name.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')

    startTransition(async () => {
      const res = await sendRegistrationOtp(email)
      if (res?.error) {
        setError(res.error)
        return
      }
      setOtpDigits(EMPTY_OTP)
      setStep('otp')
      startCooldown()
    })
  }

  // ── Step 2: verify OTP → create account ────────────────────────────────────
  const handleOtpVerify = () => {
    const code = otpDigits.join('')
    if (code.length !== 6 || otpDigits.some((d) => !d)) {
      return setError('Please enter the complete 6-digit code.')
    }
    setError(null)

    startTransition(async () => {
      const verifyRes = await verifyRegistrationOtp(email, code)
      if (verifyRes?.error) {
        setError(verifyRes.error)
        return
      }

      const regRes = await registerEmployee({ email, password, full_name: fullName, phone })
      if (regRes?.error) {
        setError(regRes.error)
        return
      }

      setStep('success')
    })
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = () => {
    if (resendCooldown > 0 || isPending) return
    setError(null)
    setOtpDigits(EMPTY_OTP)
    startTransition(async () => {
      const res = await sendRegistrationOtp(email)
      if (res?.error) {
        setError(res.error)
        return
      }
      startCooldown()
    })
  }

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <AuthWrapper>
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Registration Complete!</h2>
          <p className="text-slate-600 text-xs leading-relaxed mb-1">
            Your email has been verified and your account is now{' '}
            <strong>pending administrator approval</strong>.
          </p>
          <p className="text-slate-400 text-xs mb-6">
            An administrator will review and activate your account shortly.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/25"
          >
            Back to Login
          </Link>
        </div>
      </AuthWrapper>
    )
  }

  // ─── OTP Verification Screen ──────────────────────────────────────────────────
  if (step === 'otp') {
    const filledCount = otpDigits.filter(Boolean).length

    return (
      <AuthWrapper>
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Verify your email</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xs mx-auto">
              We sent a 6-digit verification code to{' '}
              <span className="font-semibold text-slate-700 break-all">{email}</span>
            </p>
          </div>

          {/* Spam / Junk Folder Alert right where OTP is entered */}
          <div className="mb-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <span className="text-base flex-shrink-0 mt-0.5">📬</span>
            <div className="leading-snug text-[11.5px] space-y-1">
              <p className="font-semibold text-amber-950">
                Agar code inbox mein na miley toh apna <u>Spam / Junk folder</u> zaroor check karein.
              </p>
              <p className="text-amber-700 text-[10.5px]">
                Please check your Spam / Junk / Promotions folder if the code does not appear in your primary inbox.
              </p>
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-5">
            <OtpInput value={otpDigits} onChange={setOtpDigits} />

            {/* Progress indicator */}
            <div className="flex justify-center gap-1.5">
              {otpDigits.map((d, i) => (
                <div
                  key={i}
                  className={`h-1 w-6 rounded-full transition-all duration-200 ${
                    d ? 'bg-blue-500' : 'bg-slate-200'
                  }`}
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
              disabled={isPending || filledCount !== 6}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify &amp; Create Account
                </>
              )}
            </button>

            {/* Resend + back */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setStep('form')
                  setError(null)
                  setOtpDigits(EMPTY_OTP)
                }}
                className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Change email
              </button>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isPending}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              <KeyRound className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
              Code expires in <strong>10 minutes</strong>. Agar inbox mein na dikhey toh please <strong>Spam / Promotions folder</strong> check karein.
            </p>
          </div>
        </div>
      </AuthWrapper>
    )
  }

  // ─── Registration Form ────────────────────────────────────────────────────────
  return (
    <AuthWrapper>
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <form onSubmit={handleFormSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Muhammad Ahmed"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="you@company.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              id="reg-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="+92 300 0000000"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                tabIndex={-1}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-confirm"
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Re-enter password"
            />
          </div>

          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => {
                  const strength =
                    password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
                      ? 4
                      : password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                      ? 3
                      : password.length >= 8
                      ? 2
                      : 1
                  return (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        level <= strength
                          ? strength === 4
                            ? 'bg-emerald-500'
                            : strength === 3
                            ? 'bg-blue-500'
                            : strength === 2
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  )
                })}
              </div>
              <p className="text-[10px] text-slate-400">
                {password.length < 8
                  ? 'Too short'
                  : password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                  ? 'Strong password'
                  : 'Add uppercase letters, numbers & symbols for a stronger password'}
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-[11px] text-blue-800 leading-relaxed">
              <Mail className="w-3 h-3 inline mr-1" />
              <strong>Email verification required.</strong> A 6-digit code will be sent to your email before your account is created.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending verification code…
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Continue — Verify Email
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthWrapper>
  )
}
