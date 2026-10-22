import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Healthcheck & Supabase Keep-Alive Endpoint
 * 
 * Purpose:
 * Prevents Supabase Free Tier auto-pausing (which triggers after 7 days of inactivity).
 * Can be called via:
 * 1. GitHub Actions scheduled workflow (.github/workflows/supabase-keepalive.yml)
 * 2. Vercel Cron Jobs (vercel.json)
 * 3. External free uptime monitors (Cron-job.org / UptimeRobot)
 */
export async function GET(request: Request) {
  const startTime = Date.now()

  // Optional: check for CRON_SECRET if provided in environment
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    if (token !== cronSecret) {
      // If secret configured but not provided, reject unauthorized
      return NextResponse.json(
        { error: 'Unauthorized keep-alive request' },
        { status: 401 }
      )
    }
  }

  try {
    const supabase = createAdminClient()
    
    // Execute a lightweight head query against profiles to generate real database activity
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.error('[Supabase Keep-Alive Error]:', error.message)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database query failed',
          error: error.message,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    const latencyMs = Date.now() - startTime

    return NextResponse.json(
      {
        status: 'healthy',
        database: 'active',
        supabase_project_active: true,
        profiles_count: count ?? 0,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: any) {
    console.error('[Supabase Keep-Alive Exception]:', err)
    return NextResponse.json(
      {
        status: 'fatal',
        error: err?.message || 'Unknown server error',
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
