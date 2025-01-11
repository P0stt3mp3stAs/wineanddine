import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

export function configureAmplify() {
  if (
    !process.env.NEXT_PUBLIC_USER_POOL_ID ||
    !process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ||
    !process.env.NEXT_PUBLIC_AWS_REGION
  ) {
    console.error('AWS Cognito credentials are not properly configured');
    return;
  }

  try {
    // Configure Amplify
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
          userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
          signUpVerificationMethod: 'code',
          loginWith: {
            email: true,
            username: false,
            phone: false
          }
        }
      }
    }, {
      ssr: true
    });

    // Configure token storage
    cognitoUserPoolsTokenProvider.setKeyValueStorage({
      getItem: (key: string) => {
        try {
          if (typeof window !== 'undefined') {
            return Promise.resolve(localStorage.getItem(key));
          }
          return Promise.resolve(null);
        } catch {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
          }
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
      removeItem: (key: string) => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
      clear: () => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.clear();
          }
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      }
    });

    console.log('Amplify configured successfully');
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
}
