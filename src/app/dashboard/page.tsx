'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { configureAmplify } from '@/lib/auth-config';
import { handleSignOut } from '@/utils/auth';
import DashboardHero from '@/components/DashboardHero';
import ReservationSection from '@/components/ReservationSection';
import MenuPreview from '@/components/menu/MenuPreview';

interface UserInfo {
  email: string | null;
  username: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: null,
    username: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Dashboard - Starting auth check');
        configureAmplify();
        
        // Try to get session first
        const session = await fetchAuthSession();
        console.log('Dashboard - Auth session:', session);
        
        const currentUser = await getCurrentUser();
        console.log('Dashboard - Current user:', currentUser);

        if (currentUser) {
          setUserInfo({
            email: currentUser.username || null,
            username: currentUser.username || null
          });
          setIsLoading(false);
        } else {
          console.log('Dashboard - No user found');
          throw new Error('No user found');
        }
      } catch (error) {
        console.error('Dashboard - Auth check error:', error);
        // Add a delay before redirect to see logs
        setTimeout(() => {
          router.push('/signin');
        }, 1000);
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

  // if (!userInfo.email) {
  //   return null;
  // }

  return (
    <main className="min-h-screen">
      <DashboardHero />
      <MenuPreview />
      <ReservationSection />
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
