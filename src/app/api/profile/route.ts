import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Instead of using Amplify directly, get the session from cookies
    const cookieStore = cookies();
    const session = cookieStore.get('amplify-signin-with-hostedUI');

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Return a basic response for now to test the build
    return NextResponse.json({
      status: 'authenticated'
    });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
