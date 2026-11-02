import { NextResponse, type NextRequest } from 'next/server';
import { canAccessRoute, getPrimaryDashboardForRoles } from './lib/auth/roles';
import { UserRoleName } from './lib/types';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and internal next requests pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Session cookie check
  const sessionCookie = request.cookies.get('ahcas_portal_session')?.value;
  let isAuthenticated = false;
  let userRoles: UserRoleName[] = [];
  let userStatus = 'active';

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
      if (parsed.email && parsed.roles && parsed.status === 'active') {
        isAuthenticated = true;
        userRoles = parsed.roles;
        userStatus = parsed.status;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Root and Portal Gateway Redirect
  if (pathname === '/' || pathname === '/portal') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
    const targetDashboard = getPrimaryDashboardForRoles(userRoles);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 2. Unauthenticated accessing student/staff auth pages
  const isPortalAuthPage =
    pathname === '/portal/login' ||
    pathname === '/portal/forgot-password' ||
    pathname === '/portal/reset-password';

  if (isPortalAuthPage) {
    if (isAuthenticated) {
      const targetDashboard = getPrimaryDashboardForRoles(userRoles);
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
    return NextResponse.next();
  }

  // 3. Application Public Routes
  const isApplicationPublicPage =
    pathname === '/application' ||
    pathname === '/application/login' ||
    pathname === '/application/verify-email' ||
    pathname === '/application/forgot-password' ||
    pathname === '/application/reset-password';

  if (isApplicationPublicPage) {
    if (isAuthenticated && (pathname === '/application' || pathname === '/application/login')) {
      if (userRoles.includes('applicant')) {
        return NextResponse.redirect(new URL('/application/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // 4. Unauthorised page always allowed
  if (pathname === '/portal/unauthorised') {
    return NextResponse.next();
  }

  // 5. Applicant Protected Routes
  const isApplicantProtectedRoute =
    pathname.startsWith('/application/dashboard') ||
    pathname.startsWith('/application/profile') ||
    pathname.startsWith('/application/settings') ||
    pathname.startsWith('/application/apply') ||
    pathname.startsWith('/application/review') ||
    pathname.startsWith('/application/slip') ||
    pathname.startsWith('/application/admission-letter') ||
    pathname.startsWith('/application/payments') ||
    pathname.startsWith('/application/receipt') ||
    pathname.startsWith('/application/clearance');

  if (isApplicantProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/application/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const hasAccess = canAccessRoute(userRoles, pathname);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/portal/unauthorised', request.url));
    }
    return NextResponse.next();
  }

  // 6. Student/Staff/Admin Protected Routes Check
  const isProtectedRoute =
    pathname.startsWith('/student') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/portal/profile') ||
    pathname.startsWith('/portal/settings');

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/portal/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const hasAccess = canAccessRoute(userRoles, pathname);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/portal/unauthorised', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/portal/:path*',
    '/student/:path*',
    '/staff/:path*',
    '/admin/:path*',
    '/application/:path*'
  ]
};
