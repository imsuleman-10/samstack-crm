/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SAMStack SEO Configuration — Single Source of Truth
 * All SEO, GEO, AEO, LLMO constants MUST be imported from here.
 * Never hardcode SITE_URL or contact info anywhere else.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Core Domain ───────────────────────────────────────────────────────────────
export const SITE_URL = 'https://samstack.tech'

// ── Company Entity ────────────────────────────────────────────────────────────
export const COMPANY = {
  name: 'SAMStack Technologies',
  legalName: 'SAMStack Technologies',
  alternateName: ['SAMStack', 'SAM Stack Tech', 'SAMStack Software Solutions Lahore', 'SAM Stack Pakistan'],
  description:
    'SAMStack Technologies is a premier software engineering studio based in Lahore, Pakistan. We build enterprise web applications, custom CRM systems, mobile apps, data science pipelines, and AI-powered automation tools for clients in Pakistan, the United States, the UK, the UAE, and Canada.',
  foundingDate: '2023',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-default.png`,
  email: 'samstacktechs@gmail.com',
  telephone: '+923285778715',
  telephoneFormatted: '+92 328 5778715',
  whatsapp: 'https://wa.me/923285778715',
  priceRange: '$$',
  currenciesAccepted: 'PKR, USD, GBP, EUR, AED',
  paymentAccepted: 'Bank Transfer',
} as const

// ── Address / GEO ─────────────────────────────────────────────────────────────
export const ADDRESS = {
  streetAddress: 'Johar Town',
  addressLocality: 'Lahore',
  addressRegion: 'Punjab',
  addressCountry: 'PK',
  addressCountryFull: 'Pakistan',
  postalCode: '54782',
  latitude: 31.5204,
  longitude: 74.3587,
} as const

// ── Social / Entity Proof (sameAs) ────────────────────────────────────────────
export const SAME_AS = [
  'https://github.com/imsuleman-10',
  'https://www.linkedin.com/company/samstacktechs',
  'https://samstack.tech',
  `https://wa.me/${COMPANY.telephone.replace('+', '')}`,
] as const

// ── Team Members ──────────────────────────────────────────────────────────────
export const TEAM = {
  suleman: {
    name: 'Suleman Zaheer',
    slug: 'suleman-zaheer',
    jobTitle: 'Founder & CEO',
    description:
      'Suleman Zaheer is a Pakistani Full Stack Software Engineer, Technical Writer, and the Founder & CEO of SAMStack Technologies based in Lahore, Pakistan. He leads engineering, system architecture, and client digital transformations for companies across Pakistan, the United States, the UK, and the Middle East.',
    image: `${SITE_URL}/suleman.png`,
    url: `${SITE_URL}/team/suleman-zaheer`,
    id: `${SITE_URL}/team/suleman-zaheer#person`,
    sameAs: [
      'https://github.com/imsuleman-10',
      'https://www.linkedin.com/in/suleman-zaheer',
    ],
    skills: [
      'Next.js 16', 'React 19', 'TypeScript', 'Node.js', 'Python', 'FastAPI',
      'PostgreSQL', 'Supabase', 'System Architecture', 'Technical Writing',
      'Developer Relations', 'Data Science', 'API Design', 'Microservices',
    ],
  },
  abdullah: {
    name: 'Syed Abdullah',
    slug: 'syed-abdullah',
    jobTitle: 'Engineering Team Lead & Backend Architect',
    description:
      'Syed Abdullah is the Engineering Team Lead and Senior Backend Developer at SAMStack Technologies in Lahore, Pakistan. He specializes in building resilient distributed systems, high-throughput RESTful APIs, microservices, and battle-tested database architectures.',
    image: `${SITE_URL}/abdullah.png`,
    url: `${SITE_URL}/team/syed-abdullah`,
    id: `${SITE_URL}/team/syed-abdullah#person`,
    sameAs: [
      'https://github.com/syed-abdullah',
    ],
    skills: [
      'Node.js', 'FastAPI', 'Python', 'Microservices', 'PostgreSQL',
      'Redis', 'Docker', 'Cloud Infrastructure', 'System Design', 'REST APIs',
    ],
  },
  saqib: {
    name: 'Saqib Javed',
    slug: 'saqib-javed',
    jobTitle: 'Frontend Developer & UI/UX Design Lead',
    description:
      'Saqib Javed is the Frontend Developer and UI/UX Design Lead at SAMStack Technologies in Lahore, Pakistan. He crafts pixel-perfect, conversion-focused web interfaces using React 19, Next.js 16, TailwindCSS, and Figma design systems.',
    image: `${SITE_URL}/saqib.png`,
    url: `${SITE_URL}/team/saqib-javed`,
    id: `${SITE_URL}/team/saqib-javed#person`,
    sameAs: [
      'https://github.com/saqib-javed',
    ],
    skills: [
      'React 19', 'Next.js 16', 'TailwindCSS', 'Figma', 'TypeScript',
      'Design Systems', 'WCAG 2.1 AA', 'Micro-Animations', 'CSS Architecture', 'CRO',
    ],
  },
} as const

