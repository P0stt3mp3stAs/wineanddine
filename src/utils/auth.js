import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolConfig = {
  UserPoolId: 'us-east-1_daJbUvWzH',
  ClientId: '5hlt0jspd175jnj3j8rf9hf2t2'
};

const userPool = new CognitoUserPool(poolConfig);

export const signUp = async (email, password, username) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      [
        { Name: 'email', Value: email },
        { Name: 'preferred_username', Value: username }
      ],
      null,
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
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
        localStorage.setItem('accessToken', result.getAccessToken().getJwtToken());
        localStorage.setItem('idToken', result.getIdToken().getJwtToken());
        localStorage.setItem('refreshToken', result.getRefreshToken().getToken());
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
        resolve({
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
    localStorage.clear();
  }
};

export const isAuthenticated = () => {
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