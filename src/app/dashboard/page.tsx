'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { configureAmplify } from '@/lib/auth-config';

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
        setTimeout(() => {
          router.push('/signin');
        }, 1000);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <DashboardHero />
      <MenuPreview />
      <ReservationSection />
    </main>
  );
}
