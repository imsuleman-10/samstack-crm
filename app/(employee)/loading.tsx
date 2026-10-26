import Image from 'next/image'

export default function EmployeeLoading() {
  return (
    <div className="flex-1 min-h-[65vh] flex flex-col items-center justify-center p-6 space-y-5 animate-in fade-in duration-150">
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow Rays */}
        <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
        <div className="absolute w-20 h-20 rounded-full bg-indigo-500/25 blur-lg" />

        {/* Orbiting Ring */}
        <div className="w-20 h-20 rounded-3xl border-2 border-transparent border-t-blue-500 border-r-indigo-500 animate-spin transition-all" />

        {/* Center Glass Capsule with Official SAMStack Logo */}
        <div className="absolute w-14 h-14 rounded-2xl bg-[#0a0f1e] p-2 flex items-center justify-center shadow-2xl border border-slate-800 shadow-blue-500/20">
          <Image
            src="/logo.png"
            alt="SAMStack Technologies Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain filter drop-shadow-md animate-pulse"
            priority
          />
        </div>
      </div>

      <div className="text-center space-y-1 z-10">
        <div className="flex items-center justify-center gap-2">
          <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
            SAMStack <span className="text-blue-600">Technologies</span>
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
          Streaming Workspace Stream &bull; Sub-100ms
        </p>
      </div>

      {/* High-speed Enterprise Shimmer Bar */}
      <div className="w-52 h-1 bg-slate-200 rounded-full overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full animate-indeterminate" />
      </div>
    </div>
  )
}
