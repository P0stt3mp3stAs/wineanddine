'use client';

import { useState, useEffect, Suspense } from 'react';
import { confirmSignUp, signIn } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { configureAmplify } from '@/lib/auth-config';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-c7 to-c9 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-8">Verify Account</h2>
        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500 bg-opacity-20 text-white p-3 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-c75 transition duration-200"
                disabled={loading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-c75 transition duration-200"
                disabled={loading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                type="text"
                placeholder="Verification code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-c75 transition duration-200"
                disabled={loading}
              />
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full px-4 py-3 bg-c75 text-white rounded-lg font-semibold transition duration-200 hover:bg-c75-dark focus:outline-none focus:ring-2 focus:ring-c75 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-c7 to-c9">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}