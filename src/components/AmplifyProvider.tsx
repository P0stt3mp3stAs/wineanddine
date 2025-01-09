'use client';

import { Amplify } from 'aws-amplify';
import { PropsWithChildren, useEffect } from 'react';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_daJbUvWzH',
      userPoolClientId: '5hlt0jspd175jnj3j8rf9hf2t2',
      signUpVerificationMethod: 'code',
    }
  }
});

export default function AmplifyProvider({ children }: PropsWithChildren) {
  return children;
}