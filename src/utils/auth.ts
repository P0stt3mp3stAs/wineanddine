import { Amplify } from 'aws-amplify';
import {
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails,
  CognitoUserAttribute,
  ISignUpResult,
  ICognitoUserData
} from 'amazon-cognito-identity-js';
import { 
  signIn as amplifySignIn, 
  signUp as amplifySignUp, 
  signOut as amplifySignOut, 
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession
} from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/auth-config';


// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || ''
    }
  }
};

Amplify.configure(amplifyConfig, {
  ssr: true
});

const poolConfig = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || ''
};

const userPool = new CognitoUserPool(poolConfig);

interface SignUpResponse {
  user?: CognitoUser;
  error?: Error;
}

export const signUp = async (
  email: string, 
  password: string, 
  username: string
): Promise<SignUpResponse> => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'preferred_username', Value: username })
    ];

    userPool.signUp(
      email,
      password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          reject({ error: err });
          return;
        }
        resolve({ user: result?.user });
      }
    );
  });
};

interface VerifyResponse {
  success: boolean;
  message: string;
}

export const verifyAccount = async (
  email: string, 
  code: string
): Promise<VerifyResponse> => {
  return new Promise((resolve, reject) => {
    const userData: ICognitoUserData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject({ success: false, message: err.message });
        return;
      }
      resolve({ success: true, message: result });
    });
  });
};

interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

interface SignInResponse {
  success: boolean;
  tokens?: AuthTokens;
  error?: Error;
}

export const signIn = async (
  email: string, 
  password: string
): Promise<SignInResponse> => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData: ICognitoUserData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const tokens = {
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken()
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('idToken', tokens.idToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        
        resolve({ success: true, tokens });
      },
      onFailure: (err) => {
        reject({ success: false, error: err });
      },
    });
  });
};

interface UserAttributes {
  id?: string;
  email?: string;
  username?: string;
  isVerified: boolean;
}

export const getCurrentUser = async (): Promise<UserAttributes | null> => {

  return new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    
    console.log('Current Cognito user:', cognitoUser);
    console.log('UserPool config:', userPool.getUserPoolId(), userPool.getClientId());

    if (!cognitoUser) {
      console.log('No current user found');
      resolve(null);
      return;
    }

    cognitoUser.getSession((err: Error | null, session: any) => {
      if (err) {
        console.log('Session error:', err);
        resolve(null);
        return;
      }
      
      if (!session.isValid()) {
        console.log('Session is invalid');
        resolve(null);
        return;
      }

      console.log('Valid session found');

      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          console.log('Get attributes error:', err);
          resolve(null);
          return;
        }
        
        const userData = {
          id: attributes?.find(attr => attr.Name === 'sub')?.Value,
          email: attributes?.find(attr => attr.Name === 'email')?.Value,
          username: attributes?.find(attr => attr.Name === 'preferred_username')?.Value,
          isVerified: session.isValid()
        };
        
        console.log('User data retrieved:', userData);
        resolve(userData);
      });
    });
  });
};

export const signOut = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('accessToken') !== null;
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || ''
    };

    const userPool = new CognitoUserPool(poolData);

    // @ts-ignore - The types for listUsers are incorrect in the SDK
    userPool.listUsers({
      Filter: `preferred_username = "${username}"`,
      Limit: 1
    }, (err: Error | null, data: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Users.length === 0);
    });
  });
};

export async function checkAuthStatus() {
  try {
    configureAmplify();
    const currentUser = await amplifyGetCurrentUser();
    return currentUser;
  } catch (error) {
    return null;
  }
}

export async function handleSignOut(): Promise<boolean> {
  try {
    await amplifySignOut({ global: true });
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

export async function handleSignIn(email: string, password: string) {
  try {
    // Make sure Amplify is configured
    configureAmplify();
    
    const signInResult = await amplifySignIn({
      username: email,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH"
      }
    });

    // If sign in successful, explicitly store tokens
    if (signInResult.isSignedIn) {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken;
      const idToken = session.tokens?.idToken;

      if (accessToken && idToken) {
        localStorage.setItem('accessToken', accessToken.toString());
        localStorage.setItem('idToken', idToken.toString());
        
        // Also set as cookies with a long expiration (30 days)
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `accessToken=${accessToken.toString()}; path=/; expires=${expires}`;
        document.cookie = `idToken=${idToken.toString()}; path=/; expires=${expires}`;
      }
    }

    return signInResult;
  } catch (error) {
    console.error('HandleSignIn error:', error);
    throw error;
  }
}

export async function handleSignUp(
  email: string, 
  password: string, 
  username: string
) {
  try {
    const { isSignUpComplete, userId } = await amplifySignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          preferred_username: username
        }
      }
    });
    return { isSignUpComplete, userId };
  } catch (error) {
    throw error;
  }
}

// Export getCurrentUser from Amplify for server-side use
export { getCurrentUser as getServerUser } from 'aws-amplify/auth';
function fetchUserAttributes() {
  throw new Error('Function not implemented.');
}

