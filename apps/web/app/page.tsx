/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-no-useless-fragment */

'use client';

import { Wifi, Lock, Laptop } from 'lucide-react';
import useConnectionState from './hooks/useConnectionState';
import { ScrollArea } from '@/components/ui/scroll-area';

import ConnectionCard from './ConnectionCard';
import { Skeleton } from './components/ui/skeleton';

const HomePage = () => {
  const colorClassnames = {
    connected: 'text-brand-green-700 dark:text-brand-green-500',
    not_connected: 'text-brand-yellow-700 dark:text-brand-yellow-500',
    error: 'text-brand-magenta-800 dark:text-brand-magenta-600',
    loading: '',
  };

  const internetState = useConnectionState('internet');
  const ADState = useConnectionState('ad');
  const domainState = useConnectionState('domain');

  const allConnected =
    internetState.connectionState === 'connected' &&
    ADState.connectionState === 'connected' &&
    domainState.connectionState === 'connected';

  const connectionTypes = {
    internet: {
      label: 'INTERNET',
      icon: Wifi,
      state: internetState,
      sublabels: {
        connected: 'You are connected to the internet.',
        not_connected: 'You are not connected to the internet.',
        error: 'Something went wrong...',
      },
    },
    ad: {
      label: 'DEVICE MANAGEMENT',
      icon: Laptop,
      state: ADState,
      sublabels: {
        connected: `Your device is bound to Azure Active Directory.`,
        not_connected: 'You device is not bound to Azure Active Directory.',
        error: 'Something went wrong...',
      },
    },
    domain: {
      label: 'TRUSTED NETWORK',
      icon: Lock,
      state: domainState,
      sublabels: {
        connected: `You are connected to ${domainState.connectionLabel}.`,
        not_connected: 'You are not connected to either ZPA or VPN.',
        error: 'Please connect to the internet to get trusted network status.',
      },
    },
  };

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
        <div className='mt-4 grid grid-cols-2 gap-4'>
          {Object.entries(connectionTypes).map(([key, connectionType]) => {
            const { state, label, icon: Icon, sublabels } = connectionType;
            const { connectionState } = state;

            let sublabel;
            if (connectionState === 'loading') {
              sublabel = '';
              return (
                <div key={key}>
                  <Skeleton className='h-4 w-[175px]' />
                  <Skeleton className='h-4 w-[150px]' />
                </div>
              );
            }
            sublabel = sublabels[connectionState];

            return (
              <ConnectionCard
                key={key}
                title={label}
                state={connectionState}
                icon={
                  <Icon
                    className={`${colorClassnames[connectionState]} h-4 w-4`}
                  />
                }
                sublabel={sublabel}
                classNames={colorClassnames}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HomePage;
