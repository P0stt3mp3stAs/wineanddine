// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { getCurrentUser, deleteUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { uploadImage, getImageUrl } from '@/utils/storage';

export interface UserProfile {
  email: string | null;
  username: string | null;
  profilePicture?: string;
}

export const useProfile = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserProfile>({ email: null, username: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      if (currentUser) {
        setUserInfo({
          email: attributes.email || null,
          username: attributes['preferred_username'] || null,
        });
        
        try {
          const imageKey = `profiles/${attributes['preferred_username']}/profile.jpg`;
          const imageUrl = await getImageUrl(imageKey);
          setUserInfo(prev => ({ ...prev, profilePicture: imageUrl }));
        } catch (error) {
          console.log('No existing profile picture');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      router.push('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      Cookies.remove('accessToken');
      Cookies.remove('idToken');
      Cookies.remove('refreshToken');
      await signOut();
      localStorage.clear();
      router.push('/signin');
    } catch (error) {
      console.error('Error during sign out:', error);
      router.push('/signin');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      await handleSignOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return {
    userInfo,
    setUserInfo,
    isLoading,
    error,
    setError,
    handleSignOut,
    handleDeleteAccount
  };
};