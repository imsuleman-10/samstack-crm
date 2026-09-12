import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

const SITE_URL = 'https://samstack.tech'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SAMStack | Web Development, Data Science & Software — Lahore, Pakistan',
    template: '%s | SAMStack',
  },
  description:
    'SAMStack — Professional web development, mobile apps, data science, and custom software solutions from Lahore, Pakistan. Founded by Suleman Zaheer.',
  openGraph: {
    siteName: 'SAMStack',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  verification: {
    google: 'ncDPDf6qeVYyIfZspChewZ1n7l0WbtzJejdJRZMsCqQ',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Site Verification (Search Console) */}
        <meta name="google-site-verification" content="ncDPDf6qeVYyIfZspChewZ1n7l0WbtzJejdJRZMsCqQ" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Geo / Local Business Meta Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Lahore, Punjab, Pakistan" />
        <meta name="geo.position" content="31.5204;74.3587" />
        <meta name="ICBM" content="31.5204, 74.3587" />

        {/* Content & Distribution */}
        <meta name="language" content="English" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="coverage" content="Pakistan, Worldwide" />
        <meta name="revisit-after" content="7 days" />
        <meta name="target" content="all" />

        {/* Mobile */}
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />

        {/* Business / Author */}
        <meta name="author" content="Suleman Zaheer, SAMStack" />
        <meta name="designer" content="Suleman Zaheer" />
        <meta name="copyright" content="SAMStack" />
        <meta name="publisher" content="SAMStack" />
        <meta name="creator" content="Suleman Zaheer" />

        {/* Theme Color (PWA / Mobile browser chrome) */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />

        {/* AEO — Sitelinks Searchbox / AI Visibility */}
        <meta name="application-name" content="SAMStack" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
