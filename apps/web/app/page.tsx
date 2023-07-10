/* eslint-disable no-nested-ternary */

'use client';

import {
  Wifi,
  Signal,
  Lock,
  Laptop,
  KeyRound,
  HardDrive,
  HelpCircle,
  Network,
} from 'lucide-react';
import { useEffect } from 'react';
import { useOs, useNetwork } from '@mantine/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWiFiData } from '@/hooks/useQueryHooks/useWifiData';
import { useTrustedNetworkStatus } from '@/hooks/useQueryHooks/useTrustedNetworkStatus';
import { useADStatus } from '@/hooks/useQueryHooks/useADStatus';
import { usePasswordData } from './hooks/useQueryHooks/usePasswordData';
import { useDiskSpace } from './hooks/useQueryHooks/useDiskData';
import { useNetworkAdapters } from './hooks/useQueryHooks/useNetworkAdapters';

import FminfoCard, { FminfoCardProps } from '@/components/fminfo-card';

import {
  DataPopoverButton,
  DataPopoverButtonProps,
} from './data-popover-button';
import {
  StaticPopoverButton,
  StaticPopoverButtonProps,
} from './static-popover-button';

import { Skeleton } from './components/ui/skeleton';
import { Label } from './components/ui/label';
import ClipboardText from './components/clipboard-text';
import { Input } from './components/ui/input';

