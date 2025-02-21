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
    <div className="min-h-screen flex items-center justify-center bg-[#ffd9c4] p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#ffefe6] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-4xl font-bold text-[#05004f] text-center mb-8">Verify Account</h2>
        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#E60012] bg-opacity-20 text-[#05004f] p-3 rounded-lg text-center"
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
                className="w-full px-4 py-3 bg-[#7c0323] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#ffdb3d] transition duration-200"
                disabled={loading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-[#7c0323] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#ffdb3d] transition duration-200"
                disabled={loading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                type="text"
                placeholder="Verification code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-4 py-3 bg-[#7c0323] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#ffdb3d] transition duration-200"
                disabled={loading}
              />
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full py-3 bg-[#ffdb3d] text-[#05004f] rounded-lg font-semibold transition duration-200 hover:bg-[#fdce00] focus:outline-none focus:ring-2 focus:ring-[#ffdb3d] focus:ring-offset-2 focus:ring-offset-[#ffd9c4]"
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
      <div className="min-h-screen flex items-center justify-center bg-[#ffd9c4]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#05004f]"></div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}