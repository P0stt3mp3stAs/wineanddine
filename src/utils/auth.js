// src/utils/auth.js
import { Amplify } from 'aws-amplify';
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
};

const isConfigValid = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_USER_POOL_ID &&
    process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
  );
};


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

let userPool = null;

const getUserPool = () => {
  if (!isConfigValid()) {
    throw new Error('Cognito configuration is missing');
  }
  
  if (!userPool) {
    userPool = new CognitoUserPool(poolConfig);
  }
  
  return userPool;
};

export const signUp = async (email, password, username) => {
  if (!isConfigValid()) {
    throw new Error('Authentication service not configured');
  }

  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'preferred_username', Value: username })
    ];

    getUserPool().signUp(
      email,
      password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result?.user);
      }
    );
  });
};

export const verifyAccount = async (email, code) => {
  if (!isConfigValid()) {
    throw new Error('Authentication service not configured');
  }

  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: getUserPool()
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const signIn = async (email, password) => {
  if (!isConfigValid()) {
    throw new Error('Authentication service not configured');
  }

  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: getUserPool()
    });

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
        
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const getCurrentUser = () => {
  if (!isConfigValid()) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const cognitoUser = getUserPool().getCurrentUser();
    
    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!session.isValid()) {
        resolve(null);
        return;
      }

      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!attributes) {
          resolve(null);
          return;
        }

        resolve({
          id: attributes.find(attr => attr.Name === 'sub')?.Value,
          email: attributes.find(attr => attr.Name === 'email')?.Value,
          username: attributes.find(attr => attr.Name === 'preferred_username')?.Value,
          isVerified: session.isValid()
        });
      });
    });
  });
};

export const signOut = () => {
  const cognitoUser = getUserPool().getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('accessToken') !== null;
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  
  return `Bearer ${accessToken}`;
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    'Authorization': token,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const cognitoUser = getUserPool().getCurrentUser();
    if (cognitoUser) {
      try {
        await new Promise((resolve, reject) => {
          cognitoUser.getSession((err, session) => {
            if (err) {
              signOut();
              reject(err);
            } else {
              localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
              resolve(session);
            }
          });
        });
        return fetchWithAuth(url, options);
      } catch (error) {
        signOut();
        throw new Error('Session expired');
      }
    }
  }

  return response;
};

export const validateToken = async (token) => {
  if (!token) return null;

  try {
    const cognitoUser = getUserPool().getCurrentUser();
    if (!cognitoUser) return null;

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err || !session.isValid()) {
          reject(err || new Error('Invalid session'));
          return;
        }
        resolve(session);
      });
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

export { getCurrentUser as getServerUser } from 'aws-amplify/auth';
