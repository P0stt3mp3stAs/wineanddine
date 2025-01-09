import { Amplify } from 'aws-amplify';

export function getAmplifyConfig() {
  return {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
      }
    }
  };
}
