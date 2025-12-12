import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TeamMistake - We Deliver What You Need',
  description: 'At our core, we are a client-centric software company, driven by innovation and dedicated to crafting solutions that align with your unique needs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
