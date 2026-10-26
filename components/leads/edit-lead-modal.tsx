'use client'

import { useState } from 'react'
import {
  Edit3,
  X,
  Building2,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react'
import { toast } from 'sonner'
import { updateLead, type UpdateLeadInput } from '@/lib/actions/leads'
import type { Lead } from '@/lib/types/database'

interface EditLeadModalProps {
  lead: Lead
  triggerButtonText?: string
  className?: string
}

const PIPELINE_STAGES = [
  { value: 'new', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'seen', label: 'Message Seen' },
  { value: 'replied', label: 'Replied' },
  { value: 'interested', label: 'Interested' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'negotiation', label: 'Negotiating' },
  { value: 'won', label: 'Won / Closed' },
  { value: 'project_started', label: 'Project Started' },
  { value: 'project_completed', label: 'Project Completed' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'not_qualified', label: 'Not Qualified' },
  { value: 'lost', label: 'Lost' },
]

const LEAD_SOURCES = [
  { value: 'google_maps', label: 'Google Maps' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'manual_entry', label: 'Manual Entry' },
  { value: 'other', label: 'Other' },
]

const CURRENCIES = ['PKR', 'USD', 'AED', 'GBP', 'EUR']

export default function EditLeadModal({
  lead,
  triggerButtonText = 'Edit Lead',
  className = '',
}: EditLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'financials' | 'social'>('info')

  const social = (lead.social_links as any) || {}

  const [formData, setFormData] = useState({
    business_name: lead.business_name || '',
    contact_person: lead.contact_person || '',
    phone: lead.phone || '',
    whatsapp: lead.whatsapp || '',
    email: lead.email || '',
    city: lead.city || '',
    area: lead.area || '',
    full_address: lead.full_address || '',
    category: lead.category || '',
    website: lead.website || '',
    description: lead.description || '',
    pipeline_stage: lead.pipeline_stage || 'new',
    lead_source: lead.lead_source || 'manual_entry',
    google_rating: lead.google_rating ? String(lead.google_rating) : '',
    offered_price: lead.offered_price ? String(lead.offered_price) : '',
    deal_value: lead.deal_value ? String(lead.deal_value) : '',
    amount_received: lead.amount_received !== null && lead.amount_received !== undefined ? String(lead.amount_received) : '0',
    currency: lead.currency || 'PKR',
    facebook_url: social.facebook_url || '',
    instagram_url: social.instagram_url || '',
    tiktok_url: social.tiktok_url || '',
    linkedin_url: social.linkedin_url || '',
  })

  const offeredNum = parseFloat(formData.offered_price) || 0
  const dealNum = parseFloat(formData.deal_value) || 0
  const receivedNum = parseFloat(formData.amount_received) || 0
  const remainingBalance = Math.max(0, dealNum - receivedNum)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.business_name.trim()) {
      toast.error('Business Name is required!')
      return
    }

    setIsLoading(true)

    try {
      const payload: UpdateLeadInput = {
        business_name: formData.business_name.trim(),
        contact_person: formData.contact_person.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        whatsapp: formData.whatsapp.trim() || undefined,
        email: formData.email.trim() || undefined,
        city: formData.city.trim() || undefined,
        area: formData.area.trim() || undefined,
        full_address: formData.full_address.trim() || undefined,
        category: formData.category.trim() || undefined,
        website: formData.website.trim() || undefined,
        description: formData.description.trim() || undefined,
        pipeline_stage: formData.pipeline_stage,
        lead_source: formData.lead_source,
        google_rating: formData.google_rating ? parseFloat(formData.google_rating) : null,
        offered_price: formData.offered_price ? parseFloat(formData.offered_price) : null,
        deal_value: formData.deal_value ? parseFloat(formData.deal_value) : null,
        amount_received: formData.amount_received ? parseFloat(formData.amount_received) : 0,
        currency: formData.currency,
        facebook_url: formData.facebook_url.trim() || undefined,
        instagram_url: formData.instagram_url.trim() || undefined,
        tiktok_url: formData.tiktok_url.trim() || undefined,
        linkedin_url: formData.linkedin_url.trim() || undefined,
      }

      const res = await updateLead(lead.id, payload)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Lead and deal financials updated successfully! 🎉')
        setIsOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update lead')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors'
        }
      >
        <Edit3 className="w-3.5 h-3.5" />
        {triggerButtonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    Edit Lead &amp; Deal Financials
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                    {lead.business_name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 px-5 bg-white gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'info'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Business Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('financials')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'financials'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" /> Deal &amp; Pricing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'social'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" /> Social &amp; Web
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: Business Info */}
              {activeTab === 'info' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Apex Textile Mills Ltd"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        placeholder="e.g. Chaudhry Kamran"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category / Industry
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g. Textiles, E-Commerce, Software"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +92 300 1234567"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="e.g. +92 328 5778715"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. contact@business.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Lahore, Karachi, Dubai"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pipeline Stage
                      </label>
                      <select
                        name="pipeline_stage"
                        value={formData.pipeline_stage}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lead Source
                      </label>
                      <select
                        name="lead_source"
                        value={formData.lead_source}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {LEAD_SOURCES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description &amp; Notes
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Requirements, tech stack preferences, timeline..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Deal & Pricing */}
              {activeTab === 'financials' && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Financial Balance Summary Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Deal Financial Breakdown
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">Offer</div>
                        <div className="text-xs sm:text-sm font-bold text-slate-800">
                          {formData.currency} {offeredNum.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="text-[10px] text-emerald-700 uppercase font-semibold">Locked (Done)</div>
                        <div className="text-xs sm:text-sm font-extrabold text-emerald-700">
                          {formData.currency} {dealNum.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <div className="text-[10px] text-amber-700 uppercase font-semibold">Balance Due</div>
                        <div className="text-xs sm:text-sm font-extrabold text-amber-700">
                          {formData.currency} {remainingBalance.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Offered Price (کتنی آفر دی تھی)
                      </label>
                      <input
                        type="number"
                        name="offered_price"
                        value={formData.offered_price}
                        onChange={handleChange}
                        placeholder="e.g. 450000"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Initial quote / proposal price sent to client
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Locked / Closed Deal Value (کتنے میں ڈن ہوا)
                      </label>
                      <input
                        type="number"
                        name="deal_value"
                        value={formData.deal_value}
                        onChange={handleChange}
                        placeholder="e.g. 380000"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-extrabold text-slate-900"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Final agreed contract value with the client
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Amount Received / Advance (کتنے پیسے آ گئے)
                      </label>
                      <input
                        type="number"
                        name="amount_received"
                        value={formData.amount_received}
                        onChange={handleChange}
                        placeholder="e.g. 150000"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Advance or total cash collected so far
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        {CURRENCIES.map((cur) => (
                          <option key={cur} value={cur}>
                            {cur}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Social & Web */}
              {activeTab === 'social' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://clientwebsite.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        name="facebook_url"
                        value={formData.facebook_url}
                        onChange={handleChange}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        name="instagram_url"
                        value={formData.instagram_url}
                        onChange={handleChange}
                        placeholder="https://instagram.com/..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        TikTok URL
                      </label>
                      <input
                        type="url"
                        name="tiktok_url"
                        value={formData.tiktok_url}
                        onChange={handleChange}
                        placeholder="https://tiktok.com/@..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
