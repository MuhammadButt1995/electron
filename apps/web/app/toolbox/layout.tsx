/* eslint-disable react/function-component-definition */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { UndoDot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <>
      {pathName !== '/toolbox' && (
        <Button
          className='fixed right-12 top-8 justify-between'
          onClick={() => router.replace('/toolbox')}
          variant='outline'
        >
          <UndoDot className='mr-2 h-4 w-4' />
          Back to Toolbox
        </Button>
      )}

      {children}
    </>
  );
}
