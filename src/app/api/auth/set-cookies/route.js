import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { accessToken, idToken, refreshToken } = await request.json();

  // Get cookies instance
  const cookieStore = cookies();

  // Set cookies with HTTP-only flag
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  cookieStore.set('idToken', idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return NextResponse.json({ success: true });
}