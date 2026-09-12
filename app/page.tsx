import type { Metadata } from 'next'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LandingNavbar from '@/components/landing/LandingNavbar'

// ─── Company & Contact Constants ──────────────────────────────────────────────
const SITE_URL = 'https://samstack-crm.vercel.app'
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
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Enterprise Web Development', description: 'Custom full-stack web applications built with Next.js 16, React 19, and TypeScript with 100/100 Core Web Vitals.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cross-Platform Mobile App Development', description: 'Cross-platform iOS and Android mobile apps using React Native and Flutter with offline data sync.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data Science & Predictive Analytics', description: 'Machine learning, automated ETL pipelines, predictive customer models, and interactive BI dashboards.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'High-Throughput Backend & Microservices', description: 'Scalable backend architectures, REST/GraphQL microservices, and PostgreSQL with Row-Level Security.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Solutions & Custom LLM Workflows', description: 'Retrieval-Augmented Generation (RAG) with pgvector, OpenAI GPT-4o, and autonomous LangChain agents.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design & Design Systems', description: 'Modern user experience design, Figma clickable prototypes, WCAG 2.1 AA accessibility, and atomic design tokens.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Headless E-Commerce & Global Payments', description: 'High-conversion headless digital storefronts with Stripe, PayPal, PayFast, and localized checkouts.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Technical Writing & API Documentation', description: 'Production-grade software documentation, OpenAPI/Swagger references, developer guides, and architecture whitepapers.' } },
        ],
      },
    },

    // 6. Individual Schema.org Service Entities (GEO / AEO Standards for Google & AI Engines)
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-web-development`,
      name: 'Enterprise Web Development & Jamstack Architecture',
      serviceType: 'Full Stack Web Engineering',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'Enterprise-grade web application engineering utilizing Next.js 16 (App Router), React 19, TypeScript, and TailwindCSS. Engineered for Core Web Vitals (sub-second LCP), Server Components, Edge Middleware, strict security headers, and international SEO ranking from Lahore, Pakistan.',
      areaServed: [
        { '@type': 'Country', name: 'Pakistan' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Canada' },
        { '@type': 'Country', name: 'Australia' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Web Engineering Deliverables',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Next.js 16 App Router Architecture with Server Components' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '100/100 Core Web Vitals & LCP < 1.2s Optimization' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Edge Middleware Security, CSRF & Strict CSP Headers' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automated CI/CD Zero-Downtime Deployment on Vercel' } },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-data-science`,
      name: 'Data Science, Predictive Modeling & Business Intelligence',
      serviceType: 'AI, Machine Learning & Data Engineering',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'Comprehensive data science and business analytics pipelines engineered with Python, Pandas, Polars, Scikit-learn, and XGBoost in Lahore. We architect automated ETL/ELT pipelines, predictive customer churn models, and interactive executive BI dashboards.',
      areaServed: [
        { '@type': 'Country', name: 'Pakistan' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Canada' },
        { '@type': 'Country', name: 'Australia' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Data Science Deliverables',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automated ETL/ELT Cloud Data Pipelines' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Predictive ML Churn & Revenue Models' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interactive Executive Dashboards in Power BI / Studio' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Statistical Attribution & Anomaly Detection' } },
        ],
      },
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-backend-engineering`,
      name: 'High-Throughput Backend Engineering & Microservices',
      serviceType: 'Backend Architecture & Distributed Systems',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'Mission-critical server backends and microservices built with Node.js, Python FastAPI, PostgreSQL, and Supabase. Features PgBouncer connection pooling, Row-Level Security (RLS), distributed Redis caching, and OpenAPI specifications.',
      areaServed: [
        { '@type': 'Country', name: 'Pakistan' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'United Kingdom' },
        { '@type': 'Country', name: 'Canada' },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-mobile-apps`,
      name: 'Cross-Platform Mobile App Development',
      serviceType: 'iOS & Android Mobile Engineering',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'High-performance cross-platform mobile apps for iOS and Android developed with React Native and Flutter. Offline-first data sync with SQLite, push notifications, and store release compliance.',
      areaServed: [{ '@type': 'Country', name: 'Worldwide' }],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-ai-llm`,
      name: 'Enterprise AI & Custom LLM Agentic Workflows',
      serviceType: 'Generative AI & Autonomous Agent Systems',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'Custom AI copilots, Retrieval-Augmented Generation (RAG) with pgvector, and multi-agent LangChain/LangGraph pipelines with strict data privacy and zero-retention policies.',
      areaServed: [{ '@type': 'Country', name: 'Worldwide' }],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-ui-ux`,
      name: 'UI/UX Product Design & Enterprise Design Systems',
      serviceType: 'Interface Design & Conversion Rate Optimization',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'User-centric digital product design by Saqib Javed. Figma clickable prototypes, WCAG 2.1 AA accessibility, atomic design tokens, and CRO UX audits.',
      areaServed: [{ '@type': 'Country', name: 'Worldwide' }],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-ecommerce`,
      name: 'Headless E-Commerce & Global Payment Gateways',
      serviceType: 'Digital Commerce Infrastructure',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'High-converting headless Next.js online stores with Stripe, PayPal, PayFast payment gateway integrations, and real-time inventory synchronization.',
      areaServed: [{ '@type': 'Country', name: 'Worldwide' }],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-technical-writing`,
      name: 'Technical Writing, API Specs & Developer Relations',
      serviceType: 'Software Documentation & Developer Education',
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#services`,
      description:
        'Professional developer documentation, OpenAPI/Swagger references, architecture whitepapers, and high-ranking SEO technical blogs authored by Suleman Zaheer.',
      areaServed: [{ '@type': 'Country', name: 'Worldwide' }],
    },

    // 7. WebSite Schema with SearchAction
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

    // 8. FAQPage (AEO — Answer Engine Optimization for Google AI Overviews, Perplexity & Copilot)
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What services does SAMStack offer in Lahore and globally?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SAMStack provides end-to-end digital engineering: custom web development (Next.js 16, React 19), mobile app development (React Native, Flutter), data science and machine learning (Python, Pandas, Scikit-learn, Power BI), scalable backend architectures (Node.js, Python FastAPI, PostgreSQL, Supabase), Generative AI & RAG solutions, UI/UX design systems in Figma, and developer technical writing. We serve clients in Lahore, across Pakistan, and globally.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who runs SAMStack and who are the key team members?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SAMStack is founded and led by Suleman Zaheer, a backend & full-stack software engineer and technical writer based in Lahore. The core leadership team includes Syed Abdullah as Team Lead & Senior Backend Developer, and Saqib Javed as Frontend Developer & UI/UX Designer.',
          },
        },
        {
          '@type': 'Question',
          name: 'What web development technologies and standards does SAMStack specialize in?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SAMStack specializes in Next.js 16 (App Router), React 19, TypeScript, and TailwindCSS. Every build achieves 100/100 Core Web Vitals (sub-second LCP), Server Components (RSC), Edge Middleware security, international SEO optimization, and automated CI/CD deployments on Vercel.',
          },
        },
        {
          '@type': 'Question',
          name: 'What data science, machine learning, and analytics capabilities does SAMStack provide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SAMStack engineers automated cloud ETL/ELT pipelines, predictive machine learning models (churn, revenue forecasting, classification), customer segmentation systems, and interactive BI dashboards using Python, Pandas, Polars, Scikit-learn, XGBoost, and Power BI.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does SAMStack ensure backend security and database scalability?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our backend engineering utilizes PostgreSQL with connection pooling (PgBouncer), strict Row-Level Security (RLS), distributed Redis caching, and microservices in Node.js and Python FastAPI. We implement enterprise Role-Based Access Control (RBAC) and full audit logging.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does SAMStack work with international clients outside Pakistan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. A large portion of SAMStack’s portfolio serves international clients across the United States, United Kingdom, Canada, Australia, and the Middle East (UAE & Saudi Arabia). We deliver Silicon Valley caliber code quality with transparent milestones and high cost-efficiency.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are SAMStack’s contact details, phone number, and website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact SAMStack by phone or WhatsApp at +92 328 5778715 (+923285778715) or by email at samstacktechs@gmail.com. Our official platform is hosted at https://samstack-crm.vercel.app. We are based in Lahore, Punjab, Pakistan.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I get a quote or start a project with SAMStack?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can email us directly at samstacktechs@gmail.com or message/call us on WhatsApp at +92 328 5778715. We offer a free technical discovery consultation and provide a comprehensive proposal with timeline, architecture blueprints, and fixed-price milestones.',
          },
        },
      ],
    },
  ],
}

