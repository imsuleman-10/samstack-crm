import Link from 'next/link'

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Top Fixed Header for Team Routes */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 shadow-sm flex items-center justify-center group-hover:scale-105 transition-all flex-shrink-0">
              <img src="/logo.png" alt="SAMStack Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-white tracking-tight leading-none">
                SAM<span className="text-blue-400">Stack</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">
                Engineering Team
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-300">
            <Link href="/" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">
              &larr; Home
            </Link>
            <Link href="/team" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">
              All Team
            </Link>
            <a
              href="https://wa.me/923285778715"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all font-bold"
            >
              <span>💬</span> WhatsApp
            </a>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md"
            >
              Sign In &rarr;
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="pt-20 pb-20">{children}</main>

      {/* Global Team Footer */}
      <footer className="border-t border-white/10 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center">
              <img src="/logo.png" alt="SAMStack Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-300 text-sm">SAMStack Technologies</span>
          </div>
          <p className="text-slate-400">
            Premier software development studio based in Lahore, Pakistan. Built by Suleman Zaheer, Syed Abdullah &amp; Saqib Javed.
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400 text-xs pt-2">
            <Link href="/team/suleman-zaheer" className="hover:text-blue-400 transition-colors">
              Suleman Zaheer
            </Link>
            <span>&bull;</span>
            <Link href="/team/syed-abdullah" className="hover:text-emerald-400 transition-colors">
              Syed Abdullah
            </Link>
            <span>&bull;</span>
            <Link href="/team/saqib-javed" className="hover:text-purple-400 transition-colors">
              Saqib Javed
            </Link>
          </div>
          <p className="text-[11px] text-slate-600 pt-4">
            &copy; {new Date().getFullYear()} SAMStack Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
