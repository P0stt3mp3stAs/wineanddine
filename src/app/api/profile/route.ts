// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/utils/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      name: user.username,
      email: user.email
    });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Failed to load profile' },
      { status: 500 }
    );
  }
}
