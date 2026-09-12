import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://samstack-crm.vercel.app'

export const metadata: Metadata = {
  title: 'Engineering Leadership & Team | SAMStack Technologies — Lahore, Pakistan',
  description:
    'Meet the core software engineering leads and founders of SAMStack Technologies in Lahore, Pakistan: Suleman Zaheer (Founder & CEO), Syed Abdullah (Team Lead & Backend), and Saqib Javed (Frontend & UI/UX Lead).',
  keywords: [
    'SAMStack team', 'SAMStack leadership', 'Suleman Zaheer', 'Syed Abdullah', 'Saqib Javed',
    'developers lahore', 'software engineers lahore', 'top web developers pakistan', 'tech founders lahore'
  ],
  alternates: {
    canonical: `${SITE_URL}/team`,
  },
  openGraph: {
    title: 'Engineering Leadership & Team | SAMStack Technologies',
    description:
      'Meet the core software engineering leads and founders of SAMStack Technologies in Lahore, Pakistan.',
    url: `${SITE_URL}/team`,
    siteName: 'SAMStack Technologies',
    images: [{ url: `${SITE_URL}/crm.png`, width: 1200, height: 630, alt: 'SAMStack Leadership Team' }],
    type: 'website',
  },
}

const teamMembers = [
  {
    name: 'Suleman Zaheer',
    slug: 'suleman-zaheer',
    role: 'Founder & CEO',
    title: 'Full Stack Engineer & Technical Writer',
    image: '/suleman.png',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    bio: 'Founder & CEO of SAMStack. Full-stack software engineer specializing in scalable Next.js systems, distributed Python backends, and developer-grade technical documentation.',
    skills: ['Next.js 16', 'Python', 'Node.js', 'PostgreSQL', 'System Architecture', 'Technical Writing'],
    location: 'Lahore, Pakistan',
  },
  {
    name: 'Syed Abdullah',
    slug: 'syed-abdullah',
    role: 'Team Lead',
    title: 'Senior Backend & Distributed Systems Developer',
    image: '/abdullah.png',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    bio: 'Engineering Team Lead at SAMStack. Specializes in building resilient microservices, high-throughput APIs, cloud infrastructure, and battle-tested databases.',
    skills: ['Node.js', 'FastAPI', 'Microservices', 'PostgreSQL', 'Redis', 'Docker', 'Cloud Infrastructure'],
    location: 'Lahore, Pakistan',
  },
  {
    name: 'Saqib Javed',
    slug: 'saqib-javed',
    role: 'Frontend & UI/UX Lead',
    title: 'Frontend Developer & UI/UX Designer',
    image: '/saqib.png',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    bio: 'Frontend and UI/UX Lead at SAMStack. Expert in crafting conversion-focused user interfaces, responsive design systems, and fluid micro-animations in React & Next.js.',
    skills: ['React 19', 'Next.js 16', 'TailwindCSS', 'Figma', 'UI/UX Design', 'Design Systems'],
    location: 'Lahore, Pakistan',
  },
]

export default function TeamDirectoryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SAMStack Engineering Leadership & Team',
    url: `${SITE_URL}/team`,
    description: 'The leadership and core engineering specialists behind SAMStack Technologies in Lahore, Pakistan.',
    publisher: {
      '@type': 'Organization',
      name: 'SAMStack Technologies',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    hasPart: teamMembers.map((member) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      url: `${SITE_URL}/team/${member.slug}`,
      image: `${SITE_URL}${member.image}`,
      worksFor: {
        '@type': 'Organization',
        name: 'SAMStack Technologies',
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4">
            <span>👥</span> Core Leadership &amp; Engineering
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            The Minds Behind SAMStack
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            World-class software products are built by hands-on technical leaders. Meet the engineers driving SAMStack’s architecture, backend resilience, and design systems from Lahore, Pakistan.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member) => (
            <div
              key={member.slug}
              className="rounded-3xl bg-slate-900/60 border border-white/10 p-7 flex flex-col justify-between hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group backdrop-blur-md"
            >
              <div>
                {/* Photo & Role */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-white/15 bg-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <img
                      src={member.image}
                      alt={`${member.name} — ${member.role} at SAMStack`}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${member.badgeColor}`}>
                      {member.role}
                    </span>
                    <h2 className="text-xl font-black text-white mt-1 group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h2>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      📍 {member.location}
                    </span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-xs font-semibold text-blue-300 mb-3">
                  {member.title}
                </p>

                {/* Bio */}
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Core Expertise
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Profile Link */}
              <Link
                href={`/team/${member.slug}`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all group-hover:translate-y-[-1px]"
              >
                <span>View Full Profile &amp; Bio</span>
                <span>&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
