import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicAuthPath } from '@/features/auth/auth.routes';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Shared with AuthProvider's client-side guard so the two can't drift apart.
  if (isPublicAuthPath(pathname)) {
    return NextResponse.next();
  }

  // Sanctum SPA auth: the Laravel session cookie IS the credential (the backend
  // issues no accessToken cookie). Middleware can only check presence, not
  // validity — and Laravel hands a session to guests too (the
  // /sanctum/csrf-cookie handshake sets one), so this is a weak first gate.
  // Real validation is `GET /personnel/me` — see AuthProvider.
  const token = request.cookies.get('laravel-session')?.value;



  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};