// ─── High-Level Services Data Array (International Standards) ─────────────────
const services = [
  {
    id: 'web-development',
    icon: '🌐',
    badge: 'Production Web Apps',
    metric: '⚡ 100/100 Lighthouse & Sub-1.2s LCP',
    accentBorder: 'border-t-blue-500',
    iconBg: 'from-blue-50 to-indigo-50 border-blue-100 text-blue-600',
    title: 'Enterprise Web Development & Jamstack',
    tagline: 'High-performance, SEO-dominant Next.js 16 & React web platforms engineered for maximum conversion.',
    desc: 'We engineer bespoke full-stack web applications utilizing Next.js 16 (App Router), React 19, TypeScript, and TailwindCSS. Engineered for Core Web Vitals (LCP < 1.2s, INP < 100ms), Edge Middleware routing, semantic HTML5 microdata, and international Google ranking.',
    deliverables: [
      'Next.js 16 App Router architecture with Server Components (RSC)',
      '100/100 Core Web Vitals, accessibility & performance tuning',
      'Edge Middleware routing, CSRF protection & strict security headers',
      'Automated Vercel / Cloudflare CI/CD zero-downtime deployment',
    ],
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'TailwindCSS', 'Server Components', 'Edge Runtime', 'GraphQL'],
  },
  {
    id: 'data-science',
    icon: '📊',
    badge: 'AI & Data Engineering',
    metric: '📈 10M+ Data Points / Automated ETL',
    accentBorder: 'border-t-emerald-500',
    iconBg: 'from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600',
    title: 'Data Science & Predictive Analytics',
    tagline: 'Transforming unstructured corporate datasets into automated ETL pipelines and predictive intelligence.',
    desc: 'Our Lahore-based data science team architects end-to-end data pipelines, predictive machine learning models, and automated business intelligence suites. We extract, clean, and analyze high-volume data streams using Python (Pandas, NumPy, Polars, DuckDB) and build classification, regression, and forecasting models with Scikit-learn and XGBoost.',
    deliverables: [
      'Automated ETL/ELT cloud data pipelines for scheduled extraction & warehousing',
      'Predictive ML classification, regression & customer churn models',
      'Interactive executive dashboards in Power BI, Supabase Studio & custom charts',
      'Statistical data cleansing, cohort analysis & automated KPI attribution',
    ],
    tags: ['Python', 'Pandas', 'Polars', 'Scikit-Learn', 'XGBoost', 'Power BI', 'DuckDB', 'ETL Pipelines'],
  },
  {
    id: 'backend-microservices',
    icon: '⚙️',
    badge: 'Distributed Systems',
    metric: '🛡️ 99.99% Uptime & < 80ms P95',
    accentBorder: 'border-t-indigo-500',
    iconBg: 'from-indigo-50 to-blue-50 border-indigo-100 text-indigo-600',
    title: 'High-Throughput Backend & Microservices',
    tagline: 'Fault-tolerant server architectures, distributed databases, and high-concurrency APIs.',
    desc: 'Led by Team Lead Syed Abdullah and Founder Suleman Zaheer, our backend engineering delivers mission-critical microservices and fault-tolerant server systems. We design normalized relational database schemas in PostgreSQL with PgBouncer connection pooling, strict Row-Level Security (RLS), and distributed Redis cache layers.',
    deliverables: [
      'Microservices and REST/GraphQL APIs with OpenAPI / Swagger documentation',
      'PostgreSQL schema normalization, indexing, partitioning & Supabase RLS',
      'Distributed caching and rate-limiting using Redis & asynchronous workers',
      'Role-Based Access Control (RBAC), Row-Level Security & JWT authentication',
    ],
    tags: ['Node.js', 'Python FastAPI', 'PostgreSQL', 'Supabase', 'Redis', 'Docker', 'PgBouncer'],
  },
  {
    id: 'mobile-development',
    icon: '📱',
    badge: 'iOS & Android Native',
    metric: '📱 60 FPS Native Speed & Offline Sync',
    accentBorder: 'border-t-amber-500',
    iconBg: 'from-amber-50 to-orange-50 border-amber-100 text-amber-600',
    title: 'Cross-Platform Mobile App Development',
    tagline: 'Unified React Native & Flutter codebases with native speed, offline sync, and intuitive touch UX.',
    desc: 'We develop high-performance mobile applications for Apple iOS and Google Android. Incorporating offline-first local databases (SQLite / WatermelonDB), background push notification pipelines, biometric authentication, and seamless hardware bridge access that easily pass App Store and Play Store review.',
    deliverables: [
      'Single codebase iOS and Android deployment with native platform bridges',
      'Offline-first data persistence with SQLite and background cloud synchronization',
      'Push notification pipelines via Firebase Cloud Messaging (FCM) & Apple APNs',
      'App Store and Google Play compliance, cryptographic signing & release automation',
    ],
    tags: ['React Native', 'Flutter', 'TypeScript', 'Firebase FCM', 'SQLite', 'iOS / Android', 'Expo'],
  },
  {
    id: 'ai-llm-solutions',
    icon: '🧠',
    badge: 'Generative AI & RAG',
    metric: '🤖 Sub-Second RAG Vector Search',
    accentBorder: 'border-t-purple-500',
    iconBg: 'from-purple-50 to-pink-50 border-purple-100 text-purple-600',
    title: 'AI Solutions & Custom LLM Agentic Workflows',
    tagline: 'Custom enterprise AI solutions powered by OpenAI, Claude, LangChain, and vector embeddings.',
    desc: 'We empower businesses with cutting-edge Generative AI and autonomous LLM agents. From Retrieval-Augmented Generation (RAG) using pgvector and Pinecone to custom OpenAI GPT-4o and Anthropic Claude workflows, we build intelligent AI copilots, document Q&A engines, and automated data enrichment pipelines.',
    deliverables: [
      'Production RAG pipelines with semantic document chunking & pgvector embeddings',
      'Multi-agent autonomous workflows using LangChain, LangGraph & LlamaIndex',
      'Conversational AI copilots with token streaming, memory & rate guards',
      'Enterprise privacy guardrails, zero-data-retention compliance & prompt engineering',
    ],
    tags: ['OpenAI GPT-4o', 'Claude 3.5', 'LangChain', 'pgvector', 'Pinecone', 'LangGraph', 'Python'],
  },
  {
    id: 'ui-ux-design',
    icon: '🎨',
    badge: 'Design Systems & CRO',
    metric: '🎯 WCAG 2.1 AA Accessible Tokens',
    accentBorder: 'border-t-rose-500',
    iconBg: 'from-rose-50 to-pink-50 border-rose-100 text-rose-600',
    title: 'UI/UX Product Design & Design Systems',
    tagline: 'Human-centric digital interfaces, clickable Figma design systems, and conversion-focused wireframes.',
    desc: 'Crafted by Frontend & UI/UX Lead Saqib Javed, our product design methodology transforms complex workflows into intuitive, visually captivating web and mobile interfaces. We build comprehensive Figma design systems with atomic tokens, responsive breakpoints, and micro-interactions that elevate customer retention.',
    deliverables: [
      'High-fidelity clickable Figma prototypes for desktop, tablet & mobile',
      'Atomic Design System with tokens, typography scales, colors & UI components',
      'User journey mapping, wireframing, usability testing & UX heuristic audits',
      'Conversion Rate Optimization (CRO) and responsive design token handoff',
    ],
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Atomic Tokens', 'Wireframes', 'WCAG 2.1 AA', 'Prototyping'],
  },
  {
    id: 'ecommerce-platforms',
    icon: '🛒',
    badge: 'Revenue Infrastructure',
    metric: '💳 99.9% Checkout Reliability',
    accentBorder: 'border-t-cyan-500',
    iconBg: 'from-cyan-50 to-blue-50 border-cyan-100 text-cyan-600',
    title: 'Headless E-Commerce & Global Payments',
    tagline: 'High-conversion online stores with custom checkout flows, inventory synchronization, and secure payments.',
    desc: 'We construct headless e-commerce platforms and custom Shopify Plus stores. Featuring global and localized payment gateways (Stripe, PayPal, PayFast, Pakistani payment rails), automated inventory reconciliation, cart abandonment recovery, and blazing-fast checkout flows.',
    deliverables: [
      'Headless Next.js storefronts with headless CMS or Shopify Plus backends',
      'Multi-currency payment gateways (Stripe, PayPal, PayFast & local wallets)',
      'Real-time stock synchronization, webhook listeners & inventory APIs',
      'Cart abandonment recovery, SEO product catalogs & 1-click checkout flows',
    ],
    tags: ['Shopify Plus', 'Next.js Commerce', 'Stripe API', 'PayFast', 'Webhooks', 'Inventory Sync', 'TailwindCSS'],
  },
  {
    id: 'technical-writing',
    icon: '✍️',
    badge: 'Developer Relations & Docs',
    metric: '📚 100% API Spec Coverage',
    accentBorder: 'border-t-teal-500',
    iconBg: 'from-teal-50 to-emerald-50 border-teal-100 text-teal-600',
    title: 'Technical Writing, API Specs & Developer Docs',
    tagline: 'Clear developer documentation, OpenAPI references, architecture whitepapers, and technical blogs.',
    desc: 'Led by Founder Suleman Zaheer, we produce authoritative technical documentation, interactive OpenAPI / Swagger references, and engineering whitepapers. Designed to drastically reduce developer onboarding friction and establish authoritative domain presence on Google.',
    deliverables: [
      'OpenAPI 3.1 / Swagger documentation, SDK guides & developer portals',
      'Interactive Markdown / MDX documentation hubs with runnable code sandboxes',
      'System architecture whitepapers, RFCs, and engineering runbooks for CTOs',
      'SEO-dominant technical content, engineering blogs & deep-dive tutorials',
    ],
    tags: ['OpenAPI / Swagger', 'Markdown / MDX', 'Mintlify', 'Technical Writing', 'DevRel', 'API Docs', 'RFCs'],
  },
]

