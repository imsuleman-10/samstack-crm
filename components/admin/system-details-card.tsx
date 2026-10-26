'use client'

import { useState } from 'react'
import {
  Server,
  Cloud,
  Database,
  Mail,
  Code2,
  FileSpreadsheet,
  Globe2,
  Cpu,
  Key,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react'

export default function SystemDetailsCard() {
  const [activeSubTab, setActiveSubTab] = useState<'infrastructure' | 'excel_spec' | 'tech_stack'>('infrastructure')

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>About The System &amp; Architecture</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                Admin Exclusive
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Accounts, infrastructure emails, technology stack, and AI Excel ingestion specifications.
            </p>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('infrastructure')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeSubTab === 'infrastructure'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Accounts &amp; Cloud
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('excel_spec')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeSubTab === 'excel_spec'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Excel File Structure
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('tech_stack')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeSubTab === 'tech_stack'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Stack &amp; Frameworks
          </button>
        </div>
      </div>

      {/* TAB 1: ACCOUNTS & CLOUD INFRASTRUCTURE */}
      {activeSubTab === 'infrastructure' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Supabase Account Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border border-emerald-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" /> Supabase Database &amp; Auth
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                  Connected
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Registered Owner Account:</div>
                <div className="font-mono font-bold text-slate-900 bg-white/80 px-2 py-1 rounded-lg border border-emerald-200 text-[11px] select-all">
                  samstackteam@gmail.com
                </div>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>&bull; <strong>Project Reference ID:</strong> <code className="font-mono">nqxhmdtsnwezwucnvckq</code></div>
                <div>&bull; <strong>Storage Buckets:</strong> Avatars, Lead Attachments</div>
                <div>&bull; <strong>Security:</strong> Multi-role Row Level Security (RLS) Enforced</div>
              </div>
            </div>

            {/* Vercel Account Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-blue-400" /> Vercel Edge Hosting
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  Live Edge Production
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400">Registered Owner Account:</div>
                <div className="font-mono font-bold text-white bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-[11px] select-all">
                  samstacktechs@gmail.com
                </div>
              </div>
              <div className="text-[11px] text-slate-300 space-y-0.5">
                <div>&bull; <strong>Production Domain:</strong> samstack-crm.vercel.app</div>
                <div>&bull; <strong>Auto-Deploy Branch:</strong> <code className="text-emerald-400 font-mono">main</code></div>
                <div>&bull; <strong>Server Actions &amp; Turbopack:</strong> Active</div>
              </div>
            </div>

            {/* GitHub Account Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-600" /> GitHub Repository &amp; CI/CD
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                  Verified Pusher
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Active Commit Author &amp; Streak:</div>
                <div className="font-mono font-bold text-purple-900 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[11px]">
                  imsuleman-10 (sulemanzaheer09@gmail.com)
                </div>
              </div>
              <div className="text-[11px] text-slate-600">
                &bull; <strong>Repository:</strong> github.com/imsuleman-10/samstack-crm
              </div>
            </div>

            {/* Official Support & Contact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-600" /> System Contact &amp; Alerts
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                  Corporate
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Official Company Communication:</div>
                <div className="font-mono font-bold text-blue-900 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[11px]">
                  samstacktechs@gmail.com &bull; +92 328 5778715
                </div>
              </div>
              <div className="text-[11px] text-slate-600">
                &bull; <strong>Location:</strong> Johar Town, Lahore, Pakistan
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXCEL FILE SPECIFICATION & FIELD DICTIONARY */}
      {activeSubTab === 'excel_spec' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Groq AI Smart Column Mapper:</strong> Aapki Excel sheet mein columns kisi bhi tarteeb (order) mein hon ya koi bhi naam ho (e.g. <em>Company</em>, <em>Client Name</em>, <em>Phone</em>, <em>Mobile</em>, <em>Deal Value</em>, <em>Paid</em>), AI usko automatically pehchan leta hai.
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Column Name in Excel</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Required?</th>
                    <th className="py-2.5 px-3">Example Data</th>
                    <th className="py-2.5 px-3">Description / AI Aliases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="bg-amber-50/30">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Business Name</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Text</td>
                    <td className="py-2.5 px-3"><span className="text-rose-600 font-bold">Yes (Mandatory)</span></td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">Apex Textile Mills Ltd</td>
                    <td className="py-2.5 px-3 text-[11px]">Company name, Client, Business, Title</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Contact Person</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Text</td>
                    <td className="py-2.5 px-3 text-slate-400">Optional</td>
                    <td className="py-2.5 px-3">Chaudhry Kamran</td>
                    <td className="py-2.5 px-3 text-[11px]">Owner name, Decision maker, Person</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Phone</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Text/Number</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">Recommended</td>
                    <td className="py-2.5 px-3">+92 300 4567890</td>
                    <td className="py-2.5 px-3 text-[11px]">Mobile number, Contact, Telephone</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">WhatsApp</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Text/Number</td>
                    <td className="py-2.5 px-3 text-slate-400">Optional</td>
                    <td className="py-2.5 px-3">+92 300 4567890</td>
                    <td className="py-2.5 px-3 text-[11px]">WA number for direct 1-click messaging</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Email</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Email</td>
                    <td className="py-2.5 px-3 text-slate-400">Optional</td>
                    <td className="py-2.5 px-3">kamran@apextextiles.pk</td>
                    <td className="py-2.5 px-3 text-[11px]">Official client email for outreach</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">City</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Text</td>
                    <td className="py-2.5 px-3 text-slate-400">Optional</td>
                    <td className="py-2.5 px-3">Lahore</td>
                    <td className="py-2.5 px-3 text-[11px]">City, Town, District</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Category</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Text</td>
                    <td className="py-2.5 px-3 text-slate-400">Optional</td>
                    <td className="py-2.5 px-3">Textiles &amp; Manufacturing</td>
                    <td className="py-2.5 px-3 text-[11px]">Industry, Sector, Business Type</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-950">Offered Price</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Number</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">Deal Pricing</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">450000</td>
                    <td className="py-2.5 px-3 text-[11px]">Initial quote / Price offered to client</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-950">Locked Price / Deal Value</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Number</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">Deal Pricing</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">380000</td>
                    <td className="py-2.5 px-3 text-[11px]">Contract price agreed upon (Won Deal)</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-950">Amount Received</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Number</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-semibold">Deal Pricing</td>
                    <td className="py-2.5 px-3 font-bold text-blue-700">150000</td>
                    <td className="py-2.5 px-3 text-[11px]">Cash paid / Advance received from client</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Currency</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Text</td>
                    <td className="py-2.5 px-3 text-slate-400">Optional</td>
                    <td className="py-2.5 px-3">PKR</td>
                    <td className="py-2.5 px-3 text-[11px]">PKR, USD, AED, EUR, GBP (Default PKR)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Pipeline Stage</td>
                    <td className="py-2.5 px-3 text-[11px] font-mono">Enum</td>
                    <td className="py-2.5 px-3 text-slate-400">Optional</td>
                    <td className="py-2.5 px-3">won</td>
                    <td className="py-2.5 px-3 text-[11px]">new, contacted, interested, won, project_started</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE TECH STACK SPECIFICATION */}
      {activeSubTab === 'tech_stack' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-600" /> Frontend &amp; Core
              </div>
              <ul className="text-slate-600 space-y-1 text-[11px]">
                <li>&bull; <strong>Next.js 16.3.4</strong> (App Router + Turbopack)</li>
                <li>&bull; <strong>React 19</strong> Server Components (RSC)</li>
                <li>&bull; <strong>TypeScript 5</strong> Strict Mode</li>
                <li>&bull; <strong>TailwindCSS v4</strong> + Glassmorphism tokens</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" /> Database &amp; Security
              </div>
              <ul className="text-slate-600 space-y-1 text-[11px]">
                <li>&bull; <strong>PostgreSQL 15</strong> (Supabase Managed)</li>
                <li>&bull; <strong>Row-Level Security (RLS)</strong> Policies</li>
                <li>&bull; <strong>Supabase Auth</strong> (SSR Cookie sessions)</li>
                <li>&bull; <strong>pg_trgm</strong> Fast Search Indexes</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-600" /> AI &amp; File Parsing
              </div>
              <ul className="text-slate-600 space-y-1 text-[11px]">
                <li>&bull; <strong>Groq LLM Engine</strong> (openai/gpt-oss-20b)</li>
                <li>&bull; <strong>XLSX / SheetJS</strong> Ingestion &amp; Export</li>
                <li>&bull; <strong>Sub-70ms</strong> AI inference latency</li>
                <li>&bull; <strong>Deterministic</strong> Fallback Column Mapping</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
