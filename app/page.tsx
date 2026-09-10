import type { Metadata } from 'next'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// ─── Company & Contact Constants ──────────────────────────────────────────────
const SITE_URL = 'https://samstack.tech'
const COMPANY_NAME = 'SAMStack'
const OFFICIAL_EMAIL = 'samstacktechs@gmail.com'
const OFFICIAL_PHONE = '+923285778715'
const FORMATTED_PHONE = '+92 328 5778715'
const WHATSAPP_URL = `https://wa.me/923285778715?text=${encodeURIComponent('Hello SAMStack, I would like to inquire about your software and data services.')}`

// ─── Full SEO Metadata (On-page, Technical, Local, International) ─────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'SAMStack | Web Development, Mobile Apps & Data Science — Lahore, Pakistan',
  description:
    'SAMStack delivers world-class web development, mobile apps, data science, data analytics, and scalable backend solutions from Lahore, Pakistan. Founded & led by Suleman Zaheer (Full Stack & Writer), with Syed Abdullah (Team Lead & Backend) and Saqib Javed (Frontend & UI/UX). Call +92 328 5778715 or email samstacktechs@gmail.com.',
  keywords: [
    // Core Brand & Team
    'SAMStack', 'samstack.tech', 'SAMStack Lahore', 'SAMStack Pakistan',
    'Suleman Zaheer', 'Suleman Zaheer developer', 'Suleman Zaheer writer',
    'Syed Abdullah', 'Syed Abdullah backend', 'Syed Abdullah team lead',
    'Saqib Javed', 'Saqib Javed frontend', 'Saqib Javed UI UX',
    // Data Science & Analytics
    'data science lahore', 'data analytics lahore', 'data science pakistan',
    'data analyst lahore', 'machine learning lahore', 'AI development pakistan',
    'predictive modeling pakistan', 'data engineering lahore', 'business intelligence pakistan',
    'Python data science lahore', 'pandas numpy scikit learn developer pakistan',
    // Web Development
    'web development lahore', 'website development lahore', 'web design lahore',
    'website development pakistan', 'custom website lahore', 'Next.js developer lahore',
    'React developer lahore', 'React developer pakistan', 'full stack developer lahore',
    'full stack developer pakistan', 'frontend developer lahore', 'UI UX designer lahore',
    // Backend & APIs
    'backend developer lahore', 'backend development pakistan', 'Node.js developer lahore',
    'Python developer lahore', 'FastAPI developer pakistan', 'API development lahore',
    'microservices developer lahore', 'database design lahore', 'PostgreSQL developer pakistan',
    // Mobile Apps
    'mobile app development lahore', 'mobile app development pakistan',
    'React Native developer pakistan', 'Flutter developer lahore', 'iOS app lahore',
    'Android app development pakistan',
    // Software & Enterprise
    'custom software development lahore', 'software development company lahore',
    'software house lahore', 'IT company lahore', 'tech company lahore',
    'software solutions pakistan', 'enterprise software lahore', 'tech consultancy lahore',
    // Technical Writing & Content
    'technical writer pakistan', 'technical writing lahore', 'documentation specialist pakistan',
    'API documentation writer lahore', 'tech content writer pakistan',
    // Local / Regional SEO
    'best software company in lahore', 'top web developers in lahore', 'hire developers lahore',
    'software house in gulberg lahore', 'software house in dha lahore', 'affordable software house pakistan',
    'hire offshore developers pakistan', 'remote developers pakistan',
  ],
  authors: [
    { name: 'Suleman Zaheer', url: SITE_URL },
    { name: 'Syed Abdullah', url: SITE_URL },
    { name: 'Saqib Javed', url: SITE_URL },
  ],
  creator: 'Suleman Zaheer',
  publisher: COMPANY_NAME,
  category: 'Technology',
  classification: 'Software Development & Data Science Company',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'en-US': SITE_URL, 'en-PK': SITE_URL },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: COMPANY_NAME,
    title: 'SAMStack | Web Development, Data Science & Software Solutions — Lahore, Pakistan',
    description:
      'Professional web development, mobile apps, data science & custom software by Suleman Zaheer, Syed Abdullah & Saqib Javed. Based in Lahore, Pakistan, serving clients globally.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SAMStack — Software Development & Data Science Company in Lahore, Pakistan',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SAMStackTech',
    creator: '@SulamanZaheer',
    title: 'SAMStack | Web Dev, Data Science & Software — Lahore, Pakistan',
    description:
      'World-class digital engineering from Lahore, Pakistan. Web, Mobile, Data Science & Backend Architecture. Call +92 328 5778715.',
    images: [`${SITE_URL}/og-image.png`],
  },
  // Geo / Local SEO Meta Tags
  other: {
    'geo.region': 'PK-PB',
    'geo.placename': 'Lahore, Punjab, Pakistan',
    'geo.position': '31.5204;74.3587',
    'ICBM': '31.5204, 74.3587',
    'telephone': OFFICIAL_PHONE,
    'email': OFFICIAL_EMAIL,
    'language': 'English',
    'revisit-after': '7 days',
    'rating': 'General',
    'distribution': 'Global',
    'coverage': 'Pakistan, Worldwide',
    'target': 'all',
    'HandheldFriendly': 'True',
    'MobileOptimized': '320',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

// ─── Comprehensive JSON-LD Schema Markup (SEO, AEO, GEO) ─────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // 1. Organization
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: COMPANY_NAME,
      legalName: 'SAMStack Technologies',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 200,
        height: 60,
      },
      description:
        'SAMStack is a technology and data science company based in Lahore, Pakistan. We specialize in web development, mobile apps, data science & analytics, scalable backend architecture, and technical writing.',
      foundingDate: '2023',
      founders: [{ '@id': `${SITE_URL}/#person-suleman-zaheer` }],
      employee: [
        { '@id': `${SITE_URL}/#person-suleman-zaheer` },
        { '@id': `${SITE_URL}/#person-syed-abdullah` },
        { '@id': `${SITE_URL}/#person-saqib-javed` },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Lahore',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
        postalCode: '54000',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: OFFICIAL_PHONE,
          contactType: 'Sales and Technical Consultation',
          email: OFFICIAL_EMAIL,
          areaServed: ['PK', 'US', 'GB', 'CA', 'AU', 'AE', 'SA'],
          availableLanguage: ['English', 'Urdu'],
        },
      ],
      sameAs: [
        'https://github.com/samstack',
        'https://linkedin.com/company/samstack',
        'https://twitter.com/SAMStackTech',
      ],
      knowsAbout: [
        'Web Development', 'Mobile App Development', 'Data Science',
        'Data Analytics', 'Backend Architecture', 'Full Stack Development',
        'Machine Learning', 'API Development', 'Technical Writing',
        'Database Optimization', 'UI/UX Design', 'Next.js', 'Python',
      ],
    },

    // 2. Person — Suleman Zaheer (Founder & CEO, Backend & Full Stack, Writer)
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person-suleman-zaheer`,
      name: 'Suleman Zaheer',
      givenName: 'Suleman',
      familyName: 'Zaheer',
      jobTitle: 'Founder, CEO, Backend & Full Stack Developer, Technical Writer',
      image: `${SITE_URL}/suleman.png`,
      description:
        'Suleman Zaheer is the founder of SAMStack, a backend & full-stack software engineer and technical writer based in Lahore, Pakistan. He specializes in scalable web architecture, database design, data science pipelines, and technical documentation.',
      url: SITE_URL,
      email: OFFICIAL_EMAIL,
      telephone: OFFICIAL_PHONE,
      worksFor: { '@id': `${SITE_URL}/#organization` },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
      },
      knowsAbout: [
        'Backend Development', 'Full Stack Architecture', 'Next.js', 'Node.js',
        'Python', 'Data Science', 'Data Analytics', 'Technical Writing',
        'PostgreSQL', 'Supabase', 'API Design', 'System Scalability',
      ],
      sameAs: [
        'https://github.com/sulemanzaheer',
        'https://linkedin.com/in/sulemanzaheer',
      ],
    },

    // 3. Person — Syed Abdullah (Team Lead & Backend Developer)
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person-syed-abdullah`,
      name: 'Syed Abdullah',
      givenName: 'Syed',
      familyName: 'Abdullah',
      jobTitle: 'Team Lead & Backend Developer',
      image: `${SITE_URL}/abdullah.png`,
      description:
        'Syed Abdullah is the Team Lead and Senior Backend Developer at SAMStack in Lahore, Pakistan. He leads core server-side engineering, microservices, high-throughput REST & GraphQL APIs, database architecture, and performance optimization.',
      url: SITE_URL,
      email: OFFICIAL_EMAIL,
      worksFor: { '@id': `${SITE_URL}/#organization` },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
      },
      knowsAbout: [
        'Backend Architecture', 'Distributed Systems', 'Team Leadership',
        'Node.js', 'Python', 'FastAPI', 'Microservices', 'PostgreSQL',
        'Redis', 'API Security', 'Server Optimization',
      ],
    },

    // 4. Person — Saqib Javed (Frontend Developer & UI/UX Designer)
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person-saqib-javed`,
      name: 'Saqib Javed',
      givenName: 'Saqib',
      familyName: 'Javed',
      jobTitle: 'Frontend Developer & UI/UX Designer',
      image: `${SITE_URL}/saqib.png`,
      description:
        'Saqib Javed is the Frontend Developer and UI/UX Designer at SAMStack in Lahore, Pakistan. He crafts pixel-perfect, responsive web interfaces, modern design systems, micro-interactions, and accessible frontends using React, Next.js, and TailwindCSS.',
      url: SITE_URL,
      email: OFFICIAL_EMAIL,
      worksFor: { '@id': `${SITE_URL}/#organization` },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
      },
      knowsAbout: [
        'Frontend Development', 'UI/UX Design', 'Next.js', 'React',
        'TailwindCSS', 'Figma', 'Design Systems', 'Responsive Web Design',
        'Web Performance', 'Micro-Interactions',
      ],
    },

    // 5. LocalBusiness (GEO & Local SEO for Lahore & Pakistan)
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: COMPANY_NAME,
      image: `${SITE_URL}/og-image.png`,
      url: SITE_URL,
      telephone: OFFICIAL_PHONE,
      email: OFFICIAL_EMAIL,
      priceRange: '$$',
      description:
        'Premier software house and data science company in Lahore, Pakistan. Founded by Suleman Zaheer. Offering web development, mobile apps, data science & analytics, and custom software.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Lahore, Punjab',
        addressLocality: 'Lahore',
        addressRegion: 'Punjab',
        postalCode: '54000',
        addressCountry: 'PK',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 31.5204,
        longitude: 74.3587,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
      areaServed: [
        { '@type': 'City', name: 'Lahore' },
        { '@type': 'City', name: 'Karachi' },
        { '@type': 'City', name: 'Islamabad' },
        { '@type': 'City', name: 'Rawalpindi' },
        { '@type': 'City', name: 'Faisalabad' },
        { '@type': 'Country', name: 'Pakistan' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Canada' },
        { '@type': 'Country', name: 'Australia' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SAMStack Core Engineering Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development', description: 'Custom full-stack web applications built with Next.js, React, and TypeScript.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development', description: 'Cross-platform iOS and Android mobile apps using React Native and Flutter.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data Science & Analytics', description: 'Machine learning, predictive models, business intelligence, and Python data pipelines.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Backend Engineering & APIs', description: 'Scalable backend architectures, REST/GraphQL microservices, and high-concurrency databases.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design', description: 'Modern user experience design, Figma prototypes, responsive interfaces, and interaction design.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Technical Writing', description: 'Professional software documentation, API documentation, developer guides, and tech content.' } },
        ],
      },
    },

    // 6. WebSite Schema with SearchAction
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: COMPANY_NAME,
      description: 'Web development, mobile apps, data science, and custom software from Lahore, Pakistan.',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },

    // 7. FAQPage (AEO — Answer Engine Optimization for Google AI, Perplexity, ChatGPT)
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What services does SAMStack offer in Lahore and globally?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SAMStack provides end-to-end technology solutions: custom web development (Next.js, React), mobile app development (iOS & Android), data science and data analytics (Python, Machine Learning, Business Intelligence), scalable backend systems (Node.js, Python, PostgreSQL), UI/UX design, and technical writing. We serve clients in Lahore, across Pakistan, and internationally.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who runs SAMStack and who are the key team members?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SAMStack is founded and led by Suleman Zaheer, a backend and full-stack developer and technical writer based in Lahore. The core leadership team includes Syed Abdullah as Team Lead and Senior Backend Developer, and Saqib Javed as Frontend Developer and UI/UX Designer.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are SAMStack’s contact details and phone number?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact SAMStack by phone or WhatsApp at +92 328 5778715 (+923285778715) or by email at samstacktechs@gmail.com. We are located in Lahore, Punjab, Pakistan and respond promptly to inquiries.',
          },
        },
        {
          '@type': 'Question',
          name: 'What data science and data analytics capabilities does SAMStack have?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SAMStack builds automated data pipelines, predictive machine learning models, customer segmentation systems, interactive BI dashboards, and custom analytics tools using Python, Pandas, Scikit-learn, TensorFlow, and cloud database architectures.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does SAMStack work with international clients outside Pakistan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. A large portion of SAMStack’s portfolio serves international clients across the United States, United Kingdom, Canada, Australia, and the Middle East (UAE & Saudi Arabia). We deliver silicon-valley caliber code quality with high cost-efficiency.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I get a quote or start a project with SAMStack?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can email us directly at samstacktechs@gmail.com or message/call us on WhatsApp at +92 328 5778715. We offer a free technical discovery call and a comprehensive proposal with timeline and transparent pricing.',
          },
        },
      ],
    },
  ],
}

