// src/utils/auth.js
import { Amplify } from 'aws-amplify';
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

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

export const signUp = async (email, password, username) => {
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
          reject(err);
          return;
        }
        resolve(result?.user);
      }
    );
  });
};

export const verifyAccount = async (email, code) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
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
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
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
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    
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
  const cognitoUser = userPool.getCurrentUser();
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

export const checkUsernameAvailability = async (username) => {
  return new Promise((resolve, reject) => {
    userPool.listUsers({
      Filter: `preferred_username = "${username}"`,
      Limit: 1
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.Users.length === 0);
    });
  });
};

// Modify your existing auth.js by adding these functions

// Add this to your existing exports
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  
  return `Bearer ${accessToken}`;
};

// Add this helper function for authenticated API calls
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

  // Handle token expiration
  if (response.status === 401) {
    // Optional: Attempt to refresh token
    const cognitoUser = userPool.getCurrentUser();
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
        // Retry the request with new token
        return fetchWithAuth(url, options);
      } catch (error) {
        signOut();
        throw new Error('Session expired');
      }
    }
  }

  return response;
};

// Add this helper for protected API routes
export const validateToken = async (token) => {
  if (!token) return null;

  try {
    const cognitoUser = userPool.getCurrentUser();
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


// Export getCurrentUser from Amplify for server-side use
export { getCurrentUser as getServerUser } from 'aws-amplify/auth';
