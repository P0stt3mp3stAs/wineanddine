import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export const checkAuthStatus = async () => {
  try {
    const currentUser = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    console.log('Current logged in user:', attributes.email);
    return {
      isAuthenticated: true,
      userEmail: attributes.email
    };
  } catch (error) {
    console.log('No user is currently logged in');
    return {
      isAuthenticated: false,
      userEmail: null
    };
  }
};