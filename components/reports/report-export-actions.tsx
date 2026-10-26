'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { Download, FileSpreadsheet, Printer, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReportExportButtonProps {
  metrics: {
    total_leads: number
    interested_leads: number
    messages_sent: number
    deals_won: number
    total_project_value: number
  }
  rates: {
    reply_rate: number
    overall_conversion: number
  }
  employees: Array<{
    id: string
    full_name: string
    role: string
    job_title?: string | null
    target_weekly_outreach?: number | null
    target_monthly_revenue?: number | null
    status: string
  }>
}

export default function ReportExportActions({ metrics, rates, employees }: ReportExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = () => {
    setIsExporting(true)
    try {
      const summaryData = [
        { Metric: 'Total Leads in Pipeline', Value: metrics.total_leads },
        { Metric: 'Interested / High Intent Leads', Value: metrics.interested_leads },
        { Metric: 'Total Outreach Messages Sent', Value: metrics.messages_sent },
        { Metric: 'Outreach Reply Rate (%)', Value: `${rates.reply_rate}%` },
        { Metric: 'Total Won / Closed Deals', Value: metrics.deals_won },
        { Metric: 'Overall Sales Conversion Rate (%)', Value: `${rates.overall_conversion}%` },
        { Metric: 'Total Closed Deal Value (PKR)', Value: metrics.total_project_value },
        { Metric: 'Report Generated Date', Value: new Date().toLocaleString() },
      ]

      const rosterData = employees.map((emp) => ({
        'Employee Name': emp.full_name,
        Role: emp.role,
        'Designation / Job Title': emp.job_title || 'N/A',
        'Weekly Outreach Target': emp.target_weekly_outreach,
        'Monthly Revenue Target (PKR)': emp.target_monthly_revenue,
        Status: emp.status,
      }))

      const workbook = XLSX.utils.book_new()
      const summarySheet = XLSX.utils.json_to_sheet(summaryData)
      const rosterSheet = XLSX.utils.json_to_sheet(rosterData)

      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary')
      XLSX.utils.book_append_sheet(workbook, rosterSheet, 'Team Performance')

      const dateStr = new Date().toISOString().split('T')[0]
      XLSX.writeFile(workbook, `SAMStack_CRM_Executive_Report_${dateStr}.xlsx`)
      toast.success('Executive Report downloaded as Excel successfully! 📊')
    } catch (err: any) {
      toast.error('Failed to generate Excel report')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={handleExportExcel}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
      >
        <FileSpreadsheet className="w-4 h-4" />
        {isExporting ? 'Generating...' : 'Export Excel'}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
      >
        <Printer className="w-4 h-4" />
        Print / PDF
      </button>
    </div>
  )
}