// ── Services Offered (for Service schema + AEO) ───────────────────────────────
export const SERVICES = [
  {
    name: 'Custom CRM Development',
    description:
      'We design and build bespoke Customer Relationship Management (CRM) platforms tailored to your business pipeline — featuring Kanban boards, AI-powered lead ingestion, multi-role dashboards, and real-time analytics. Delivered as a fast, mobile-first Next.js application.',
    serviceType: 'Software Development',
    keywords: ['custom crm lahore', 'crm development pakistan', 'crm software lahore', 'build crm pakistan'],
  },
  {
    name: 'Web Application Development',
    description:
      'Full-stack web application development with Next.js 16, React 19, TypeScript, and Supabase. We deliver performant, SEO-optimized, mobile-first web apps with sub-1s load times and 100/100 Lighthouse scores.',
    serviceType: 'Web Development',
    keywords: ['web development lahore', 'nextjs developer lahore', 'full stack developer pakistan', 'web app development pakistan'],
  },
  {
    name: 'Mobile App Development',
    description:
      'Cross-platform mobile application development for iOS and Android using React Native and Expo. We build consumer-grade apps, business tools, and data collection systems with offline-first capabilities.',
    serviceType: 'Mobile Development',
    keywords: ['mobile app development lahore', 'react native developer pakistan', 'ios android app lahore'],
  },
  {
    name: 'Data Science & Analytics',
    description:
      'End-to-end data science services including ETL pipelines, predictive modeling, business intelligence dashboards, and automated reporting. We use Python, Pandas, and modern BI tools to turn raw data into strategic business decisions.',
    serviceType: 'Data Science',
    keywords: ['data science lahore', 'data analytics pakistan', 'python data science lahore', 'business intelligence pakistan'],
  },
  {
    name: 'AI & Automation Solutions',
    description:
      'AI-powered automation workflows using Groq LLM integrations, intelligent document parsing, smart column mapping for Excel/CSV files, and custom AI assistants. We bring enterprise-grade AI to Pakistani businesses at accessible price points.',
    serviceType: 'Artificial Intelligence',
    keywords: ['ai development lahore', 'automation pakistan', 'llm integration lahore', 'ai solutions pakistan'],
  },
  {
    name: 'Backend API Architecture',
    description:
      'Scalable REST and GraphQL API design and development using Python FastAPI and Node.js. We deliver production-ready backends with Supabase/PostgreSQL, Row-Level Security, Redis caching, and full OpenAPI documentation.',
    serviceType: 'Backend Development',
    keywords: ['backend developer lahore', 'api development pakistan', 'fastapi developer pakistan', 'node.js developer lahore'],
  },
] as const

// ── SEO Keywords Master List ───────────────────────────────────────────────────
export const MASTER_KEYWORDS = [
  // Brand / Entity
  'SAMStack', 'SAMStack Technologies', 'SAM Stack Tech', 'SAMStack Pakistan',
  'SAMStack Lahore', 'SAMStack CRM',

  // People
  'Suleman Zaheer', 'Suleman Zaheer SAMStack', 'Suleman Zaheer Lahore',
  'Syed Abdullah SAMStack', 'Saqib Javed SAMStack',
  'who is Suleman Zaheer', 'who founded SAMStack',

  // Services
  'web development Lahore', 'web development Pakistan',
  'software development Lahore', 'software company Lahore',
  'custom CRM development Pakistan', 'CRM software Lahore',
  'mobile app development Lahore', 'React Native developer Pakistan',
  'data science Lahore', 'data analytics Pakistan',
  'AI automation Pakistan', 'Groq AI integration Pakistan',
  'backend developer Lahore', 'API development Pakistan',
  'Next.js developer Lahore', 'full stack developer Pakistan',
  'Python developer Lahore', 'FastAPI developer Pakistan',

  // Local / GEO
  'best software company Lahore', 'top developers Pakistan',
  'IT company Lahore', 'tech startup Lahore',
  'software studio Lahore', 'freelance developers Lahore',
  'Johar Town software company', 'Punjab Pakistan tech company',

  // Informational / AEO
  'hire full stack developer Pakistan',
  'best web developers in Lahore',
  'affordable software development Pakistan',
  'enterprise software Lahore',
  'digital transformation Pakistan',

  // International / Client-Facing
  'Pakistan software company for US clients',
  'offshore development team Pakistan',
  'remote developers Lahore Pakistan',
  'software outsourcing Pakistan',
] as const

// ── Opening Hours ─────────────────────────────────────────────────────────────
export const OPENING_HOURS = [
  { dayOfWeek: 'Monday', opens: '09:00', closes: '22:00' },
  { dayOfWeek: 'Tuesday', opens: '09:00', closes: '22:00' },
  { dayOfWeek: 'Wednesday', opens: '09:00', closes: '22:00' },
  { dayOfWeek: 'Thursday', opens: '09:00', closes: '22:00' },
  { dayOfWeek: 'Friday', opens: '09:00', closes: '18:00' },
  { dayOfWeek: 'Saturday', opens: '10:00', closes: '20:00' },
  { dayOfWeek: 'Sunday', opens: '11:00', closes: '17:00' },
] as const

// ── WhatsApp Presets ──────────────────────────────────────────────────────────
export const WA_MSG = {
  general: encodeURIComponent('Hello SAMStack! I would like to discuss a software project with your team.'),
  crm: encodeURIComponent('Hello SAMStack, I am interested in your Custom CRM Development services.'),
  web: encodeURIComponent('Hello SAMStack, I need a full-stack web application built for my business.'),
  data: encodeURIComponent('Hello SAMStack, I would like to discuss data science and analytics services.'),
  suleman: encodeURIComponent('Hello Suleman Zaheer, I am reaching out regarding SAMStack software and engineering consultation.'),
  abdullah: encodeURIComponent('Hello Syed Abdullah, I am reaching out regarding backend architecture consultation at SAMStack.'),
  saqib: encodeURIComponent('Hello SAMStack, I would like to connect with Saqib Javed regarding UI/UX and frontend development.'),
} as const
