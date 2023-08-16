/* eslint-disable react/function-component-definition */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='grid min-h-full px-6 py-24 place-content-center'>
      <div className='text-center'>
        <div className='flex flex-row items-center justify-center space-x-4 text-brand-magenta'>
          <p className='text-base font-semibold text-brand-magenta-800 dark:text-brand-magenta-600'>
            Something went wrong
          </p>

          <Separator orientation='vertical' className='h-4' />

          <h1 className='text-base font-semibold text-brand-magenta-800 dark:text-brand-magenta-600'>
            {error.name}
          </h1>
        </div>

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

      <Button
        className='mt-10'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
