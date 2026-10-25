import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'
import {
  SITE_URL, COMPANY, ADDRESS, SAME_AS, TEAM,
  SERVICES, MASTER_KEYWORDS, OPENING_HOURS,
} from '@/lib/seo-config'

// ─────────────────────────────────────────────────────────────────────────────
// Next.js Metadata — Technical SEO + OG + Twitter
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SAMStack Technologies | Web Development, CRM & Data Science — Lahore, Pakistan',
    template: '%s | SAMStack Technologies',
  },
  description:
    'SAMStack Technologies — Expert web development, custom CRM systems, mobile apps, data science & AI automation from Lahore, Pakistan. Founded by Suleman Zaheer. Serving clients in the US, UK, UAE & Canada. Call +92 328 5778715.',
  keywords: [...MASTER_KEYWORDS],
  authors: [
    { name: 'Suleman Zaheer', url: `${SITE_URL}/team/suleman-zaheer` },
    { name: 'Syed Abdullah', url: `${SITE_URL}/team/syed-abdullah` },
    { name: 'Saqib Javed', url: `${SITE_URL}/team/saqib-javed` },
  ],
  creator: 'Suleman Zaheer',
  publisher: 'SAMStack Technologies',
  category: 'Technology',
  classification: 'Software Development & IT Services Company',
  openGraph: {
    siteName: 'SAMStack Technologies',
    locale: 'en_PK',
    alternateLocale: ['en_US', 'en_GB', 'en_AE'],
    type: 'website',
    title: 'SAMStack Technologies | Web Development, CRM & Data Science — Lahore, Pakistan',
    description:
      'SAMStack Technologies delivers world-class web applications, custom CRM platforms, mobile apps, and data science solutions from Lahore, Pakistan. Trusted by clients in the US, UK, UAE & beyond.',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'SAMStack Technologies — Web Development & CRM Software from Lahore, Pakistan',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAMStack Technologies | Web Dev, CRM & AI — Lahore, Pakistan',
    description:
      'Expert software engineering from Lahore, Pakistan. Custom CRM, web apps, mobile, data science & AI automation. Founded by Suleman Zaheer.',
    images: [`${SITE_URL}/og-default.png`],
    creator: '@samstack_tech',
    site: '@samstack_tech',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'ncDPDf6qeVYyIfZspChewZ1n7l0WbtzJejdJRZMsCqQ',
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-PK': SITE_URL,
      'en-US': SITE_URL,
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Layout Component
// ─────────────────────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {

  // ── Global Schema.org Knowledge Graph ────────────────────────────────────
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [

      // ── 1. Organization + LocalBusiness (Core Entity) ──────────────────
      {
        '@type': ['Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService'],
        '@id': `${SITE_URL}/#organization`,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        alternateName: COMPANY.alternateName,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: COMPANY.logo,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
        },
        description: COMPANY.description,
        foundingDate: COMPANY.foundingDate,
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 3 },
        founder: {
          '@type': 'Person',
          '@id': TEAM.suleman.id,
          name: TEAM.suleman.name,
          jobTitle: TEAM.suleman.jobTitle,
          url: TEAM.suleman.url,
          image: TEAM.suleman.image,
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: ADDRESS.streetAddress,
          addressLocality: ADDRESS.addressLocality,
          addressRegion: ADDRESS.addressRegion,
          addressCountry: ADDRESS.addressCountry,
          postalCode: ADDRESS.postalCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: ADDRESS.latitude,
          longitude: ADDRESS.longitude,
        },
        hasMap: `https://maps.google.com/?q=${ADDRESS.latitude},${ADDRESS.longitude}`,
        telephone: COMPANY.telephone,
        email: COMPANY.email,
        priceRange: COMPANY.priceRange,
        currenciesAccepted: COMPANY.currenciesAccepted,
        paymentAccepted: COMPANY.paymentAccepted,
        openingHoursSpecification: OPENING_HOURS.map(h => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: `https://schema.org/${h.dayOfWeek}`,
          opens: h.opens,
          closes: h.closes,
        })),
        areaServed: [
          { '@type': 'Country', name: 'Pakistan' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'Saudi Arabia' },
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'Australia' },
        ],
        sameAs: [...SAME_AS],
        knowsAbout: [
          'Enterprise CRM Development', 'Next.js 16 App Router', 'React 19',
          'Python FastAPI Microservices', 'PostgreSQL Database Architecture',
          'Supabase Cloud & Row-Level Security', 'Groq AI LLM Integrations',
          'Lead Management & Sales Funnels', 'Generative Engine Optimization (GEO)',
          'UI/UX Design Systems in Figma', 'Mobile App Development with React Native',
          'Data Science & Business Intelligence',
        ],
        employee: [
          {
            '@type': 'Person',
            '@id': TEAM.suleman.id,
            name: TEAM.suleman.name,
            jobTitle: TEAM.suleman.jobTitle,
            url: TEAM.suleman.url,
            image: TEAM.suleman.image,
            sameAs: TEAM.suleman.sameAs,
          },
          {
            '@type': 'Person',
            '@id': TEAM.abdullah.id,
            name: TEAM.abdullah.name,
            jobTitle: TEAM.abdullah.jobTitle,
            url: TEAM.abdullah.url,
            image: TEAM.abdullah.image,
          },
          {
            '@type': 'Person',
            '@id': TEAM.saqib.id,
            name: TEAM.saqib.name,
            jobTitle: TEAM.saqib.jobTitle,
            url: TEAM.saqib.url,
            image: TEAM.saqib.image,
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'SAMStack Software Engineering Services',
          itemListElement: SERVICES.map((svc, i) => ({
            '@type': 'Offer',
            position: i + 1,
            itemOffered: {
              '@type': 'Service',
              '@id': `${SITE_URL}/#service-${i + 1}`,
              name: svc.name,
              description: svc.description,
              serviceType: svc.serviceType,
              provider: { '@id': `${SITE_URL}/#organization` },
              areaServed: 'Worldwide',
              availableLanguage: ['English', 'Urdu'],
            },
          })),
        },
      },

      // ── 2. Services (individual Service entities) ──────────────────────
      ...SERVICES.map((svc, i) => ({
        '@type': 'Service',
        '@id': `${SITE_URL}/#service-${i + 1}`,
        name: svc.name,
        description: svc.description,
        serviceType: svc.serviceType,
        provider: { '@id': `${SITE_URL}/#organization` },
        url: SITE_URL,
        areaServed: [
          { '@type': 'Country', name: 'Pakistan' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'United Kingdom' },
        ],
        availableLanguage: ['English', 'Urdu'],
        offers: {
          '@type': 'Offer',
          price: 'Contact for Quote',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      })),

      // ── 3. SAMStack CRM Software Application ──────────────────────────
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#crm-software`,
        name: 'SAMStack CRM Platform',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'CRMApplication',
        operatingSystem: 'All Modern Web Browsers, iOS, Android',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '2.0.0',
        inLanguage: ['en', 'ur'],
        creator: { '@id': `${SITE_URL}/#organization` },
        description:
          'SAMStack CRM is an all-in-one enterprise Customer Relationship Management platform featuring Groq AI-powered Excel and CSV file ingestion, drag-and-drop Kanban sales pipelines, team outreach analytics, real-time performance leaderboards, and multi-role access control.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          eligibleRegion: { '@type': 'Place', name: 'Worldwide' },
        },
        featureList: [
          'AI-Powered Excel, XLS, CSV Smart File Ingestion with Groq Column Mapping',
          'Drag-and-Drop Kanban Sales Pipeline',
          'Full Phone & Tablet Mobile Responsiveness',
          'Multi-Channel Outreach & Follow-Up Automation',
          'Role-Based Access: Super Admin, Admin, Sales Employee',
          'Real-time BI Analytics & Team Performance Leaderboards',
          'One-Click WhatsApp & Call Lead Actions',
          'Supabase Row-Level Security & Audit Trails',
        ],
        screenshot: `${SITE_URL}/crm.png`,
      },

      // ── 4. WebSite with SearchAction (Sitelinks Search) ───────────────
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'SAMStack Technologies',
        description:
          'Official website of SAMStack Technologies — a software engineering studio based in Lahore, Pakistan.',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-PK',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },

      // ── 5. ContactPage Schema (AEO for "How to contact SAMStack?") ─────
      {
        '@type': 'ContactPage',
        '@id': `${SITE_URL}/#contact`,
        name: 'Contact SAMStack Technologies',
        url: SITE_URL,
        description: 'Contact SAMStack Technologies for software development, CRM, data science, and AI automation services.',
        mainEntity: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
        },
        contactOption: ['HearingImpairedSupported'],
        contactType: 'customer service',
        telephone: COMPANY.telephone,
        email: COMPANY.email,
        availableLanguage: ['English', 'Urdu'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '22:00',
        },
      },

      // ── 6. WebPage (Homepage) with Speakable for Voice / LLMO ─────────
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: 'SAMStack Technologies | Web Development, CRM & Data Science — Lahore, Pakistan',
        description:
          'SAMStack Technologies is a premier software development studio in Lahore, Pakistan. We build custom CRM systems, web apps, mobile apps, and data science pipelines for global clients.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.hero-tagline', '.company-description', '.faq-answer'],
        },
        inLanguage: 'en-PK',
        publisher: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          ],
        },
      },

      // ── 7. FAQPage (Global AEO — Company-Level Questions) ─────────────
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is SAMStack Technologies?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SAMStack Technologies is a premier software engineering studio based in Lahore, Pakistan, founded in 2023 by Suleman Zaheer. We specialize in custom CRM development, full-stack web applications, mobile apps, data science, and AI automation. We serve clients in Pakistan, the United States, the United Kingdom, the UAE, and Canada.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who founded SAMStack Technologies?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SAMStack Technologies was founded by Suleman Zaheer, a Pakistani Full Stack Software Engineer and Technical Writer based in Lahore, Pakistan. The engineering team includes Syed Abdullah (Team Lead & Backend Architect) and Saqib Javed (Frontend Developer & UI/UX Lead).',
            },
          },
          {
            '@type': 'Question',
            name: 'What services does SAMStack Technologies offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SAMStack Technologies offers: (1) Custom CRM Development, (2) Web Application Development with Next.js & React, (3) Mobile App Development with React Native, (4) Data Science & Analytics with Python, (5) AI & Automation Solutions using Groq LLMs, and (6) Backend API Architecture with FastAPI & Node.js.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I contact SAMStack Technologies?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can contact SAMStack Technologies by calling or WhatsApp at +92 328 5778715, emailing samstacktechs@gmail.com, or visiting our office in Johar Town, Lahore, Punjab, Pakistan.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does SAMStack Technologies work with international clients?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. SAMStack Technologies actively serves clients in the United States, United Kingdom, UAE, Saudi Arabia, Canada, and Australia in addition to Pakistan. We accept payments in USD, GBP, EUR, AED, and PKR via direct bank transfer.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is SAMStack Technologies located?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SAMStack Technologies is located in Johar Town, Lahore, Punjab, Pakistan (Postal Code: 54782). We operate Monday to Saturday, 9:00 AM to 10:00 PM PKT.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the SAMStack CRM platform?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SAMStack CRM is an enterprise-grade Customer Relationship Management platform built by SAMStack Technologies. It features AI-powered Excel/CSV file ingestion with Groq column mapping, drag-and-drop Kanban sales pipelines, real-time team analytics, multi-role access control, and full mobile responsiveness.',
            },
          },
        ],
      },
    ],
  }

  return (
    <html lang="en-PK" suppressHydrationWarning>
      <head>
        {/* ── Verification ──────────────────────────────────────────────── */}
        <meta name="google-site-verification" content="ncDPDf6qeVYyIfZspChewZ1n7l0WbtzJejdJRZMsCqQ" />

        {/* ── Global JSON-LD Knowledge Graph ────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />

        {/* ── Icons ─────────────────────────────────────────────────────── */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* ── Google Fonts ──────────────────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* ── DNS Prefetch ───────────────────────────────────────────────── */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//wa.me" />

        {/* ── GEO / Local Business Meta ─────────────────────────────────── */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Lahore, Punjab, Pakistan" />
        <meta name="geo.position" content={`${ADDRESS.latitude};${ADDRESS.longitude}`} />
        <meta name="ICBM" content={`${ADDRESS.latitude}, ${ADDRESS.longitude}`} />

        {/* ── Language & Distribution ───────────────────────────────────── */}
        <meta name="language" content="English" />
        <meta name="content-language" content="en-PK" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="coverage" content="Pakistan, Worldwide" />
        <meta name="revisit-after" content="7 days" />
        <meta name="target" content="all" />

        {/* ── Mobile & PWA ──────────────────────────────────────────────── */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="SAMStack" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />

        {/* ── Business Attribution ──────────────────────────────────────── */}
        <meta name="author" content="Suleman Zaheer, SAMStack Technologies" />
        <meta name="designer" content="Saqib Javed, SAMStack Technologies" />
        <meta name="copyright" content="SAMStack Technologies" />
        <meta name="publisher" content="SAMStack Technologies" />
        <meta name="creator" content="Suleman Zaheer" />
        <meta name="owner" content="SAMStack Technologies" />

        {/* ── Theme ─────────────────────────────────────────────────────── */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />

        {/* ── AEO / Application ─────────────────────────────────────────── */}
        <meta name="application-name" content="SAMStack CRM" />

        {/* ── hreflang Alternates ───────────────────────────────────────── */}
        <link rel="alternate" hrefLang="en-PK" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-US" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-GB" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      </head>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
