'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import {
  FileSpreadsheet,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'

const EXCEL_FIELDS = [
  {
    col: 'Business Name',
    type: 'Text',
    required: true as true | false | 'recommended',
    example: 'Apex Textile Mills Ltd',
    desc: 'Company name — mandatory. AI aliases: Company, Client, Business, Title',
  },
  {
    col: 'Contact Person',
    type: 'Text',
    required: false as true | false | 'recommended',
    example: 'Chaudhry Kamran',
    desc: 'Owner / decision maker name. Aliases: Owner Name, Person',
  },
  {
    col: 'Phone',
    type: 'Text / Number',
    required: 'recommended' as true | false | 'recommended',
    example: '+92 300 4567890',
    desc: 'Primary contact number. Aliases: Mobile, Telephone, Contact No',
  },
  {
    col: 'WhatsApp',
    type: 'Text / Number',
    required: false as true | false | 'recommended',
    example: '+92 300 4567890',
    desc: 'WhatsApp number for 1-click messaging. Can be same as Phone.',
  },
  {
    col: 'Email',
    type: 'Email',
    required: false as true | false | 'recommended',
    example: 'kamran@apextextiles.pk',
    desc: 'Official client email address for outreach.',
  },
  {
    col: 'City',
    type: 'Text',
    required: false as true | false | 'recommended',
    example: 'Lahore',
    desc: 'Client city. Aliases: Town, District, Location',
  },
  {
    col: 'Area',
    type: 'Text',
    required: false as true | false | 'recommended',
    example: 'Gulberg III',
    desc: 'Sub-area / neighborhood within the city.',
  },
  {
    col: 'Category',
    type: 'Text',
    required: false as true | false | 'recommended',
    example: 'Textiles & Manufacturing',
    desc: 'Business industry. Aliases: Industry, Sector, Business Type',
  },
  {
    col: 'Website',
    type: 'URL',
    required: false as true | false | 'recommended',
    example: 'https://apextextiles.pk',
    desc: 'Client website URL (with https://).',
  },
  {
    col: 'Offered Price',
    type: 'Number',
    required: false as true | false | 'recommended',
    example: '450000',
    desc: '💰 Initial quote offered to client. Aliases: Quote, Price, Bid Amount',
  },
  {
    col: 'Locked Price',
    type: 'Number',
    required: false as true | false | 'recommended',
    example: '380000',
    desc: '💰 Final agreed contract price (for Won deals).',
  },
  {
    col: 'Amount Received',
    type: 'Number',
    required: false as true | false | 'recommended',
    example: '150000',
    desc: '💰 Advance / payment already received from client.',
  },
  {
    col: 'Currency',
    type: 'Text',
    required: false as true | false | 'recommended',
    example: 'PKR',
    desc: 'PKR, USD, AED, EUR, GBP — defaults to PKR if blank.',
  },
  {
    col: 'Pipeline Stage',
    type: 'Dropdown',
    required: false as true | false | 'recommended',
    example: 'won',
    desc: 'new · contacted · interested · negotiation · won · project_started · lost',
  },
  {
    col: 'Lead Source',
    type: 'Text',
    required: false as true | false | 'recommended',
    example: 'referral',
    desc: 'referral · linkedin · instagram · google · cold_call · website',
  },
  {
    col: 'Google Rating',
    type: 'Number (0–5)',
    required: false as true | false | 'recommended',
    example: '4.8',
    desc: 'Google Maps / review rating of the client business.',
  },
  {
    col: 'Notes',
    type: 'Text (Long)',
    required: false as true | false | 'recommended',
    example: 'Inventory ERP portal needed.',
    desc: 'Any additional context or notes about this lead.',
  },
]

