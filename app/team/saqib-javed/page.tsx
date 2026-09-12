import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://samstack-crm.vercel.app'
const OFFICIAL_EMAIL = 'samstacktechs@gmail.com'
const WHATSAPP_URL = `https://wa.me/923285778715?text=${encodeURIComponent('Hello SAMStack, I would like to connect with Saqib Javed regarding UI/UX and frontend development.')}`

export const metadata: Metadata = {
  title: 'Saqib Javed | Frontend Developer & UI/UX Lead at SAMStack — Lahore, Pakistan',
  description:
    'Saqib Javed is the Frontend Developer and UI/UX Lead at SAMStack Technologies in Lahore, Pakistan. Expert in React 19, Next.js 16, TailwindCSS, Figma design systems, micro-animations, and WCAG-accessible web interfaces.',
  keywords: [
    'Saqib Javed', 'Saqib Javed SAMStack', 'Saqib Javed frontend developer', 'Saqib Javed UI UX',
    'Saqib Javed Lahore', 'frontend developer lahore', 'UI UX designer pakistan',
    'React developer lahore', 'Next.js developer lahore', 'TailwindCSS developer pakistan',
    'Figma design lahore', 'web designer lahore', 'SAMStack UI lead',
  ],
  alternates: {
    canonical: `${SITE_URL}/team/saqib-javed`,
  },
  openGraph: {
    title: 'Saqib Javed — Frontend Developer & UI/UX Lead at SAMStack Technologies',
    description:
      'Official profile of Saqib Javed: Frontend Developer, UI/UX Designer, and Design Systems Lead at SAMStack Technologies, Lahore, Pakistan.',
    url: `${SITE_URL}/team/saqib-javed`,
    siteName: 'SAMStack Technologies',
    images: [
      {
        url: `${SITE_URL}/saqib.png`,
        width: 800,
        height: 800,
        alt: 'Saqib Javed — Frontend Developer & UI/UX Lead at SAMStack Technologies',
      },
    ],
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saqib Javed | Frontend & UI/UX Lead at SAMStack',
    description:
      'Frontend Developer and UI/UX Lead at SAMStack Technologies. Expert in React, Next.js, TailwindCSS, and Figma design systems — Lahore, Pakistan.',
    images: [`${SITE_URL}/saqib.png`],
  },
}