// ─── Data Arrays ──────────────────────────────────────────────────────────────
const services = [
  {
    icon: '🌐',
    title: 'Web Development',
    desc: 'High-performance web apps built with Next.js, React, and TypeScript. Blazing fast load times, SEO-optimized architecture, and responsive layouts.',
    tags: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
    gradient: 'from-blue-600/20 via-indigo-600/20 to-transparent',
    border: 'border-blue-500/20',
    accent: '#3b82f6',
  },
  {
    icon: '📱',
    title: 'Mobile App Development',
    desc: 'Cross-platform iOS and Android applications with React Native and Flutter. Native speed, offline capabilities, and intuitive touch UX.',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    gradient: 'from-purple-600/20 via-pink-600/20 to-transparent',
    border: 'border-purple-500/20',
    accent: '#a855f7',
  },
  {
    icon: '📊',
    title: 'Data Science & Analytics',
    desc: 'Turn raw datasets into strategic advantage. Predictive ML models, data extraction, automated ETL pipelines, and executive BI dashboards.',
    tags: ['Python', 'Pandas', 'ML / AI', 'Power BI'],
    gradient: 'from-emerald-600/20 via-teal-600/20 to-transparent',
    border: 'border-emerald-500/20',
    accent: '#10b981',
  },
  {
    icon: '⚙️',
    title: 'Backend & Microservices',
    desc: 'Mission-critical server architectures, RESTful and GraphQL APIs built to handle massive concurrency with rock-solid security.',
    tags: ['Node.js', 'Python', 'PostgreSQL', 'FastAPI'],
    gradient: 'from-amber-600/20 via-orange-600/20 to-transparent',
    border: 'border-amber-500/20',
    accent: '#f59e0b',
  },
  {
    icon: '🎨',
    title: 'UI/UX & Product Design',
    desc: 'User-centric interface design, clickable Figma prototypes, and complete design systems that turn visitors into loyal customers.',
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Wireframes'],
    gradient: 'from-rose-600/20 via-red-600/20 to-transparent',
    border: 'border-rose-500/20',
    accent: '#f43f5e',
  },
  {
    icon: '🧠',
    title: 'AI & Custom LLM Solutions',
    desc: 'AI-driven automation, LangChain workflows, OpenAI & custom LLM integrations, retrieval-augmented generation (RAG), and intelligent bots.',
    tags: ['OpenAI', 'RAG', 'LangChain', 'Automation'],
    gradient: 'from-violet-600/20 via-indigo-600/20 to-transparent',
    border: 'border-violet-500/20',
    accent: '#8b5cf6',
  },
  {
    icon: '🛒',
    title: 'E-Commerce Platforms',
    desc: 'High-converting custom stores and Shopify implementations with payment gateways, inventory sync, and localized checkout.',
    tags: ['Custom E-Com', 'Shopify', 'Stripe', 'PayFast'],
    gradient: 'from-cyan-600/20 via-blue-600/20 to-transparent',
    border: 'border-cyan-500/20',
    accent: '#06b6d4',
  },
  {
    icon: '✍️',
    title: 'Technical Writing & Docs',
    desc: 'Clear developer documentation, API references, architecture guides, and in-depth technical blogs that establish brand authority.',
    tags: ['API Docs', 'Tech Blogs', 'Dev Guides', 'Markdown'],
    gradient: 'from-slate-600/20 via-zinc-600/20 to-transparent',
    border: 'border-slate-500/20',
    accent: '#94a3b8',
  },
]

