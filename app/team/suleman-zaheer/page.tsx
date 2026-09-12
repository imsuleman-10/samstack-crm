import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://samstack-crm.vercel.app'
const OFFICIAL_PHONE = '+923285778715'
const FORMATTED_PHONE = '+92 328 5778715'
const OFFICIAL_EMAIL = 'samstacktechs@gmail.com'
const WHATSAPP_URL = `https://wa.me/923285778715?text=${encodeURIComponent('Hello Suleman Zaheer, I am reaching out regarding SAMStack software and engineering consultation.')}`

export const metadata: Metadata = {
  title: 'Who is Suleman Zaheer? | Founder & CEO of SAMStack — Lahore, Pakistan',
  description:
    'Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder & CEO of SAMStack Technologies in Lahore, Pakistan. Learn about his career, projects, skills in Next.js, Python, PostgreSQL, and contact details.',
  keywords: [
    'Who is Suleman Zaheer', 'Suleman Zaheer', 'Suleman Zaheer Lahore', 'Suleman Zaheer developer',
    'Suleman Zaheer CEO', 'Suleman Zaheer SAMStack', 'Suleman Zaheer writer', 'full stack developer Lahore',
    'best software engineer Pakistan', 'Next.js developer Lahore', 'Python developer Pakistan',
    'founder SAMStack Technologies'
  ],
  alternates: {
    canonical: `${SITE_URL}/team/suleman-zaheer`,
  },
  openGraph: {
    title: 'Who is Suleman Zaheer? — Founder & CEO of SAMStack Technologies',
    description:
      'Official executive profile of Suleman Zaheer: Full Stack Engineer, Technical Writer, and Founder & CEO of SAMStack Technologies based in Lahore, Pakistan.',
    url: `${SITE_URL}/team/suleman-zaheer`,
    siteName: 'SAMStack Technologies',
    images: [
      {
        url: `${SITE_URL}/suleman.png`,
        width: 800,
        height: 800,
        alt: 'Suleman Zaheer — Founder & CEO of SAMStack Technologies',
      },
    ],
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who is Suleman Zaheer? | Founder & CEO of SAMStack',
    description:
      'Pakistani Full Stack Engineer, Technical Writer, and Founder & CEO of SAMStack Technologies in Lahore, Pakistan.',
    images: [`${SITE_URL}/suleman.png`],
  },
}