export default function ExcelTemplateGuide() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        {
          'Business Name': 'Apex Textile Mills Ltd',
          'Contact Person': 'Chaudhry Kamran',
          Phone: '+92 300 4567890',
          WhatsApp: '+92 300 4567890',
          Email: 'kamran@apextextiles.pk',
          City: 'Lahore',
          Area: 'Gulberg III',
          Category: 'Textiles & Manufacturing',
          Website: 'https://apextextiles.pk',
          'Offered Price': 450000,
          'Locked Price': 380000,
          'Amount Received': 150000,
          Currency: 'PKR',
          'Pipeline Stage': 'won',
          'Lead Source': 'referral',
          'Google Rating': 4.8,
          Notes: 'Enterprise inventory ERP portal with 2-week agile sprint delivery.',
        },
        {
          'Business Name': 'BlueWave Digital Commerce',
          'Contact Person': 'Tariq Mehmood',
          Phone: '+971 50 1234567',
          WhatsApp: '+971 50 1234567',
          Email: 'contact@bluewave-uae.com',
          City: 'Dubai',
          Area: 'Business Bay',
          Category: 'E-Commerce & Retail',
          Website: 'https://bluewave-uae.com',
          'Offered Price': 5000,
          'Locked Price': 4200,
          'Amount Received': 2100,
          Currency: 'USD',
          'Pipeline Stage': 'project_started',
          'Lead Source': 'linkedin',
          'Google Rating': 4.9,
          Notes: 'Headless Next.js 16 online store with automated payment sync.',
        },
        {
          'Business Name': 'Pak Steel Traders',
          'Contact Person': 'Tariq Mahmood',
          Phone: '+92 321 9876543',
          WhatsApp: '+92 321 9876543',
          Email: 'sales@paksteel.com',
          City: 'Lahore',
          Area: 'Badami Bagh',
          Category: 'Manufacturing',
          Website: '',
          'Offered Price': 280000,
          'Locked Price': 250000,
          'Amount Received': 100000,
          Currency: 'PKR',
          'Pipeline Stage': 'negotiation',
          'Lead Source': 'referral',
          'Google Rating': 4.5,
          Notes: 'Requires inventory management CRM software.',
        },
        {
          'Business Name': 'GreenLeaf Organic Foods',
          'Contact Person': 'Ayesha Siddiqui',
          Phone: '+92 311 5678901',
          WhatsApp: '+92 311 5678901',
          Email: 'hello@greenleaf.pk',
          City: 'Karachi',
          Area: 'DHA Phase 6',
          Category: 'Food & Beverages',
          Website: 'https://greenleaf.pk',
          'Offered Price': 180000,
          'Locked Price': '',
          'Amount Received': '',
          Currency: 'PKR',
          'Pipeline Stage': 'interested',
          'Lead Source': 'instagram',
          'Google Rating': 4.6,
          Notes: 'Wants an e-commerce website with delivery tracking.',
        },
      ]

      const worksheet = XLSX.utils.json_to_sheet(templateData)
      worksheet['!cols'] = [
        { wch: 28 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 28 },
        { wch: 14 }, { wch: 16 }, { wch: 26 }, { wch: 24 }, { wch: 14 },
        { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 18 }, { wch: 16 },
        { wch: 14 }, { wch: 40 },
      ]

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SAMStack Leads Template')
      XLSX.writeFile(workbook, 'SAMStack_CRM_Leads_Template.xlsx')
      toast.success('Demo Excel template downloaded! 📊 Fill it and import via "Import File AI" button.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate template.')
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-200 rounded-2xl overflow-hidden">
      {/* Header Row — always visible */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-blue-950">Excel / CSV Import Guide</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800">
                <Sparkles className="w-3 h-3" /> Groq AI
              </span>
            </div>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Upload any spreadsheet — AI auto-detects columns. Use the demo template as a starting point.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Demo .XLSX
          </button>

          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-blue-200 text-blue-800 text-xs font-semibold transition-all"
          >
            {isExpanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Hide Fields</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> View Fields</>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Field Dictionary */}
      {isExpanded && (
        <div className="border-t border-blue-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2.5 px-4 sm:px-5 py-3 bg-white/60 text-[11px] text-blue-900 border-b border-blue-100">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Groq AI Smart Mapper:</strong> Your columns can be in any order with any
              name (e.g. <em>Company, Client, Mobile, Deal Price, Paid</em>) — AI auto-recognizes
              them. Only <strong>Business Name</strong> column is required.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-blue-600/10 text-blue-900 font-bold border-b border-blue-200">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Column Name</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Data Type</th>
                  <th className="py-2.5 px-3">Required?</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">Example</th>
                  <th className="py-2.5 px-3 hidden lg:table-cell">Description / Aliases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100/70 bg-white/40">
                {EXCEL_FIELDS.map((field) => (
                  <tr key={field.col} className="hover:bg-white/60 transition-colors">
                    <td className="py-2 px-3 sm:px-4 font-bold text-slate-900">{field.col}</td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[10px] hidden sm:table-cell">
                      {field.type}
                    </td>
                    <td className="py-2 px-3">
                      {field.required === true ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                          <AlertCircle className="w-3 h-3" /> Required
                        </span>
                      ) : field.required === 'recommended' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Recommended
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Optional</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600 font-medium hidden md:table-cell">
                      {field.example}
                    </td>
                    <td className="py-2 px-3 text-slate-500 hidden lg:table-cell leading-relaxed">
                      {field.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 bg-white/40 border-t border-blue-100 text-[11px]">
            <div className="flex items-start gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span><strong>Formats:</strong> .xlsx, .xls, .csv, .json — all supported</span>
            </div>
            <div className="flex items-start gap-1.5 text-blue-800">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-600" />
              <span><strong>AI Maps Columns:</strong> Even mismatched headers get auto-detected</span>
            </div>
            <div className="flex items-start gap-1.5 text-slate-700">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
              <span><strong>Pricing:</strong> Use plain numbers only (no commas, no ₨ symbols)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