const teamMembers = [
  {
    name: 'Suleman Zaheer',
    role: 'Founder & CEO',
    title: 'Backend & Full Stack Developer · Technical Writer',
    initials: 'SZ',
    image: '/suleman.png',
    badgeColor: 'from-blue-600 to-indigo-600',
    avatarBorder: 'border-blue-500/40',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    bio: 'Leads SAMStack’s technological vision and client architecture. Deep specialization in full-stack engineering, high-throughput backend systems, data science pipelines, and clear technical communication.',
    skills: ['Next.js', 'Node.js', 'Python', 'PostgreSQL', 'Data Science', 'Tech Writing', 'System Design'],
  },
  {
    name: 'Syed Abdullah',
    role: 'Team Lead',
    title: 'Senior Backend Developer & Distributed Systems',
    initials: 'SA',
    image: '/abdullah.png',
    badgeColor: 'from-emerald-600 to-teal-600',
    avatarBorder: 'border-emerald-500/40',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bio: 'Oversees engineering delivery, microservices design, and database resilience. Specializes in building bulletproof server architectures, REST & GraphQL APIs, and high-performance cloud pipelines.',
    skills: ['Node.js', 'Python', 'FastAPI', 'Microservices', 'PostgreSQL', 'Redis', 'API Security'],
  },
  {
    name: 'Saqib Javed',
    role: 'Frontend & UI/UX Lead',
    title: 'Frontend Developer & UI/UX Designer',
    initials: 'SJ',
    image: '/saqib.png',
    badgeColor: 'from-purple-600 to-pink-600',
    avatarBorder: 'border-purple-500/40',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    bio: 'Crafts visually stunning, intuitive user interfaces and modern design systems. Expert in turning complex user requirements into elegant, high-conversion frontends using React and Next.js.',
    skills: ['React', 'Next.js', 'TailwindCSS', 'Figma', 'UI/UX Design', 'Design Systems', 'Micro-Animations'],
  },
]