const teamMembers = [
  {
    name: 'Suleman Zaheer',
    role: 'Founder & CEO',
    title: 'Backend & Full Stack Developer · Technical Writer',
    initials: 'SZ',
    image: '/suleman.png',
    status: 'Active in Lahore, PK',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    bio: 'Leads SAMStack’s technological vision and client architecture. Deep specialization in full-stack engineering, high-throughput backend systems, data science pipelines, and clear technical communication.',
    skills: ['Next.js 16', 'Node.js', 'Python', 'PostgreSQL', 'Data Science', 'Tech Writing', 'System Design'],
  },
  {
    name: 'Syed Abdullah',
    role: 'Team Lead',
    title: 'Senior Backend Developer & Distributed Systems',
    initials: 'SA',
    image: '/abdullah.png',
    status: 'Active in Lahore, PK',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bio: 'Oversees engineering delivery, microservices design, and database resilience. Specializes in building bulletproof server architectures, REST & GraphQL APIs, and high-performance cloud pipelines.',
    skills: ['Node.js', 'Python', 'FastAPI', 'Microservices', 'PostgreSQL', 'Redis', 'API Security'],
  },
  {
    name: 'Saqib Javed',
    role: 'Frontend & UI/UX Lead',
    title: 'Frontend Developer & UI/UX Designer',
    initials: 'SJ',
    image: '/saqib.png',
    status: 'Active in Lahore, PK',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    bio: 'Crafts visually stunning, intuitive user interfaces and modern design systems. Expert in turning complex user requirements into elegant, high-conversion frontends using React and Next.js.',
    skills: ['React 19', 'Next.js 16', 'TailwindCSS', 'Figma', 'UI/UX Design', 'Design Systems', 'Micro-Animations'],
  },
]

