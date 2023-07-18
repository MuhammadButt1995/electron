/* eslint-disable react/require-default-props */

'use client';

import { Network, Wifi } from 'lucide-react';
import FminfoCard, { FminfoRating } from '@/components/Fminfo/fminfo-card';
import { useGlobalStateStore } from '@/store/settings-store';

import {
  DataPopoverButton,
  DataPopoverButtonProps,
} from '../../data-popover-button';
import { useNetworkAdapters } from '@/hooks/useQueryHooks/useNetworkAdapters';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import ClipboardText from '@/components/clipboard-text';

const InternetConnectionCard = () => {
  const IS_CONNECTED_TO_INTERNET = useGlobalStateStore(
    (state) => state.isConnectedToInternet
  );

  const internetConnectionValue = IS_CONNECTED_TO_INTERNET
    ? 'CONNECTED'
    : 'NOT CONNECTED';

  const cardProps = {
    rating: IS_CONNECTED_TO_INTERNET ? 'ok' : ('warn' as FminfoRating),
    title: 'INTERNET CONNECTION',
    value: internetConnectionValue,
    icon: <Wifi className='mr-2 h-4 w-4' />,
    cardBody: (
      <p className='text-muted-foreground w-7/12 text-xs'>
        {IS_CONNECTED_TO_INTERNET
          ? 'You are connected to the Internet.'
          : 'Please connect to a Wi-Fi network or switch to a hardwired connection.'}
      </p>
    ),
  };

  const networkAdapterQuery = useNetworkAdapters();

  const IS_NETWORK_ADAPTER_LOADING =
    networkAdapterQuery.isLoading || networkAdapterQuery.isFetching;
  const IS_NETWORK_ADAPTER_LOADED = networkAdapterQuery.isSuccess;

  const getNetworkAdaptersContentProps = (): DataPopoverButtonProps => {
    let content: React.ReactNode;

    if (IS_NETWORK_ADAPTER_LOADING) {
      content = (
        <div className='flex items-center space-x-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
      );
    }

    if (IS_NETWORK_ADAPTER_LOADED) {
      content = (
        <ScrollArea>
          {Object.entries(
            networkAdapterQuery.data.data.activeAdapters || {}
          ).map(([key, value]) => (
            <div key={key} className='grid grid-cols-2 items-center gap-4'>
              <Label key={key}>{key}</Label>
              <ClipboardText text={value} classNames='h-8' />
            </div>
          ))}
        </ScrollArea>
      );
    }

    return {
      icon: <Network className='h-4 w-4' />,
      btnClasses: 'absolute bottom-3 right-5 w-10 rounded-full p-0',
      fetchData: networkAdapterQuery.refetch,
      disabled: !IS_CONNECTED_TO_INTERNET,
      children: (
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              Your active network adapters
            </h4>
            <p className='text-muted-foreground w-72 text-sm'>
              Your IP Address is will usually correspond to the
              &quot;Wi-Fi&quot; or &quot;Ethernet&quot; adapter.
            </p>
          </div>
          <div className='grid gap-2'>{content}</div>
        </div>
      ),
    };
  };

  return (
    <FminfoCard {...cardProps}>
      <DataPopoverButton {...getNetworkAdaptersContentProps()} />
    </FminfoCard>
  );
};

export default InternetConnectionCard;
