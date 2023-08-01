/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/function-component-definition */

'use client';

import '@/styles/globals.css';
import { ErrorBoundary } from 'react-error-boundary';
import { Wrench, Home, LayoutDashboard } from 'lucide-react';
import { Source_Sans_3 } from '@next/font/google';
import Navbar from './components/navbar';
import Providers from '@/components/lib/provider';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { QueryRunner } from './query-runner';
import { ThemeProvider } from '@/components/lib/theme-provider';
import useInitialStates from './hooks/useInitialStates';

const SOURCE_SANS_PRO = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

const navItems = [
  {
    title: 'Home',
    icon: <Home className='mb-1 h-4 w-4' />,
    href: '/',
  },
  {
    title: 'FMInfo',
    icon: <LayoutDashboard className='mb-1 h-4 w-4' />,
    href: '/fminfo',
  },
  {
    title: 'Tools',
    icon: <Wrench className='mb-1 h-4 w-4' />,
    href: '/tools',
  },
];

export default function RootLayout({ children }: { children: JSX.Element }) {
  useInitialStates();

  return (
    <html lang='en'>
      <body className={`${SOURCE_SANS_PRO.className}`}>
        <Providers>
          <ErrorBoundary FallbackComponent={fallbackRender}>
            <QueryRunner>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
              >
                <div className='fixed bottom-0 left-0 right-0 justify-between'>
                  <Separator />
                  <Navbar items={navItems} />
                </div>
                {children}
              </ThemeProvider>
            </QueryRunner>
          </ErrorBoundary>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

function fallbackRender({ error, resetErrorBoundary }) {
  return (
    <div className='grid min-h-full place-content-center px-6 py-24'>
      <div className='text-center'>
        <p className='text-brand-magenta-800 dark:text-brand-magenta-600 text-base font-semibold'>
          Something went wrong
        </p>

        <h1 className='mt-4 text-3xl font-bold tracking-tight'>
          {error.message}
        </h1>

        <h1 className='mt-4 text-xl font-bold tracking-tight'>
          {error.cause?.toString()}
        </h1>

        <p className='text-muted-foreground mt-6 leading-7'>
          Please click &apos;Try again&apos; to see if the problem has been
          fixed or contact the tech center if the problem persists.
        </p>
      </div>

      <Button className='mt-10' onClick={() => resetErrorBoundary()}>
        Try again
      </Button>
    </div>
  );
}
