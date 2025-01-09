// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export async function GET() {
//   try {
//     // Instead of using Amplify directly, get the session from cookies
//     const cookieStore = cookies();
//     const session = cookieStore.get('amplify-signin-with-hostedUI');

//     if (!session) {
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     // Return a basic response for now to test the build
//     return NextResponse.json({
//       status: 'authenticated'
//     });

//   } catch (error) {
//     console.error('Profile error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Your authentication logic here
    // Verify user credentials from your database
    
    // Generate JWT token
    const token = sign(
      { userId: 'user_id', email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return NextResponse.json({ 
      token,
      user: {
        id: 'user_id',
        email
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