export default function SaqibJavedProfilePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Person Entity (Knowledge Graph Optimized)
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/team/saqib-javed#person`,
        name: 'Saqib Javed',
        alternateName: ['Saqib', 'Saqib Javed SAMStack', 'Saqib Javed UI/UX'],
        url: `${SITE_URL}/team/saqib-javed`,
        image: `${SITE_URL}/saqib.png`,
        jobTitle: 'Frontend Developer & UI/UX Lead',
        worksFor: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'SAMStack Technologies',
          url: SITE_URL,
        },
        description:
          'Saqib Javed is the Frontend Developer and UI/UX Lead at SAMStack Technologies in Lahore, Pakistan. He crafts pixel-perfect, responsive web interfaces, comprehensive Figma design systems, and conversion-optimized user experiences using React 19 and Next.js 16.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lahore',
          addressRegion: 'Punjab',
          addressCountry: 'Pakistan',
          postalCode: '54000',
        },
        email: OFFICIAL_EMAIL,
        knowsAbout: [
          'Frontend Development', 'UI/UX Design', 'React 19', 'Next.js 16',
          'TailwindCSS', 'Figma', 'Design Systems', 'Atomic Design', 'WCAG 2.1 AA',
          'Micro-Animations', 'Responsive Web Design', 'Conversion Rate Optimization',
          'Web Performance Optimization', 'CSS Architecture', 'TypeScript',
        ],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Frontend Developer & UI/UX Designer',
          occupationLocation: {
            '@type': 'City',
            name: 'Lahore',
          },
          skills: 'React, Next.js, TailwindCSS, Figma, TypeScript, Design Systems',
        },
      },
      // 2. ProfilePage Entity
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/team/saqib-javed`,
        url: `${SITE_URL}/team/saqib-javed`,
        name: 'Saqib Javed — Frontend Developer & UI/UX Lead at SAMStack Technologies',
        description:
          'Official profile of Saqib Javed, Frontend Developer and UI/UX Design Lead at SAMStack Technologies, Lahore, Pakistan.',
        about: { '@id': `${SITE_URL}/team/saqib-javed#person` },
        publisher: {
          '@type': 'Organization',
          name: 'SAMStack Technologies',
          url: SITE_URL,
        },
        inLanguage: 'en-US',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Team', item: `${SITE_URL}/team` },
            { '@type': 'ListItem', position: 3, name: 'Saqib Javed', item: `${SITE_URL}/team/saqib-javed` },
          ],
        },
      },
    ],
  }

  const skills = [
    { name: 'React 19', level: 96, color: 'from-blue-500 to-cyan-500' },
    { name: 'Next.js 16', level: 94, color: 'from-slate-500 to-blue-500' },
    { name: 'TypeScript', level: 90, color: 'from-blue-600 to-indigo-500' },
    { name: 'TailwindCSS', level: 97, color: 'from-teal-500 to-cyan-500' },
    { name: 'Figma Design', level: 95, color: 'from-purple-500 to-pink-500' },
    { name: 'CSS & Animations', level: 93, color: 'from-pink-500 to-rose-500' },
    { name: 'WCAG Accessibility', level: 88, color: 'from-emerald-500 to-teal-500' },
    { name: 'Design Systems', level: 92, color: 'from-violet-500 to-purple-500' },
  ]

  const portfolio = [
    {
      title: 'SAMStack CRM Enterprise Platform',
      category: 'Full-Scale Product Design',
      desc: 'Architected the entire UI/UX system for the SAMStack CRM — including design tokens, multi-role dashboards, onboarding flows, data visualization components, and glassmorphic design language.',
      tags: ['Next.js 16', 'TailwindCSS', 'Supabase', 'Figma', 'Role-Based UI'],
      highlight: 'Complete enterprise CRM interface from wireframe to production',
      accent: 'bg-blue-500/10 border-blue-500/20',
      iconBg: 'from-blue-500 to-indigo-600',
      icon: '🏢',
    },
    {
      title: 'SAMStack Public Landing Page',
      category: 'SEO-Optimized Marketing Site',
      desc: 'Designed and developed the production marketing website with cinematic hero section, scroll-aware transparent navbar, service cards, team profiles, and full Schema.org SEO markup.',
      tags: ['Next.js 16', 'TailwindCSS', 'Glassmorphism', 'SEO', 'Performance'],
      highlight: 'Transparent hero navbar & cinematic team background imagery',
      accent: 'bg-indigo-500/10 border-indigo-500/20',
      iconBg: 'from-indigo-500 to-purple-600',
      icon: '🌐',
    },
    {
      title: 'Authentication & Onboarding UX',
      category: 'User Experience Design',
      desc: 'Built multi-step registration with OTP verification, polished login page with branded visual panel, and a seamless onboarding wizard with progress tracking and role-based routing.',
      tags: ['React', 'Form UX', 'OTP Flow', 'Onboarding', 'Micro-Animations'],
      highlight: 'Seamless multi-step auth flow with full OTP verification',
      accent: 'bg-emerald-500/10 border-emerald-500/20',
      iconBg: 'from-emerald-500 to-teal-600',
      icon: '🔐',
    },
    {
      title: 'Mobile-First Design System',
      category: 'Atomic Design & Tokens',
      desc: 'Created a comprehensive atomic design system — typography scales, spacing tokens, color palettes, component variants, dark/light themes, and WCAG 2.1 AA contrast ratios.',
      tags: ['Design Tokens', 'Atomic CSS', 'WCAG 2.1 AA', 'Component Library', 'Figma'],
      highlight: 'Full atomic design system with WCAG 2.1 AA compliant tokens',
      accent: 'bg-purple-500/10 border-purple-500/20',
      iconBg: 'from-purple-500 to-pink-600',
      icon: '🎨',
    },
  ]

  const expertise = [
    {
      icon: '⚛️',
      title: 'React & Next.js Architecture',
      desc: 'Server Components, App Router, streaming SSR, advanced state management, and Next.js 16 App Router patterns that deliver Core Web Vitals scores above 95.',
    },
    {
      icon: '🎨',
      title: 'UI/UX Product Design',
      desc: 'End-to-end product design in Figma: user journeys, wireframes, interactive prototypes, usability testing, and hand-off-ready design systems with atomic tokens.',
    },
    {
      icon: '✨',
      title: 'Micro-Animations & Motion',
      desc: 'Crafting engaging, performant animations using CSS transitions, Framer Motion, and GSAP that increase user engagement and dwell time without impacting performance budgets.',
    },
    {
      icon: '📐',
      title: 'Design Systems & Tokens',
      desc: 'Building scalable, maintainable component libraries with atomic design methodology, semantic color tokens, breakpoint systems, and complete Storybook documentation.',
    },
    {
      icon: '♿',
      title: 'Web Accessibility (WCAG 2.1 AA)',
      desc: 'Ensuring every interface meets WCAG 2.1 AA accessibility standards: keyboard navigation, ARIA roles, focus management, color contrast ratios, and screen reader compatibility.',
    },
    {
      icon: '⚡',
      title: 'Web Performance & CRO',
      desc: 'Achieving sub-1.2s LCP and 100/100 Lighthouse scores through image optimization, critical CSS extraction, lazy loading strategies, and Conversion Rate Optimization (CRO).',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Hero Profile Banner ───────────────────────────────────────── */}
        <section
          aria-label="Saqib Javed Profile"
          className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-white/10 shadow-2xl"
        >
          {/* Background gradient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.12)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.10)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border-2 border-purple-500/40 bg-slate-800 ring-4 ring-purple-500/10">
                <img
                  src="/saqib.png"
                  alt="Saqib Javed — Frontend Developer & UI/UX Lead at SAMStack Technologies"
                  className="w-full h-full object-cover object-top"
                  itemProp="image"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm shadow-lg">
                🎨
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Frontend & UI/UX Lead
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active · Lahore, Pakistan
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1"
                itemProp="name"
              >
                Saqib Javed
              </h1>
              <p className="text-base sm:text-lg text-purple-300 font-semibold mb-4" itemProp="jobTitle">
                Frontend Developer & UI/UX Designer · Design Systems Lead
              </p>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-6" itemProp="description">
                Saqib Javed crafts pixel-perfect, conversion-focused digital interfaces at SAMStack Technologies.
                Specializing in React 19, Next.js 16, TailwindCSS, and Figma — he transforms complex product
                requirements into intuitive, visually stunning web experiences that drive engagement and retention.
              </p>

              {/* Quick Contact Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>💬</span> Contact via WhatsApp
                </a>
                <a
                  href={`mailto:${OFFICIAL_EMAIL}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
                >
                  <span>✉️</span> Email SAMStack
                </a>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs border border-white/10 transition-all"
                >
                  ← All Team Members
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* ─── Left Column: Skills & Stats ───────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Tech Skills with Progress Bars */}
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-md">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-5">
                Core Technical Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-[11px] font-bold text-slate-400">{skill.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fast Facts */}
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 backdrop-blur-md">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-5">
                Fast Facts
              </h2>
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">📍</span>
                  <div>
                    <div className="font-semibold text-white">Location</div>
                    <div>Lahore, Punjab, Pakistan</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">🏢</span>
                  <div>
                    <div className="font-semibold text-white">Company</div>
                    <div>SAMStack Technologies</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">💼</span>
                  <div>
                    <div className="font-semibold text-white">Role</div>
                    <div>Frontend Developer & UI/UX Lead</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">🛠️</span>
                  <div>
                    <div className="font-semibold text-white">Primary Stack</div>
                    <div>React 19, Next.js 16, TailwindCSS, Figma</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">🌍</span>
                  <div>
                    <div className="font-semibold text-white">Serves</div>
                    <div>Pakistan, USA, UK, Canada, GCC</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0">✉️</span>
                  <div>
                    <div className="font-semibold text-white">Email</div>
                    <a href={`mailto:${OFFICIAL_EMAIL}`} className="text-blue-400 hover:underline break-all">
                      {OFFICIAL_EMAIL}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Metrics */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/20 p-6">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-purple-400 mb-5">
                Impact Metrics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '100/100', label: 'Lighthouse Score' },
                  { value: '30+', label: 'UI Components Built' },
                  { value: 'WCAG', label: '2.1 AA Certified' },
                  { value: '<1.2s', label: 'LCP Target' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] font-semibold text-purple-300 mt-0.5 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right Column: About & Projects ───────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Detailed Bio */}
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-7 backdrop-blur-md">
              <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span className="text-purple-400">👤</span> About Saqib Javed
              </h2>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">Saqib Javed</strong> is the Frontend Developer and UI/UX Lead at{' '}
                  <strong className="text-purple-400">SAMStack Technologies</strong>, based in Lahore, Pakistan.
                  With a deep passion for user-centric design and performance-first frontend engineering, Saqib
                  has been instrumental in shaping SAMStack&apos;s visual identity and client-facing product experiences.
                </p>
                <p>
                  Saqib specializes in translating complex product requirements and Figma wireframes into
                  production-grade React and Next.js interfaces. His workflow combines{' '}
                  <strong className="text-white">atomic design methodology</strong>,{' '}
                  <strong className="text-white">TailwindCSS design tokens</strong>, and{' '}
                  <strong className="text-white">micro-animation patterns</strong> to create interfaces that are
                  both visually captivating and conversion-optimized.
                </p>
                <p>
                  A core advocate for <strong className="text-white">web accessibility</strong>, Saqib ensures every
                  interface he ships meets WCAG 2.1 AA standards — from proper ARIA roles and keyboard navigation to
                  semantic HTML structure and screen reader compatibility. He applies{' '}
                  <strong className="text-white">Conversion Rate Optimization (CRO)</strong> principles to every UI
                  to maximize user retention and business impact.
                </p>
                <p>
                  His portfolio spans enterprise CRM dashboards, marketing landing pages, authentication flows,
                  multi-step onboarding wizards, and comprehensive design systems — all deployed to production
                  with 100/100 Lighthouse performance scores.
                </p>
              </div>
            </div>

            {/* Portfolio Projects */}
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-7 backdrop-blur-md">
              <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
                <span className="text-purple-400">🚀</span> Featured Work & Portfolio
              </h2>
              <div className="space-y-4">
                {portfolio.map((project) => (
                  <div
                    key={project.title}
                    className={`p-5 rounded-xl border ${project.accent} backdrop-blur-sm transition-all hover:border-opacity-60`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.iconBg} flex items-center justify-center text-lg shadow-lg flex-shrink-0`}>
                        {project.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {project.category}
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1">{project.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">{project.desc}</p>
                        <div className="text-[11px] text-emerald-400 font-semibold mb-2.5">
                          ✓ {project.highlight}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Full-Width: Areas of Expertise ──────────────────────────── */}
        <section className="mb-12 rounded-2xl bg-slate-900/60 border border-white/10 p-8 backdrop-blur-md">
          <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <span className="text-purple-400">⚙️</span> Areas of Expertise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertise.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Full-Width: Team & CTA ──────────────────────────────────── */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Meet the Team */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-7 backdrop-blur-md">
            <h2 className="text-base font-black text-white mb-4">
              🤝 Collaborate with SAMStack
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Saqib works alongside Suleman Zaheer (Founder & Full Stack) and Syed Abdullah (Team Lead & Backend)
              to deliver complete product experiences — from backend APIs to polished pixel-perfect frontends.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { name: 'Suleman Zaheer', role: 'Founder & CEO · Full Stack', slug: 'suleman-zaheer', color: 'text-blue-400' },
                { name: 'Syed Abdullah', role: 'Team Lead · Backend', slug: 'syed-abdullah', color: 'text-emerald-400' },
              ].map((member) => (
                <Link
                  key={member.slug}
                  href={`/team/${member.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="text-sm">👤</div>
                  <div>
                    <div className={`text-xs font-bold ${member.color}`}>{member.name}</div>
                    <div className="text-[11px] text-slate-500">{member.role}</div>
                  </div>
                  <span className="ml-auto text-slate-500 group-hover:text-white text-xs">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Get in Touch CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/40 border border-purple-500/25 p-7 flex flex-col justify-between">
            <div>
              <div className="text-xs font-extrabold text-purple-400 uppercase tracking-widest mb-2">
                Hire Saqib's Expertise
              </div>
              <h2 className="text-xl font-black text-white mb-3">
                Need world-class UI/UX design and frontend engineering?
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Get in touch with the SAMStack team and let Saqib transform your product&apos;s user experience.
                We offer free design discovery consultations.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span> Chat on WhatsApp
              </a>
              <a
                href={`mailto:${OFFICIAL_EMAIL}`}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all flex items-center justify-center gap-2"
              >
                <span>✉️</span> {OFFICIAL_EMAIL}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
