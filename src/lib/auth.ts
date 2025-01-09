// src/lib/auth.ts
import { Amplify } from 'aws-amplify';

if (typeof window !== 'undefined') {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!
      }
    }
  });
}

export { getCurrentUser } from 'aws-amplify/auth';
