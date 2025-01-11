'use client';

import { useState, useEffect, Suspense } from 'react';
import { confirmSignUp, signIn } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { configureAmplify } from '@/lib/auth-config';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfigured, setIsConfigured] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        configureAmplify();
        setIsConfigured(true);
        const email = searchParams.get('email');
        if (email) {
          setFormData(prev => ({ ...prev, email }));
        }
      } catch (error) {
        console.error('Failed to configure Amplify:', error);
        setError('Authentication system initialization failed');
      }
    };

    initializeAuth();
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConfigured) {
      setError('Please wait while the authentication system initializes...');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmSignUp({
        username: formData.email,
        confirmationCode: formData.code
      });

      const signInResult = await signIn({
        username: formData.email,
        password: formData.password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH"
        }
      });

      if (signInResult.isSignedIn) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          {error && (
            <div className="text-red-600 text-center text-sm">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Verification code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
