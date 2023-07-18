/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/function-component-definition */

'use client';

import '@/styles/globals.css';
import { ErrorBoundary } from 'react-error-boundary';
import { shallow } from 'zustand/shallow';
import { Source_Sans_3 } from '@next/font/google';
import Providers from '@/components/lib/provider';
import { useGlobalStateStore } from '@/store/settings-store';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { QueryRunner } from './query-runner';
import Sidebar from '@/components/sidebar';
import useInitialStates from './hooks/useInitialStates';

const SOURCE_SANS_PRO = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

export default function RootLayout({ children }: { children: JSX.Element }) {
  useInitialStates();
  const [theme, toggleTheme] = useGlobalStateStore(
    (state) => [state.theme, state.toggleTheme],
    shallow
  );

  return (
    <html lang='en'>
      <body
        className={`${SOURCE_SANS_PRO.className} ${
          theme === 'dark' ? 'dark' : 'light'
        }`}
      >
        <div className='fixed bottom-0 left-0 right-0 justify-between'>
          <Separator />
          <Sidebar theme={theme} toggleTheme={toggleTheme} />
        </div>
        <Providers>
          <ErrorBoundary FallbackComponent={fallbackRender}>
            <QueryRunner>{children}</QueryRunner>
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
