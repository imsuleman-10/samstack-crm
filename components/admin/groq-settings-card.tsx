'use client'

import { useState, useTransition } from 'react'
import {
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Cpu,
  RefreshCw,
  Save,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { GROQ_MODELS, DEFAULT_GROQ_API_KEY, DEFAULT_GROQ_MODEL } from '@/lib/groq'
import { testGroqKeyAction, saveSystemSettings, type SystemSettingsConfig } from '@/lib/actions/settings'

interface GroqSettingsCardProps {
  initialConfig?: SystemSettingsConfig
}

export default function GroqSettingsCard({ initialConfig }: GroqSettingsCardProps) {
  const [apiKey, setApiKey] = useState(initialConfig?.groq_api_key || DEFAULT_GROQ_API_KEY)
  const [model, setModel] = useState(initialConfig?.groq_model || DEFAULT_GROQ_MODEL)
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success?: boolean
    latencyMs?: number
    message?: string
    error?: string
    availableCount?: number
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Test the key
  const handleTestKey = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const res = await testGroqKeyAction(apiKey)
      if (res.success) {
        setTestResult({
          success: true,
          latencyMs: res.latencyMs,
          message: `Connected successfully in ${res.latencyMs}ms!`,
          availableCount: res.availableModels.length,
        })
        toast.success(`Groq API connected! Latency: ${res.latencyMs}ms`)
      } else {
        setTestResult({
          success: false,
          error: res.error || 'Connection failed',
        })
        toast.error('Groq test failed: ' + (res.error || 'Check key'))
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Unknown network error',
      })
      toast.error('Failed to test Groq connection')
    } finally {
      setIsTesting(false)
    }
  }

  // Save key & config to database
  const handleSaveConfig = () => {
    startTransition(async () => {
      const res = await saveSystemSettings({
        groq_api_key: apiKey.trim(),
        groq_model: model,
        auto_ai_mapping_enabled: true,
      })

      if (res.error) {
        toast.error('Error saving settings: ' + res.error)
      } else {
        toast.success('Groq AI settings saved to CRM database! ✨')
      }
    })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Groq AI Intelligence Engine
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Active
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Powers instant file ingestion, column auto-mapping, and intelligent lead parsing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestKey}
          disabled={isTesting}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
              <span>Pinging Groq...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
              <span>Test Connection</span>
            </>
          )}
        </button>
      </div>

      {/* Test Result Banner */}
      {testResult && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
            testResult.success
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-red-50/80 border-red-200 text-red-900'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold">
              {testResult.success ? 'Groq API Active & Verified' : 'Connection Unsuccessful'}
            </div>
            <div className="text-[11px] mt-0.5">
              {testResult.success
                ? `${testResult.message} (${testResult.availableCount} models ready on your key)`
                : testResult.error}
            </div>
          </div>
        </div>
      )}

      {/* API Key Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-slate-400" /> Groq API Key
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            Stored securely in database / server env
          </span>
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_..."
            className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-slate-400" /> Default AI Inference Model
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GROQ_MODELS.map((m) => (
            <div
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                model === m.id
                  ? 'border-purple-500 bg-purple-50/50 shadow-xs ring-1 ring-purple-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{m.name}</span>
                {model === m.id && <Check className="w-3.5 h-3.5 text-purple-600" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSaveConfig}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Configuration...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Groq AI Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
