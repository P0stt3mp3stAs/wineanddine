'use client';

import { useState, useEffect } from 'react';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { configureAmplify } from '@/lib/auth-config';
import { motion } from 'framer-motion';

export default function SignIn() {
  const router = useRouter();
  const [isConfigured, setIsConfigured] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        configureAmplify();
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            router.push('/dashboard');
            return;
          }
        } catch (e) {
          // No user is signed in, continue with sign in page
        }
        setIsConfigured(true);
      } catch (error) {
        console.error('Failed to configure Amplify:', error);
        setError('Authentication system initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const signInResult = await signIn({
        username: email,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH"
        }
      });

      if (signInResult.isSignedIn) {
        window.location.href = '/dashboard';
        return;
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError((err as any).message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-c7 to-c9">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-c7 to-c9 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-c75 transition duration-200"
                disabled={loading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            className="w-full py-3 bg-c75 text-white rounded-lg font-semibold transition duration-200 hover:bg-c8 focus:outline-none focus:ring-2 focus:ring-c75 focus:ring-offset-2 focus:ring-offset-c9"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-white"
        >
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="font-medium text-c75 hover:text-c8 focus:outline-none focus:underline transition duration-200"
          >
            Sign up
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}