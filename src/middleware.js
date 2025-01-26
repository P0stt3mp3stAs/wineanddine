// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const token = request.cookies.get('accessToken');
//   const path = request.nextUrl.pathname;

//   console.log('Middleware checking path:', path);
//   console.log('Token exists:', !!token);

//   // Only protect dashboard routes - don't redirect signin/signup anymore
//   if (path.startsWith('/dashboard')) {
//     if (!token) {
//       console.log('No token found, redirecting to signin');
//       return NextResponse.redirect(new URL('/signin', request.url));
//     }
//   }

//   // Let all other routes pass through
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*']
// };

import { NextResponse } from 'next/server';
// import { configureAmplify } from '@/lib/auth-config';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/dashboard')) {
    try {
      // Debug logs
      console.log('Middleware - Request path:', path);
      console.log('Middleware - Cookies:', request.cookies.getAll());
      console.log('Middleware - Headers:', Object.fromEntries(request.headers.entries()));

      // Let the request through for now to debug dashboard page
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};