'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createLeadQuick, createLeadFull, checkDuplicate } from '@/lib/actions/leads'
import { toast } from 'sonner'
import {
  Building2, Globe, Phone, Mail, MapPin, ChevronRight,
  ChevronLeft, Loader2, AlertTriangle, X, Zap, FileText
} from 'lucide-react'
import Link from 'next/link'
import { LEAD_SOURCE_OPTIONS } from '@/lib/constants'
import type { LeadSource } from '@/lib/types/database'

type Mode = 'quick' | 'full'
type FullStep = 1 | 2 | 3 | 4

interface DuplicateLead {
  id: string
  business_name: string
  city: string | null
  pipeline_stage: string
  owner?: { full_name: string } | null
}

export default function NewLeadClient({ categories }: { categories: { name: string }[] }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('quick')
  const [isPending, startTransition] = useTransition()
  const [duplicates, setDuplicates] = useState<DuplicateLead[]>([])
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)

  // Quick form state
  const [q, setQ] = useState({
    business_name: '', category: '', city: '', country: 'Pakistan',
    google_maps_url: '', website: '', phone: '', whatsapp: '',
    email: '', facebook_url: '', instagram_url: '', tiktok_url: '',
    lead_source: 'google_maps' as LeadSource,
  })

  // Duplicate check on business name change
  useEffect(() => {
    if (q.business_name.length < 3) { setDuplicates([]); return }
    const timeout = setTimeout(async () => {
      const result = await checkDuplicate({
        business_name: q.business_name,
        phone: q.phone || undefined,
        email: q.email || undefined,
        website: q.website || undefined,
      })
      setDuplicates((result.duplicates as unknown as DuplicateLead[]) || [])
      setShowDuplicateWarning(((result.duplicates as unknown as DuplicateLead[]) || []).length > 0)
    }, 600)
    return () => clearTimeout(timeout)
  }, [q.business_name, q.phone, q.email])

  function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createLeadQuick(q)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Lead created successfully!')
      router.push(`/leads/${result.data?.id}`)
    })
  }

  return (
    <div className="space-y-5 animate-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/leads" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Lead</h1>
          <p className="text-sm text-slate-500">Add a business to start outreach</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setMode('quick')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'quick' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Quick Add
        </button>
        <button
          onClick={() => setMode('full')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'full' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Full Form
        </button>
      </div>

      {/* Duplicate Warning */}
      {showDuplicateWarning && duplicates.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Possible Duplicate Detected</p>
                <p className="text-amber-700 text-xs mt-0.5">This business may already exist:</p>
                <div className="mt-2 space-y-1.5">
                  {duplicates.map(d => (
                    <Link
                      key={d.id}
                      href={`/leads/${d.id}`}
                      className="flex items-center gap-2 text-xs text-amber-800 hover:text-blue-700 hover:underline"
                    >
                      <Building2 className="w-3 h-3" />
                      <span className="font-medium">{d.business_name}</span>
                      {d.city && <span>· {d.city}</span>}
                      <span>· Assigned to {(d.owner as any)?.full_name || 'Unknown'}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDuplicateWarning(false)}
              className="text-amber-400 hover:text-amber-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Form */}
      {mode === 'quick' && (
        <form onSubmit={handleQuickSubmit} className="bg-white border border-border rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Business Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required
                  value={q.business_name}
                  onChange={e => setQ(prev => ({ ...prev, business_name: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC Restaurant"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={q.category}
                onChange={e => setQ(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category...</option>
                {categories.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={q.city}
                  onChange={e => setQ(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lahore"
                />
              </div>
            </div>

            {/* Google Maps */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps URL</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={q.google_maps_url}
                  onChange={e => setQ(prev => ({ ...prev, google_maps_url: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={q.website}
                  onChange={e => setQ(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://website.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={q.phone}
                  onChange={e => setQ(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                <input
                  type="tel"
                  value={q.whatsapp}
                  onChange={e => setQ(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={q.email}
                  onChange={e => setQ(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@business.com"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                <input
                  type="url"
                  value={q.facebook_url}
                  onChange={e => setQ(prev => ({ ...prev, facebook_url: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/page"
                />
              </div>
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
              <input
                type="url"
                value={q.instagram_url}
                onChange={e => setQ(prev => ({ ...prev, instagram_url: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/page"
              />
            </div>

            {/* TikTok */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">TikTok</label>
              <input
                type="url"
                value={q.tiktok_url}
                onChange={e => setQ(prev => ({ ...prev, tiktok_url: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://tiktok.com/@page"
              />
            </div>

            {/* Lead Source */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lead Source</label>
              <select
                value={q.lead_source}
                onChange={e => setQ(prev => ({ ...prev, lead_source: e.target.value as LeadSource }))}
                className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LEAD_SOURCE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/leads"
              className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create Lead
            </button>
          </div>
        </form>
      )}

      {/* Full Form */}
      {mode === 'full' && (
        <div className="bg-white border border-border rounded-xl p-6">
          <p className="text-sm text-slate-500 mb-4">Use Full Form for detailed business information. Start with Quick Add and edit later for faster entry.</p>
          <button
            onClick={() => setMode('quick')}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Switch to Quick Add
          </button>
          {/* Full form implementation uses same fields expanded across steps */}
          <FullLeadForm categories={categories} router={router} />
        </div>
      )}
    </div>
  )
}

function FullLeadForm({ categories, router }: { categories: { name: string }[], router: any }) {
  const [step, setStep] = useState<FullStep>(1)
  const [isPending, startTransition] = useTransition()

  const [data, setData] = useState({
    business_name: '', business_type: '', category: '', description: '',
    country: 'Pakistan', city: '', area: '', full_address: '',
    website: '', google_maps_url: '', google_place_id: '',
    email: '', phone: '', whatsapp: '', alternative_phone: '',
    contact_person: '', contact_position: '',
    has_website: false, has_social_media: false, has_online_presence: false,
    google_rating: '', google_reviews_count: '',
    lead_source: 'google_maps' as LeadSource,
    facebook_url: '', instagram_url: '', tiktok_url: '', linkedin_url: '', youtube_url: '',
  })

  function handleSubmit() {
    startTransition(async () => {
      const result = await createLeadFull({
        ...data,
        google_rating: data.google_rating ? Number(data.google_rating) : undefined,
        google_reviews_count: data.google_reviews_count ? Number(data.google_reviews_count) : undefined,
      } as any)

      if (result.error) { toast.error(result.error); return }
      toast.success('Lead created!')
      router.push(`/leads/${result.data?.id}`)
    })
  }

  const input = (field: keyof typeof data, label: string, props?: any) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        value={data[field] as string}
        onChange={e => setData(prev => ({ ...prev, [field]: e.target.value }))}
        className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  )

  const steps = [
    { num: 1, label: 'Business' },
    { num: 2, label: 'Contact' },
    { num: 3, label: 'Social' },
    { num: 4, label: 'Source' },
  ]

  return (
    <div className="mt-6 space-y-5">
      {/* Step indicator */}
      <div className="flex gap-3">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num as FullStep)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              step === s.num ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === s.num ? 'bg-white/20' : 'bg-slate-200'}`}>{s.num}</span>
            {s.label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">{input('business_name', 'Business Name *', { required: true })}</div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={data.category}
              onChange={e => setData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category...</option>
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          {input('business_type', 'Business Type')}
          {input('country', 'Country')}
          {input('city', 'City', { placeholder: 'Lahore' })}
          {input('area', 'Area')}
          <div className="col-span-2">{input('full_address', 'Full Address')}</div>
          <div className="col-span-2">{input('google_maps_url', 'Google Maps URL', { type: 'url' })}</div>
          {input('website', 'Website', { type: 'url' })}
          {input('google_rating', 'Google Rating', { type: 'number', min: '0', max: '5', step: '0.1' })}
          {input('google_reviews_count', 'Google Reviews Count', { type: 'number', min: '0' })}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Online Presence</label>
            <div className="flex gap-4">
              {[
                { key: 'has_website', label: 'Has Website' },
                { key: 'has_social_media', label: 'Has Social Media' },
                { key: 'has_online_presence', label: 'Has Online Presence' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data[key as keyof typeof data] as boolean}
                    onChange={e => setData(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-2 gap-4">
          {input('phone', 'Phone', { type: 'tel' })}
          {input('whatsapp', 'WhatsApp', { type: 'tel' })}
          {input('email', 'Email', { type: 'email' })}
          {input('alternative_phone', 'Alternative Phone', { type: 'tel' })}
          {input('contact_person', 'Contact Person')}
          {input('contact_position', 'Contact Position')}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {input('facebook_url', 'Facebook', { type: 'url' })}
          {input('instagram_url', 'Instagram', { type: 'url' })}
          {input('tiktok_url', 'TikTok', { type: 'url' })}
          {input('linkedin_url', 'LinkedIn', { type: 'url' })}
          {input('youtube_url', 'YouTube', { type: 'url' })}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lead Source</label>
            <select
              value={data.lead_source}
              onChange={e => setData(prev => ({ ...prev, lead_source: e.target.value as LeadSource }))}
              className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LEAD_SOURCE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={data.description}
              onChange={e => setData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief description of the business..."
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <button
            onClick={() => setStep((step - 1) as FullStep)}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => setStep((step + 1) as FullStep)}
            className="flex-1 h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-1"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isPending || !data.business_name.trim()}
            className="flex-1 h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Create Lead
          </button>
        )}
      </div>
    </div>
  )
}
