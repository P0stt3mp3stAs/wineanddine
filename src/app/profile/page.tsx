// pages/profile/page.tsx
'use client';
import { useState } from 'react';
import ProfilePicture from '@/components/ProfilePicture';
import { useProfile, UserProfile } from '@/hooks/useProfile';

export default function Profile() {
  const { 
    userInfo, 
    setUserInfo, 
    isLoading, 
    error, 
    setError, 
    handleSignOut, 
    handleDeleteAccount 
  } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleImageUpdate = (url: string) => {
    setUserInfo((prev: UserProfile) => ({ ...prev, profilePicture: url }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>

          <ProfilePicture
            username={userInfo.username}
            initialImage={userInfo.profilePicture}
            onImageUpdate={handleImageUpdate}
            onError={setError}
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                @{userInfo.username}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {userInfo.email}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Sign Out
            </button>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-center text-red-600 font-medium">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Yes, Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}