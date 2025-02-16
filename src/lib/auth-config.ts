import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

let isConfigured = false;

export function configureAmplify() {
  if (isConfigured) return;

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
          },
        }
      }
    }, {
      ssr: true
    });

    // Configure token storage to use cookies instead of localStorage in production
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      cognitoUserPoolsTokenProvider.setKeyValueStorage({
        getItem: (key: string) => {
          const value = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)')?.pop() || '';
          return Promise.resolve(value);
        },
        setItem: (key: string, value: string) => {
          document.cookie = `${key}=${value}; path=/; secure; max-age=86400`;
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          return Promise.resolve();
        },
        clear: () => {
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
          });
          return Promise.resolve();
        }
      });
    }

    // Add debug logging
    console.log('Amplify configured with:', {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      region: process.env.NEXT_PUBLIC_AWS_REGION
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

    isConfigured = true;
    console.log('Amplify configured successfully');
  } catch (error) {
    console.error('Error configuring Amplify:', error);
    // isConfigured = false;
    throw error;
  }
}

export function getAuthConfig() {
  return {
    isConfigured,
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    region: process.env.NEXT_PUBLIC_AWS_REGION
  };
}
