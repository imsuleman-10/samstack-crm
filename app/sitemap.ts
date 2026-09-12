import type { MetadataRoute } from 'next'

const SITE_URL = 'https://samstack-crm.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    // ── Homepage (Highest Priority — All SEO / GEO Weight) ───────────
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // ── Homepage Anchor Sections (For Crawlability) ──────────────────
    {
      url: `${SITE_URL}/#services`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#team`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/#tech`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/#faq`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // ── Team Directory ───────────────────────────────────────────────
    {
      url: `${SITE_URL}/team`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // ── Team Profile Pages (AEO / Knowledge Panel Targets) ──────────
    // Suleman Zaheer — Founder & CEO (Targets "who is Suleman Zaheer" searches)
    {
      url: `${SITE_URL}/team/suleman-zaheer`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Syed Abdullah — Team Lead & Backend
    {
      url: `${SITE_URL}/team/syed-abdullah`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Saqib Javed — Frontend & UI/UX Lead
    {
      url: `${SITE_URL}/team/saqib-javed`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // ── Auth (Lower Priority — Not for Public Indexing) ──────────────
    {
      url: `${SITE_URL}/login`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
