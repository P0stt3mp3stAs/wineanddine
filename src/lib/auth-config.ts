import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
          username: false,
          phone: false
        }
      }
    }
  });

  cognitoUserPoolsTokenProvider.setKeyValueStorage({
    getItem: (key: string) => {
      try {
        return Promise.resolve(localStorage.getItem(key));
      } catch {
        return Promise.resolve(null);
      }
    },
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    },
    clear: () => {
      try {
        localStorage.clear();
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    }
  });
}
