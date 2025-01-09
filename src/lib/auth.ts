// src/lib/auth.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!
    }
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!
    }
  }
});

export { getCurrentUser } from 'aws-amplify/auth';
