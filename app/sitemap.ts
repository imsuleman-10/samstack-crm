import type { MetadataRoute } from 'next'
import { SITE_URL, TEAM } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  return [
    // ── Homepage — Maximum Authority ────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ── About Page — Company Entity / LLMO Target ────────────────────────
    {
      url: `${SITE_URL}/about`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Team Directory ───────────────────────────────────────────────────
    {
      url: `${SITE_URL}/team`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Suleman Zaheer Profile — Founder / Knowledge Panel ───────────────
    // Target: "Who is Suleman Zaheer?", "Suleman Zaheer Pakistan"
    {
      url: TEAM.suleman.url,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.95,
    },

    // ── Syed Abdullah Profile — Backend Lead ────────────────────────────
    {
      url: TEAM.abdullah.url,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // ── Saqib Javed Profile — UI/UX Lead ────────────────────────────────
    {
      url: TEAM.saqib.url,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // ── Team profile images — Google Image Search ────────────────────────
    {
      url: `${SITE_URL}/suleman.png`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/saqib.png`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/abdullah.png`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/og-default.png`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]
}