export default function SulemanZaheerProfilePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Person Entity (Knowledge Graph)
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/team/suleman-zaheer#person`,
        name: 'Suleman Zaheer',
        alternateName: ['Suleman', 'M. Suleman Zaheer', 'Suleman Zaheer SAMStack'],
        url: `${SITE_URL}/team/suleman-zaheer`,
        image: `${SITE_URL}/suleman.png`,
        jobTitle: 'Founder & CEO',
        worksFor: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'SAMStack Technologies',
          url: SITE_URL,
        },
        description:
          'Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder & CEO of SAMStack Technologies based in Lahore, Pakistan. He specializes in high-throughput backend architecture, Next.js, Python, PostgreSQL, and developer documentation.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lahore',
          addressRegion: 'Punjab',
          addressCountry: 'Pakistan',
          postalCode: '54000',
        },
        telephone: OFFICIAL_PHONE,
        email: OFFICIAL_EMAIL,
        sameAs: [
          'https://github.com/imsuleman-10',
          'https://samstack-crm.vercel.app',
        ],
        knowsAbout: [
          'Next.js 16', 'React 19', 'TypeScript', 'Node.js', 'Python', 'FastAPI',
          'PostgreSQL', 'Supabase', 'System Architecture', 'Technical Writing',
          'Developer Relations', 'Data Science', 'API Design', 'Microservices'
        ],
      },

      // 2. ProfilePage Entity
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/team/suleman-zaheer`,
        url: `${SITE_URL}/team/suleman-zaheer`,
        name: 'Suleman Zaheer — Founder & CEO Profile',
        mainEntity: { '@id': `${SITE_URL}/team/suleman-zaheer#person` },
        isPartOf: {
          '@type': 'WebSite',
          name: 'SAMStack Technologies',
          url: SITE_URL,
        },
      },

      // 3. BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Team', item: `${SITE_URL}/team` },
          { '@type': 'ListItem', position: 3, name: 'Suleman Zaheer', item: `${SITE_URL}/team/suleman-zaheer` },
        ],
      },

      // 4. FAQPage for AEO (Direct Google & AI answers for "Who is Suleman Zaheer?")
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is Suleman Zaheer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder & CEO of SAMStack Technologies based in Lahore, Pakistan. He leads engineering, system architecture, and client digital transformations for companies in Pakistan, the United States, the UK, and the Middle East.',
            },
          },
          {
            '@type': 'Question',
            name: 'What company did Suleman Zaheer found?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Suleman Zaheer founded SAMStack Technologies, a premier software development studio and IT solutions company based in Lahore, Pakistan offering web development, mobile apps, data science & analytics, and developer documentation.',
            },
          },
          {
            '@type': 'Question',
            name: 'What technical skills and technologies does Suleman Zaheer specialize in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Suleman Zaheer specializes in full-stack web and backend engineering utilizing Next.js 16, React 19, TypeScript, Python, FastAPI, Node.js, PostgreSQL, Supabase, Redis, and developer-grade technical writing.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do you contact Suleman Zaheer in Lahore, Pakistan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can contact Suleman Zaheer via direct phone or WhatsApp at +92 328 5778715 or email at samstacktechs@gmail.com.',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="pt-4 pb-8 flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/team" className="hover:text-white transition-colors">Team</Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">Suleman Zaheer</span>
        </nav>

        {/* Hero Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Avatar Column */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400/40 bg-slate-800 ring-4 ring-blue-500/20 mb-4">
                <img
                  src="/suleman.png"
                  alt="Suleman Zaheer — Founder & CEO of SAMStack"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active in Lahore, PK</span>
              </div>
            </div>

            {/* Info Column */}
            <div className="md:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                Founder &amp; CEO · SAMStack
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
                Suleman Zaheer
              </h1>

              <p className="text-sm sm:text-base font-semibold text-blue-300 mb-4">
                Full Stack Software Engineer &bull; System Architect &bull; Technical Writer
              </p>

              {/* Direct AEO Definition Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Who is Suleman Zaheer?</strong> Suleman Zaheer is an entrepreneur and senior software engineer based in Lahore, Pakistan. As Founder and CEO of <strong>SAMStack Technologies</strong>, he architects mission-critical digital products, scalable web backends, and data science platforms for global enterprises.
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <span>💬</span> WhatsApp Direct
                </a>
                <a
                  href={`tel:${OFFICIAL_PHONE}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>📞</span> Call: {FORMATTED_PHONE}
                </a>
                <a
                  href={`mailto:${OFFICIAL_EMAIL}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all"
                >
                  <span>✉️</span> {OFFICIAL_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Biography & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left 2 Cols: Story & Leadership */}
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>👨‍💻</span> About Suleman Zaheer
              </h2>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  Suleman Zaheer founded SAMStack Technologies with a singular vision: to bring developer-grade rigor, architectural cleanliness, and direct engineering access to businesses seeking high-impact digital products.
                </p>
                <p>
                  With deep practical experience spanning full-stack web platforms, distributed cloud microservices, and database optimization, Suleman oversees the end-to-end technical lifecycle of client applications. His focus on test automation, Supabase Row-Level Security, and sub-second page performance ensures every product built under his direction exceeds international standards.
                </p>
                <p>
                  In addition to software engineering, Suleman is an active technical writer. He creates developer-grade OpenAPI specifications, system whitepapers, and technical blogs designed to eliminate software complexity and drive developer adoption.
                </p>
              </div>
            </div>

            {/* Engineering Pillars */}
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎯</span> Core Architectural Focus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">⚡ High-Throughput Web Apps</div>
                  <p className="text-xs text-slate-400">
                    Next.js 16 App Router, React 19, Server Actions, edge caching, and 100/100 Core Web Vitals.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">🛡️ Bulletproof Backend Architecture</div>
                  <p className="text-xs text-slate-400">
                    PostgreSQL schema normalization, PgBouncer pooling, Row-Level Security (RLS), and Redis caching.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">📊 Data Science &amp; Pipelines</div>
                  <p className="text-xs text-slate-400">
                    Python, Pandas, automated ETL workflows, predictive models, and real-time dashboarding.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">✍️ Technical Documentation</div>
                  <p className="text-xs text-slate-400">
                    Authoritative OpenAPI specs, MDX developer documentation, and engineering RFCs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Tech Stack & Overview */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Technical Stack &amp; Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Next.js 16', 'React 19', 'TypeScript', 'Node.js', 'Python',
                  'FastAPI', 'PostgreSQL', 'Supabase', 'Redis', 'Docker',
                  'TailwindCSS', 'OpenAPI / Swagger', 'Git', 'Vercel', 'AWS'
                ].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Location &amp; Delivery
              </h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div>📍 <strong>Base:</strong> Lahore, Punjab, Pakistan (54000)</div>
                <div>🌍 <strong>Global Delivery:</strong> US, UK, Canada, Australia, UAE &amp; GCC</div>
                <div>💬 <strong>Languages:</strong> English, Urdu</div>
                <div>⏱️ <strong>Response SLA:</strong> Under 2 hours</div>
              </div>
            </div>

            {/* Team Navigation Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 p-6 text-center">
              <h4 className="font-bold text-white text-sm mb-2">SAMStack Leadership</h4>
              <p className="text-xs text-slate-300 mb-4">
                Collaborating closely with engineering leads Syed Abdullah and Saqib Javed.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/team/syed-abdullah"
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                >
                  Meet Syed Abdullah (Team Lead) &rarr;
                </Link>
                <Link
                  href="/team/saqib-javed"
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                >
                  Meet Saqib Javed (UI/UX Lead) &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section (AEO Schema matching) */}
        <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8 mb-16">
          <h2 className="text-xl font-bold text-white mb-6">
            Frequently Asked Questions About Suleman Zaheer
          </h2>
          <div className="space-y-4 divide-y divide-white/10">
            <div className="pt-4 first:pt-0">
              <h3 className="font-bold text-white text-sm mb-1.5">
                Who is Suleman Zaheer?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder &amp; CEO of SAMStack Technologies based in Lahore, Pakistan. He specializes in distributed backend systems, Next.js, Python, PostgreSQL, and developer documentation.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-white text-sm mb-1.5">
                What company did Suleman Zaheer found?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suleman Zaheer founded SAMStack Technologies, an engineering studio based in Lahore, Pakistan offering high-performance web development, mobile apps, data science pipelines, and developer documentation.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-white text-sm mb-1.5">
                What technical skills and technologies does Suleman Zaheer specialize in?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suleman Zaheer specializes in full-stack web and backend engineering utilizing Next.js 16, React 19, TypeScript, Python, FastAPI, Node.js, PostgreSQL, Supabase, Redis, and developer-grade technical writing.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-white text-sm mb-1.5">
                How can I hire or consult with Suleman Zaheer?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You can reach Suleman Zaheer directly via call or WhatsApp at {FORMATTED_PHONE} or email at {OFFICIAL_EMAIL} for project inquiries and technical architecture consultations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
