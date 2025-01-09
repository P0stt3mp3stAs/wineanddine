import { NextResponse } from 'next/server';
import { signIn } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await signIn(email, password);

    return NextResponse.json({
      user: {
        id: result.getUsername(),
        email: email,
        accessToken: result.getAccessToken().getJwtToken(),
        idToken: result.getIdToken().getJwtToken(),
        refreshToken: result.getRefreshToken().getToken()
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      },
      { status: 401 }
    );
  }
}

// Optional: Add GET method if needed
export async function GET() {
  return NextResponse.json(
    { message: 'Auth endpoint ready' },
    { status: 200 }
  );
}
