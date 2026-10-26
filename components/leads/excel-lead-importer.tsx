'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  X,
  Download,
  ChevronRight,
  Database,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { smartMapColumnsWithGroq, STANDARD_CRM_FIELDS, runDeterministicColumnMapping } from '@/lib/groq'
import { batchImportLeads, type BatchLeadItem } from '@/lib/actions/leads'

interface ExcelLeadImporterProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ExcelLeadImporter({
  isOpen,
  onClose,
  onSuccess,
}: ExcelLeadImporterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [isMappingWithAI, setIsMappingWithAI] = useState<boolean>(false)
  const [isImporting, setIsImporting] = useState<boolean>(false)
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload')
  const [importProgress, setImportProgress] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  // 1. Handle File Upload & Parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let uploadedFile: File | null = null

    if ('dataTransfer' in e) {
      e.preventDefault()
      uploadedFile = e.dataTransfer.files?.[0] || null
    } else if (e.target.files) {
      uploadedFile = e.target.files[0] || null
    }

    if (!uploadedFile) return

    const validExts = ['.xlsx', '.xls', '.csv', '.json']
    const hasValidExt = validExts.some((ext) => uploadedFile!.name.toLowerCase().endsWith(ext))

    if (!hasValidExt) {
      toast.error('Please upload an Excel (.xlsx, .xls) or CSV file.')
      return
    }

    setFile(uploadedFile)
    setFileName(uploadedFile.name)

    const reader = new FileReader()

    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Parse to JSON array of objects
        const parsedRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
          defval: '',
        })

        if (!parsedRows || parsedRows.length === 0) {
          toast.error('The uploaded file contains no data rows.')
          return
        }

        const headers = Object.keys(parsedRows[0] || {})
        if (headers.length === 0) {
          toast.error('No headers found in the file.')
          return
        }

        setRawHeaders(headers)
        setRawRows(parsedRows)

        // Run fast auto mapping
        const initialMapping = runDeterministicColumnMapping(headers)
        setColumnMapping(initialMapping)
        setStep('mapping')
        toast.success(`Loaded ${parsedRows.length} rows from "${uploadedFile!.name}"`)
      } catch (err: any) {
        console.error('File parsing error:', err)
        toast.error('Failed to parse file: ' + (err.message || 'Unknown error'))
      }
    }

    reader.readAsBinaryString(uploadedFile)
  }

  // 2. AI Auto-Mapping with Groq
  const handleSmartMapWithGroq = async () => {
    if (rawHeaders.length === 0) return
    setIsMappingWithAI(true)
    toast.info('Groq AI analyzing spreadsheet columns...', { duration: 2000 })

    try {
      const aiMapping = await smartMapColumnsWithGroq(rawHeaders, rawRows.slice(0, 5))
      setColumnMapping((prev) => ({ ...prev, ...aiMapping }))
      toast.success('Groq AI mapped columns with high confidence!')
    } catch (err) {
      console.error(err)
      toast.error('AI mapping failed. Reverting to rule-based mapping.')
    } finally {
      setIsMappingWithAI(false)
    }
  }

  // 3. Map Header to CRM Field
  const handleMapField = (header: string, crmField: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [header]: crmField === 'ignore' ? '' : crmField,
    }))
  }

  // Check if required field 'business_name' is mapped
  const isBusinessNameMapped = Object.values(columnMapping).includes('business_name')

  // 4. Transform Raw Rows into BatchLeadItems
  const prepareLeadsForImport = (): BatchLeadItem[] => {
    return rawRows.map((row) => {
      const item: any = {}
      for (const [header, crmKey] of Object.entries(columnMapping)) {
        if (crmKey && row[header] !== undefined) {
          item[crmKey] = String(row[header]).trim()
        }
      }
      return item as BatchLeadItem
    })
  }

  // 5. Execute Import
  const handleExecuteImport = async () => {
    if (!isBusinessNameMapped) {
      toast.error('Please map at least one column to "Business / Company Name"!')
      return
    }

    const leads = prepareLeadsForImport().filter((l) => l.business_name && l.business_name.length > 0)

    if (leads.length === 0) {
      toast.error('No rows with a valid Business Name found to import.')
      return
    }

    setIsImporting(true)
    setImportProgress(25)

    try {
      setImportProgress(60)
      const res = await batchImportLeads(leads)
      setImportProgress(100)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Successfully imported ${res.count} leads into SAMStack CRM! 🎉`, {
          duration: 4000,
        })
        if (onSuccess) onSuccess()
        handleResetAndClose()
      }
    } catch (err: any) {
      toast.error('Import error: ' + (err.message || 'Unknown error'))
    } finally {
      setIsImporting(false)
    }
  }

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Business Name': 'Apex Textile Mills Ltd',
        'Contact Person': 'Chaudhry Kamran',
        Phone: '+92 300 4567890',
        WhatsApp: '+92 300 4567890',
        Email: 'kamran@apextextiles.pk',
        City: 'Lahore',
        Area: 'Gulberg III',
        'Full Address': 'Suite 401, Main Boulevard, Gulberg III, Lahore',
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
        'Full Address': 'Tower B, Business Bay, Dubai, UAE',
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
        'Full Address': 'Plot 12, Industrial Area, Badami Bagh, Lahore',
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
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SAMStack Leads Template')
    XLSX.writeFile(workbook, 'SAMStack_CRM_Leads_Template.xlsx')
    toast.success('Sample Excel Template with Deal Pricing downloaded!')
  }

  const handleResetAndClose = () => {
    setFile(null)
    setFileName('')
    setRawHeaders([])
    setRawRows([])
    setColumnMapping({})
    setStep('upload')
    setImportProgress(0)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Smart Excel &amp; File Ingestion
              </h2>
              <p className="text-[11px] text-slate-500">
                Upload .xlsx, .xls, or .csv &bull; Auto-mapped with Groq AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              title="Download standard Excel structure"
            >
              <Download className="w-3.5 h-3.5" />
              Template
            </button>
            <button
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* STEP 1: Upload Dropzone */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileUpload}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv, .json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  Drop your Excel or CSV file here
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Drag and drop any spreadsheet. Groq AI will automatically recognize and map your column headers.
                </p>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25">
                  Browse Computer
                </span>
              </div>

              {/* Template Download Quick Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <span>📊</span> Official Spreadsheet Template (Ready-to-use)
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">
                    Pre-configured columns with business contacts, offered quotes, locked prices, and payments.
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href="/SAMStack_CRM_Leads_Template.xlsx"
                    download="SAMStack_CRM_Leads_Template.xlsx"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .XLSX
                  </a>
                  <a
                    href="/SAMStack_CRM_Leads_Template.csv"
                    download="SAMStack_CRM_Leads_Template.csv"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-colors"
                  >
                    .CSV
                  </a>
                </div>
              </div>

              {/* Supported Formats Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {[
                  { ext: '.XLSX', desc: 'Excel 2007+' },
                  { ext: '.XLS', desc: 'Excel 97-2003' },
                  { ext: '.CSV', desc: 'Comma Separated' },
                  { ext: '.JSON', desc: 'Structured Data' },
                ].map((item) => (
                  <div key={item.ext} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-xs text-slate-800">{item.ext}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Column Mapping */}
          {step === 'mapping' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    File: {fileName} ({rawRows.length} total rows)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Verify matched headers or click Groq AI to re-scan.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSmartMapWithGroq}
                  disabled={isMappingWithAI}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
                >
                  {isMappingWithAI ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Groq AI Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Smart Re-Map with Groq AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Warning if Business Name not mapped */}
              {!isBusinessNameMapped && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>
                    <strong>Required:</strong> Please select which column represents the{' '}
                    <strong>Business / Company Name</strong>.
                  </span>
                </div>
              )}

              {/* Mapping Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Spreadsheet Header</th>
                      <th className="py-2.5 px-3">Sample Value</th>
                      <th className="py-2.5 px-3">CRM Field Destination</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rawHeaders.map((header) => {
                      const currentField = columnMapping[header] || ''
                      const sampleVal = String(rawRows[0]?.[header] || '')

                      return (
                        <tr key={header} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {header}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">
                            {sampleVal || '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={currentField || 'ignore'}
                              onChange={(e) => handleMapField(header, e.target.value)}
                              className={`w-full py-1.5 px-2.5 rounded-lg border text-xs focus:outline-none transition-all ${
                                currentField
                                  ? 'bg-blue-50/60 border-blue-300 text-blue-900 font-medium'
                                  : 'bg-white border-slate-200 text-slate-500'
                              }`}
                            >
                              <option value="ignore">— Ignore this column —</option>
                              {STANDARD_CRM_FIELDS.map((f) => (
                                <option key={f.key} value={f.key}>
                                  {f.label} {('required' in f && f.required) ? '*(Required)' : ''}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quick Preview Toggle */}
              <button
                type="button"
                onClick={() => setStep('preview')}
                disabled={!isBusinessNameMapped}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
              >
                <span>Proceed to Data Preview &amp; Import</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Preview & Ingestion */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Leads Ingestion Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Showing top 5 rows mapped ready to be saved in CRM database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('mapping')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  &larr; Adjust Mapping
                </button>
              </div>

              {/* Preview Cards / Table */}
              <div className="border border-slate-200 rounded-2xl overflow-x-auto max-h-64">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Business</th>
                      <th className="py-2.5 px-3">Phone / WhatsApp</th>
                      <th className="py-2.5 px-3">City / Category</th>
                      <th className="py-2.5 px-3">Deal Financials</th>
                      <th className="py-2.5 px-3">Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prepareLeadsForImport()
                      .slice(0, 5)
                      .map((lead, idx) => {
                        const cur = (lead.currency || 'PKR').toUpperCase()
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {lead.business_name || '—'}
                              {lead.contact_person && (
                                <div className="text-[10px] text-slate-400">
                                  Contact: {lead.contact_person}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {lead.phone || lead.whatsapp || '—'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              <div>{lead.city || '—'}</div>
                              <div className="text-[10px] text-slate-400">{lead.category || 'General'}</div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-700">
                              {lead.deal_value ? (
                                <div>
                                  <span className="font-bold text-emerald-700 text-xs">
                                    {cur} {Number(lead.deal_value).toLocaleString()}
                                  </span>
                                  {lead.amount_received ? (
                                    <div className="text-[10px] text-slate-500">
                                      Paid: {cur} {Number(lead.amount_received).toLocaleString()}
                                    </div>
                                  ) : null}
                                </div>
                              ) : lead.offered_price ? (
                                <span className="text-amber-700 font-semibold text-[11px]">
                                  Offer: {cur} {Number(lead.offered_price).toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                                {lead.pipeline_stage || 'new'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>

              {/* Progress Bar when importing */}
              {isImporting && (
                <div className="space-y-1.5 p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex justify-between text-xs font-semibold text-blue-900">
                    <span>Importing {rawRows.length} leads into database...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('mapping')}
                  disabled={isImporting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={isImporting}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ingesting into CRM...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Add All {rawRows.length} Leads to CRM</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
