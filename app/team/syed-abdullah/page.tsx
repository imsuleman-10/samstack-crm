import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://samstack-crm.vercel.app'
const OFFICIAL_PHONE = '+923285778715'
const FORMATTED_PHONE = '+92 328 5778715'
const OFFICIAL_EMAIL = 'samstacktechs@gmail.com'
const WHATSAPP_URL = `https://wa.me/923285778715?text=${encodeURIComponent('Hello Syed Abdullah, I am reaching out regarding backend architecture consultation at SAMStack.')}`

export const metadata: Metadata = {
  title: 'Who is Syed Abdullah? | Senior Backend Developer & Team Lead — SAMStack',
  description:
    'Syed Abdullah is a Senior Backend Developer, Distributed Systems Architect, and the Engineering Team Lead at SAMStack Technologies in Lahore, Pakistan. Discover his expertise in Python, Node.js, microservices, and database resilience.',
  keywords: [
    'Who is Syed Abdullah', 'Syed Abdullah', 'Syed Abdullah backend', 'Syed Abdullah developer',
    'Syed Abdullah team lead', 'Syed Abdullah SAMStack', 'Syed Abdullah Lahore', 'backend engineer Pakistan',
    'FastAPI developer Lahore', 'PostgreSQL database architect Pakistan'
  ],
  alternates: {
    canonical: `${SITE_URL}/team/syed-abdullah`,
  },
  openGraph: {
    title: 'Who is Syed Abdullah? — Senior Backend Developer & Team Lead at SAMStack',
    description:
      'Official profile of Syed Abdullah: Senior Backend Engineer, Distributed Systems Architect, and Team Lead at SAMStack Technologies based in Lahore, Pakistan.',
    url: `${SITE_URL}/team/syed-abdullah`,
    siteName: 'SAMStack Technologies',
    images: [
      {
        url: `${SITE_URL}/abdullah.png`,
        width: 800,
        height: 800,
        alt: 'Syed Abdullah — Team Lead & Senior Backend Developer at SAMStack',
      },
    ],
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who is Syed Abdullah? | Team Lead at SAMStack',
    description:
      'Senior Backend Engineer and Team Lead at SAMStack Technologies in Lahore, Pakistan.',
    images: [`${SITE_URL}/abdullah.png`],
  },
}

