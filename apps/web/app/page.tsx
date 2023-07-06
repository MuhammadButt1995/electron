/* eslint-disable no-nested-ternary */

'use client';

import { Wifi, Signal, Lock, Laptop, KeyRound, HardDrive } from 'lucide-react';
import { useEffect } from 'react';
import { useOs, useNetwork } from '@mantine/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWiFiData } from '@/hooks/useQueryHooks/useWifiData';
import { useTrustedNetworkStatus } from '@/hooks/useQueryHooks/useTrustedNetworkStatus';
import { useADStatus } from '@/hooks/useQueryHooks/useADStatus';
import { usePasswordData } from './hooks/useQueryHooks/usePasswordData';
import { useDiskSpace } from './hooks/useQueryHooks/useDiskData';

import FminfoCard, { FminfoCardProps } from '@/components/fminfo-card';

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
        ? trustedNetworkQuery?.data?.rating ?? 'error'
        : 'error',
      title: 'TRUSTED NETWORK',
      value: IS_TRUSTED_NETWORK_LOADING
        ? 'LOADING'
        : IS_CONNECTED_TO_INTERNET
        ? trustedNetworkQuery?.data?.status ?? 'ERROR'
        : 'ERROR',
      icon: <Lock className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {IS_CONNECTED_TO_INTERNET
            ? trustedNetworkQuery?.data?.description ??
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
        : ADStatusQuery?.data?.rating ?? 'error',
      title: IS_MACOS ? 'ON-PREM ACTIVE DIRECTORY' : 'AZURE ACTIVE DIRECTORY',
      value: IS_AD_STATUS_LOADING
        ? 'LOADING'
        : ADStatusQuery?.data?.isBound ?? 'ERROR',
      icon: <Laptop className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {ADStatusQuery?.data?.description ??
            (ADStatusQuery?.isError && serverErrorDescription)}
        </p>
      ),
    };
  };

  const getPasswordDataCardProps = (): FminfoCardProps => {
    const IS_PASSWORD_DATA_LOADING =
      passwordDataQuery.isLoading || passwordDataQuery.isFetching;

    const IS_ON_TRUSTED_NETWORK =
      trustedNetworkQuery?.data?.status === 'ZPA' ||
      trustedNetworkQuery?.data?.status === 'VPN';
    // const IS_CONNECTED_AND_TRUSTED = IS_CONNECTED_TO_INTERNET && IS_ON_TRUSTED_NETWORK;
    const IS_CONNECTED_AND_TRUSTED = IS_CONNECTED_TO_INTERNET && true;
    return {
      rating: IS_PASSWORD_DATA_LOADING
        ? 'loading'
        : IS_CONNECTED_AND_TRUSTED
        ? passwordDataQuery?.data?.rating ?? 'error'
        : 'error',
      title: 'PASSWORD EXPIRES IN',
      value: IS_PASSWORD_DATA_LOADING
        ? 'LOADING'
        : IS_CONNECTED_AND_TRUSTED
        ? passwordDataQuery?.data?.daysLeft ?? 'ERROR'
        : 'ERROR',
      icon: <KeyRound className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {IS_CONNECTED_TO_INTERNET
            ? IS_CONNECTED_AND_TRUSTED
              ? passwordDataQuery?.data?.description ??
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
        : diskSpaceQuery?.data?.rating ?? 'error',
      title: 'DISK SPACE HEALTH',
      value: IS_DISK_SPACE_LOADING
        ? 'LOADING'
        : diskSpaceQuery?.data?.diskSpaceUsage ?? 'ERROR',
      icon: <HardDrive className='mr-2 h-4 w-4' />,
      cardBody: (
        <p className='text-muted-foreground w-7/12 text-xs'>
          {diskSpaceQuery?.data?.description ??
            (diskSpaceQuery?.isError && serverErrorDescription)}
        </p>
      ),
    };
  };

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
            <TabsList className='grid w-fit grid-cols-2'>
              <TabsTrigger value='internal'>
                <div>Internal</div>
              </TabsTrigger>
              <TabsTrigger value='external'>
                <div>External</div>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className='mt-4 h-64 pr-4'>
              <TabsContent value='internal'>
                <div className='grid grid-cols-1 gap-4'>
                  <FminfoCard {...getInternetConnectionCardProps()} />
                  <FminfoCard {...getWifiSignalCardProps()} />
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
