import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();

  // Clear all auth cookies
  cookieStore.delete('accessToken');
  cookieStore.delete('idToken');
  cookieStore.delete('refreshToken');

  return NextResponse.json({ success: true });
}