const deliveryFramework = [
  {
    step: '01',
    title: 'Discovery & Architecture Blueprint',
    desc: 'We map user personas, system workflows, database ERDs, and API contracts. You receive an interactive Figma wireframe and fixed-milestone scope within 48 hours.',
    icon: '📐',
    badge: 'Stage 1',
  },
  {
    step: '02',
    title: 'Agile Sprint Engineering',
    desc: 'Bi-weekly demo deployments on preview environments. Clean Git feature branching, rigorous TypeScript typing, and direct communication with lead engineers.',
    icon: '⚡',
    badge: 'Stage 2',
  },
  {
    step: '03',
    title: 'Automated QA & Security Hardening',
    desc: 'Continuous integration running end-to-end tests, Supabase Row-Level Security (RLS) penetration audits, and 100/100 Lighthouse performance audits.',
    icon: '🛡️',
    badge: 'Stage 3',
  },
  {
    step: '04',
    title: 'Zero-Downtime Launch & IP Transfer',
    desc: 'Seamless deployment on edge infrastructure (Vercel, AWS, Cloudflare), 100% intellectual property ownership transfer, and full developer documentation.',
    icon: '🚀',
    badge: 'Stage 4',
  },
]

const heroPillars = [
  { icon: '⚡', label: '100/100 Core Web Vitals' },
  { icon: '🛡️', label: '99.99% Cloud Uptime SLA' },
  { icon: '🔒', label: 'Enterprise RLS & Security' },
  { icon: '🌍', label: 'Global & Local Delivery' },
]

