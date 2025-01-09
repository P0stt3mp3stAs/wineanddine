// src/lib/server-auth.ts
import { Amplify } from 'aws-amplify';

export function initializeAmplify() {
  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!
        }
      }
    });
  } catch (error) {
    console.error('Error initializing Amplify:', error);
  }
}
