import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('accessToken');
  const path = request.nextUrl.pathname;

  console.log('Middleware checking path:', path);
  console.log('Token exists:', !!token);

  // Only protect dashboard routes - don't redirect signin/signup anymore
  if (path.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token found, redirecting to signin');
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Let all other routes pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};