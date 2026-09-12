'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LandingNavbarProps {
  officialPhone?: string
  formattedPhone?: string
  whatsappUrl?: string
}

export default function LandingNavbar({
  officialPhone = '+923285778715',
  formattedPhone = '+92 328 5778715',
  whatsappUrl = 'https://wa.me/923285778715',
}: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Stay completely seamless/transparent while in hero section (transition only when scrolled past 150px)
      if (window.scrollY > 150) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Run once on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      role="banner"
      style={!isScrolled ? { borderBottom: 'none', border: 'none', boxShadow: 'none' } : undefined}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent border-0 border-none shadow-none py-4 sm:py-5'
      }`}
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4"
      >
        {/* Brand Logo & Name */}
        <Link
          href="/"
          aria-label="SAMStack Technologies — Home"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 shadow-md flex items-center justify-center group-hover:scale-105 group-hover:shadow-blue-500/20 transition-all flex-shrink-0">
            <img src="/logo.png" alt="SAMStack Technologies Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-white tracking-tight leading-none drop-shadow-sm">
              SAM<span className="text-blue-400">Stack</span>
            </span>
            <span className="text-[10px] text-slate-300 font-bold tracking-wider uppercase mt-0.5 drop-shadow-sm">
              Technologies
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5 text-sm font-semibold text-slate-200">
          <a
            href="#services"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            Services
          </a>
          <a
            href="#framework"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            How We Work
          </a>
          <a
            href="#team"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            Team
          </a>
          <a
            href="#about"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            About
          </a>
          <a
            href="#tech"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            Tech Stack
          </a>
          <a
            href="#faq"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            FAQ
          </a>
        </div>

        {/* Direct Contact Actions & Portal */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3">
          {/* Direct Phone Call Button */}
          <a
            href={`tel:${officialPhone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/18 text-slate-200 hover:text-white text-xs font-semibold border border-white/15 backdrop-blur-md transition-all shadow-sm"
            title="Call SAMStack"
          >
            <span>📞</span>
            <span className="hidden lg:inline">{formattedPhone}</span>
            <span className="lg:hidden">Call</span>
          </a>

          {/* WhatsApp Quick Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold border border-emerald-500/35 backdrop-blur-md transition-all shadow-sm hover:shadow-emerald-500/20"
            title="Chat on WhatsApp"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WhatsApp</span>
          </a>

          {/* Portal Login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-0.5"
          >
            <span>Sign In</span>
            <span className="text-blue-200 font-bold">&rarr;</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-md"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 border border-white/15 text-slate-200 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-3 pb-6 bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 mt-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-200">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            >
              Services
            </a>
            <a
              href="#framework"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            >
              How We Work
            </a>
            <a
              href="#team"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            >
              Team Leadership
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            >
              About Studio
            </a>
            <a
              href="#tech"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            >
              Tech Stack
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="pt-4 mt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              <span>💬</span> Chat on WhatsApp
            </a>
            <a
              href={`tel:${officialPhone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-xs"
            >
              <span>📞</span> Call: {formattedPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
