import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, TEAM, COMPANY, ADDRESS } from '@/lib/seo-config'

const MEMBER = TEAM.suleman
const WHATSAPP_URL = `https://wa.me/923285778715?text=${encodeURIComponent('Hello Suleman Zaheer, I am reaching out regarding SAMStack software and engineering consultation.')}`

export const metadata: Metadata = {
  title: 'Who is Suleman Zaheer? | Founder & CEO of SAMStack Technologies — Lahore, Pakistan',
  description:
    'Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder & CEO of SAMStack Technologies in Lahore, Pakistan. Expert in Next.js, Python, PostgreSQL, and system architecture. Contact: +92 328 5778715.',
  keywords: [
    'Who is Suleman Zaheer', 'Suleman Zaheer', 'Suleman Zaheer Lahore',
    'Suleman Zaheer developer', 'Suleman Zaheer CEO', 'Suleman Zaheer SAMStack',
    'Suleman Zaheer writer', 'Suleman Zaheer full stack engineer',
    'Suleman Zaheer Pakistan', 'Suleman Zaheer founder',
    'full stack developer Lahore', 'best software engineer Pakistan',
    'Next.js developer Lahore', 'Python developer Pakistan',
    'founder SAMStack Technologies', 'hire full stack developer Pakistan',
    'software engineer Lahore', 'web developer Lahore Pakistan',
  ],
  alternates: {
    canonical: MEMBER.url,
    languages: { 'en-PK': MEMBER.url, 'en-US': MEMBER.url },
  },
  openGraph: {
    title: 'Who is Suleman Zaheer? — Founder & CEO of SAMStack Technologies, Lahore',
    description:
      'Official executive profile: Suleman Zaheer, Full Stack Engineer, Technical Writer, and Founder & CEO of SAMStack Technologies. Based in Lahore, Pakistan. Serving global clients in US, UK & UAE.',
    url: MEMBER.url,
    siteName: 'SAMStack Technologies',
    locale: 'en_PK',
    images: [
      {
        url: MEMBER.image,
        width: 800,
        height: 800,
        alt: 'Suleman Zaheer — Founder & CEO of SAMStack Technologies, Lahore Pakistan',
      },
    ],
    type: 'profile',
    firstName: 'Suleman',
    lastName: 'Zaheer',
    username: 'suleman-zaheer',
    gender: 'male',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who is Suleman Zaheer? | Founder & CEO of SAMStack Technologies',
    description:
      'Pakistani Full Stack Engineer, Technical Writer, and Founder & CEO of SAMStack Technologies in Lahore, Pakistan.',
    images: [MEMBER.image],
  },
}

