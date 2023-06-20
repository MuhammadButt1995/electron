/* eslint-disable react/jsx-no-useless-fragment */

'use client';

import { Wifi, Laptop, Lock } from 'lucide-react';
import { useOs } from '@mantine/hooks';
import { useInternetConnection } from '@/hooks/useInternetConnection';
import { useADConnection } from '@/hooks/useADConnection';
import { useDomainConnection } from '@/hooks/useDomainConnection';
import useMounted from './hooks/useMounted';
import ConnectionCard from './ConnectionCard';

const HomePage = () => {
  const internetConnection = useInternetConnection();
  const ADConnection = useADConnection();
  const domainConnection = useDomainConnection();
  const os = useOs();
  const mounted = useMounted();

  // Render data from the WebSocket connections
  return (
    <>
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Your Talos Home
            </h2>
            <p className='text-muted-foreground text-sm'>
              Live health metrics for your work environment.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 pt-6'>
          <ConnectionCard
            state={internetConnection.status}
            title='INTERNET'
            icon={<Wifi className='mr-2 h-4 w-4' />}
            description={internetConnection.description}
          />

          <ConnectionCard
            state={ADConnection.status}
            title={os === 'macos' ? 'ON-PREM AD' : 'AZURE AD'}
            icon={<Laptop className='mr-2 h-4 w-4' />}
            description={ADConnection.description}
          />

          <ConnectionCard
            state={domainConnection.status}
            title='TRUSTED NETWORK'
            icon={<Lock className='mr-2 h-4 w-4' />}
            description={domainConnection.description}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
