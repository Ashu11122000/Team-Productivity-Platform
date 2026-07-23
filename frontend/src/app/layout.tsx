import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import { env } from '@/config/env';
import { AppProviders } from '@/providers/app-providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),

  title: {
    default: 'Team Productivity Platform',
    template: '%s | Team Productivity Platform',
  },

  description:
    'A modern enterprise productivity platform built with Next.js, FastAPI, NestJS, and PostgreSQL.',

  applicationName: 'Team Productivity Platform',

  keywords: [
    'Productivity',
    'Task Management',
    'Notes',
    'Analytics',
    'Dashboard',
    'Next.js',
    'FastAPI',
    'NestJS',
    'PostgreSQL',
    'Enterprise',
  ],

  authors: [
    {
      name: 'Ashish Sharma',
    },
  ],

  creator: 'Ashish Sharma',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Team Productivity Platform',
    description:
      'Enterprise productivity platform built with Next.js, FastAPI, NestJS, and PostgreSQL.',
    siteName: 'Team Productivity Platform',
    url: env.NEXT_PUBLIC_APP_URL,
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Team Productivity Platform',
    description:
      'Enterprise productivity platform built with Next.js, FastAPI, NestJS, and PostgreSQL.',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className='bg-background min-h-screen font-sans antialiased'>
        <AppProviders>{children}</AppProviders>

        {env.NEXT_PUBLIC_GA_ID ? <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} /> : null}
      </body>
    </html>
  );
}