export default function SulemanZaheerProfilePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Person Entity (Knowledge Graph Panel Target)
      {
        '@type': 'Person',
        '@id': MEMBER.id,
        name: MEMBER.name,
        givenName: 'Suleman',
        familyName: 'Zaheer',
        alternateName: ['Suleman', 'M. Suleman Zaheer', 'Suleman Zaheer SAMStack', 'imsuleman-10'],
        url: MEMBER.url,
        image: {
          '@type': 'ImageObject',
          url: MEMBER.image,
          width: 800,
          height: 800,
          caption: 'Suleman Zaheer — Founder & CEO of SAMStack Technologies, Lahore Pakistan',
        },
        jobTitle: MEMBER.jobTitle,
        worksFor: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: COMPANY.name,
          url: SITE_URL,
        },
        description: MEMBER.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: ADDRESS.streetAddress,
          addressLocality: ADDRESS.addressLocality,
          addressRegion: ADDRESS.addressRegion,
          addressCountry: ADDRESS.addressCountry,
          postalCode: ADDRESS.postalCode,
        },
        telephone: COMPANY.telephone,
        email: COMPANY.email,
        nationality: { '@type': 'Country', name: 'Pakistan' },
        sameAs: [...MEMBER.sameAs],
        knowsAbout: MEMBER.skills,
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Full Stack Software Engineer & Technical Writer',
          occupationLocation: { '@type': 'City', name: 'Lahore', containedInPlace: { '@type': 'Country', name: 'Pakistan' } },
          estimatedSalary: { '@type': 'MonetaryAmountDistribution', name: 'base', currency: 'USD', duration: 'P1Y', percentile10: 3000, percentile50: 6000, percentile90: 12000 },
          skills: MEMBER.skills.join(', '),
        },
        performerIn: {
          '@type': 'Event',
          name: 'SAMStack Technologies — Ongoing Software Engineering Leadership',
          location: { '@type': 'Place', name: 'Lahore, Pakistan' },
        },
      },

      // 2. ProfilePage Entity
      {
        '@type': 'ProfilePage',
        '@id': MEMBER.url,
        url: MEMBER.url,
        name: 'Suleman Zaheer — Founder & CEO Profile | SAMStack Technologies',
        description: 'Official executive profile of Suleman Zaheer, Founder & CEO of SAMStack Technologies, Lahore, Pakistan.',
        mainEntity: { '@id': MEMBER.id },
        about: { '@id': MEMBER.id },
        isPartOf: { '@type': 'WebSite', name: 'SAMStack Technologies', url: SITE_URL },
        inLanguage: 'en-PK',
        publisher: { '@id': `${SITE_URL}/#organization` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: MEMBER.image,
          width: 800,
          height: 800,
        },
      },

      // 3. BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Team', item: `${SITE_URL}/team` },
          { '@type': 'ListItem', position: 3, name: 'Suleman Zaheer', item: MEMBER.url },
        ],
      },

      // 4. FAQPage — AEO (Directly answers "Who is Suleman Zaheer?" queries)
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is Suleman Zaheer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder & CEO of SAMStack Technologies based in Lahore, Pakistan. He leads engineering, system architecture, and digital transformation projects for companies in Pakistan, the United States, the UK, and the Middle East.',
            },
          },
          {
            '@type': 'Question',
            name: 'What company did Suleman Zaheer found?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Suleman Zaheer founded SAMStack Technologies, a premier software development studio in Lahore, Pakistan offering custom CRM systems, web applications, mobile apps, data science, and AI automation solutions.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are Suleman Zaheer\'s technical skills?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Suleman Zaheer specializes in Next.js 16, React 19, TypeScript, Python, FastAPI, Node.js, PostgreSQL, Supabase, Redis, system architecture, microservices, and developer-grade technical writing.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I contact Suleman Zaheer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can contact Suleman Zaheer via WhatsApp or phone at +92 328 5778715, or email at samstacktechs@gmail.com. He is based in Lahore, Pakistan and responds within 2 hours.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Suleman Zaheer available for freelance or consulting work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Suleman Zaheer and his team at SAMStack Technologies are available for software development contracts, technical consulting, and digital transformation projects. They serve clients globally in the US, UK, UAE, and Canada.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is Suleman Zaheer based?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Suleman Zaheer is based in Johar Town, Lahore, Punjab, Pakistan. He leads remote engineering teams and delivers projects for global clients without timezone limitations.',
            },
          },
        ],
      },

      // 5. WebPage with Speakable
      {
        '@type': 'WebPage',
        '@id': `${MEMBER.url}#webpage`,
        url: MEMBER.url,
        name: 'Who is Suleman Zaheer? | Founder & CEO of SAMStack Technologies — Lahore, Pakistan',
        isPartOf: { '@type': 'WebSite', url: SITE_URL },
        about: { '@id': MEMBER.id },
        inLanguage: 'en-PK',
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.aeo-definition', '.faq-answer'],
        },
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
        {/* Breadcrumb */}
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
            {/* Avatar */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400/40 bg-slate-800 ring-4 ring-blue-500/20 mb-4">
                <img
                  src="/suleman.png"
                  alt="Suleman Zaheer — Founder & CEO of SAMStack Technologies, Lahore Pakistan"
                  className="w-full h-full object-cover object-top"
                  itemProp="image"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active in Lahore, PK</span>
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                Founder &amp; CEO · SAMStack Technologies
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
                Suleman Zaheer
              </h1>

              <p className="text-sm sm:text-base font-semibold text-blue-300 mb-4">
                Full Stack Software Engineer &bull; System Architect &bull; Technical Writer
              </p>

              {/* AEO Definition Box — matches schema speakable */}
              <div className="aeo-definition p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Who is Suleman Zaheer?</strong> Suleman Zaheer is an entrepreneur and senior software engineer based in Lahore, Pakistan. As Founder and CEO of <strong>SAMStack Technologies</strong>, he architects mission-critical digital products, scalable web backends, and data science platforms for clients across Pakistan, the US, UK, and Middle East.
              </div>

              {/* Contact Actions */}
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
                  href={`tel:${COMPANY.telephone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>📞</span> Call: {COMPANY.telephoneFormatted}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all"
                >
                  <span>✉️</span> {COMPANY.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>👨‍💻</span> About Suleman Zaheer
              </h2>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  Suleman Zaheer founded SAMStack Technologies with a singular vision: to bring developer-grade rigor, architectural cleanliness, and direct engineering access to businesses seeking high-impact digital products. Since 2023, he has led the delivery of enterprise CRM platforms, data science pipelines, and AI-powered automation tools for clients across Pakistan, the United States, the UK, and the UAE.
                </p>
                <p>
                  With deep practical experience spanning full-stack web platforms, distributed cloud microservices, and database optimization, Suleman oversees the end-to-end technical lifecycle of client applications. His focus on Supabase Row-Level Security, sub-second page performance, and test-first development ensures every product exceeds international software quality standards.
                </p>
                <p>
                  In addition to engineering, Suleman is an active technical writer — creating developer-grade OpenAPI specifications, system architecture whitepapers, and technical blogs designed to eliminate software complexity and drive developer adoption at scale.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎯</span> Core Architectural Focus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '⚡', title: 'High-Throughput Web Apps', desc: 'Next.js 16 App Router, React 19, Server Actions, edge caching, and 100/100 Core Web Vitals.' },
                  { icon: '🛡️', title: 'Bulletproof Backend', desc: 'PostgreSQL schema normalization, PgBouncer, Row-Level Security (RLS), and Redis caching.' },
                  { icon: '📊', title: 'Data Science Pipelines', desc: 'Python, Pandas, automated ETL workflows, predictive models, and real-time dashboarding.' },
                  { icon: '✍️', title: 'Technical Documentation', desc: 'Authoritative OpenAPI specs, MDX developer documentation, and engineering RFCs.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="font-bold text-white text-sm mb-1">{item.icon} {item.title}</div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Technical Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {MEMBER.skills.map((tech) => (
                  <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Location &amp; Delivery</h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div>📍 <strong>Base:</strong> Johar Town, Lahore, Punjab, Pakistan</div>
                <div>🌍 <strong>Serves:</strong> US, UK, Canada, Australia, UAE &amp; GCC</div>
                <div>💬 <strong>Languages:</strong> English, Urdu</div>
                <div>⏱️ <strong>Response SLA:</strong> Under 2 hours</div>
                <div>💳 <strong>Payments:</strong> Bank Transfer (PKR, USD, GBP, EUR, AED)</div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 p-6 text-center">
              <h4 className="font-bold text-white text-sm mb-2">SAMStack Leadership Team</h4>
              <p className="text-xs text-slate-300 mb-4">Working with engineering leads Syed Abdullah and Saqib Javed.</p>
              <div className="flex flex-col gap-2">
                <Link href="/team/syed-abdullah" className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all">
                  Meet Syed Abdullah →
                </Link>
                <Link href="/team/saqib-javed" className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all">
                  Meet Saqib Javed →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section — AEO Schema Matching */}
        <div className="rounded-3xl bg-slate-900/50 border border-white/10 p-8 mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions About Suleman Zaheer</h2>
          <div className="space-y-4 divide-y divide-white/10">
            {[
              { q: 'Who is Suleman Zaheer?', a: 'Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder & CEO of SAMStack Technologies based in Lahore, Pakistan. He specializes in distributed backend systems, Next.js, Python, PostgreSQL, and developer documentation.' },
              { q: 'What company did Suleman Zaheer found?', a: 'Suleman Zaheer founded SAMStack Technologies, a software engineering studio in Lahore, Pakistan offering custom CRM systems, web apps, mobile apps, data science pipelines, and developer documentation.' },
              { q: 'What technologies does Suleman Zaheer specialize in?', a: 'Suleman Zaheer specializes in Next.js 16, React 19, TypeScript, Python, FastAPI, Node.js, PostgreSQL, Supabase, Redis, and developer-grade technical writing.' },
              { q: 'How can I hire or consult with Suleman Zaheer?', a: `You can reach Suleman Zaheer via WhatsApp or call at ${COMPANY.telephoneFormatted} or email at ${COMPANY.email} for project inquiries and technical architecture consultations.` },
              { q: 'Is Suleman Zaheer available for international clients?', a: 'Yes, Suleman Zaheer and SAMStack Technologies actively serve clients in the US, UK, UAE, Canada, and Australia. They accept payments in USD, GBP, EUR, AED, and PKR.' },
            ].map(({ q, a }) => (
              <div key={q} className="pt-4 first:pt-0">
                <h3 className="font-bold text-white text-sm mb-1.5">{q}</h3>
                <p className="faq-answer text-xs text-slate-300 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
