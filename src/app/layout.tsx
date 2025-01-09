// src/app/layout.tsx
import '@/utils/amplify-config';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import AmplifyProvider from '@/components/AmplifyProvider';
import '../config/amplifyConfig';
// import { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <AmplifyProvider>
          <Navbar />
          {children}
          {/* <Toaster position="top-right" /> */}
        </AmplifyProvider>
      </body>
    </html>
  );
}