const techStack = [
  'Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'Python', 'FastAPI',
  'PostgreSQL', 'Supabase', 'MongoDB', 'Redis', 'TailwindCSS', 'React Native',
  'Flutter', 'TensorFlow', 'Pandas', 'Docker', 'AWS', 'Vercel', 'GraphQL',
  'REST APIs', 'Git', 'Figma',
]

const faqs = [
  {
    q: 'What makes SAMStack different from other agencies in Lahore and Pakistan?',
    a: 'SAMStack is founded and operated directly by active senior engineers — Suleman Zaheer, Syed Abdullah, and Saqib Javed. You communicate directly with the technical leads who build your product. We adhere to strict international coding standards, automated tests, and world-class UX while offering competitive Pakistan-based pricing.',
  },
  {
    q: 'Can SAMStack build end-to-end data analytics and data science pipelines?',
    a: 'Yes. We specialize in building automated ETL pipelines, predictive machine learning models, customer intelligence dashboards, and business data analytics using Python, Pandas, and modern cloud databases.',
  },
  {
    q: 'How do I get in touch with the team or schedule a consultation?',
    a: `You can reach out directly via call or WhatsApp at ${FORMATTED_PHONE} (${OFFICIAL_PHONE}) or email us at ${OFFICIAL_EMAIL}. We respond within hours and provide a free, no-obligation technical consultation.`,
  },
  {
    q: 'Do you work with international clients across the US, UK, and Middle East?',
    a: 'Yes, SAMStack works regularly with businesses and startups in North America, Europe, Australia, and the GCC. We work with flexible time zones and provide transparent milestone-based delivery.',
  },
  {
    q: 'What is the pricing for web development and software in Lahore?',
    a: 'We offer flexible engagement models: fixed-price for defined MVPs, and dedicated monthly retainers for ongoing development. Contact us with your project details for an accurate, upfront quote.',
  },
  {
    q: 'Do you provide full source code ownership and technical documentation?',
    a: '100% yes. Upon project completion, you retain complete intellectual property and source code ownership, accompanied by comprehensive technical documentation written to developer-grade standards.',
  },
]

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '3+', label: 'Years Experience' },
  { value: '15+', label: 'Tech Stacks' },
]

