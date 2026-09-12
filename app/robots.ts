import type { MetadataRoute } from 'next'

const SITE_URL = 'https://samstack-crm.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — allow public pages, block internal/auth routes
      {
        userAgent: '*',
        allow: [
          '/',
          '/team/',
          '/team/suleman-zaheer',
          '/team/syed-abdullah',
          '/team/saqib-javed',
        ],
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/pending-approval',
          '/onboarding',
          '/_next/',
        ],
      },
      // AEO: Allow all AI & Answer Engine bots to index all public content
      // This enables Google AI Overviews, Perplexity, ChatGPT, Bing Copilot etc.
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
          'Bingbot',
          'DuckDuckBot',
          'facebookexternalhit',
          'LinkedInBot',
          'Twitterbot',
        ],
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
