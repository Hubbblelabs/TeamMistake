import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import FloatingSupport from '@/components/FloatingSupport';

// Configure fonts with Next.js optimization (eliminates render-blocking)
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TeamMistake - We Deliver What You Need',
  description: 'At our core, we are a client-centric software company, driven by innovation and dedicated to crafting solutions that align with your unique needs.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <FloatingSupport />
      </body>
    </html>
  );
}