// ─── Homepage Component ───────────────────────────────────────────────────────
export default async function HomePage() {
  // Auth check — redirect logged-in users to their workspace
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const adminSupabase = createAdminClient()
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role, status, onboarding_completed')
        .eq('auth_user_id', user.id)
        .single()

      if (profile) {
        if (profile.status === 'pending') redirect('/pending-approval')
        if (profile.status === 'inactive' || profile.status === 'suspended') redirect('/login')
        if (!profile.onboarding_completed) redirect('/onboarding')
        if (['admin', 'super_admin'].includes(profile.role)) redirect('/admin/dashboard')
        redirect('/dashboard')
      }
    }
  } catch {
    // unauthenticated — render public homepage
  }

  return (
    <>
      {/* JSON-LD Structured Data for Google / Bing / Perplexity / AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#060b17] text-slate-100 selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans">
        {/* ─── STICKY HEADER / NAV ──────────────────────────────────────── */}
        <header
          role="banner"
          className="sticky top-0 z-50 bg-[#060b17]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all"
        >
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
          >
            {/* Brand Logo */}
            <a
              href="/"
              aria-label="SAMStack Technologies — Home"
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <span className="text-white text-lg font-black tracking-tighter">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                  SAM<span className="text-blue-500">Stack</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Technologies
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
              <a href="#services" className="hover:text-blue-400 transition-colors">Services</a>
              <a href="#team" className="hover:text-blue-400 transition-colors">Team</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#tech" className="hover:text-blue-400 transition-colors">Tech Stack</a>
              <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>

            {/* Direct Contact Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Direct Phone Call Button */}
              <a
                href={`tel:${OFFICIAL_PHONE}`}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
                title="Call SAMStack"
              >
                <span>📞</span>
                <span>{FORMATTED_PHONE}</span>
              </a>

              {/* WhatsApp Quick Button */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all"
                title="Chat on WhatsApp"
              >
                <span>💬</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Portal Login */}
              <Link
                href="/login"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </header>

        {/* ─── HERO SECTION ──────────────────────────────────────────────── */}
        <section
          role="main"
          aria-labelledby="hero-heading"
          className="relative pt-20 pb-28 md:pt-28 md:pb-36 text-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-purple-600/15 blur-[120px] pointer-events-none -z-10" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          <div className="max-w-4xl mx-auto">
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lahore, Pakistan &bull; Worldwide Software &amp; Data Studio</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6"
            >
              Transforming Ideas Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                High-Performance Digital Products
              </span>
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              <strong className="text-white font-semibold">SAMStack</strong> is Lahore’s premier digital engineering powerhouse. Founded by <strong className="text-blue-400 font-semibold">Suleman Zaheer</strong> with team leaders <strong className="text-slate-200 font-semibold">Syed Abdullah</strong> and <strong className="text-slate-200 font-semibold">Saqib Javed</strong> — delivering world-class Web Apps, Mobile Platforms, Data Science &amp; Scalable Cloud Backends.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>💬</span> Chat on WhatsApp
              </a>

              <a
                href={`tel:${OFFICIAL_PHONE}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>📞</span> Call: {FORMATTED_PHONE}
              </a>

              <a
                href={`mailto:${OFFICIAL_EMAIL}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all transform hover:-translate-y-0.5"
              >
                <span>✉️</span> {OFFICIAL_EMAIL}
              </a>
            </div>

            {/* Trust Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="p-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SERVICES SECTION ──────────────────────────────────────────── */}
        <section
          id="services"
          aria-labelledby="services-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/80"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase">
                End-To-End Capabilities
              </span>
              <h2
                id="services-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2 mb-4"
              >
                Comprehensive Software &amp; Data Services
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you need a full data analytics pipeline, an enterprise web application, a modern mobile app, or developer documentation — our engineering team delivers precision at every step.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <article
                  key={service.title}
                  className={`relative p-6 rounded-2xl bg-gradient-to-b ${service.gradient} bg-slate-900/80 border ${service.border} backdrop-blur-sm hover:border-slate-600 transition-all group flex flex-col justify-between`}
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <h3
                      itemProp="name"
                      className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors"
                    >
                      {service.title}
                    </h3>
                    <p
                      itemProp="description"
                      className="text-xs text-slate-300 leading-relaxed mb-4"
                    >
                      {service.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LEADERSHIP & ENGINEERING TEAM SECTION ─────────────────────── */}
        <section
          id="team"
          aria-labelledby="team-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 relative"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase">
                The Minds Behind SAMStack
              </span>
              <h2
                id="team-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-2 mb-4"
              >
                Meet Our Leadership &amp; Engineering Team
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                World-class products are built by passionate specialists. Meet the engineers driving SAMStack’s architecture, systems, and interfaces from Lahore, Pakistan.
              </p>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-7 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl shadow-black/20"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <div>
                    {/* Header: Photo Avatar + Role */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-slate-700/80 flex-shrink-0 bg-slate-800 ring-2 ring-blue-500/20">
                        <img
                          src={member.image}
                          alt={`${member.name} — ${member.title} at SAMStack`}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                          {member.role}
                        </span>
                        <h3 itemProp="name" className="text-xl font-black text-white mt-1">
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p
                      itemProp="jobTitle"
                      className="text-xs font-semibold text-slate-300 mb-3 leading-snug"
                    >
                      {member.title}
                    </p>

                    {/* Bio */}
                    <p
                      itemProp="description"
                      className="text-xs text-slate-400 leading-relaxed mb-6"
                    >
                      {member.bio}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Core Expertise
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-md border ${member.tagColor}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ABOUT FOUNDER / SULEMAN ZAHEER DETAIL ─────────────────────── */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-y border-slate-800/80"
          itemScope
          itemType="https://schema.org/Person"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column — Founder Overview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/70 p-8 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-28 h-28 rounded-3xl overflow-hidden mx-auto shadow-2xl shadow-blue-500/30 mb-5 border-2 border-blue-500/40 bg-slate-800 ring-4 ring-blue-500/10">
                  <img
                    src="/suleman.png"
                    alt="Suleman Zaheer — Founder & CEO of SAMStack"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <h3 itemProp="name" className="text-2xl font-black text-white">
                  Suleman Zaheer
                </h3>
                <p itemProp="jobTitle" className="text-xs text-blue-400 font-semibold mt-1 mb-4">
                  Founder &amp; CEO · Backend &amp; Full Stack Developer · Technical Writer
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300 mb-6">
                  <span>📍</span> Lahore, Punjab, Pakistan
                </div>

                <p className="text-xs text-slate-400 leading-relaxed text-left mb-6">
                  Spearheading engineering at SAMStack with a strong focus on high-reliability backend systems, microservices, advanced data analytics, and developer-centric technical writing.
                </p>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={`tel:${OFFICIAL_PHONE}`}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>📞</span> Call: {FORMATTED_PHONE}
                  </a>
                  <a
                    href={`mailto:${OFFICIAL_EMAIL}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span>✉️</span> {OFFICIAL_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column — Narrative & Value Pillars */}
            <div className="lg:col-span-7">
              <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase">
                Founder&apos;s Vision
              </span>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 mb-6"
              >
                Engineering Excellence With Global Standards
              </h2>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>
                  At <strong className="text-white">SAMStack</strong>, we believe software should be built with rigorous engineering standards, clean architecture, and total transparency. Founded in Lahore, Pakistan by <strong className="text-blue-400">Suleman Zaheer</strong>, our mission is to empower both local Pakistani businesses and global startups with enterprise-grade web development, data science, and custom software.
                </p>
                <p>
                  Backed by Team Lead <strong className="text-white">Syed Abdullah</strong> managing high-concurrency backend services and <strong className="text-white">Saqib Javed</strong> delivering pixel-perfect UI/UX frontends, we take full pride in our engineering craft. Every line of code is structured, tested, and documented.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-blue-400 font-bold text-sm mb-1">🏗️ Robust Backend Systems</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Scalable Node.js, Python, PostgreSQL, and Supabase data layers engineered for high uptime.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-emerald-400 font-bold text-sm mb-1">📊 Data Science &amp; Insights</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Data mining, predictive algorithms, automated ETL workflows, and executive analytics.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-purple-400 font-bold text-sm mb-1">🎨 Modern UI/UX Experience</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Interactive Next.js &amp; React user interfaces that maximize customer engagement and conversions.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-amber-400 font-bold text-sm mb-1">✍️ Technical Documentation</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Clear API specs, deployment guides, and knowledge bases for effortless team onboarding.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TECH STACK SECTION ────────────────────────────────────────── */}
        <section
          id="tech"
          aria-labelledby="tech-heading"
          className="py-20 px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase">
              Technology Ecosystem
            </span>
            <h2
              id="tech-heading"
              className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 mb-4"
            >
              Modern, Battle-Tested Stacks
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
              We choose modern, high-performance tools that guarantee speed, developer ergonomics, and scalability.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-bold hover:border-blue-500/50 hover:text-blue-400 hover:scale-105 transition-all cursor-default shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ SECTION (AEO / Answer Engine Optimization) ────────────── */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/80"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase">
                Frequently Asked Questions
              </span>
              <h2
                id="faq-heading"
                className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 mb-4"
              >
                Clear Answers to Common Questions
              </h2>
              <p className="text-slate-400 text-sm">
                Everything you need to know about working with SAMStack in Lahore and across the globe.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3
                    itemProp="name"
                    className="text-base font-bold text-white mb-2 tracking-tight"
                  >
                    {faq.q}
                  </h3>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p
                      itemProp="text"
                      className="text-xs sm:text-sm text-slate-400 leading-relaxed"
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT & CTA BANNER ──────────────────────────────────────── */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-indigo-600/10 to-transparent pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-xs font-extrabold text-emerald-400 tracking-widest uppercase mb-2 inline-block">
              Get In Touch Today
            </span>
            <h2
              id="contact-heading"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight"
            >
              Ready to Build Something Remarkable?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Contact our leadership team directly. We provide a detailed technical discovery and proposal with transparent milestones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
              {/* Phone Card */}
              <a
                href={`tel:${OFFICIAL_PHONE}`}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all text-center group"
              >
                <div className="text-2xl mb-2">📞</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Direct Phone</div>
                <div className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors">
                  {FORMATTED_PHONE}
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-center group"
              >
                <div className="text-2xl mb-2">💬</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Chat</div>
                <div className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                  Chat Instantly
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${OFFICIAL_EMAIL}`}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all text-center group"
              >
                <div className="text-2xl mb-2">✉️</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official Email</div>
                <div className="text-xs font-extrabold text-white group-hover:text-indigo-400 transition-colors break-all">
                  {OFFICIAL_EMAIL}
                </div>
              </a>
            </div>

            {/* Employee Portal Link */}
            <div className="text-xs text-slate-500">
              Are you an authorized team member?{' '}
              <Link href="/login" className="text-blue-400 hover:underline font-semibold">
                Access Employee Workspace &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ────────────────────────────────────────────────────── */}
        <footer
          role="contentinfo"
          className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-[#040812] border-t border-slate-800/80 text-xs text-slate-400"
          itemScope
          itemType="https://schema.org/WPFooter"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
              {/* Brand & Address */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
                    S
                  </div>
                  <span className="font-black text-base text-white tracking-tight">
                    SAM<span className="text-blue-500">Stack</span> Technologies
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed max-w-sm mb-4">
                  World-class software development studio based in Lahore, Pakistan. Specializing in high-performance web applications, mobile apps, data science &amp; analytics, and scalable backend infrastructure.
                </p>
                <address
                  className="not-italic text-slate-400 space-y-1"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <div>
                    📍 <span itemProp="addressLocality">Lahore</span>,{' '}
                    <span itemProp="addressRegion">Punjab</span>,{' '}
                    <span itemProp="addressCountry">Pakistan</span> (54000)
                  </div>
                  <div>
                    📞 <a href={`tel:${OFFICIAL_PHONE}`} className="hover:text-blue-400">{FORMATTED_PHONE}</a>
                  </div>
                  <div>
                    ✉️ <a href={`mailto:${OFFICIAL_EMAIL}`} className="hover:text-blue-400">{OFFICIAL_EMAIL}</a>
                  </div>
                </address>
              </div>

              {/* Services Column */}
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                  Services
                </h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#services" className="hover:text-blue-400">Web Development</a></li>
                  <li><a href="#services" className="hover:text-blue-400">Mobile Apps</a></li>
                  <li><a href="#services" className="hover:text-blue-400">Data Science &amp; Analytics</a></li>
                  <li><a href="#services" className="hover:text-blue-400">Backend Engineering</a></li>
                  <li><a href="#services" className="hover:text-blue-400">UI/UX &amp; Product Design</a></li>
                  <li><a href="#services" className="hover:text-blue-400">Technical Writing</a></li>
                </ul>
              </div>

              {/* Team Column */}
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                  Leadership
                </h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <span className="text-white font-medium">Suleman Zaheer</span>
                    <span className="block text-[11px] text-slate-500">Founder &amp; CEO · Full Stack</span>
                  </li>
                  <li>
                    <span className="text-white font-medium">Syed Abdullah</span>
                    <span className="block text-[11px] text-slate-500">Team Lead &amp; Backend</span>
                  </li>
                  <li>
                    <span className="text-white font-medium">Saqib Javed</span>
                    <span className="block text-[11px] text-slate-500">Frontend &amp; UI/UX</span>
                  </li>
                </ul>
              </div>

              {/* Regions Served */}
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                  Coverage
                </h4>
                <ul className="space-y-2 text-slate-400">
                  <li>Lahore, PK</li>
                  <li>Karachi &amp; Islamabad</li>
                  <li>United States</li>
                  <li>United Kingdom</li>
                  <li>Canada &amp; Australia</li>
                  <li>Middle East / UAE</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
              <p>
                &copy; {new Date().getFullYear()} SAMStack Technologies. All rights reserved. Built with precision in Lahore, Pakistan.
              </p>
              <p>
                Run by <strong className="text-slate-300">Suleman Zaheer</strong> (Backend/Full Stack &amp; Writer), <strong className="text-slate-300">Syed Abdullah</strong> (Team Lead), &amp; <strong className="text-slate-300">Saqib Javed</strong> (Frontend/UI/UX).
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
