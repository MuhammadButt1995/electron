/* eslint-disable no-nested-ternary */

'use client';

import {
  Lock,
  HelpCircle,
  RefreshCw,
  Signal,
  Wifi,
  Laptop,
  Footprints,
  KeyRound,
  UserCircle,
  HardDrive,
  Monitor,
  XOctagon,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

import { useOs, useNetwork } from '@mantine/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import StatefulCard from './components/stateful-card';
import { useWiFiDetails } from './hooks/useWiFiDetails';
import { useTrustedNetworkStatus } from './hooks/useTrustedNetworkStatus';
import { useADStatus } from './hooks/useADStatus';
import { useLDAPData } from './hooks/useLDAPData';
import { Button } from './components/ui/button';
import StatefulCardInfoButton from './components/stateful-card-info-button';
import { PopoverContent } from './components/ui/popover';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import RouterButton from './components/router-button';
import { useNetworkAdapters } from './hooks/useNetworkAdapters';
import ClipboardText from './components/clipboard-text';
import { useDeviceData } from './hooks/useDeviceData';
import WiFiAssistantCard from './components/wifi-assistant-card';
import { Skeleton } from '@/components/ui/skeleton';
import TabButton from './components/tab-button';
import { cn } from './components/lib/utils';
import { fetchData } from './hooks/useFetchData';

const HomePage = () => {
  const os = useOs();
  const networkStatus = useNetwork();
  const internetConnection = networkStatus.online
    ? 'CONNECTED'
    : 'NOT CONNECTED';

  useEffect(() => {
    window.onInternetStatusChange(internetConnection);
  }, [internetConnection]);

  const { wifiResponse, wifiState } = useWiFiDetails();
  const { networkAdaptersResponse } = useNetworkAdapters();
  const { trustedNetworkResponse, trustedNetworkState } =
    useTrustedNetworkStatus();
  const { ADResponse, ADState } = useADStatus();
  const { LDAPPasswordData, LDAPDataResponse } = useLDAPData('get_password');
  const { LDAPDataResponse: LDAPDomainResponse } =
    useLDAPData('get_domain_data');
  const { diskSpaceData, deviceDataResponse } = useDeviceData('get_disk_usage');
  const { deviceDataResponse: CPUDeviceDataResponse } =
    useDeviceData('get_device_data');

  const dynamicClasses = cn({
    'text-brand-green-700 dark:text-brand-green-500':
      wifiState.status === 'RELIABLE',
    'text-brand-yellow-700 dark:text-brand-yellow-500':
      wifiState.status === 'DECENT',
    'text-brand-magenta-800 dark:text-brand-magenta-600':
      wifiState.status === 'SLOW',
  });

  const [wifiAssistant, setWifiAsssistant] = useState(false);
  const [countdown, setCountdown] = useState(5 * 60);
  const [isHovered, setIsHovered] = useState(false);

  const stopWifiAssistant = () => {
    setWifiAsssistant(false);
    setIsHovered(false);
    setCountdown(5 * 60);
  };

  // Store the refetch function in a ref
  const refetchRef = useRef(wifiResponse.refetch);

  useEffect(() => {
    // Update the refetch ref whenever wifiResponse.refetch changes
    refetchRef.current = wifiResponse.refetch;
  }, [wifiResponse.refetch]);

  useEffect(() => {
    let refetchIntervalId = null;
    let countdownIntervalId = null;

    if (wifiAssistant) {
      // Start a new interval for refetching
      refetchIntervalId = setInterval(async () => {
        // Use the refetch function from the ref
        await refetchRef.current();
        // Check if wifiState.status is 'ERROR' after refetching
        if (wifiState.status === 'ERROR') {
          // If it is, stop the wifiAssistant
          setWifiAsssistant(false);
        }
      }, 5000); // 5000 milliseconds = 5 seconds

      // Start a new interval for countdown
      countdownIntervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            // If countdown has reached 0, stop the wifiAssistant
            setWifiAsssistant(false);
            setIsHovered(false);
            return 5 * 60; // Reset the countdown
          }
          return prevCountdown - 1;
        });
      }, 1000); // 1000 milliseconds = 1 second
    }

    // This function is run when the component unmounts or when wifiAssistant changes
    return () => {
      // Clear any existing intervals
      if (refetchIntervalId) {
        clearInterval(refetchIntervalId);
      }
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
      }
    };
  }, [wifiAssistant]); // Only re-run the effect if wifiAssistant changes

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
            <TabButton
              title='Network'
              statuses={[
                internetConnection,
                wifiState.status,
                trustedNetworkState.status,
              ]}
            />
          </TabsTrigger>
          <TabsTrigger value='identity-services'>
            <TabButton
              title='Identity Services'
              statuses={[ADState.status, LDAPPasswordData.passwordExpiresIn]}
            />
          </TabsTrigger>
          <TabsTrigger value='device'>
            <TabButton title='Device' statuses={[diskSpaceData.status]} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value='network'>
          <Tabs defaultValue='internal' className='mt-4'>
            <TabsList className='grid w-fit grid-cols-2'>
              <TabsTrigger value='internal'>
                <TabButton
                  title='Internal'
                  statuses={[internetConnection, wifiState.status]}
                />
              </TabsTrigger>
              <TabsTrigger value='external'>
                <TabButton
                  title='External'
                  statuses={[trustedNetworkState.status]}
                />
              </TabsTrigger>
            </TabsList>

            <ScrollArea className='mt-4 h-64 pr-4'>
              <TabsContent value='internal'>
                <div className='grid grid-cols-1 gap-4'>
                  <StatefulCard
                    state={internetConnection}
                    title='INTERNET CONNECTION'
                    icon={<Wifi className='mr-2 h-4 w-4' />}
                    description={
                      internetConnection === 'CONNECTED'
                        ? 'You are connected to the Internet.'
                        : 'Please connect to a Wi-Fi network or switch to a hardwired connection.'
                    }
                  >
                    {internetConnection !== 'NOT CONNECTED' && (
                      <StatefulCardInfoButton
                        onClickFunc={() => networkAdaptersResponse.refetch()}
                        icon={<HelpCircle className='h-4 w-4' />}
                      >
                        <PopoverContent
                          className='w-120'
                          collisionPadding={{
                            top: 20,
                            left: 20,
                            right: 20,
                            bottom: 20,
                          }}
                        >
                          <div className='grid gap-4'>
                            <div className='space-y-2'>
                              <h4 className='font-medium leading-none'>
                                Your active network adapters
                              </h4>
                              <p className='text-muted-foreground w-72 text-sm'>
                                Your IP Address is will usually correspond to
                                the &quot;Wi-Fi&quot; or &quot;Ethernet&quot;
                                adapter.
                              </p>
                            </div>

                            <div className='grid gap-2'>
                              {networkAdaptersResponse.isLoading ||
                                (networkAdaptersResponse.isFetching && (
                                  <div className='flex items-center space-x-4'>
                                    <div className='space-y-2'>
                                      <Skeleton className='h-4 w-[250px]' />
                                      <Skeleton className='h-4 w-[200px]' />
                                    </div>
                                  </div>
                                ))}
                              {networkAdaptersResponse.isSuccess &&
                                !networkAdaptersResponse.isFetching &&
                                networkAdaptersResponse.data && (
                                  <ScrollArea>
                                    {Object.entries(
                                      networkAdaptersResponse.data
                                        .active_adapters || {}
                                    ).map(([key, value]) => (
                                      <div className='grid grid-cols-2 items-center gap-4'>
                                        <Label key={key}>{key}</Label>
                                        <ClipboardText
                                          text={value}
                                          classNames='h-8'
                                        />
                                      </div>
                                    ))}
                                  </ScrollArea>
                                )}
                            </div>
                          </div>
                        </PopoverContent>
                      </StatefulCardInfoButton>
                    )}
                  </StatefulCard>

                  {!wifiAssistant ? (
                    <StatefulCard
                      state={
                        wifiResponse.isLoading || wifiResponse.isFetching
                          ? 'LOADING'
                          : internetConnection === 'CONNECTED'
                          ? wifiState.status
                          : 'ERROR'
                      }
                      title='WI-FI SIGNAL'
                      icon={<Signal className='mr-2 h-4 w-4' />}
                      description={
                        internetConnection === 'CONNECTED'
                          ? wifiState.description
                          : 'Please connect to a Wi-Fi network for signal information.'
                      }
                      lastUpdated={wifiState.lastUpdated}
                    >
                      {wifiState.status !== 'ERROR' && (
                        <>
                          <div className='absolute right-20 top-3 flex items-center'>
                            <Button
                              onClick={() => wifiResponse.refetch()}
                              variant='ghost'
                              disabled={
                                wifiResponse.isLoading ||
                                wifiResponse.isFetching
                              }
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${
                                  wifiResponse.isLoading ||
                                  wifiResponse.isFetching
                                    ? 'animate-spin'
                                    : ''
                                }`}
                              />
                            </Button>
                          </div>
                          <div className='absolute right-32 top-16 flex items-center'>
                            <div>
                              <StatefulCardInfoButton
                                icon={<Footprints className='h-4 w-4' />}
                              >
                                <PopoverContent
                                  className='w-120'
                                  collisionPadding={{
                                    top: 50,
                                    left: 20,
                                    right: 20,
                                    bottom: 20,
                                  }}
                                >
                                  <div className='grid gap-4'>
                                    <div className='space-y-2'>
                                      <h4 className='w-72 font-medium leading-none'>
                                        Start Your Journey to Find the Ideal
                                        Workspace Environment.
                                      </h4>
                                      <p className='text-muted-foreground w-72 text-sm'>
                                        We&apos;ll provide Wi-Fi data every 5
                                        seconds for 5 minutes. Find a spot with
                                        consistent strong signals to set up your
                                        workspace.
                                      </p>
                                    </div>

                                    <Button
                                      variant='outline'
                                      className='mt-2'
                                      onClick={() => setWifiAsssistant(true)}
                                    >
                                      Start
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </StatefulCardInfoButton>
                            </div>
                          </div>
                          <StatefulCardInfoButton
                            icon={<HelpCircle className='h-4 w-4' />}
                          >
                            <PopoverContent
                              className='w-120'
                              collisionPadding={{
                                top: 40,
                                left: 20,
                                right: 20,
                                bottom: 20,
                              }}
                            >
                              <div className='grid gap-4'>
                                <div className='space-y-2'>
                                  <h4 className='font-medium leading-none'>
                                    How we&apos;re measuring your Wi-Fi signal
                                  </h4>
                                  <p className='text-muted-foreground w-72 text-sm'>
                                    We&apos;re using a weighted average from
                                    analyzing these data points from your
                                    machine:
                                  </p>
                                </div>
                                <div className='grid gap-2'>
                                  <div className='grid grid-cols-3 items-center gap-4'>
                                    <Label>Signal Strength</Label>
                                    <Input
                                      disabled
                                      value={`${wifiState.data.signal}%`}
                                      className='col-span-2 h-8'
                                    />
                                  </div>
                                  <div className='grid grid-cols-3 items-center gap-4'>
                                    <Label>Radio Type</Label>
                                    <Input
                                      disabled
                                      value={wifiState.data.radioType}
                                      className='col-span-2 h-8'
                                    />
                                  </div>
                                  <div className='grid grid-cols-3 items-center gap-4'>
                                    <Label>Channel</Label>
                                    <Input
                                      disabled
                                      value={wifiState.data.channel}
                                      className='col-span-2 h-8'
                                    />
                                  </div>
                                  <div className='mt-4 grid grid-cols-3 items-center gap-4'>
                                    <Label className='font-bold'>
                                      Overall Rating
                                    </Label>
                                    <Label className={`${dynamicClasses}`}>
                                      {wifiState.status}
                                    </Label>
                                  </div>
                                  <RouterButton
                                    title='Learn More'
                                    variant='outline'
                                    classNames='mt-2'
                                    route='/info/wifi-factors'
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </StatefulCardInfoButton>
                        </>
                      )}
                    </StatefulCard>
                  ) : (
                    <WiFiAssistantCard
                      state={
                        wifiResponse.isLoading || wifiResponse.isFetching
                          ? 'LOADING'
                          : internetConnection === 'CONNECTED'
                          ? wifiState.status
                          : 'ERROR'
                      }
                      data={wifiState.data}
                      description={wifiState.description}
                      lastUpdated={wifiState.lastUpdated}
                    >
                      <div className='absolute right-20 top-3 flex items-center'>
                        <Button
                          onClick={() => wifiResponse.refetch()}
                          variant='ghost'
                          disabled={
                            wifiResponse.isLoading || wifiResponse.isFetching
                          }
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              wifiResponse.isLoading || wifiResponse.isFetching
                                ? 'animate-spin'
                                : ''
                            }`}
                          />
                        </Button>
                      </div>

                      <div className='absolute right-36 top-3 flex items-center'>
                        <Button onClick={stopWifiAssistant} variant='ghost'>
                          <XOctagon className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='absolute bottom-16 right-12 flex items-center'>
                        <Button
                          variant='outline'
                          size='lg'
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          onClick={stopWifiAssistant}
                        >
                          {isHovered
                            ? 'Stop'
                            : `${Math.floor(countdown / 60)}:${
                                countdown % 60 < 10 ? '0' : ''
                              }${countdown % 60}`}
                        </Button>
                      </div>
                    </WiFiAssistantCard>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='external'>
                <ScrollArea>
                  <div className='grid grid-cols-1 gap-4'>
                    <StatefulCard
                      state={
                        internetConnection === 'CONNECTED'
                          ? trustedNetworkState.status
                          : 'ERROR'
                      }
                      title='TRUSTED NETWORK'
                      icon={<Lock className='mr-2 h-4 w-4' />}
                      description={
                        internetConnection === 'CONNECTED'
                          ? trustedNetworkState.description
                          : 'Please connect to the internet to see your connection to a trusted network.'
                      }
                      lastUpdated={trustedNetworkState.lastUpdated}
                    >
                      <div className='absolute right-20 top-3 flex items-center'>
                        <Button
                          onClick={() => trustedNetworkResponse.refetch()}
                          variant='ghost'
                          disabled={
                            trustedNetworkResponse.isLoading ||
                            trustedNetworkResponse.isFetching
                          }
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${
                              trustedNetworkResponse.isLoading ||
                              trustedNetworkResponse.isFetching
                                ? 'animate-spin'
                                : ''
                            }`}
                          />
                        </Button>
                      </div>
                    </StatefulCard>
                  </div>
                </ScrollArea>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value='identity-services' className='pt-4'>
          <ScrollArea>
            <div className='grid grid-cols-1 gap-4'>
              <StatefulCard
                state={ADState.status}
                title={os === 'macos' ? 'ON-PREM AD' : 'AZURE AD'}
                icon={<Laptop className='mr-2 h-4 w-4' />}
                description={ADState.description}
                lastUpdated={ADState.lastUpdated}
              >
                <div className='absolute right-20 top-3 flex items-center'>
                  <Button
                    onClick={() => ADResponse.refetch()}
                    variant='ghost'
                    disabled={ADResponse.isLoading || ADResponse.isFetching}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        ADResponse.isLoading || ADResponse.isFetching
                          ? 'animate-spin'
                          : ''
                      }`}
                    />
                  </Button>
                </div>
              </StatefulCard>

              <StatefulCard
                state={
                  LDAPDataResponse.isLoading || LDAPDataResponse.isFetching
                    ? 'LOADING'
                    : trustedNetworkState.status === 'CONNECTED'
                    ? LDAPPasswordData.passwordExpiresIn
                    : 'ERROR'
                }
                title='PASSWORD EXPIRES IN'
                icon={<KeyRound className='mr-2 h-4 w-4' />}
                description={
                  trustedNetworkState.status === 'CONNECTED'
                    ? LDAPPasswordData.description
                    : 'Please connect to a trusted network to see your password & domain information.'
                }
                lastUpdated={LDAPPasswordData.lastUpdated}
              >
                <div className='absolute right-20 top-3 flex items-center'>
                  <Button
                    onClick={() => LDAPDataResponse.refetch()}
                    variant='ghost'
                    disabled={
                      LDAPDataResponse.isLoading || LDAPDataResponse.isFetching
                    }
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        LDAPDataResponse.isLoading ||
                        LDAPDataResponse.isFetching
                          ? 'animate-spin'
                          : ''
                      }`}
                    />
                  </Button>
                </div>

                <StatefulCardInfoButton
                  onClickFunc={() => LDAPDomainResponse.refetch()}
                  icon={<UserCircle className='h-4 w-4' />}
                >
                  <PopoverContent
                    className='w-120'
                    collisionPadding={{
                      top: 20,
                      left: 20,
                      right: 20,
                      bottom: 20,
                    }}
                  >
                    <div className='grid gap-4'>
                      <div className='space-y-2'>
                        <h4 className='font-medium leading-none'>
                          Your domain information
                        </h4>
                      </div>

                      <div className='grid gap-2'>
                        {LDAPDomainResponse.isLoading ||
                          (LDAPDomainResponse.isFetching && (
                            <div className='flex items-center space-x-4'>
                              <div className='space-y-2'>
                                <Skeleton className='h-4 w-[250px]' />
                                <Skeleton className='h-4 w-[200px]' />
                              </div>
                            </div>
                          ))}
                        {LDAPDomainResponse.isSuccess &&
                          !LDAPDomainResponse.isFetching &&
                          LDAPDomainResponse.data && (
                            <ScrollArea>
                              {Object.entries(
                                LDAPDomainResponse.data || {}
                              ).map(([key, value]) => (
                                <div className='grid grid-cols-2 items-center gap-2'>
                                  <Label key={key}>
                                    {key.replace(/_/g, ' ')}
                                  </Label>
                                  <ClipboardText
                                    text={value}
                                    classNames='h-8'
                                  />
                                </div>
                              ))}
                            </ScrollArea>
                          )}
                        <Button variant='outline' className='mt -2'>
                          Reset Password
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </StatefulCardInfoButton>
              </StatefulCard>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='device' className='pt-4'>
          <ScrollArea>
            <div className='grid grid-cols-1 gap-4'>
              <StatefulCard
                state={diskSpaceData.status}
                title='DISK SPACE USAGE'
                icon={<HardDrive className='mr-2 h-4 w-4' />}
                description={diskSpaceData.description}
                lastUpdated={diskSpaceData.lastUpdated}
              >
                <div className='absolute right-20 top-3 flex items-center'>
                  <Button
                    onClick={() => deviceDataResponse.refetch()}
                    variant='ghost'
                    disabled={
                      deviceDataResponse.isLoading ||
                      deviceDataResponse.isFetching
                    }
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        deviceDataResponse.isLoading ||
                        deviceDataResponse.isFetching
                          ? 'animate-spin'
                          : ''
                      }`}
                    />
                  </Button>
                </div>

                <StatefulCardInfoButton
                  onClickFunc={() => CPUDeviceDataResponse.refetch()}
                  icon={<Monitor className='h-4 w-4' />}
                >
                  <PopoverContent
                    className='w-fit'
                    align='center'
                    avoidCollisions
                    collisionPadding={{
                      top: 20,
                      bottom: 20,
                      right: 20,
                    }}
                  >
                    <div className='grid gap-4'>
                      <div className='space-y-2'>
                        <h4 className='font-medium leading-none'>
                          Your device information
                        </h4>
                      </div>

                      <div className='grid w-fit gap-2'>
                        {CPUDeviceDataResponse.isLoading ||
                          (CPUDeviceDataResponse.isFetching && (
                            <div className='flex items-center space-x-4'>
                              <div className='space-y-2'>
                                <Skeleton className='h-4 w-[250px]' />
                                <Skeleton className='h-4 w-[200px]' />
                              </div>
                            </div>
                          ))}
                        {CPUDeviceDataResponse.isSuccess &&
                          !CPUDeviceDataResponse.isFetching &&
                          CPUDeviceDataResponse.data && (
                            <ScrollArea>
                              {Object.entries(
                                CPUDeviceDataResponse.data || {}
                              ).map(([key, value]) => (
                                <div className='grid grid-cols-3 items-center gap-4'>
                                  <Label key={key}>{key}</Label>
                                  <ClipboardText
                                    text={value}
                                    classNames='col-span-2 h-7'
                                  />
                                </div>
                              ))}
                            </ScrollArea>
                          )}
                      </div>
                    </div>
                  </PopoverContent>
                </StatefulCardInfoButton>
              </StatefulCard>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
