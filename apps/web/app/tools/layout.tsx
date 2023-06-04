/* eslint-disable react/function-component-definition */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { UndoDot, Users } from 'lucide-react';
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
      {pathName === '/tools' ? (
        <Button className='fixed right-6 top-8 justify-between'>
          <Users className='mr-2 h-4 w-4' />
          Switch Toolbox
        </Button>
      ) : (
        <Button
          className='fixed right-6 top-8 justify-between'
          onClick={() => router.replace('/tools')}
        >
          <UndoDot className='mr-2 h-4 w-4' />
          Back to Toolbox
        </Button>
      )}

      {children}
    </>
  );
}
