'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import DashboardHero from '@/components/DashboardHero';
import ReservationSection from '@/components/ReservationSection';
import MenuPreview from '@/components/menu/MenuPreview';

interface UserInfo {
  email: string | null;
  username: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: null, username: null });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUserInfo({
          email: currentUser.email || null,
          username: currentUser.username || null
        });
        console.log('Logged in user:', currentUser.email);
      }
    } catch (error) {
      console.log('No user is logged in');
      setUserInfo({ email: null, username: null });
      router.push('/signin');
    }
  };

  if (!userInfo.email) {
    return null;
  }

  return (
    <main>
      <DashboardHero />
      <MenuPreview />
      <ReservationSection />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black">welcome to Dashboard</h1>
                <p className="text-sm mt-2">
                  {userInfo.username && `@${userInfo.username}`}
                  <br />
                  {userInfo.email}
                </p>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}