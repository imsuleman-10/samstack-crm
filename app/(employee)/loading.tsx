export default function EmployeeLoading() {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/15 animate-ping absolute" />
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-[2.5px] animate-spin shadow-lg shadow-blue-500/25">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            <span className="font-black text-white text-base tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              S
            </span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
          <span>SAMStack CRM Workspace</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        </h3>
        <p className="text-[11px] text-slate-400 font-medium">
          Loading pipeline stream...
        </p>
      </div>

      <div className="w-48 h-1 bg-slate-200/80 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-indeterminate" />
      </div>
    </div>
  )
}
