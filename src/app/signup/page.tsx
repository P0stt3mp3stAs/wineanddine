'use client';

import { useState, useEffect } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { configureAmplify } from '@/lib/auth-config';
import { motion } from 'framer-motion';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        configureAmplify();
        setIsConfigured(true);
      } catch (error) {
        console.error('Failed to configure Amplify:', error);
        setError('Authentication system initialization failed');
      }
    };

    initializeAuth();
  }, []);

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validateUsername(formData.username)) {
        throw new Error('Username must be 3-15 characters long and can only contain letters, numbers, and underscores');
      }

      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            preferred_username: formData.username
          }
        }
      });

      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
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
        <h2 className="text-4xl font-bold text-[#05004f] text-center mb-8">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                type="text"
                placeholder="Username (3-15 characters, letters, numbers, underscore)"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-[#7c0323] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#ffdb3d] transition duration-200"
                disabled={loading}
              />
            </motion.div>
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
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full py-3 bg-[#ffdb3d] text-[#05004f] rounded-lg font-semibold transition duration-200 hover:bg-[#fdce00] focus:outline-none focus:ring-2 focus:ring-[#ffdb3d] focus:ring-offset-2 focus:ring-offset-[#ffd9c4]"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-[#05004f]"
        >
          Already have an account?{' '}
          <button
            onClick={() => router.push('/signin')}
            className="font-medium text-[#7c0323] hover:text-[#742f37] focus:outline-none focus:underline transition duration-200"
          >
            Sign in
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}