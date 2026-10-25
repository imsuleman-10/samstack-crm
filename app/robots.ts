import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Standard Crawlers — allow public, block internal/auth ──────────
      {
        userAgent: '*',
        allow: [
          '/',
          '/team',
          '/team/',
          '/team/suleman-zaheer',
          '/team/syed-abdullah',
          '/team/saqib-javed',
          '/about',
          '/sitemap.xml',
          '/og-default.png',
          '/suleman.png',
          '/saqib.png',
          '/abdullah.png',
          '/logo.png',
        ],
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/pending-approval',
          '/onboarding',
          '/_next/',
          '/login',
          '/register',
        ],
        crawlDelay: 1,
      },

      // ── Googlebot — Full access to all public content ──────────────────
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin/', '/api/', '/dashboard/', '/_next/'],
      },

      // ── Google Image Bot ───────────────────────────────────────────────
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/og-default.png',
          '/suleman.png',
          '/saqib.png',
          '/abdullah.png',
          '/logo.png',
          '/crm.png',
          '/favicon.png',
        ],
      },

      // ── AEO & LLMO: Allow ALL modern AI & Generative Search bots ──────
      {
        userAgent: [
          // OpenAI
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          // Anthropic Claude
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          // Google AI
          'Google-Extended',
          'Bard',
          'Gemini',
          // Perplexity
          'PerplexityBot',
          // Apple
          'Applebot-Extended',
          'Applebot',
          // Cohere
          'cohere-ai',
          // Meta
          'FacebookBot',
          'facebookexternalhit',
          // Microsoft Bing
          'Bingbot',
          'msnbot',
          // Other search engines
          'DuckDuckBot',
          'Bytespider',
          // Data intelligence
          'Diffbot',
          'CCBot',
          // Social
          'LinkedInBot',
          'Twitterbot',
          'Slackbot',
          // Specialized crawlers
          'ia_archiver',
        ],
        allow: ['/'],
        disallow: ['/admin/', '/api/', '/dashboard/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