const primaryTechStrip = [
  'Next.js 16', 'React 19', 'TypeScript', 'Python', 'FastAPI',
  'PostgreSQL', 'Supabase', 'Docker', 'TailwindCSS', 'Redis'
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
  { value: '50+', label: 'Delivered Projects', detail: 'Web, Mobile & Data' },
  { value: '100%', label: 'Code Ownership', detail: 'Zero Vendor Lock-in' },
  { value: '3+ Yrs', label: 'Production Craft', detail: 'Battle-Tested Team' },
  { value: '15+', label: 'Modern Stacks', detail: 'Full Cloud Native' },
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

      <div className="min-h-screen bg-white text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans relative">
        {/* Subtle Background Pattern: Modern Dot Matrix */}
        <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 -z-20" />

        {/* ─── FIXED NAVBAR — Transparent over Hero, Glassy when scrolled ─── */}
        <LandingNavbar
          officialPhone={OFFICIAL_PHONE}
          formattedPhone={FORMATTED_PHONE}
          whatsappUrl={WHATSAPP_URL}
        />

        {/* ─── HERO SECTION (1 Screen View with crm.png Team Photo) ─── */}
        <section
          role="main"
          aria-labelledby="hero-heading"
          className="relative min-h-screen lg:h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-6 overflow-hidden bg-slate-950 text-white"
        >
          {/* Background Image: crm.png prominently visible ("fully numaya") */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/crm.png"
              alt="SAMStack Team - Suleman Zaheer, Syed Abdullah, Saqib Javed"
              className="w-full h-full object-cover object-center opacity-90 filter contrast-[1.03] brightness-95"
            />
            {/* Soft vignette: crystal clear center, gentle fade at edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.65)_100%)]" />
          </div>

          {/* Ambient Subtle Glow Accents */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-violet-500/15 blur-[120px] pointer-events-none z-0" />

          {/* Hero Core Content: Clean, Spacious & Focused */}
          <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full my-auto z-10">
            {/* Top Pill / Badge with Live Status */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/15 text-slate-200 text-[11px] sm:text-xs font-semibold tracking-wide uppercase mb-3 shadow-lg hover:border-blue-400/40 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-blue-400 font-bold">SAMStack Digital Studio</span>
              <span className="text-slate-400">&bull;</span>
              <span>Lahore, Pakistan &bull; Worldwide Delivery</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.1] mb-3 max-w-3xl drop-shadow-md"
            >
              Transforming Ideas Into <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Digital Products That Scale
              </span>
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="text-xs sm:text-sm md:text-base text-slate-200/90 max-w-xl mx-auto mb-5 leading-relaxed font-normal drop-shadow-sm">
              Lahore’s premier digital engineering studio. Crafting elite Web Apps, Mobile Platforms, Scalable Cloud Backends &amp; Data Science.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 hover:shadow-emerald-500/40"
              >
                <span>💬</span> Chat on WhatsApp
              </a>

              <a
                href={`tel:${OFFICIAL_PHONE}`}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/12 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span>📞</span> {FORMATTED_PHONE}
              </a>
            </div>

            {/* Minimalist, Clean Stats Bar (Zero Heavy Clutter) */}
            <div className="w-full max-w-2xl rounded-2xl bg-slate-950/45 backdrop-blur-md border border-white/10 shadow-xl px-4 py-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {stats.map((stat, i) => (
                  <div key={stat.label} className={`px-2 py-0.5 text-center ${i > 1 ? 'pt-2 sm:pt-0' : ''}`}>
                    <div className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">
                      {stat.value}
                    </div>
                    <div className="text-[10.5px] sm:text-[11px] font-medium text-slate-300 mt-1 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="pb-2 pt-1 flex flex-col items-center justify-center z-10">
            <a
              href="#services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors group"
            >
              <span>Explore Services &amp; Capabilities</span>
              <span className="group-hover:translate-y-0.5 transition-transform animate-bounce text-blue-400">↓</span>
            </a>
          </div>
        </section>

        {/* ─── SERVICES SECTION ──────────────────────────────────────────── */}
        <section
          id="services"
          aria-labelledby="services-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-y border-slate-200"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                <span>⚡</span> Enterprise Capabilities
              </div>
              <h2
                id="services-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-1 mb-4"
              >
                Comprehensive Software &amp; Data Services
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Whether you need a full data analytics pipeline, an enterprise web application, a modern mobile app, or developer documentation — our engineering team delivers precision at every step.
              </p>
            </div>

            {/* High-Level Services Grid (Compact, Modern 3-Column Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {services.map((service) => (
                <article
                  key={service.id}
                  id={service.id}
                  className={`relative p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 border-t-4 ${service.accentBorder} hover:border-slate-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group flex flex-col justify-between shadow-xs`}
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${service.iconBg} border flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-2xs flex-shrink-0`}>
                          {service.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {service.badge}
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold shadow-2xs">
                        <span>{service.metric}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      itemProp="name"
                      className="text-base sm:text-lg font-bold text-slate-900 mb-1 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {service.title}
                    </h3>

                    {/* Tagline */}
                    <p className="text-[11px] sm:text-xs font-semibold text-blue-600 mb-2 leading-snug line-clamp-1">
                      {service.tagline}
                    </p>

                    {/* Description */}
                    <p
                      itemProp="description"
                      className="text-xs text-slate-600 leading-relaxed mb-3.5 line-clamp-2"
                    >
                      {service.desc}
                    </p>

                    {/* Key Deliverables & Specifications */}
                    <div className="mb-4 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
                      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        Key Capabilities:
                      </p>
                      <ul className="space-y-1">
                        {service.deliverables.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-tight">
                            <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Footer: Tech Stack & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {service.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`https://wa.me/923285778715?text=${encodeURIComponent(`Hello SAMStack, I would like to consult with your engineering team regarding: ${service.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
                    >
                      <span>Scope</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Architecture Standards Banner */}
            <div className="mt-14 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  International Quality Guarantee
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-1 mb-2">
                  Need a custom SLA, dedicated squad, or technical architecture discovery?
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We offer free 30-minute discovery consultations with our lead engineers. Receive an interactive scope document, milestone breakdown, and architecture diagram within 24 hours.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={`tel:${OFFICIAL_PHONE}`}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
                >
                  📞 {FORMATTED_PHONE}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                >
                  💬 Start Discovery Call
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW WE WORK / ENGINEERING FRAMEWORK ───────────────────────── */}
        <section
          id="framework"
          aria-labelledby="framework-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
                Proven Delivery Pipeline
              </span>
              <h2
                id="framework-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2 mb-4"
              >
                The SAMStack Engineering Framework
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                From initial discovery to zero-downtime production deployment, our disciplined four-stage engineering methodology guarantees transparency, quality, and velocity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deliveryFramework.map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors font-mono">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LEADERSHIP & ENGINEERING TEAM SECTION ─────────────────────── */}
        <section
          id="team"
          aria-labelledby="team-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-50/70 border-t border-slate-200"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
                The Minds Behind SAMStack
              </span>
              <h2
                id="team-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2 mb-4"
              >
                Meet Our Leadership &amp; Engineering Team
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                World-class products are built by passionate specialists. Meet the engineers driving SAMStack’s architecture, systems, and interfaces from Lahore, Pakistan.
              </p>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl bg-white border border-slate-200 p-7 flex flex-col justify-between hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all shadow-sm"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <div>
                    {/* Header: Photo Avatar + Role */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-slate-200 flex-shrink-0 bg-slate-100 ring-2 ring-blue-500/10">
                        <img
                          src={member.image}
                          alt={`${member.name} — ${member.title} at SAMStack`}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${member.badgeColor}`}>
                          {member.role}
                        </span>
                        <h3 itemProp="name" className="text-xl font-black text-slate-900 mt-1">
                          {member.name}
                        </h3>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {member.status}
                        </span>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p
                      itemProp="jobTitle"
                      className="text-xs font-semibold text-slate-600 mb-3 leading-snug"
                    >
                      {member.title}
                    </p>

                    {/* Bio */}
                    <p
                      itemProp="description"
                      className="text-xs text-slate-500 leading-relaxed mb-6"
                    >
                      {member.bio}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Core Expertise
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md border bg-slate-50 text-slate-700 border-slate-200"
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
          className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200"
          itemScope
          itemType="https://schema.org/Person"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column — Founder Overview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center relative overflow-hidden shadow-xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-28 h-28 rounded-3xl overflow-hidden mx-auto shadow-xl shadow-blue-500/10 mb-5 border-2 border-blue-200 bg-slate-100 ring-4 ring-blue-500/5">
                  <img
                    src="/suleman.png"
                    alt="Suleman Zaheer — Founder & CEO of SAMStack"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <h3 itemProp="name" className="text-2xl font-black text-slate-900">
                  Suleman Zaheer
                </h3>
                <p itemProp="jobTitle" className="text-xs text-blue-600 font-semibold mt-1 mb-4">
                  Founder &amp; CEO · Backend &amp; Full Stack Developer · Technical Writer
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600 mb-6">
                  <span>📍</span> Lahore, Punjab, Pakistan
                </div>

                <p className="text-xs text-slate-500 leading-relaxed text-left mb-6">
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
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <span>✉️</span> {OFFICIAL_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column — Narrative & Value Pillars */}
            <div className="lg:col-span-7">
              <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
                Founder&apos;s Vision
              </span>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-6"
              >
                Engineering Excellence With Global Standards
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  At <strong className="text-slate-900">SAMStack</strong>, we believe software should be built with rigorous engineering standards, clean architecture, and total transparency. Founded in Lahore, Pakistan by <strong className="text-blue-600">Suleman Zaheer</strong>, our mission is to empower both local Pakistani businesses and global startups with enterprise-grade web development, data science, and custom software.
                </p>
                <p>
                  Backed by Team Lead <strong className="text-slate-900">Syed Abdullah</strong> managing high-concurrency backend services and <strong className="text-slate-900">Saqib Javed</strong> delivering pixel-perfect UI/UX frontends, we take full pride in our engineering craft. Every line of code is structured, tested, and documented.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-blue-600 font-bold text-sm mb-1">🏗️ Robust Backend Systems</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    Scalable Node.js, Python, PostgreSQL, and Supabase data layers engineered for high uptime.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-emerald-600 font-bold text-sm mb-1">📊 Data Science &amp; Insights</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    Data mining, predictive algorithms, automated ETL workflows, and executive analytics.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-purple-600 font-bold text-sm mb-1">🎨 Modern UI/UX Experience</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    Interactive Next.js &amp; React user interfaces that maximize customer engagement and conversions.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-amber-600 font-bold text-sm mb-1">✍️ Technical Documentation</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
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
          className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-slate-50/70 border-t border-slate-200"
        >
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
              Technology Ecosystem
            </span>
            <h2
              id="tech-heading"
              className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-4"
            >
              Modern, Battle-Tested Stacks
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
              We choose modern, high-performance tools that guarantee speed, developer ergonomics, and scalability.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {[
                'Next.js 16', 'React 19', 'TypeScript', 'Node.js', 'Python', 'FastAPI',
                'PostgreSQL', 'Supabase', 'MongoDB', 'Redis', 'TailwindCSS', 'React Native',
                'Flutter', 'TensorFlow', 'Pandas', 'Docker', 'AWS', 'Vercel', 'GraphQL',
                'REST APIs', 'Git', 'Figma',
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:border-blue-400 hover:text-blue-600 hover:scale-105 hover:bg-blue-50 transition-all cursor-default shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ SECTION (Accessible Native Accordion & AEO Schema) ─────── */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
                Frequently Asked Questions
              </span>
              <h2
                id="faq-heading"
                className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 mb-4"
              >
                Clear Answers to Common Questions
              </h2>
              <p className="text-slate-500 text-sm">
                Everything you need to know about working with SAMStack in Lahore and across the globe.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-200 transition-all overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  open={idx === 0}
                >
                  <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer select-none">
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        0{idx + 1}
                      </span>
                      <h3
                        itemProp="name"
                        className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                      >
                        {faq.q}
                      </h3>
                    </div>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0 text-sm">
                      ▼
                    </span>
                  </summary>
                  <div
                    className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT & CTA BANNER ──────────────────────────────────────── */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/40 to-slate-50 border-t border-slate-200"
        >
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase mb-2 inline-block">
              Get In Touch Today
            </span>
            <h2
              id="contact-heading"
              className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight"
            >
              Ready to Build Something Remarkable?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Contact our leadership team directly. We provide a detailed technical discovery and proposal with transparent milestones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
              {/* Phone Card */}
              <a
                href={`tel:${OFFICIAL_PHONE}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-center group shadow-sm"
              >
                <div className="text-2xl mb-2">📞</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Direct Phone</div>
                <div className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {FORMATTED_PHONE}
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md transition-all text-center group shadow-sm"
              >
                <div className="text-2xl mb-2">💬</div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">WhatsApp Chat</div>
                <div className="text-sm font-extrabold text-emerald-800 group-hover:text-emerald-600 transition-colors">
                  Chat Instantly
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${OFFICIAL_EMAIL}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-center group shadow-sm"
              >
                <div className="text-2xl mb-2">✉️</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Official Email</div>
                <div className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors break-all">
                  {OFFICIAL_EMAIL}
                </div>
              </a>
            </div>

            {/* Guaranteed SLA Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
              <span>⚡</span> Guaranteed technical consultation with lead engineers within 2 hours
            </div>

            {/* Employee Portal Link */}
            <div className="text-xs text-slate-500">
              Are you an authorized team member?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-bold">
                Access Employee Workspace &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FOOTER (Light Theme) ───────────────────────────────────────── */}
        <footer
          role="contentinfo"
          className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200 text-xs text-slate-600"
          itemScope
          itemType="https://schema.org/WPFooter"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
              {/* Brand & Address */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-slate-200 shadow-sm flex items-center justify-center">
                    <img src="/logo.png" alt="SAMStack Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-base text-slate-900 tracking-tight">
                    SAM<span className="text-blue-600">Stack</span> Technologies
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed max-w-sm mb-4">
                  World-class software development studio based in Lahore, Pakistan. Specializing in high-performance web applications, mobile apps, data science &amp; analytics, and scalable backend infrastructure.
                </p>
                <address
                  className="not-italic text-slate-500 space-y-1"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <div>
                    📍 <span itemProp="addressLocality">Lahore</span>,{' '}
                    <span itemProp="addressRegion">Punjab</span>,{' '}
                    <span itemProp="addressCountry">Pakistan</span> (54000)
                  </div>
                  <div>
                    📞 <a href={`tel:${OFFICIAL_PHONE}`} className="hover:text-blue-600 font-medium">{FORMATTED_PHONE}</a>
                  </div>
                  <div>
                    ✉️ <a href={`mailto:${OFFICIAL_EMAIL}`} className="hover:text-blue-600 font-medium">{OFFICIAL_EMAIL}</a>
                  </div>
                </address>
              </div>

              {/* Services Column */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
                  Services
                </h4>
                <ul className="space-y-2 text-slate-500">
                  <li><a href="#services" className="hover:text-blue-600 transition-colors">Web Development</a></li>
                  <li><a href="#services" className="hover:text-blue-600 transition-colors">Mobile Apps</a></li>
                  <li><a href="#services" className="hover:text-blue-600 transition-colors">Data Science &amp; Analytics</a></li>
                  <li><a href="#services" className="hover:text-blue-600 transition-colors">Backend Engineering</a></li>
                  <li><a href="#services" className="hover:text-blue-600 transition-colors">UI/UX &amp; Product Design</a></li>
                  <li><a href="#services" className="hover:text-blue-600 transition-colors">Technical Writing</a></li>
                </ul>
              </div>

              {/* Team Column */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
                  Leadership
                </h4>
                <ul className="space-y-2 text-slate-500">
                  <li>
                    <span className="text-slate-900 font-semibold">Suleman Zaheer</span>
                    <span className="block text-[11px] text-slate-500">Founder &amp; CEO · Full Stack</span>
                  </li>
                  <li>
                    <span className="text-slate-900 font-semibold">Syed Abdullah</span>
                    <span className="block text-[11px] text-slate-500">Team Lead &amp; Backend</span>
                  </li>
                  <li>
                    <span className="text-slate-900 font-semibold">Saqib Javed</span>
                    <span className="block text-[11px] text-slate-500">Frontend &amp; UI/UX</span>
                  </li>
                </ul>
              </div>

              {/* Regions Served */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
                  Coverage
                </h4>
                <ul className="space-y-2 text-slate-500">
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
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <p>
                &copy; {new Date().getFullYear()} SAMStack Technologies. All rights reserved. Built with precision in Lahore, Pakistan.
              </p>
              <p>
                Run by <strong className="text-slate-700">Suleman Zaheer</strong> (Backend/Full Stack &amp; Writer), <strong className="text-slate-700">Syed Abdullah</strong> (Team Lead), &amp; <strong className="text-slate-700">Saqib Javed</strong> (Frontend/UI/UX).
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

