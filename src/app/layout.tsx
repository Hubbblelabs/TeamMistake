import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import FloatingSupport from '@/components/FloatingSupport';
import Preloader from '@/components/Preloader';
import CookieBanner from '@/components/CookieBanner';

// Configure fonts with Next.js optimization
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TeamMistake - Digital Production Studio',
  description: 'An interactive production studio for every screen, spanning e-comms, experiential, and retail innovation.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    title: 'TeamMistake - Digital Production Studio',
    description: 'An interactive production studio for every screen, spanning e-comms, experiential, and retail innovation.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Preloader />
        <AuthProvider>{children}</AuthProvider>
        <FloatingSupport />
        <CookieBanner />
      </body>
    </html>
  );
}
