/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/function-component-definition */

'use client';

import '@/styles/globals.css';
import { ErrorBoundary } from 'react-error-boundary';
import { Wrench, Home, LayoutDashboard } from 'lucide-react';
import { Source_Sans_3 } from '@next/font/google';
import Navbar from '@/components/layout/navbar';
import Providers from '@/components/lib/provider';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { QueryRunner } from '@/components/layout/query-runner';
import { ThemeProvider } from '@/components/lib/theme-provider';
import useInitialStates from '@/hooks/useInitialStates';

const SOURCE_SANS_PRO = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

const navItems = [
  {
    title: 'FMInfo',
    icon: <LayoutDashboard className='w-4 h-4 mb-1' />,
    href: '/',
  },
  {
    title: 'Toolbox',
    icon: <Wrench className='w-4 h-4 mb-1' />,
    href: '/toolbox',
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
    <div className='grid min-h-full px-6 py-24 place-content-center'>
      <div className='text-center'>
        <p className='text-base font-semibold text-brand-magenta-800 dark:text-brand-magenta-600'>
          Something went wrong
        </p>

        <h1 className='mt-4 text-3xl font-bold tracking-tight'>
          {error.message}
        </h1>

        <h1 className='mt-4 text-xl font-bold tracking-tight'>
          {error.cause?.toString()}
        </h1>

        <p className='mt-6 leading-7 text-muted-foreground'>
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