export default function SyedAbdullahProfilePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/team/syed-abdullah#person`,
        name: 'Syed Abdullah',
        alternateName: ['Abdullah', 'Syed Abdullah Backend', 'Syed Abdullah SAMStack'],
        url: `${SITE_URL}/team/syed-abdullah`,
        image: `${SITE_URL}/abdullah.png`,
        jobTitle: 'Team Lead & Senior Backend Developer',
        worksFor: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'SAMStack Technologies',
          url: SITE_URL,
        },
        description:
          'Syed Abdullah is a Senior Backend Developer and the Engineering Team Lead at SAMStack Technologies based in Lahore, Pakistan. He specializes in high-concurrency microservices, Node.js, Python FastAPI, PostgreSQL, and resilient server infrastructure.',
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
          'https://samstack-crm.vercel.app',
        ],
        knowsAbout: [
          'Node.js', 'Python', 'FastAPI', 'Microservices', 'PostgreSQL',
          'Redis', 'Docker', 'Database Indexing', 'API Security',
          'Distributed Systems', 'Supabase', 'Cloud Architecture'
        ],
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/team/syed-abdullah`,
        url: `${SITE_URL}/team/syed-abdullah`,
        name: 'Syed Abdullah — Team Lead Profile',
        mainEntity: { '@id': `${SITE_URL}/team/syed-abdullah#person` },
        isPartOf: {
          '@type': 'WebSite',
          name: 'SAMStack Technologies',
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Team', item: `${SITE_URL}/team` },
          { '@type': 'ListItem', position: 3, name: 'Syed Abdullah', item: `${SITE_URL}/team/syed-abdullah` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is Syed Abdullah?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Syed Abdullah is a Senior Backend Developer, Distributed Systems Architect, and the Engineering Team Lead at SAMStack Technologies in Lahore, Pakistan. He leads backend microservice delivery, database resilience, and high-concurrency API integrations.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Syed Abdullah’s role at SAMStack?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'At SAMStack, Syed Abdullah serves as Engineering Team Lead, overseeing server architectures, REST and GraphQL APIs, PostgreSQL schema design, and asynchronous worker queues.',
            },
          },
          {
            '@type': 'Question',
            name: 'What technologies does Syed Abdullah specialize in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Syed Abdullah specializes in Node.js, Python, FastAPI, PostgreSQL, Supabase, Redis caching, Docker containerization, and distributed cloud microservices.',
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
          <span className="text-emerald-400 font-semibold">Syed Abdullah</span>
        </nav>

        {/* Hero Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Avatar Column */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-400/40 bg-slate-800 ring-4 ring-emerald-500/20 mb-4">
                <img
                  src="/abdullah.png"
                  alt="Syed Abdullah — Team Lead & Senior Backend Developer at SAMStack"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                Team Lead · Senior Backend Architect
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
                Syed Abdullah
              </h1>

              <p className="text-sm sm:text-base font-semibold text-emerald-300 mb-4">
                Distributed Systems Architect &bull; API Security &bull; Cloud Infrastructure
              </p>

              {/* Direct AEO Definition Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Who is Syed Abdullah?</strong> Syed Abdullah is a Senior Backend Engineer and the Engineering Team Lead at <strong>SAMStack Technologies</strong> in Lahore, Pakistan. He oversees server microservices, high-throughput APIs, database resilience, and cloud reliability across mission-critical systems.
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all"
                >
                  <span>📞</span> Call Team Lead
                </a>
                <Link
                  href="/team/suleman-zaheer"
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 font-semibold text-xs border border-blue-500/30 transition-all"
                >
                  Meet CEO Suleman Zaheer &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Biography & Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⚙️</span> About Syed Abdullah
              </h2>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  As Engineering Team Lead at SAMStack, Syed Abdullah directs the development of scalable microservices, relational database schemas, and mission-critical server environments.
                </p>
                <p>
                  He specializes in designing fault-tolerant distributed systems using Node.js and Python FastAPI, paired with normalized PostgreSQL databases, Redis caching layers, and asynchronous worker queues. His focus on robust database indexing, connection pooling with PgBouncer, and strict Row-Level Security safeguards high-throughput applications against downtime and data bottlenecks.
                </p>
                <p>
                  Collaborating seamlessly with Founder Suleman Zaheer and Frontend Lead Saqib Javed, Syed Abdullah ensures client backends are built to international production standards with 99.99% uptime SLAs.
                </p>
              </div>
            </div>

            {/* Core Competencies */}
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🛡️</span> Technical Expertise
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">🚀 High-Concurrency APIs</div>
                  <p className="text-xs text-slate-400">
                    RESTful &amp; GraphQL APIs built with FastAPI and Node.js with sub-80ms P95 latency.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">🗄️ Relational Data Architectures</div>
                  <p className="text-xs text-slate-400">
                    PostgreSQL indexing, query optimization, connection pooling, and automated replication.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">⚡ Distributed Caching</div>
                  <p className="text-xs text-slate-400">
                    In-memory Redis stores, rate-limiting algorithms, and background worker queues.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold text-white text-sm mb-1">🔒 Enterprise API Security</div>
                  <p className="text-xs text-slate-400">
                    JWT validation, Role-Based Access Control (RBAC), and Supabase Row-Level Security (RLS).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase',
                  'Redis', 'Docker', 'Microservices', 'REST APIs', 'GraphQL',
                  'Linux', 'Git', 'PgBouncer', 'JWT Security'
                ].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Leadership &amp; Delivery
              </h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div>📍 <strong>Location:</strong> Lahore, Punjab, Pakistan</div>
                <div>🛡️ <strong>SLA Target:</strong> 99.99% Production Uptime</div>
                <div>⚡ <strong>Sprint Model:</strong> Agile 2-week Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