const HomePage = () => {
  const IS_CONNECTED_TO_INTERNET = useNetwork().online;
  const IS_MACOS = useOs() === 'macos';

  const internetConnectionValue = IS_CONNECTED_TO_INTERNET
    ? 'CONNECTED'
    : 'NOT CONNECTED';

  const wifiDataQuery = useWiFiData();
  const trustedNetworkQuery = useTrustedNetworkStatus();
  const ADStatusQuery = useADStatus();
  const passwordDataQuery = usePasswordData();
  const diskSpaceQuery = useDiskSpace();
  const networkAdapterQuery = useNetworkAdapters();

  const serverErrorDescription =
    "Whoops! We couldn't fetch this data! Please try restarting the Talos app.";

  useEffect(() => {
    window.onInternetStatusChange(internetConnectionValue);
  }, [internetConnectionValue]);

  const getInternetConnectionCardProps = (): FminfoCardProps => ({
    rating: IS_CONNECTED_TO_INTERNET ? 'ok' : 'warn',
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
  });

  const getWifiSignalCardProps = (): FminfoCardProps => {
    const IS_WIFI_DATA_LOADING =
      wifiDataQuery.isLoading || wifiDataQuery.isFetching;

    return {
      rating: IS_WIFI_DATA_LOADING
        ? 'loading'
        : IS_CONNECTED_TO_INTERNET
        ? wifiDataQuery?.data?.data.rating ?? 'error'
        : 'error',
      title: 'WI-FI SIGNAL',
      value: IS_WIFI_DATA_LOADING
        ? 'LOADING'
        : IS_CONNECTED_TO_INTERNET
        ? wifiDataQuery?.data?.data.overall ?? 'ERROR'
        : 'ERROR',
      icon: <Signal className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {IS_CONNECTED_TO_INTERNET
            ? wifiDataQuery?.data?.data.description ??
              (wifiDataQuery?.isError && serverErrorDescription)
            : 'Please connect to a Wi-Fi network or switch to a hardwired connection.'}
        </p>
      ),
    };
  };

  const getTrustedNetworkCardProps = (): FminfoCardProps => {
    const IS_TRUSTED_NETWORK_LOADING =
      trustedNetworkQuery.isLoading || trustedNetworkQuery.isFetching;

    return {
      rating: IS_TRUSTED_NETWORK_LOADING
        ? 'loading'
        : IS_CONNECTED_TO_INTERNET
        ? trustedNetworkQuery?.data?.data.rating ?? 'error'
        : 'error',
      title: 'TRUSTED NETWORK',
      value: IS_TRUSTED_NETWORK_LOADING
        ? 'LOADING'
        : IS_CONNECTED_TO_INTERNET
        ? trustedNetworkQuery?.data?.data.status ?? 'ERROR'
        : 'ERROR',
      icon: <Lock className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {IS_CONNECTED_TO_INTERNET
            ? trustedNetworkQuery?.data?.data.description ??
              (trustedNetworkQuery?.isError && serverErrorDescription)
            : 'Please connect to the internet to see your connection to a trusted network.'}
        </p>
      ),
    };
  };

  const getADStatusCardProps = (): FminfoCardProps => {
    const IS_AD_STATUS_LOADING =
      ADStatusQuery.isLoading || ADStatusQuery.isFetching;

    return {
      rating: IS_AD_STATUS_LOADING
        ? 'loading'
        : ADStatusQuery?.data?.data.rating ?? 'error',
      title: IS_MACOS ? 'ON-PREM ACTIVE DIRECTORY' : 'AZURE ACTIVE DIRECTORY',
      value: IS_AD_STATUS_LOADING
        ? 'LOADING'
        : ADStatusQuery?.data?.data.isBound ?? 'ERROR',
      icon: <Laptop className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {ADStatusQuery?.data?.data.description ??
            (ADStatusQuery?.isError && serverErrorDescription)}
        </p>
      ),
    };
  };

  const getPasswordDataCardProps = (): FminfoCardProps => {
    const IS_PASSWORD_DATA_LOADING =
      passwordDataQuery.isLoading || passwordDataQuery.isFetching;

    const IS_ON_TRUSTED_NETWORK =
      trustedNetworkQuery?.data?.data.status === 'ZPA' ||
      trustedNetworkQuery?.data?.data.status === 'VPN';
    // const IS_CONNECTED_AND_TRUSTED = IS_CONNECTED_TO_INTERNET && IS_ON_TRUSTED_NETWORK;
    const IS_CONNECTED_AND_TRUSTED = IS_CONNECTED_TO_INTERNET && true;
    return {
      rating: IS_PASSWORD_DATA_LOADING
        ? 'loading'
        : IS_CONNECTED_AND_TRUSTED
        ? passwordDataQuery?.data?.data.rating ?? 'error'
        : 'error',
      title: 'PASSWORD EXPIRES IN',
      value: IS_PASSWORD_DATA_LOADING
        ? 'LOADING'
        : IS_CONNECTED_AND_TRUSTED
        ? passwordDataQuery?.data?.data.daysLeft ?? 'ERROR'
        : 'ERROR',
      icon: <KeyRound className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {IS_CONNECTED_TO_INTERNET
            ? IS_CONNECTED_AND_TRUSTED
              ? passwordDataQuery?.data?.data.description ??
                (passwordDataQuery?.isError && serverErrorDescription)
              : 'Please connect to a trusted network to see your current password data.'
            : 'Please connect to the internet to see your current password data.'}
        </p>
      ),
    };
  };

  const getDiskSpaceProps = (): FminfoCardProps => {
    const IS_DISK_SPACE_LOADING =
      diskSpaceQuery.isLoading || diskSpaceQuery.isFetching;

    return {
      rating: IS_DISK_SPACE_LOADING
        ? 'loading'
        : diskSpaceQuery?.data?.data.rating ?? 'error',
      title: 'DISK SPACE HEALTH',
      value: IS_DISK_SPACE_LOADING
        ? 'LOADING'
        : diskSpaceQuery?.data?.data.diskSpaceUsage ?? 'ERROR',
      icon: <HardDrive className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {diskSpaceQuery?.data?.data.description ??
            (diskSpaceQuery?.isError && serverErrorDescription)}
        </p>
      ),
    };
  };

  const getNetworkAdaptersContentProps = (): DataPopoverButtonProps => {
    const IS_NETWORK_ADAPTER_LOADING =
      networkAdapterQuery.isLoading || networkAdapterQuery.isFetching;
    const IS_NETWORK_ADAPTER_LOADED = networkAdapterQuery.isSuccess;

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
      btnClasses: 'w-10 rounded-full p-0',
      fetchData: networkAdapterQuery.refetch,
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

  const getWifiDataContentProps = (): StaticPopoverButtonProps => ({
    icon: <HelpCircle className='h-4 w-4' />,
    btnClasses: 'absolute bottom-3 right-5 w-10 rounded-full p-0',
    children: (
      <div className='grid gap-4'>
        <div className='space-y-2'>
          <h4 className='font-medium leading-none'>
            How we&apos;re measuring your Wi-Fi signal
          </h4>
          <p className='text-muted-foreground w-72 text-sm'>
            We&apos;re using a weighted average from analyzing these data points
            from your machine:
          </p>
        </div>
        <div className='grid gap-2'>
          <div className='grid grid-cols-3 items-center gap-4'>
            <Label>Signal Strength</Label>
            <Input
              disabled
              value={`${wifiDataQuery?.data?.data.signal.value}%`}
              className='col-span-2 h-8'
            />
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <Label>Radio Type</Label>
            <Input
              disabled
              value={wifiDataQuery?.data?.data.radioType.value}
              className='col-span-2 h-8'
            />
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <Label>Channel</Label>
            <Input
              disabled
              value={wifiDataQuery?.data?.data.channel.value}
              className='col-span-2 h-8'
            />
          </div>
          <div className='mt-4 grid grid-cols-3 items-center gap-4'>
            <Label className='font-bold'>Overall Rating</Label>
            <Label>{wifiDataQuery?.data?.data.overall}</Label>
          </div>
        </div>
      </div>
    ),
  });

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold tracking-tight'>FMInfo</h2>
          <p className='text-muted-foreground text-sm'>
            Everything to know about your workplace environment - in real time.
          </p>
        </div>
      </div>

      <Tabs defaultValue='network' className='mt-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='network'>
            <div>Network</div>
          </TabsTrigger>
          <TabsTrigger value='identity-services'>
            <div>Identity Services</div>
          </TabsTrigger>
          <TabsTrigger value='device'>
            <div>Device</div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='network'>
          <Tabs defaultValue='internal' className='mt-4'>
            <div className='flex items-center justify-start space-x-10'>
              <TabsList className='grid w-fit grid-cols-2'>
                <TabsTrigger value='internal'>
                  <div>Internal</div>
                </TabsTrigger>
                <TabsTrigger value='external'>
                  <div>External</div>
                </TabsTrigger>
              </TabsList>
              {IS_CONNECTED_TO_INTERNET && (
                <DataPopoverButton {...getNetworkAdaptersContentProps()} />
              )}
            </div>

            <ScrollArea className='mt-4 h-64 pr-4'>
              <TabsContent value='internal'>
                <div className='grid grid-cols-1 gap-4'>
                  <FminfoCard {...getInternetConnectionCardProps()} />

                  <FminfoCard {...getWifiSignalCardProps()}>
                    {IS_CONNECTED_TO_INTERNET && (
                      <StaticPopoverButton {...getWifiDataContentProps()} />
                    )}
                  </FminfoCard>
                </div>
              </TabsContent>

              <TabsContent value='external'>
                <ScrollArea>
                  <div className='grid grid-cols-1 gap-4'>
                    <FminfoCard {...getTrustedNetworkCardProps()} />
                  </div>
                </ScrollArea>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value='identity-services' className='pt-4'>
          <ScrollArea>
            <div className='grid grid-cols-1 gap-4'>
              <FminfoCard {...getADStatusCardProps()} />
              <FminfoCard {...getPasswordDataCardProps()} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='device' className='pt-4'>
          <ScrollArea>
            <div className='grid grid-cols-1 gap-4'>
              <FminfoCard {...getDiskSpaceProps()} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
