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

export function middleware(request) {
  const authHeader = request.headers.get('Authorization');
  const path = request.nextUrl.pathname;

  console.log('Middleware checking path:', path);
  console.log('Auth header exists:', !!authHeader);

  // Only protect dashboard routes
  if (path.startsWith('/dashboard')) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found, redirecting to signin');
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    // You can also verify the token here if needed
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Add auth header to the response
  const response = NextResponse.next();
  response.headers.set('x-auth-status', 'checked');
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*']
};
