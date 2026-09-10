import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_ROLES = ['admin', 'super_admin']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const pathname = request.nextUrl.pathname

  // Fast bypass for static files / favicon / api / rsc assets / robots / sitemap
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml)$/.test(pathname)
  ) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  function redirectWithCookies(pathOrUrl: string, searchParams?: Record<string, string>) {
    const url = request.nextUrl.clone()
    url.pathname = pathOrUrl
    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    const response = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, cookie)
    })
    return response
  }

  // Public routes that don't require auth
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isAuthRoute = authRoutes.some(r => pathname === r || pathname.startsWith(r + '/'))
  const isHomePage = pathname === '/'
  const isPublicRoute = isHomePage || isAuthRoute

  // Fast path: Check for Supabase auth token cookie before making remote network calls
  const allCookies = request.cookies.getAll()
  const hasAuthToken = allCookies.some(c => c.name.startsWith('sb-') && c.name.includes('-auth-token'))

  if (!hasAuthToken) {
    if (!isPublicRoute) {
      return redirectWithCookies('/login')
    }
    return supabaseResponse
  }

  // Fast bypass for Next.js router prefetch requests to prevent duplicate cloud queries
  const isPrefetch = request.headers.get('next-router-prefetch') === '1' ||
                     request.headers.get('purpose') === 'prefetch'
  if (isPrefetch && !isPublicRoute) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not logged in → redirect to login (except public routes)
  if (!user) {
    if (!isPublicRoute) {
      return redirectWithCookies('/login')
    }
    return supabaseResponse
  }

  // User is logged in: fetch profile ONCE
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status, onboarding_completed')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) {
    // If profile hasn't been created yet (e.g. slight trigger delay on signup), allow request
    return supabaseResponse
  }

  const isAdmin = ADMIN_ROLES.includes(profile.role)

  // 1. Account status checks
  if (profile.status === 'inactive' || profile.status === 'suspended') {
    if (!isPublicRoute) {
      await supabase.auth.signOut()
      return redirectWithCookies('/login', { error: 'account_disabled' })
    }
    return supabaseResponse
  }

  if (profile.status === 'pending') {
    if (pathname !== '/pending-approval') {
      return redirectWithCookies('/pending-approval')
    }
    return supabaseResponse
  }

  if (pathname === '/pending-approval') {
    return redirectWithCookies(isAdmin ? '/admin/dashboard' : '/dashboard')
  }

  // 2. Onboarding checks
  if (!profile.onboarding_completed) {
    if (pathname !== '/onboarding') {
      return redirectWithCookies('/onboarding')
    }
    return supabaseResponse
  }

  // If already onboarded, prevent accessing /onboarding
  if (profile.onboarding_completed && pathname === '/onboarding') {
    return redirectWithCookies(isAdmin ? '/admin/dashboard' : '/dashboard')
  }

  // 3. Redirect away from public routes for authenticated active users
  if (isPublicRoute) {
    return redirectWithCookies(isAdmin ? '/admin/dashboard' : '/dashboard')
  }

  // 4. Protect admin routes — only admin and super_admin allowed
  if (pathname.startsWith('/admin')) {
    if (!isAdmin || profile.status !== 'active') {
      return redirectWithCookies('/dashboard')
    }
  }

  return supabaseResponse
}

