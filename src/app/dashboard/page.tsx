'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { configureAmplify } from '@/lib/auth-config';
import { handleSignOut } from '@/utils/auth';

export default function Dashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ email: null, username: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        configureAmplify();
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUserInfo({
            email: currentUser.username || null,
            username: currentUser.username || null
          });
        } else {
          throw new Error('No user found');
        }
      } catch (error) {
        console.log('No user is logged in, redirecting to signin');
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOutClick = async () => {
    await handleSignOut();
    router.push('/signin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!userInfo.email) {
    return null;
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome, {userInfo.email}</p>
            </div>
            <button
              onClick={handleSignOutClick}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
